import React, { useRef, useState, useEffect } from 'react'
import big from '../../assets/img/transfer/Big Arrow.svg'
import USDTTRCICON from '../../assets/img/newdeposit/usdt_trc.svg';
import axios from "axios"
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import { useAuth } from '../context/AuthContext'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config'
import WitdrawaBalacne from '../History/WitdrawaBalacne'
import MobileBottomNav from '../tradepage/MobileBottomNav'
import { useTheme } from '../../context/ThemeContext'
import { getDepositSource } from '../../utils/depositSource'


const withdrawalUsdtTRC20 = () => {

  const [currentView, setCurrentView] = useState("");
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [selectedFile, setSelectedFile] = useState("")
  const [txHash, setTxHash] = useState("");
  const [showFieldsAlert, setShowFieldsAlert] = useState(false);
  const [showMinDepositAlert, setShowMinDepositAlert] = useState(false);
  const { user, token } = useAuth()
  const fileInputRef = useRef(null)
  const [adminRate, setAdminRate] = useState({ minimum_withdrawal: 30, inr_value: 90, deposit_fee: 0, withdrawal_fee: 0 });
  const [loading, setLoading] = useState(false);
  const paymentType = localStorage.getItem("withdraw_type");
  const { isDark } = useTheme();
  // Get withdrawal source (website or mobile_app)
  const withdrawalSource = getDepositSource();

  // Fixing Minimum Withdrawal,INR values and others  
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/values/getdata`);

        if (data.success && data.data) {
          setAdminRate({
            minimum_withdrawal: parseFloat(data.data.minimum_withdrawal) || 30,
            inr_value: parseFloat(data.data.inr_value) || 90,
            deposit_fee: parseFloat(data.data.deposit_fee) || 0,
            withdrawal_fee: parseFloat(data.data.withdrawal_fee) || 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch admin rates:", error);
      }
    };
    fetchAdmin()
  }, [])

  // caluclation

  const numericAmount = parseFloat(amount) || 0;
  const feeAmount = numericAmount > 0 ? (numericAmount * (adminRate.withdrawal_fee / 100)) : 0;
  const receiveAmount = numericAmount > 0 ? (numericAmount - feeAmount) : 0;


  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger file input
  };

    const handleFileChange = (e) => {
       const file = e.target.files[0];
       if(!file) return;
       const allowedTypes = ["application/pdf","image/jpeg","image/png","image/jpg"];
   
       if (!allowedTypes.includes(file.type)) {
       toast.error("Only PDF and image files are allowed!");
       e.target.value = "";
       return;
     }
         const maxSize = 5 * 1024 * 1024;
     if (file.size > maxSize) {
       toast.error("File size must be less than 2MB");
       e.target.value = "";
       return;
     }
     setSelectedFile(file);
     };

  const handelWithdrawl = async () => {
    if (!amount || !txHash || !selectedFile) {
      // setShowFieldsAlert(true);
      toast.warning("Please fill out all required fields before Withdrawal.")
      return
    }

    const numericAmount = parseFloat(amount)
    if (numericAmount < Number(adminRate.minimum_withdrawal)) {
      // setShowMinDepositAlert(true)
      toast.error(`The minimum withdrawal amount is ${adminRate.minimum_withdrawal} USD.`)
      return
    }

    // check balance 
    if (numericAmount > balance) {
      toast.error("Insufficient balance");
      return
    }

    const fee = parseFloat((numericAmount * (adminRate.withdrawal_fee / 100)).toFixed(2));
    const transferAmount = parseFloat((numericAmount - fee).toFixed(2));


    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("payment_method", paymentType);
      formData.append("requested_amount_usd", numericAmount);
      formData.append("transfer_amount_usd", transferAmount);
      formData.append("payment_address_upi_id", txHash);

      // Do NOT append any file field yet, just send NULL as string
      formData.append("qr_payment_screenshot", selectedFile);
      // Append withdrawal source to track if from website or mobile app
      formData.append("withdrawal_source", withdrawalSource);

      const { data } = await axios.post(
        `${BACKEND_API_URL}/withdrawal`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` } }
      );

      console.log("withdraw saved successfully:", data);

      // alert("Withdrawal submitted!");

      toast.success(data.message || "Withdrawal")

      setBalance("");
      setAmount("");
      setTxHash("");
      setSelectedFile(null)

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000)

    } catch (error) {
      console.error("Withdrawal submission error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  // Shwoing balance from wallet 
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.user_id || !token) return;
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Wallet API response:", data);
        if (data.status === "success") setBalance(data.wallet);
        else setBalance(0);
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
        setBalance(0);
      }
    };

    fetchWallet();
  }, [user, token]);

  return (
    <div>
      <DashboardNavebar />

      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
        pauseOnHover theme='dark' transition={Slide} />
    <div className='pt-[70px]' >
      <WitdrawaBalacne />
    </div>
      <div className='mx-4 md:mx- flex flex-col md:flex-row pb-55 md:pb-0'>
        {/* Left Section */}
      <div className='flex'>


        <div className='border h-60 mt-10 rounded-2xl px-4 py-2 xl:ml-10 xl:w-130'>
          <h2 className='font-bold text-center text-lg md:text-xl'>Steps to Withdraw</h2>
          <p className='border border-[#CECECE]'></p>
          <div className='flex flex-col gap-3 mt-3 md:gap-4 md:mt-4'>
            {[
              "Enter the amount in USD.",
              "Enter Your USDT USDT TRC 20 Address.",
              "Upload your USDT TRC 20 Address QR codeScreenshot",
              "Click 'Withdraw' and your fund wil get processed."
            ].map((step, i) => (
              <div key={i} className='flex items-start gap-2'>
                <h4 className='rounded-full bg-[#F7931A] w-6 h-6 text-sm font-bold text-white flex items-center justify-center'>{i + 1}</h4>
                <p className='font-medium text-sm md:text-base break-words'>
                  {i === 4 ? (
                    <>
                      Click <span className='font-bold'>Withdraw</span>  and your fund wil get processed.
                    </>
                  ) : (
                    step
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#EBDDDD] flex items-start mt-20 md:items-center gap-2 px-3 py-2 rounded-sm xl:w-105">
            <h2 className="mt-4 text-[#AD0000] font-bold md:mt-0">Note:</h2>
            <div className="hidden md:block w-px h-20 mx-2 bg-[#AD000054]"></div>
            <p className="text-[#AD0000] font-medium text-sm md:text-base">
              Incorrect details may lead to wrong processing. Please check carefully before submitting.
            </p>
          </div>
        </div>
        
        <div className="hidden md:block w-px lg:h-[1330px] xl:h-[1230px] 2xl:h-[830px]  ml-16 mx-14 bg-[#C3C3C3]"></div>
     </div>

        {/* Right Section */}
        <div className='flex flex-col -ml-2  w-full mt-52 xl:mt-0 2xl:flex-row'>
        <div className='mx-2 mt-auto flex flex-col md:mt-8 xl:items-center'>
          <div className='ml-14 gap-5 flex items-center md:ml-0 md:gap-10'>
            <div className="relative w-12 h-12">
              <img src={USDTTRCICON} alt="Token" className="w-full h-full" />
              {/* Overlay BNB Image */}
              {/* <img src={bnb} alt="BNB" className="absolute -bottom-1 -right-2 w-5 h-5" /> */}
            </div>
            <h3 className='font-extrabold text-2xl md:text-4xl mt-5'>USDT TRC Withdrawal</h3>
          </div>

          {/* Minimum Withdrawal */}
          <div className='mt-8 md:mt-10'>
            <h3 className='font-bold text-[#A40000] text-lg md:text-xl xl:text-2xl'>Minimum Withdrawal Amount: {adminRate.minimum_withdrawal} USD</h3>

            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:gap-10 mt-6 md:mt-10'>

              {/* Enter Amount */}
              <div className='order-1 flex flex-col gap-2.5'>
                <h3 className={`text-lg md:text-xl font-medium ${isDark ? "text-white" : "text-[#080808]"}`}>Enter Amount in USD </h3>
                <div className={`flex gap-2 px-4 py-2 w-full lg:w-105 md:w-[500px] xl:w-115 xl:py-4 2xl:py-2 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                  <h3 className='rounded-full bg-[#F7931A] w-6 h-6 text-sm font-bold text-white flex items-center justify-center'>$</h3>
                  <input
                    type="number"
                    min="30"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`flex-1 outline-none text-lg md:text-xl font-medium bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`}
                  />
                </div>
              </div>

              {/* Tx Hash */}
              <div className="order-4 flex flex-col gap-2.5 md:order-2">
                <h3 className={`text-lg md:text-xl font-medium ${isDark ? "text-white" : "text-[#080808]"}`}>Enter your USDT BEP 20 Address </h3>
                <div className={`flex gap-2 px-4 py-2 w-full md:w-[500px] lg:w-105 xl:w-115 xl:py-4 2xl:py-2 border rounded-md items-center transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#868686] bg-[#FBFBFB]"}`}>
                  <h3 className='rounded-full bg-[#F7931A] w-6 h-6 text-sm font-bold text-white flex items-center justify-center'>$</h3>
                  <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value.trimStart())} className={`outline-none w-full bg-transparent transition-colors duration-300 ${isDark ? "text-white" : "text-[#080808]"}`} />
                </div>
              </div>

              {/* Upload */}
              <div className="order-5 cursor-pointer flex flex-col gap-2.5 md:order-4 " onClick={handleImageClick}>
                <h2 className={`text-base font-medium md:text-xl ${isDark ? "text-white" : "text-[#080808]"}`}>Upload your USDT BEP 20 QR Code Screenshot</h2>
                <div className='bg-[#F7931A8F] flex flex-col justify-center items-center w-full lg:w-105 xl:w-115  md: h-30 px-4 py-2 border border-[#868686]'>

                  <div className="flex justify-center" >
                    <img className="w-5 h-5" src={big} alt="Upload" />
                  </div>
                  <p className='mt-2 text-[#474747] text-sm md:text-base text-center'>
                    Upload Your QR Here (Maximum file size: 2MB)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.jpg,.png,.jpeg,.svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {
                    selectedFile && (
                      <p className='text-white font-medium mt-2'>{selectedFile.name}</p>
                    )
                  }
                </div>
              </div>

              {/* Withdrawal Button */}
              <div className="flex flex-col gap-2.5 order-6">
                <button
                  className=" mt-6 rounded-lg bg-[#F7931A] px-4 py-2 md:px-4 md:py-2 font-medium text-white transition  disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:w-105 md:w-[500px] xl:w-115 xl:py-4 2xl:py-2"
                  onClick={!loading ? handelWithdrawl : undefined}
                  disabled={loading}
                >
                  {loading && <FaSpinner className="animate-spin text-white text-xl md:text-2xl" />}
                  <span className='text-2xl'>
                    {loading ? "Processing..." : "WITHDRAW"}
                  </span>
                </button>
                <h3 className="text-right mt-2 mr-10">Withdrawal Fee: {numericAmount ? feeAmount.toFixed(2) : ""} USD</h3>
              </div>
            </div>
          </div>

        </div>
     </div>
    </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileBottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  )
}

export default withdrawalUsdtTRC20
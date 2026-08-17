import React, { useState, useRef, useEffect } from 'react'
import bank from '../../assets/img/transfer/bank.svg'
import copy from '../../assets/img/transfer/Copy.svg'
import big from '../../assets/img/transfer/Big Arrow.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import { useAuth } from '../context/AuthContext'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config'
import { getDepositSource } from '../../utils/depositSource'

const Bank = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const paymentType = location.state?.payment_type
  // Get deposit source (website or mobile_app)
  const depositSource = getDepositSource();

  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState("");
  const [amount, setAmount] = useState("")
  const [transcation, setTranscation] = useState("")
  const [selectedFile, setselectedFile] = useState("")
  const [showFieldsAlert, setShowFieldsAlert] = useState(false);
  const [showMinDepositAlert, setShowMinDepositAlert] = useState(false);
  const [details, setDetails] = useState([]);
  const fileInputRef = useRef(null)
  const { user, token } = useAuth()
  // console.log("Token on Bank page:", token);
  const [adminRate, setAdminRate] = useState({ minimum_deposit: 30, inr_value: 90, deposit_fee: 0, withdrawal_fee: 0 });
  const [loading, setLoading] = useState(false);

  // Fixing Minimum Deposit,INR values and others  
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/values/getdata`);

        if (data.success && data.data) {
          setAdminRate({
            minimum_deposit: parseFloat(data.data.minimum_deposit) || 30,
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


  // Convert INR → USD using admin rate
  const numericAmount = parseFloat(amount) || 0;
  const minimumINR = adminRate.minimum_deposit * adminRate.inr_value;

  // Calculate USD conversion
  const amountUSD = numericAmount > 0 ? (numericAmount / adminRate.inr_value).toFixed(2) : 0;

  // Calculate fee and final receive amount in USD
  const feeUSD = amountUSD > 0 ? (amountUSD * (adminRate.deposit_fee / 100)).toFixed(2) : "";
  const receiveUSD = amountUSD > 0 ? (amountUSD - feeUSD).toFixed(2) : "";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 3000);
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setselectedFile(file);
    }
  };


  const handleDeposit = async () => {
    if (!amount || !transcation || !selectedFile) {
      // setShowFieldsAlert(true)
      toast.warning("Please fill out all required fields before deposit.")
      return
    }

    const numericamount = parseFloat(amount)
    if (numericamount < minimumINR) {
      // setShowMinDepositAlert(true)
      toast.error(`The minimum deposit amount is ${minimumINR.toFixed(0)} INR.`)
      return
    }

    // const storeData = JSON.parse(localStorage.getItem("userData"));
    // const user_id = storeData?.user_id;
    // const username = storeData?.username;

    try {
      setLoading(true);
      const formData = new FormData()
      formData.append("user_id", user.user_id)
      formData.append("username", user.username)
      formData.append("email", user.email);
      formData.append("payment_method", paymentType)
      formData.append("enter_amount", amount)
      formData.append("transaction_id", transcation)
      formData.append("payment_screenshot", selectedFile)
      // Append deposit source to track if from website or mobile app
      formData.append("deposit_source", depositSource)


      //  Append bank details only for Bank Transfer

      if (paymentType === "Bank Transfer" && details.length > 0) {
        const bankName = details.find(d => d.label === "Bank Name")?.value || "";
        const accNumber = details.find(d => d.label === "Account Number")?.value || "";
        const holderName = details.find(d => d.label === "Account Holder Name")?.value || "";

        formData.append("bank_name", bankName);
        formData.append("bank_account_number", accNumber);
        formData.append("bank_holder_name", holderName);
      }

      const { data } = await axios.post(`${BACKEND_API_URL}/deposit/create`,
        formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      }
      )
      console.log("Deposit save successfully", data);
      // alert("Payment successed")

      toast.success(data.message || "Deposited")

      setBalance("");
      setAmount("");
      setTranscation("");
      setselectedFile(null);

      setTimeout(() => {
        navigate("/deposit");
      }, 2000)

    } catch (error) {
      console.error("Depostit submussion error:", error);
      alert(error.response?.data?.error || "Something went wrong")
    }
    finally {
      setLoading(false);
    }
  }

  // Shwoing balance from wallet 

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.user_id || !token) return;
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Wallet API response:", data);
        if (data.status === "success") setBalance(data.wallet);
        else setBalance(0);
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
        setBalance(0);
      }
    };

    fetchWallet();
  }, [user, token]);


  // fetch Bank details

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        if (!paymentType) return;

        const normalizedMode = paymentType.trim().toLowerCase().replace(" ", "_");
        const { data } = await axios.get(`${BACKEND_API_URL}/payment/get`, {
          params: { payment_mode: normalizedMode },
        });

        console.log("Bank API Response:", data);

        if (data?.success && data.data) {
          const row = Array.isArray(data.data) ? data.data[0] : data.data;

          // check the row active 
          if (row.is_used !== "active") {
            console.log("No acive bank");
            setDetails([]);
            return
          }

          setDetails([
            { label: "Bank Name", value: row.bank_name || "N/A" },
            { label: "Account Number", value: row.bank_account_number || "N/A" },
            { label: "Account Holder Name", value: row.bank_account_name || "N/A" },
            { label: "Bank IFSC Code", value: row.bank_ifsc_code || "N/A" },
            { label: "Bank Country", value: row.country || "N/A" },
          ]);
        } else {
          console.warn("No bank details found for", paymentType);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchBankDetails();
  }, [paymentType]);



  return (
    <div className="bg-[#D7EBFF]  ">

      <DashboardNavebar />

      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
        pauseOnHover theme='dark' transition={Slide} />

      <div className="mx-4 md:mx-24 flex flex-col md:flex-row">

        {/* Left Section */}
        <div className="py-10 md:py-20 flex flex-col gap-5 items-center md:items-start text-center md:text-left">
          <img className="w-full shadow-xl md:w-90 rounded-xl" src={bank} alt="" />

          <div className="bg-white shadow-xl w-full md:w-90 px-4 py-2 rounded-xl flex flex-col">
            <h5 className="font-extrabold text-lg md:text-xl">{Number(balance?.balance || balance || 0).toFixed(2)} USD</h5>
            <p className="font-light text-sm md:text-base">Available Balance</p>
          </div>

          <p className="text-sm md:text-base">
            Transaction will process within 24 hours for <br className="hidden md:block" /> all working days.
          </p>

          {/* Note */}
        <div className='bg-[#EBDDDD] flex flex-col  px-3 md:flex-row items-start md:items-center gap-2 md:gap-0 py-2 md:px-0  rounded-xl md:w-105'>
            <h3 className='text-[#AD0000] font-bold mx-1'>Note:</h3>
            <div className="hidden md:block w-px h-20 mx-2 bg-[#AD000054]"></div>
            <p className="text-[#AD0000] font-medium text-sm md:text-base">
              After transferring the amount, Enter the UTR / Ref.no / Transaction ID and upload payment screenshot, (maximum file size: 2MB).</p>
          </div>

          {/* Steps */}
          <div>
            <h2 className="font-bold text-lg md:text-xl">Steps to Deposit</h2>
            <div className="flex flex-col gap-3 mt-3  md:gap-4 md:mt-4">
              {[
                "Enter the amount to deposit in INR.",
                "Use the given Bank Details to make your payment.",
                "Enter the UTR / Ref.no / Transaction ID.",
                "Upload payment screenshot.",
                "Click 'DEPOSIT' and your amount reflects in your account"
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm md:text-base">
                  <h4 className="rounded-full bg-[#0048FF] w-6 h-6 text-xs md:text-sm font-bold text-white flex items-center justify-center">{i + 1}</h4>
                  <p className='font-medium text-sm md:text-base whitespace-nowrap'>
                    {i === 4 ? (
                      <>
                        Click <span className='font-bold'>DEPOSIT</span> and your amount reflects in your account
                      </>
                    ) : (
                      step
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px mx-14 h-[899px] bg-[#C3C3C3]"></div>

        {/* Right Section */}
        <div className="mx-2 md:mx-10 mt-8 w-full">
          <h3 className="font-extrabold text-xl md:text-3xl text-center md:text-left">BANK TRANSFER:</h3>

          {/* Account Details */}
          <div className="flex justify-center items-center mt-6 md:mt-10">
            <div className="border border-[#868686] w-full md:w-1/2 flex flex-col p-4 md:p-6 rounded-lg bg-[#FBFBFB]">
              <h2 className="text-lg md:text-2xl font-semibold text-center">Account Details</h2>
              <div className="border-b-2 border-[#B7B7B7] w-full mx-auto mt-2"></div>

              <div className="flex flex-col gap-3 mt-4 md:mt-6">
                {details.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:justify-between">
                    <h2 className="text-base md:text-xl font-semibold">{item.label}</h2>
                    <div
                      className="flex items-center gap-2 cursor-pointer mt-1 md:mt-0"
                      onClick={() => handleCopy(item.value)}
                    >
                      <p className="text-sm md:text-base">{item.value}</p>
                      <img src={copy} alt="copy" className="w-4 h-4 md:w-5 md:h-5" />
                      {copied === item.value && (
                        <span className="text-green-600 text-xs md:text-sm ml-2">Copied!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deposit Form */}
          <div className="mt-8 md:mt-10">
            <h3 className="font-bold text-[#A40000] text-lg md:text-xl text-center md:text-left">
              Minimum Deposit Amount: ₹ {minimumINR.toFixed(0)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-10">

              {/* Amount */}
              <div className="order-1 md:order-none">
                <h3 className="text-base md:text-xl font-medium">Enter Amount in INR</h3>
                <div className="flex gap-2 bg-white px-4 py-2 w-full md:w-90 border border-[#868686] rounded-sm items-center">
                  <h3 className="rounded-full bg-[#0048FF] w-6 h-6 text-xs md:text-sm font-bold text-white flex items-center justify-center">₹</h3>
                  <input
                    type="number"
                    min="2670"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 outline-none text-lg md:text-xl font-medium"
                  />
                </div>
              </div>

              {/* TxID */}
              <div className="order-5 md:order-none">
                <h3 className="text-base md:text-xl font-medium">Enter the UPI Transaction ID / UTR ID</h3>
                <div className="flex gap-2 bg-white px-4 py-2 w-full md:w-90 border border-[#868686] rounded-sm items-center">
                  <h3 className="rounded-full bg-[#0048FF] w-6 h-6 text-xs md:text-sm font-bold text-white flex items-center justify-center">$</h3>
                  <input type="text" value={transcation} onChange={(e) => setTranscation(e.target.value)} className="outline-none w-full" />
                </div>
              </div>

              {/* Receive */}
              <div className="order-3 md:order-none">
                <h3 className="text-base md:text-xl font-medium">Amount You Will Receive in USD</h3>
                <div className="flex gap-2 bg-white px-4 py-2 w-full md:w-90 border border-[#868686] rounded-sm items-center">
                  <h3 className="rounded-full bg-[#0048FF] w-6 h-6 text-xs md:text-sm font-bold text-white flex items-center justify-center">$</h3>
                  <input
                    type="text"
                    value={receiveUSD}
                    className="flex-1 outline-none text-lg md:text-xl font-medium text-[#009905] bg-transparent"
                    readOnly
                  />
                </div>
              </div>

              {/* Upload */}
              <div className="order-4 md:order-none" onClick={handleImageClick}>
                <h2 className="font-medium text-base md:text-xl">Upload Payment Screenshot</h2>
                <div className="bg-[#93b2d1] flex flex-col justify-center items-center w-full md:w-90 px-4 py-4 border border-[#868686]">
                  <div className="flex justify-center cursor-pointer">
                    <img className="w-5 h-5 md:w-6 md:h-6" src={big} alt="" />
                  </div>
                  <p className="text-xs md:text-sm text-center mt-2">
                    Upload Your Payment Screenshot Here <br />
                    <span>(Maximum file size: 2MB)</span>
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.jpg,.png,.jpeg,.svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <p className="text-white font-medium mt-2 text-sm">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* Fee */}
              <div className="order-3 -mt-7 md:order-none">
                <h3 className="text-base mt-4 md:text-xl md:mt-0.5 font-medium">Deposit Fee</h3>
                <div className="flex gap-2 bg-white px-4 py-2 w-full md:w-90 border border-[#868686] rounded-sm items-center">
                  <h3 className="rounded-full bg-[#0048FF] w-6 h-6 text-xs md:text-sm font-bold text-white flex items-center justify-center">$</h3>
                  <input
                    type="text"
                    readOnly
                    value={feeUSD}
                    className="flex-1 outline-none text-lg md:text-xl font-medium bg-transparent"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="order-6 -mt-7 md:order-none">
                <button
                  className="w-full mt-6 rounded-lg bg-blue-600 px-4 py-2 md:px-4 md:py-2 font-medium text-white hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:w-90"
                  onClick={!loading ? handleDeposit : undefined}
                  disabled={loading}
                >
                  {loading && <FaSpinner className="animate-spin text-white text-xl md:text-2xl" />}
                  <span className='text-2xl'>
                    {loading ? "Processing..." : "DEPOSIT"}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bank

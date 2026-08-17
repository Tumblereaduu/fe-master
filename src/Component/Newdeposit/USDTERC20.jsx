import React, { useEffect, useRef, useState } from 'react'
import copy from '../../assets/img/transfer/Copy.svg'
import big from '../../assets/img/transfer/Big Arrow.svg'
import USDTERCICON from '../../assets/img/newdeposit/usdt_erc.svg';
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import { useAuth } from '../context/AuthContext'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config'
import DepositBalance from '../History/DepositBalance'
import MobileBottomNav from '../tradepage/MobileBottomNav'
import DepositComponent from '../Deposit/DepositComponent'
import { getDepositSource } from '../../utils/depositSource'


const USDTERC20 = () => {

  const [currentView, setCurrentView] = useState("");
  const paymentType = localStorage.getItem("deposit_type")
  // Get deposit source (website or mobile_app)
  const depositSource = getDepositSource();

  const navigate = useNavigate();
  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [address, setAddress] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const fileInputRef = useRef(null);
  const { user, token } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [adminRate, setAdminRate] = useState({ minimum_deposit: 0, inr_value: 90, bit_coin: 90000, deposit_fee: 0, withdrawal_fee: 0 });
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
            bit_coin: parseFloat(data.data.bit_coin_value) || 0,
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
  const feeAmount = numericAmount > 0 ? (numericAmount * (adminRate.deposit_fee / 100)) : 0;
  const receiveAmount = numericAmount > 0 ? (numericAmount - feeAmount) : "";

  // const address = "demodemodemodemodemodemo123456abcdefgh";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

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
    setSelectedFile(file)
  };

  const handleDeposit = async () => {
    const numericAmount = parseFloat(amount);
    if (!amount || !txHash || !selectedFile) {
      // return alert("Please fill all fields !");
      // setShowFieldsAlert(true)
      toast.warning("Please fill out all required fields before deposit.")
      return
    }

    if (numericAmount < Number(adminRate.numericAmount)) {
      toast.error(`The minimum deposit amount is ${adminRate.numericAmount} USD.`)
      return
    }

    // const storeData = JSON.parse(localStorage.getItem("userData"));
    // const user_id = storeData?.user_id;
    // const username = storeData?.username;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("payment_method", paymentType);
      formData.append("enter_amount", amount);
      formData.append("transaction_id", txHash || "123");
      formData.append("payment_screenshot", selectedFile);
      // Append deposit source to track if from website or mobile app
      formData.append("deposit_source", depositSource);

      console.log({
        user_id: user.user_id,
        username: user.username,
        payment_method: paymentType,
        enter_amount: amount,
        transaction_id: txHash,
        deposit_source: depositSource
      });


      // OptionaL address based on payment type

      if (paymentType === "usdt") {
        formData.append("usdt_address", address);
      } else if (paymentType === "upi") {
        formData.append("upi_id", address);
      }

      // console.log("Sending request with token:", user?.token);

      const { data } = await axios.post(
        `${BACKEND_API_URL}/deposit/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      console.log("Deposit saved successfully:", data);
      // show content form backend 
      toast.success(data.message || "Deposited")

      setBalance("");
      setAmount("");
      setTxHash("");
      setSelectedFile(null);

      setTimeout(() => { navigate("/dashboard") }, 3000)

    } catch (error) {
      console.error("Deposit submission error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false)
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


  // fetch USDT address

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!paymentType) return;
        setPaymentLoading(true);

        const params = { payment_mode: paymentType }
        // console.log("Requesting mode:", paymentType);

        const { data } = await axios.get(`${BACKEND_API_URL}/payment/get`, { params });

        if (data?.success && data.data) {
          const row = data.data[0];

          if (paymentType === "usdterc20") {
            setAddress(row.address || "")
          }
          else if (paymentType === "bank_transfer") {
            setAddress(row.bank_account_number || "")
          }
          if (row.qr_code) {
            setQrPreview(row.qr_code);
          }
        } else {
          console.warn("No payment details found for", paymentType);
        }

      } catch (error) {
        console.error("Error fetching payment details", error);
      }
      finally {
        setPaymentLoading(false);
      }
    };
    fetchPaymentDetails()
  }, [paymentType])

  return (
    <div className="pb-25 md:pb-0">
      <DashboardNavebar />
      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='dark' transition={Slide} />

      <div className='pt-[70px]' >
        <DepositBalance />
      </div>

      {/* Main Content: 3 equal columns */}
      <div className="flex flex-col  mt-10 md:flex-row gap-6 px-4 lg:mx-10">

        <DepositComponent paymentType={paymentType} />

        <div className='hidden md:block border border-[#BFBFBF] -mt-10 2xl:h-[830px] lg:h-[1200px]'></div>

        {/* Part 2: Quick Deposit / History */}
        <div className=' w-full flex flex-col lg:flex-col 2xl:flex-row'>
          <div className="flex flex-col gap-10 w-full 2xl:w-1/2 mt-6 items-start">

            {/* Token & Title */}
            <div className="ml-4 lg:ml-0 flex items-center gap-4 w-full">

              <div className="relative w-12 h-12">
                <img src={USDTERCICON} alt="Token" className="w-full h-full" />
                {/* <img src={bnb} alt="BNB" className="absolute -bottom-2 -right-2 w-5 h-5" /> */}
              </div>
              <h2 className="font-extrabold text-3xl lg:text-4xl xl:text-4xl text-gray-800"> {paymentType === "usdterc20" ? "USDT ERC 20" : "USDT ERC"}</h2>
            </div>

            {/* Address */}
            <div className="flex flex-col items-start gap-1 w-full">

              {/* CENTERED QR BOX */}
              <div className="w-full flex justify-center">
                <div className="flex border border-[#00000033] rounded-2xl px-5 py-4">
                  {paymentLoading ? (
                    <div className="w-80 h-80 bg-gray-300 animate-pulse rounded-xl" />
                  ) : (
                    qrPreview && <img className="w-80 h-80" src={qrPreview} alt="QR" />
                  )}
                </div>
              </div>

              <p className="break-all font-semibold text-xl mt-10 text-gray-700">
                Address: <span className="ml-10"> {paymentLoading ? "Loading..." : address}</span>
              </p>

              <div className="w-full flex justify-center">
                <button
                  onClick={handleCopy}
                  className="flex gap-2 items-center justify-center border border-[#868686] px-3 py-1 bg-[#868686] text-white rounded cursor-pointer"
                >
                  <h4 className="text-sm md:text-base">
                    {copied ? "Copied!" : "Click To Copy"}
                  </h4>
                  <img src={copy} alt="Copy" />
                </button>
              </div>
            </div>

          </div>

          {/* Part 3: Minimum Deposit / Summary */}
          <div className=" w-full mt-6 lg:mx-2 flex-1 p-4 space-y-10">

            {/* Minimum Deposit */}
            <div className="text-center">
              <h2 className="font-semibold text-xl lg:text-2xl text-[#A40000]">Minimum Deposit Amount: ${adminRate.minimum_deposit}</h2>

            </div>


            {/* Enter Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#080808]">Enter Amount in USDT</label>

              <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-[#FBFBFB] focus-within:ring-2 focus-within:ring-blue-400">
                <span className="rounded-full bg-[#F7931A] w-6 h-6 flex items-center justify-center text-white font-bold text-sm">$</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 outline-none bg-transparent text-lg font-medium" placeholder="Enter amount" />
              </div>
            </div>

            {/* Amount Will Receive */}

            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#080808]">Amount You Will Receive in USD</label>

              <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-[#FBFBFB] focus-within:ring-2 focus-within:ring-blue-400">
                <span className="rounded-full bg-[#F7931A] w-6 h-6 flex items-center justify-center text-white font-bold text-sm">$</span>
                <input type="number" value={receiveAmount} onChange={(e) => setAmount(e.target.value)} readOnly className="flex-1 outline-none bg-transparent text-lg font-medium text-green-700" />
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#080808]">Enter your Transaction Hash</label>

              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value.trimStart())}
                className="border border-gray-300 rounded-md p-2 outline-none bg-[#FBFBFB] focus:ring-2 focus:ring-blue-400"
                placeholder="Transaction Hash"
              />
            </div>

            {/* Upload Screenshot */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#080808]">Upload Payment Screenshot</label>
              <div
                className="flex flex-col items-center justify-center p-4 border border-gray-400 rounded-md cursor-pointer bg-[#F7931A8F]"
                onClick={() => fileInputRef.current.click()}
              >
                <img src={big} alt="Upload" className="w-6 h-6 mb-2" />
                <p className="text-center text-sm text-[#000000]">
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

            {/* Deposit Button */}
            <div className="w-full">
              <button
                onClick={!loading ? handleDeposit : undefined}
                disabled={loading}
                className="w-full bg-[#006772] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed transition"
              >
                {loading && <FaSpinner className="animate-spin text-white text-xl" />}
                <span className="text-lg">{loading ? "Processing..." : "DEPOSIT"}</span>
              </button>

              {/* RIGHT ALIGNED FEE */}
              <p className="text-right mt-2">
                Deposit Fee: {numericAmount ? feeAmount.toFixed(2) : ""} USD
              </p>
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

export default USDTERC20

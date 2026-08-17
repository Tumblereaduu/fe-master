import React, { useState, useRef, useEffect } from 'react'
import scan from '../../assets/img/transfer/scanner.svg'
import copy from '../../assets/img/transfer/Copy.svg'
import big from '../../assets/img/transfer/Big Arrow.svg'
import upi from '../../assets/img/deposit/upi.png'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DashboardNavebar from '../DepositNavbar/DashboardNavebar'
import { useAuth } from '../context/AuthContext'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { FaSpinner } from "react-icons/fa";
import { BACKEND_API_URL } from '../../api/config'
import DepositComponent from './DepositComponent'
import DepositBalance from '../History/DepositBalance'
import { useTheme } from '../../context/ThemeContext'
import { getDepositSource } from '../../utils/depositSource'


const Scan = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const paymentType = localStorage.getItem("deposit_type");
  // Get deposit source (website or mobile_app)
  const depositSource = getDepositSource();

  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("")
  const [transcation, setTranscation] = useState("")
  const [selectedFile, setselectedFile] = useState("")
  const [address, setAddress] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const { user, token } = useAuth()
  const fileInputRef = useRef(null)
  const [adminRate, setAdminRate] = useState({ minimum_deposit: 0, inr_value: 90, deposit_fee: 0, withdrawal_fee: 0 });
  const [loading, setLoading] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const { isDark } = useTheme();


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


  const numericAmount = parseFloat(amount) || 0;
  const minimumINR = adminRate.minimum_deposit * adminRate.inr_value;

  const amountUSD = numericAmount > 0 ? (numericAmount / adminRate.inr_value).toFixed(3) : 0;

  const feeUSD = amountUSD > 0 ? (amountUSD * (adminRate.deposit_fee / 100)).toFixed(3) : "";
  const receiveUSD = amountUSD > 0 ? (amountUSD - feeUSD).toFixed(3) : "";


  const handleCopy = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed: ", err);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
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
   setselectedFile(file);
   };

  const handleDeposit = async () => {
    if (!amount || !transcation || !selectedFile) {
      toast.warning("Please fill out all required fields before deposit.")
      return
    }

    const numericamount = parseFloat(amount)
    if (numericamount < minimumINR) {
      toast.error(`The minimum deposit amount is ${minimumINR.toFixed(2)} INR`)
      return
    }

    try {
      setLoading(true);
      const formData = new FormData()
      formData.append("user_id", user.user_id)
      formData.append("username", user.username)
      formData.append("email", user.email)
      formData.append("payment_method", paymentType)
      formData.append("enter_amount", amount)
      formData.append("transaction_id", transcation)
      formData.append("payment_screenshot", selectedFile)
      // Append deposit source to track if from website or mobile app
      formData.append("deposit_source", depositSource)

      if (paymentType.toLowerCase() === "upi") formData.append("upi_id", address)

      const { data } = await axios.post(`${BACKEND_API_URL}/deposit/create`,
        formData, { headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` } }
      )
      console.log("Deposit saved successfully:", data);

      toast.success(data.message || "Deposited")

      setBalance("")
      setAmount("")
      setTranscation("")
      setselectedFile(null)

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000)

    } catch (error) {
      console.error("Depostit submussion error:", error);
      alert(error.response?.data?.error || "Something went wrong")
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!paymentType) return;
        setPaymentLoading(true);

        const params = { payment_mode: paymentType }

        const { data } = await axios.get(`${BACKEND_API_URL}/payment/get`, { params });

        if (data?.success && data.data) {
          const row = data.data[0];

          if (paymentType === "USDT" || paymentType === "upi") {
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
      finally{
          setPaymentLoading(false);
      }
    };
    fetchPaymentDetails()
  }, [paymentType])

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/payment/getactive?type=withdraw`);
        if (data.success && data.data) {
          const flat = Array.isArray(data.data[0]) ? data.data.flat() : data.data;
          setPaymentModes(flat);
        } else {
          setPaymentModes([]);
        }
      } catch (err) {
        console.error("Failed to fetch payment modes:", err);
      }
    };

    fetchPaymentModes();
  }, []);

  return (
    <div className={`transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
      <DashboardNavebar />

      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        transition={Slide}
      />

    <div className='pt-[70px]' >
      <DepositBalance />
    </div>

      <div className="flex flex-col mt-10 md:flex-row gap-6 px-4 lg:mx-10">

        <DepositComponent paymentType={paymentType} />

        <div className={`hidden md:block border -mt-10 2xl:h-[830px] lg:h-[1200px] transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-[#BFBFBF]"}`}></div>

 <div className=' w-full flex flex-col lg:flex-col 2xl:flex-row'>
        <div className="flex flex-col gap-10 w-full 2xl:w-1/2 mt-6 items-start">

          <div className="ml-4 lg:ml-0 flex items-center gap-4 w-full">
            <div className="relative w-12 h-12">
              <img
                src={upi}
                alt="BNB"
                className="absolute -bottom-2 -right-2 w-15 h-15"
              />
            </div>
            <h2 className={`font-extrabold text-3xl lg:text-4xl xl:text-4xl transition-colors duration-300 ${isDark ? "text-white" : "text-gray-800"}`}>UPI Deposit </h2>
          </div>

          <div className="mt-5 flex flex-col items-center justify-center w-full">
          <div className={`flex border rounded-2xl px-5 py-4 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-[#00000033]"}`}>
            {paymentLoading ? (
              <div className={`w-80 h-80 animate-pulse rounded-xl ${isDark ? "bg-[#2A3640]" : "bg-gray-300"}`} />
            ) : (
              qrPreview && ( <img src={qrPreview} alt="QR Code" className="w-80 h-80" />
              )
            )}
          </div>

            <div className="flex flex-col md:flex-row items-center justify-center mt-6 gap-3">
              <p className={`break-all font-semibold text-base md:text-xl text-center transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-gray-700"}`}>
                UPI ID: <span className="ml-2 md:ml-4 text-lg md:text-2xl">
                  {paymentLoading ? "Loading..." : address}
                </span>
              </p>
              <button
                onClick={handleCopy}
                className={`flex gap-2 items-center justify-center border w-fit px-3 py-1 text-white rounded cursor-pointer text-sm md:text-base transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#2A3640]" : "border-[#868686] bg-[#868686]"}`}
              >
                <h4>{copied ? "Copied!" : "Click To Copy"}</h4>
                <img src={copy} alt="Copy" />
              </button>
            </div>
          </div>

        </div>


        <div className="w-full lg:mx-2 flex-1 p-4 space-y-10">

          <div className="text-center">
            <h2 className={`font-semibold text-[18px] lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#FF6B6B]" : "text-[#A40000]"}`}>Minimum Deposit Amount: ₹ {minimumINR.toFixed(2)}</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-[#080808]"}`}>Enter Amount in INR</label>

            <div className={`flex items-center gap-2 border rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-400 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-gray-300 bg-[#FBFBFB]"}`}>
              <span className="rounded-full bg-[#F7931A] w-6 h-6 flex items-center justify-center text-white font-bold text-sm">₹</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`flex-1 outline-none bg-transparent text-lg font-medium transition-colors duration-300 ${isDark ? "text-white" : ""}`} placeholder="Enter amount" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-[#080808]"}`}>Amount You Will Receive in USD</label>

            <div className={`flex items-center gap-2 border rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-400 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B]" : "border-gray-300 bg-[#FBFBFB]"}`}>
              <span className="rounded-full bg-[#F7931A] w-6 h-6 flex items-center justify-center text-white font-bold text-sm">$</span>       
              <input type="number" value={receiveUSD} onChange={(e) => setAmount(e.target.value)} readOnly className={`flex-1 outline-none bg-transparent text-lg font-medium transition-colors duration-300 ${isDark ? "text-green-400" : "text-green-700"}`} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-[#080808]"}`}>Enter the UPI Transaction ID / UTR ID </label>

            <input
              type="text"
              value={transcation}
              onChange={(e) => setTranscation(e.target.value.trimStart())}
              className={`border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B] text-white" : "border-gray-300 bg-[#FBFBFB]"}`}
              placeholder="Enter the UPI Transaction ID / UTR ID "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={`font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-[#080808]"}`}>Upload Payment Screenshot</label>
            <div
              className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#2A2A1A]" : "border-gray-400 bg-[#F7931A8F]"}`}
              onClick={() => fileInputRef.current.click()}
            >
              <img src={big} alt="Upload" className="w-6 h-6 mb-2" />
              <p className={`text-center text-sm transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-black"}`}>
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

          <div className="w-full">
            <button
              onClick={!loading ? handleDeposit : undefined}
              disabled={loading}
              className="w-full bg-[#E27C00] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed transition"
            >
              {loading && <FaSpinner className="animate-spin text-white text-xl" />}
              <span className="text-lg">{loading ? "Processing..." : "DEPOSIT"}</span>
            </button>

            <p className={`text-right mt-2 transition-colors duration-300 ${isDark ? "text-[#8899A6]" : ""}`}>
              Deposit Fee: {numericAmount ? feeUSD : ""} USD
            </p>
          </div>
        </div>
</div>

      </div>
    </div>

  )
}

export default Scan

import { useState, useRef } from "react";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import otpImg from "../../assets/img/forgotpassword/Enter-OTP-pana1.png";
import Logo from "../../assets/img/logo/Doin FX.svg";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";

export default function EnterOTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();
  

  const userData = location.state?.userData || {};
  const email = location.state?.email || userData.email || "";


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== otp.length) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_API_URL}/auth/verify-forgot-password-otp`, {
        email,
        otp: code
      })
      console.log("Sending OTP:", { email, otp: code })
      if (response.data.status === "success") {
        const normalizedEmail = email.trim().toLowerCase();
        localStorage.setItem("resetEmail", normalizedEmail);
        toast.success("OTP verfied successfully");
        navigate("/reset_password", { state: { email: normalizedEmail } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP")
    }

  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/auth/resend-forgot-password-otp`, { email });
      toast.success(response.data.message || "OTP send successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative">
       <ToastContainer position="top-right" autoClose={3000} transition={Slide} />
      {/* Mobile Logo */}
      <div className="absolute top-0 left-3 md:hidden mt-4">
        <img src={Logo} alt="DOIN FX Logo" className="h-16 w-32 object-contain" />
      </div>

      {/* Left Side (Desktop) */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-6">
        <div className="mb-9">
          <img src={Logo} alt="DOIN FX Logo" className="h-25 w-40 absolute top-0 left-3 object-contain" />
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <img src={otpImg} alt="OTP Illustration" className="max-w-md rounded-lg" />
          <p className="mt-6 text-center text-gray-600">
            Secure your access, enter the OTP and continue trading at the speed of thought.
          </p>
        </div>

        <div className="mt-6 space-y-2 text-gray-700 text-md">
          <p className="flex items-center gap-2 font-medium text-gray-800 mb-2">
            <FaPhone className="text-blue-600 text-lg" /> {description}
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> WhatsApp: {whatsapp}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> Mail: {adminEmail}
          </p>
        </div>
      </div>

      {/* Right Side / Mobile */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 md:p-12">
        {/* Illustration for mobile */}
        <div className="md:hidden mb-6 w-full flex justify-center mt-16">
          <img src={otpImg} alt="OTP Illustration" className="max-w-xs h-auto rounded-lg" />
        </div>

        {/* OTP Form */}
        <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
            Enter Confirmation Code
          </h2>
          <p className="mb-6 text-center text-gray-500 text-sm">
            A 4-digit code was sent to <span className="font-medium">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50 transition"
                onClick={handleResendOtp}   >
                Resend OTP
              </button>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#007FFF] px-4 py-2 font-medium text-white hover:bg-blue-600 transition"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

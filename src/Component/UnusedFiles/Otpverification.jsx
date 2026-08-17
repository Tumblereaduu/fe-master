import { useState, useRef } from "react";
import { FaLifeRing, FaEnvelope, FaWhatsapp} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OTPImg from "../assets/img/forgotpassword/Enter-OTP-pana1.png";
import Sidebar from "../Unused/Sidebar";
import Navbar from "../Unused/Navbar";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle OTP input with auto-focus
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  // Validation + Redirect
  const handleContinue = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }
    navigate("/NewPassword");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
       <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
       <Sidebar />
        {/* Main Content */}
        <main className="flex-1 bg-white p-6 md:p-10 shadow-md flex flex-col items-center justify-center md:ml-55">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            Change Password
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl">
            {/* Left Section */}
            <div className="w-full md:w-1/1 flex flex-col items-start text-center md:text-left">
              <img
                src={OTPImg}
                alt="OTP Verification"
                className="w-90 md:w-150 mx-auto"
              />
              <p className="text-sm text-gray-600 relative bottom-19 ">
                Enter OTP, unlock access, and trade at the speed of thought.
              </p>
              <div className="hidden absolute left-68 bottom-4 md:block mt-6 text-sm text-gray-700 space-y-3">
                <p className="flex items-center justify-center md:justify-start">
                  <FaLifeRing className="mr-2 text-black" /> Connect anytime and get instant support.
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <FaWhatsapp className="mr-2 text-green-500" />{" "}
                  <span className="font-bold">WhatsApp:</span> +44 7488 848671
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2 text-blue-500" />{" "}
                  <span className="font-bold">Mail:</span> contact@rifafx.com
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Enter Confirmation Code
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                4-digit code was sent to{" "}
                <span className="font-medium">example@gmail.com</span>
              </p>
              <div className="flex space-x-4 mb-6 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputsRef.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-lg font-semibold border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}
              </div>
              <button className="w-full bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 mb-3">
                Resend OTP
              </button>
              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

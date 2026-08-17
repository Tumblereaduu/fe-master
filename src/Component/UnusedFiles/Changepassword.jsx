import { useState } from "react";
import {
  FaUser,
  FaWallet,
  FaKey,
  FaLifeRing,
  FaSignOutAlt,
  FaEnvelope,
  FaWhatsapp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { User } from "lucide-react";
import Logo from "../assets/img/logo/RIFAFX_org.png";
import PasswordImg from "../assets/img/changepassword/Forgotpassword-pana1.png";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Email Regex (basic validation)
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    navigate("/otp");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar (Mobile Drawer + Desktop Static) */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-white p-8 md:p-10 shadow-md flex flex-col items-center justify-center mt-0 md:mt-0 md:ml-55">
          <h2 className="text-xl md:text-2xl  font-bold absolute top-29">Change Password</h2>

          <div className="flex flex-col md:flex-row items-center gap-15 w-full max-w-5xl ">
            {/* Left Section */}
            <div className="w-full md:w-1/1 flex flex-col items-start text-center md:text-left">
              <img
                src={PasswordImg}
                alt="Forgot Password"
                className="w-80 md:w-125 mx-auto"
              />

              {/* Footer Note */}
              <p className="text-sm text-gray-600 mt-6">
                Forgot password? Just one step to regain trading account.
              </p>

              {/* Support Section */}
              <div className="hidden md:block absolute left-69 bottom-5 mt-6 text-md text-gray-700 space-y-3">
                <p className="flex items-center justify-center md:justify-start">
                  <FaLifeRing className="mr-2 text-black" /> Connect anytime and
                  get instant support.
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp: +44
                  7488 848671
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2 text-blue-500" /> Mail:
                  contact@rifafx.com
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2">
              <h3 className="text-lg md:text-2xl font-semibold mb-9">
                Change Password
              </h3>
              <label className="block text-sm font-medium mb-3">
                Your Email ID
              </label>
              <div className="flex items-center border rounded-md mt-4 px-4 py-2 mb-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <button
                onClick={handleNext}
                className="w-full mt-3 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { FaWhatsapp, FaEnvelope, FaPhone, FaEye, FaEyeSlash,FaSpinner } from "react-icons/fa";
import resetImg from "../../assets/img/passwordpage/My-password-bro-1.png";
import Logo from "../../assets/img/logo/Doin FX.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState("");
  const[loading,setLoading] = useState(false);
  const { token } = useAuth()
  const location = useLocation();
  const email =
    (location.state?.email || localStorage.getItem("resetEmail") || "")
      .trim()
      .toLowerCase();
  const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(form.password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

        setLoading(true);
    try {

      // const email = localStorage.getItem("resetEmail") || user?.email;
      console.log("Resetting password for:", email);


      const response = await axios.post(`${BACKEND_API_URL}/auth/reset-password`, {
        email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(response.data.message || "Password set successfully");
      setTimeout(() => {
        localStorage.removeItem("resetEmail");
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error resetting password");
    }
    finally{
      setTimeout(()=>{
       setLoading(false);        
      },3000)
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative">
      {/* Mobile Logo */}
      <ToastContainer position="top-right" autoClose={2500} transition={Slide} />
      <div className="absolute top-0 left-3 md:hidden mt-4">
        <img src={Logo} alt="DOIN FX Logo" className="h-16 w-32 object-contain" />
      </div>

      {/* Left Section (Desktop) */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-6">
        <div className="mb-9">
          <img src={Logo} alt="DOIN FX Logo" className="h-25 w-40 absolute top-0 left-3 object-contain" />
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <img
            src={resetImg}
            alt="Reset Password Illustration"
            className="max-w-md rounded-lg"
          />
          <p className="mt-6 text-center text-gray-600">
            Set a strong password to secure your trading account.
          </p>
        </div>

        <div className="mt-6 space-y-2 text-gray-700 text-sm">
          <p className="flex items-center gap-2 font-medium text-gray-800 mb-2">
            <FaPhone className="text-blue-600 text-lg" />
            {description}
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> WhatsApp: {whatsapp}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> Mail: {adminEmail}
          </p>
        </div>
      </div>

      {/* Right Section / Mobile */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 md:p-12">
        {/* Illustration for mobile */}
        <div className="md:hidden mb-6 w-full flex justify-center mt-16">
          <img src={resetImg} alt="Reset Password Illustration" className="max-w-xs h-auto rounded-lg" />
        </div>

        {/* Reset Password Form */}
        <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#007FFF] px-4 py-2 md:px-4 md:py-2 font-semibold text-white hover:bg-blue-600 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {loading && <FaSpinner className="animate-spin text-white text-lg" />}
              <span>{loading ? "Resetting..." : "Continue"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
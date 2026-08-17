import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import SetPasswordImg from "../assets/img/registerpage/Mobile-login-bro.png";
import Logo from "../assets/img/logo/RIFAFX_org.png";
export default function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/contact", { state: { userData: { ...userData, ...form } } });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-3">
        {/* Logo */}
        <img src={Logo} alt="Logo" className="h-25 w-40" />

        {/* Illustration */}
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <img
            src={SetPasswordImg}
            alt="Set Password Illustration"
            className="max-w-sm h-auto mb-6"
          />
          <p className="text-gray-600 max-w-md text-base">
            Create a strong password and trade with confidence <br />
            – secure, simple, seamless.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-2 text-gray-700">
          <p className="flex items-center gap-2 font-medium">
            <FaPhone className="text-black" /> Connect anytime and get instant
            support.
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> WhatsApp: +44 7488 848671
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> Mail: contact@rifafx.com
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center h-screen">
        <div className="w-full max-w-md rounded-2xl bg-white p-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
            Set Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

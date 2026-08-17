import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import forgotImg from "../../assets/img/forgotpassword/Forgot-password-pana1.png";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function ForgotPassword() {

  // STATES
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpStatus, setOtpStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingotp, setLoadingotp] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // SEND OTP FUNCTION (unchanged)
  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    setLoadingotp(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await axios.post(`${BACKEND_API_URL}/auth/forgot-password`, { email });

      if (response.data.status === "success") {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingotp(false);
    }
  };

  // VERIFY OTP FUNCTION (unchanged)
  const verifyOtp = async (otpValue) => {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/auth/verify-forgot-password-otp`, {
        email,
        otp: otpValue
      });

      if (response.data.status === "success") {
        setOtpStatus("valid");
        toast.success("OTP verified successfully");
      } else {
        setOtpStatus("invalid");
        toast.error("OTP invalid or expired");
      }
    } catch (error) {
      setOtpStatus("invalid");
      toast.error(error.response?.data?.message || "OTP invalid or expired");
    }
  };

  // PASSWORD VALIDATION
  const isLengthValid = password.length >= 8 && password.length <= 15;
  const isUpperLowerValid = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const isNumberValid = /\d/.test(password);
  const isSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // FORM SUBMIT (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    if (!otp || otp.length !== 4) {
      toast.error("Enter valid 4-digit OTP");
      return;
    }

    try {
      const verifyResp = await axios.post(`${BACKEND_API_URL}/auth/verify-forgot-password-otp`, {
        email,
        otp
      });

      if (verifyResp.data.status !== "success") {
        setOtpStatus("invalid");
        toast.error(verifyResp.data.message || "OTP invalid or expired");
        return;
      }

      setOtpStatus("valid");
    } catch (err) {
      setOtpStatus("invalid");
      toast.error(err.response?.data?.message || "OTP invalid or expired");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_API_URL}/auth/reset-password`,
        { email, password, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Password set successfully");

      setTimeout(() => navigate("/login"), 3000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} />

      {/* Logo */}
      <div className="absolute top-0 left-3 mt-4">
        <img src={isDark ? LogoYellow : LogoBlack} alt="Doin FX Logo" className="h-19 w-39 object-contain" />
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl bg-white p-6 mt-50">

          <h2 className="mb-10 text-3xl font-bold text-gray-800">Forgot Password</h2>

          {/* ------------------------------------------------------------ */}
          {/* MOBILE VIEW FORM (NEW) */}
          {/* ------------------------------------------------------------ */}
          <form onSubmit={handleSubmit} className="md:hidden w-full space-y-10">

            {/* Email */}
            <div>
              <label className="block text-md font-medium text-gray-600">Your Email ID</label>
              <div className="relative mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3.5"
                />

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loadingotp}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 
                    px-4 py-2 rounded-lg text-sm font-medium
                    ${loadingotp ? "opacity-60" : ""}`}
                >
                  {loadingotp ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-md font-medium text-gray-600">Enter OTP</label>

              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  setOtp(value);

                  if (value.length === 4) verifyOtp(value);
                  else setOtpStatus(null);
                }}
                className={`w-full rounded-lg border px-4 py-3 tracking-widest text-center text-lg
                  ${otpStatus === "valid"
                    ? "border-green-500 bg-green-50"
                    : otpStatus === "invalid"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"}`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-md font-medium text-gray-600">Password</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-10 py-3"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 bottom-4 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Password Rules */}
              <ul className="text-xs space-y-2 ml-2 mt-2">
                <li className={`${isLengthValid ? "text-green-600" : "text-red-500"}`}>
                  {isLengthValid ? "✔" : "✖"} 8 to 15 characters
                </li>
                <li className={`${isUpperLowerValid ? "text-green-600" : "text-red-500"}`}>
                  {isUpperLowerValid ? "✔" : "✖"} 1 upper & 1 lower case letter
                </li>
                <li className={`${isNumberValid ? "text-green-600" : "text-red-500"}`}>
                  {isNumberValid ? "✔" : "✖"} At least 1 number
                </li>
                <li className={`${isSpecialChar ? "text-green-600" : "text-red-500"}`}>
                  {isSpecialChar ? "✔" : "✖"} At least 1 special character
                </li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-md font-medium text-gray-600">Confirm Password</label>

              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-10 py-3"
                />

                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 bottom-4 cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otpStatus !== "valid"}
              className="w-full rounded-lg bg-blue-600 text-white py-3 text-lg font-semibold 
              flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <FaSpinner className="animate-spin" />}
              Continue
            </button>
          </form>

          {/* ------------------------------------------------------------ */}
          {/* DESKTOP VIEW (ORIGINAL) – UNCHANGED */}
          {/* ------------------------------------------------------------ */}
          <form onSubmit={handleSubmit} className="hidden md:block w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* LEFT SIDE */}
              <div>
                {/* EMAIL */}
                <label className="block text-md font-medium text-gray-600">Your Email ID</label>

                <div className="relative mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3.5"
                  />

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loadingotp}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 px-4 py-2 rounded-lg text-sm
                      ${loadingotp ? "opacity-70" : ""}`}
                  >
                    {loadingotp ? "Sending..." : "Send OTP"}
                  </button>
                </div>

                {/* PASSWORD */}
                <div className="mt-10">
                  <label className="block text-md font-medium text-gray-600">Password</label>

                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-10 py-3"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 bottom-4 cursor-pointer text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <ul className="text-xs space-y-2 ml-2 mt-2">
                    <li className={`${isLengthValid ? "text-green-600" : "text-red-500"}`}>
                      {isLengthValid ? "✔" : "✖"} 8 to 15 characters
                    </li>
                    <li className={`${isUpperLowerValid ? "text-green-600" : "text-red-500"}`}>
                      {isUpperLowerValid ? "✔" : "✖"} 1 upper & 1 lower case letter
                    </li>
                    <li className={`${isNumberValid ? "text-green-600" : "text-red-500"}`}>
                      {isNumberValid ? "✔" : "✖"} At least 1 number
                    </li>
                    <li className={`${isSpecialChar ? "text-green-600" : "text-red-500"}`}>
                      {isSpecialChar ? "✔" : "✖"} At least 1 special character
                    </li>
                  </ul>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* OTP */}
                <label className="block text-md font-medium text-gray-600">Enter OTP</label>

                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                    if (value.length === 4) verifyOtp(value);
                    else setOtpStatus(null);
                  }}
                  className={`mt-1 w-full rounded-lg border px-4 py-3 tracking-widest text-center text-lg
                    ${otpStatus === "valid"
                      ? "border-green-500 bg-green-50"
                      : otpStatus === "invalid"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"}`}
                />

                {/* Confirm Password */}
                <div className="mt-10">
                  <label className="block text-md font-medium text-gray-600">Confirm Password</label>

                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-10 py-3"
                    />

                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 bottom-4 cursor-pointer text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpStatus !== "valid"}
                  className="mt-12 w-full rounded-lg bg-blue-600 text-white py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Continue
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

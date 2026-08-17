import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../../services/api";
import { BACKEND_API_URL } from "../../api/config";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import NavbarForAccount from "../NavbarForAccount";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide, toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

/* ─── Dark overrides for browser-native inputs ─── */
const darkModeCSS = `
  .newpwd-dark input::placeholder { color: #6B7B88; }
`;

export default function NewPassword() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const { token, user } = useAuth();

  const dk = {
    pageBg: "bg-[#141D22]",
    input: "bg-[#121A20] border-[#2A3640] text-[#E8EDF0]",
    focusRing: "focus:ring-[#2A3640]",
    heading: "text-white",
    subHeading: "text-[#E8EDF0]",
    eyeIcon: "text-[#6B7B88] hover:text-[#F7931A]",
    greenText: "text-green-400",
    redText: "text-red-400",
    errorText: "text-red-400",
    successText: "text-green-400",
  };

  const getPasswordErrors = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password should be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must include at least one number.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must include at least one special character.");
    }

    return errors;
  };

  // PASSWORD VALIDATION
  const isLengthValid = password.length >= 8 && password.length <= 15;
  const isUpperLowerValid = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const isNumberValid = /\d/.test(password);
  const isSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleConfirm = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !password || !confirmPassword) {
      setError("All fields are required");
      setPasswordErrors([]);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setPasswordErrors([]);
      return;
    }

    const errors = getPasswordErrors(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors([]);

    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/auth/change-password`,
        {
          user_id: user?.user_id,
          oldPassword,
          newPassword: password,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Password changed ");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong";
      setError(msg);
    }
  };

  const inputClass = "w-full border rounded-md px-4 py-4 pr-10 focus:ring-2 outline-none transition-colors duration-200";

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? `${dk.pageBg} newpwd-dark` : "bg-gray-100"}`}>
      {isDark && <style>{darkModeCSS}</style>}

      <NavbarForAccount />
      <DoinDashboardSidebar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} theme="dark" />

      <div className="flex flex-1">
        <main className={`flex-1 p-6 md:p-10 flex flex-col items-center justify-center md:ml-55 md:-mt-0 transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
          <h2 className={`text-2xl md:text-2xl font-bold text-center transition-colors duration-300 ${isDark ? dk.heading : "text-gray-800"}`}>
            Change Password
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl mt-10">
            <div className="w-full justify-center items-center-safe mx-10 lg:mx-32 xl:mx-48 2xl:mx-44">
              <h3 className={`text-lg md:text-xl font-semibold mb-4 text-center md:text-center transition-colors duration-300 ${isDark ? dk.subHeading : "text-gray-800"}`}>
                Set New Password 
              </h3>

              {/* Old Password */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`${inputClass} ${isDark ? dk.input : "bg-white border-gray-300 text-gray-900 focus:ring-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-3 flex items-center transition-colors duration-200 ${isDark ? dk.eyeIcon : "text-gray-500 hover:text-orange-600"}`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative mb-4">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} ${isDark ? dk.input : "bg-white border-gray-300 text-gray-900 focus:ring-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute inset-y-0 right-3 bottom-23 flex items-center transition-colors duration-200 ${isDark ? dk.eyeIcon : "text-gray-500 hover:text-orange-600"}`}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {/* Password Rules */}
                <ul className="text-xs space-y-2 ml-2 mt-2">
                  <li className={isDark ? (isLengthValid ? dk.greenText : dk.redText) : (isLengthValid ? "text-green-600" : "text-red-500")}>
                    {isLengthValid ? "✔" : "✖"} 8 to 15 characters
                  </li>
                  <li className={isDark ? (isUpperLowerValid ? dk.greenText : dk.redText) : (isUpperLowerValid ? "text-green-600" : "text-red-500")}>
                    {isUpperLowerValid ? "✔" : "✖"} 1 upper & 1 lower case letter
                  </li>
                  <li className={isDark ? (isNumberValid ? dk.greenText : dk.redText) : (isNumberValid ? "text-green-600" : "text-red-500")}>
                    {isNumberValid ? "✔" : "✖"} At least 1 number
                  </li>
                  <li className={isDark ? (isSpecialChar ? dk.greenText : dk.redText) : (isSpecialChar ? "text-green-600" : "text-red-500")}>
                    {isSpecialChar ? "✔" : "✖"} At least 1 special character
                  </li>
                </ul>
              </div>

              {/* Confirm Password */}
              <div className="relative mb-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} ${isDark ? dk.input : "bg-white border-gray-300 text-gray-900 focus:ring-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-3 flex items-center transition-colors duration-200 ${isDark ? dk.eyeIcon : "text-gray-500 hover:text-orange-600"}`}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {error && <p className={`text-sm mb-3 transition-colors duration-200 ${isDark ? dk.errorText : "text-red-500"}`}>{error}</p>}
              {success && <p className={`text-sm mb-3 transition-colors duration-200 ${isDark ? dk.successText : "text-green-600"}`}>{success}</p>}
              {passwordErrors.length > 0 && (
                <ul className="mt-2 text-sm space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx} className={`transition-colors duration-200 ${isDark ? dk.errorText : "text-red-500"}`}>{err}</li>
                  ))}
                </ul>
              )}

              <button
                onClick={handleConfirm}
                className="w-full bg-blue-500 text-white px-6 py-4 mt-10 rounded-md font-medium hover:bg-blue-400 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
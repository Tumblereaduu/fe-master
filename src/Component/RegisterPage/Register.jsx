import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Mail } from "lucide-react";
import { CiUser } from "react-icons/ci";
import { motion } from "framer-motion";
import axios from "axios";
import Registerimg from "../../assets/img/registerpage/Mobile-login-bro.png";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";
import PhoneInput from "react-phone-input-2";
import { useTheme } from "../../context/ThemeContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    otp: [""],
    password: "",
    confirmPassword: "",
    whatsapp_number: "",
    whatsapp_country_code: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpStatus, setOtpStatus] = useState(null); // null | "valid" | "invalid"
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const {isDark} = useTheme();
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const formatPhoneWithSpaces = (value, country, event, formattedValue) => {
  const rawValue = String(value || "").replace(/\D/g, "");
  const dialCode = String(country?.dialCode || "").replace(/\D/g, "");

  // Best value from react-phone-input-2, example: +263 555 555 555 555
  if (formattedValue && formattedValue.includes("+")) {
    return {
      raw: rawValue,
      formatted: formattedValue,
      dialCode,
    };
  }

  // Browser input display fallback
  if (event?.target?.value && event.target.value.includes("+")) {
    return {
      raw: rawValue,
      formatted: event.target.value,
      dialCode,
    };
  }

  // Manual fallback
  let numberOnly = rawValue;

  if (dialCode && rawValue.startsWith(dialCode)) {
    numberOnly = rawValue.slice(dialCode.length);
  }

  return {
    raw: rawValue,
    formatted: dialCode ? `+${dialCode} ${numberOnly}` : `+${rawValue}`,
    dialCode,
  };
};

const handleWhatsappChange = (value, country, event, formattedValue) => {
  const phone = formatPhoneWithSpaces(value, country, event, formattedValue);

  setForm((prev) => ({
    ...prev,
    whatsapp_number_raw: phone.raw,
    whatsapp_number: phone.formatted,
    whatsapp_country_code: phone.dialCode,
  }));
};

  // Auto verify OTP when all 4 digits entered
  // const handleOtpChange = async (e, index) => {
  //   const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
  //   if (value.length > 1) return;

  //   // const newOtp = [...form.otp];
  //   // newOtp[index] = value;
  //   // setForm({ ...form, otp: newOtp });
  //   const newOtp = value.split("").concat(Array(4 - value.length).fill(""));
  // setForm({ ...form, otp: newOtp });

  //   if (value && index < 3) document.getElementById(`otp-${index + 1}`).focus();

  //   if (newOtp.join("").length === 4) {
  //     setVerifying(true);
  //     try {
  //       const res = await axios.post(`${BACKEND_API_URL}/auth/verify-email-otp`, {
  //         email: form.email,
  //         otp: newOtp.join(""),
  //       });

  //       if (res.data.status === "success") {
  //         setOtpStatus("valid");
  //       } else {
  //         setOtpStatus("invalid");
  //       }
  //     } catch (err) {
  //       setOtpStatus("invalid");
  //     } finally {
  //       setVerifying(false);
  //     }
  //   } else {
  //     setOtpStatus(null);
  //   }
  // };

  // password = your state value
const isLengthValid = form.password.length >= 8 && form.password.length <= 15;
const isUpperLowerValid = /[A-Z]/.test(form.password) && /[a-z]/.test(form.password);
const isNumberValid = /\d/.test(form.password);
const isSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
const [loading, setLoading] = useState(false);
const [loadingOtp, setLoadingOtp] = useState(false);
const refId = new URLSearchParams(window.location.search).get("ref");

  const verifyOtp = async (otpValue) => {
  setVerifying(true);
  try {
    const res = await axios.post(`${BACKEND_API_URL}/auth/verify-email-otp`, {
      email: form.email,
      otp: otpValue,
    });

    setOtpStatus(res.data.status === "success" ? "valid" : "invalid");
  } catch {
    setOtpStatus("invalid");
  } finally {
    setVerifying(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpStatus !== "valid") {
      toast.error("Please verify your OTP before continuing.");
      return;
    }

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!form.whatsapp_number){
      toast.error("Kindly provide Whatsapp Number.");
      return;
    }

    if (form.password !== form.confirmPassword){
      toast.error("Password doesn't match");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password should be minimum 8 characters.");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/register`, {
  username: form.username,
  email: form.email,
  password: form.password,
  confirmPassword: form.confirmPassword,
  whatsapp_number: form.whatsapp_number,
  whatsapp_country_code: form.whatsapp_country_code,
  referred_by_id: refId || null,
      });

      if (res.data.status === "success") {
        // Create user data object
        const userData = {
          username: form.username,
          email: form.email,
        };

        // Save to localStorage
        // localStorage.setItem("userData", JSON.stringify(userData));
        toast.success(res.data.message)
        // Navigate to contact page with userData
        setTimeout(() => {
          navigate("/login", { state: { userData } });
        }, 3000);
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please try again.");
    }
     finally {
      setTimeout(() => {
         setLoading(false);
      }, 3000);
  }
  };

  return (
    <div className="p-5 md:block flex min-h-screen bg-white ">
      {/* Left Side: Logo + Illustration (Desktop only) */}
      <ToastContainer position="top-right" autoClose={3000} />


      {/* Right Side: Form */}
      <div className=" w-full items-center justify-center mt-20">
        {/* Logo on mobile */}
        <div className=" absolute top-1 left-1">
          <img src={ isDark ? LogoYellow : LogoBlack} alt="Logo" className="h-19 w-39 object-contain" />
        </div>
        <a
          href="/login"
          className="absolute top-5 right-3 md:top-6 md:right-12 text-blue-500 font-semibold text-lg z-10 rounded-3xl p-1 px-2 py-0.5 hover:bg-blue-50"
        > Login </a>

        {/* Illustration for mobile */}
        {/* <div className="md:hidden mb-1 w-full relative top-12 flex justify-center">
          <img src={Registerimg} alt="Register Illustration" className="max-w-xs h-auto" />
        </div> */}
        <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white md:mt-20">
          <h2 className="mb-10 text-center text-xl md:text-2xl font-bold text-gray-800">
            Create New Account
          </h2>

{/* MOBILE VIEW FORM */}
<div className="md:hidden w-full mt-1">
  {/* <h2 className="text-center text-xl font-bold mb-8">Register</h2> */}

  {/* Username */}
  <label className="block text-sm font-medium text-gray-700">User Name</label>
  <div className="relative mb-6">
    <CiUser className="absolute left-3 top-4 text-gray-700" size={18} />
    <input
      type="text"
      name="username"
      value={form.username}
      onChange={handleChange}
      placeholder="Enter your name"
      className="w-full border rounded-lg px-10 py-3"
    />
  </div>

  {/* Email */}
  <label className="block text-sm font-medium text-gray-700">Email ID</label>
  <div className="relative">
    <Mail className="absolute left-3 top-4 text-gray-700" size={18} />
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Enter your email"
      className="w-full border rounded-lg px-10 py-3"
    />
  </div>

  {/* SEND OTP */}
  <div className="flex justify-end mb-6 mt-2">
    <button
      type="button"
      disabled={loadingOtp}
      onClick={async () => {
        setLoadingOtp(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.email) {
          toast.error("Email is required");
          return setLoadingOtp(false);
        }
        if (!emailRegex.test(form.email)) {
          toast.warning("Invalid email address");
          return setLoadingOtp(false);
        }

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const response = await axios.post(`${BACKEND_API_URL}/auth/send-email-otp`, {
            email: form.email,
            username: form.username,
          });

          if (response.data.status === "success") {
            toast.success("OTP sent to your email.");
            setOtpSent(true);
          } else {
            toast.error(response.data.message || "Email already exists!");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
          setLoadingOtp(false);
        }
      }}
      className="bg-yellow-400 px-4 py-2 rounded-lg"
    >
      {loadingOtp ? "Sending..." : "Send OTP"}
    </button>
  </div>

  {/* OTP INPUT */}
  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
  <input
    type="text"
    maxLength={4}
    value={form.otp}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 4) setForm({ ...form, otp: value });
      value.length === 4 ? verifyOtp(value) : setOtpStatus(null);
    }}
    className={`w-full text-center tracking-widest border rounded-lg px-5 py-3 mb-6
      ${otpStatus === "valid" ? "border-green-500 bg-green-50" :
        otpStatus === "invalid" ? "border-red-500 bg-red-50" :
        "border-gray-700"}`}
  />

  {/* WhatsApp Number */}
  <label className="block text-sm font-medium text-gray-700">Whatsapp Number</label>
<PhoneInput
  country={"in"}
  value={form.whatsapp_number_raw}
  onChange={handleWhatsappChange}
  inputClass={`!w-full !border-gray-700 !rounded-lg !px-12 !h-12.5 ${
    error?.whatsapp_number ? "!border-red-500" : ""
  }`}
  buttonClass="!border !border-gray-700 !rounded-l-lg !h-12.5"
  containerClass="w-full mt-1"
  placeholder="Enter WhatsApp number"
  enableSearch={true}
/>

  {/* Password */}
  <label className="block text-sm font-medium text-gray-700">Password</label>
  <div className="relative mb-6">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Enter password"
      className="w-full border rounded-lg px-10 py-3"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute left-3 top-4 text-gray-700"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
          <div className="text-right">
            <p className="text-xs text-gray-500 mt-1 mr-1">
              Example: <span className="font-medium">Name@123</span>
            </p>
          </div>
                 <ul className="text-[11px] space-y-2 ml-2 mt-2">
               {/* Length */}
               <li className={`flex items-center gap-2 ${isLengthValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isLengthValid ? "✔" : "✖"}</span>
                 <span>8 to 15 characters</span>
               </li>
               {/* Upper & Lowercase */}
               <li className={`flex items-center gap-2 ${isUpperLowerValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isUpperLowerValid ? "✔" : "✖"}</span>
                 <span>At least 1 upper and 1 lower case letter</span>
               </li>
               {/* Number */}
               <li className={`flex items-center gap-2 ${isNumberValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isNumberValid ? "✔" : "✖"}</span>
                 <span>At least 1 number</span>
               </li>
              {/* speial character */}
               <li className={`flex items-center gap-2 ${isSpecialChar ? "text-green-600" : "text-red-500"}`}>
                 <span>{isSpecialChar ? "✔" : "✖"}</span>
                 <span>At least 1 special character</span>
               </li>
             </ul>
  </div>

  {/* Confirm Password */}
  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
  <div className="relative mb-8">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={form.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm password"
      className="w-full border rounded-lg px-10 py-3"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute left-3 top-4 text-gray-700"
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  {/* Continue Button */}
  <button
    type="submit"
    onClick={handleSubmit}
    disabled={loading}
    className={`w-full bg-blue-600 text-white rounded-lg py-3 text-lg 
      ${loading ? "opacity-60" : "hover:bg-blue-500"}`}
  >
    {loading ? "Please wait..." : "Continue"}
  </button>
</div>


{/* DESKTOP VIEW FORM (your existing code) */}
<div className="hidden md:block w-full items-center justify-center mt-20">
       <form 
         onSubmit={handleSubmit} 
         className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10"
       >
 
         {/* LEFT COLUMN */}
         <div className="space-y-8">
 
           {/* Username */}
           <div>
             <label className="block text-md md:text-base font-medium text-gray-700">User Name</label>
             <div className="relative">
               <CiUser className="absolute left-3 top-5 text-gray-800" size={18} />
               <input
                 type="text"
                 name="username"
                 value={form.username}
                 onChange={handleChange}
                 placeholder="Enter your name"
                 className="mt-1 w-full rounded-lg border border-gray-500 px-10 py-3"
                 required
               />
             </div>
           </div>
 
           {/* Email + Send OTP */}
           <div>
             <label className="block text-sm md:text-base font-medium text-gray-700">Email ID</label>
             <div className="relative">
               <Mail className="absolute left-3 top-5 text-gray-700" size={18} />
               <input
                 type="email"
                 name="email"
                 value={form.email}
                 onChange={handleChange}
                 placeholder="Enter your email"
                 className="mt-1 w-full rounded-lg border border-gray-700 px-10 py-3"
                 required
               />
             </div>
 
             <div className="mt-3 flex justify-end">
               <button
                 type="button"
                 disabled={loadingOtp}
                 onClick={async () => {
                   setLoadingOtp(true);
 
                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                   if (!form.email) {
                     toast.error("Email is required");
                     return setLoadingOtp(false);
                   }
                   if (!emailRegex.test(form.email)) {
                     toast.warning("Invalid email address");
                     return setLoadingOtp(false);
                   }
 
                   try {
                     // artificial 1 sec delay
                     await new Promise((resolve) => setTimeout(resolve, 1000));
 
                     const response = await axios.post(`${BACKEND_API_URL}/auth/send-email-otp`, {
                       email: form.email,
                       username: form.username,
                     });
 
                     if (response.data.status === "success") {
                       toast.success("OTP sent to your email.");
                       setOtpSent(true);
                     } else {
                       toast.error(response.data.message || "Email already exists!");
                     }
                   } catch (err) {
                     toast.error(err.response?.data?.message || "Failed to send OTP");
                   } finally {
                     setLoadingOtp(false);
                   }
                 }}
                 className={`bg-[#FFDD00] text-black px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                   loadingOtp ? "opacity-70 cursor-not-allowed" : ""
                 }`}
               >
                 {loadingOtp ? "Sending..." : "Send OTP"}
               </button>
 
             </div>
           </div>
 
           {/* Password */}
           <div>
             <label className="block text-sm md:text-base font-medium text-gray-700">Password</label>
             <div className="relative mt-1">
               <input
                 type={showPassword ? "text" : "password"}
                 name="password"
                 value={form.password}
                 onChange={handleChange}
                 placeholder="Enter password"
                 className="w-full rounded-lg border border-gray-700 px-10 py-3"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute left-3 top-4 text-gray-700"
               >
                 {showPassword ? <FaEyeSlash /> : <FaEye />}
               </button>
               <div className="text-right">
                  <p className="text-sm text-gray-500 mt-1">
                  Example: <span className="font-medium">Name@123</span>
                  </p>
              </div>
             </div>
             <ul className="text-xs space-y-2 ml-2 mt-2">
               {/* Length */}
               <li className={`flex items-center gap-2 ${isLengthValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isLengthValid ? "✔" : "✖"}</span>
                 <span>8 to 15 characters</span>
               </li>
               {/* Upper & Lowercase */}
               <li className={`flex items-center gap-2 ${isUpperLowerValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isUpperLowerValid ? "✔" : "✖"}</span>
                 <span>At least 1 upper and 1 lower case letter</span>
               </li>
               {/* Number */}
               <li className={`flex items-center gap-2 ${isNumberValid ? "text-green-600" : "text-red-500"}`}>
                 <span>{isNumberValid ? "✔" : "✖"}</span>
                 <span>At least 1 number</span>
               </li>
                {/* speial character */}
               <li className={`flex items-center gap-2 ${isSpecialChar ? "text-green-600" : "text-red-500"}`}>
                 <span>{isSpecialChar ? "✔" : "✖"}</span>
                 <span>At least 1 special character</span>
               </li>
             </ul>
           </div>
 
         </div>
 
         {/* RIGHT COLUMN */}
         <div className="space-y-8">
 
           {/* Whatsapp */}
           <div>
             <label className="block text-sm md:text-base font-medium text-gray-700">
               Whatsapp Number
             </label>
 
             <div className="relative">
               {/* <CiUser className="absolute left-3 top-4 text-gray-900" size={18} /> */}
 
              <PhoneInput
                country={"in"}
                value={form.whatsapp_number_raw}
                onChange={handleWhatsappChange}
                inputClass={`!w-full !border-gray-700 !rounded-lg !px-12 !h-12.5 ${
                  error?.whatsapp_number ? "!border-red-500" : ""
                }`}
                buttonClass="!border !border-gray-700 !rounded-l-lg !h-12.5"
                containerClass="w-full mt-1"
                placeholder="Enter WhatsApp number"
                enableSearch={true}
              />
             </div>
               {error.whatsapp_number && (
                 <p className="text-red-500 text-sm mt-1">{error.whatsapp_number}</p>
               )}
           </div>
 
           {/* OTP */}
           <div>
             <label className="block text-sm md:text-base font-medium text-gray-700">Enter OTP</label>
             <div className="mt-1">
               {/* <input
                 type="text"
                 maxLength= {4}
                 value={form.otp.join("")}
                 onChange={(e) => {
                   const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                   const newOtp = value.split("").concat(Array(4 - value.length).fill(""));
                   newOtp.forEach((digit, i) => {
                     handleOtpChange({ target: { value: digit } }, i);
                   });
                 }}
                 className={`w-full text-center tracking-widest text-md px-10 py-3 rounded-lg border 
                   ${otpStatus === "valid"
                     ? "border-green-500 bg-green-50"
                     : otpStatus === "invalid"
                       ? "border-red-500 bg-red-50"
                       : "border-gray-700"
                   }`}
                 required
               /> */}
               <input
                 type="text"
                 maxLength={4}
                 value={form.otp}
                 onChange={(e) => {
                   let value = e.target.value.replace(/\D/g, ""); // allow only digits
                   if (value.length > 4) return;
 
                   // store otp as string (not array)
                   setForm({ ...form, otp: value });
 
                   if (value.length === 4) {
                     verifyOtp(value);
                   } else {
                     setOtpStatus(null);
                   }
                 }}
                 className={`w-full text-center tracking-widest text-md px-10 py-3 rounded-lg border 
                   ${otpStatus === "valid"
                     ? "border-green-500 bg-green-50"
                     : otpStatus === "invalid"
                       ? "border-red-500 bg-red-50"
                       : "border-gray-700"
                   }`}
               />
             </div>
           </div>
 
           {/* Confirm Password */}
           <div>
             <label className="block text-sm md:text-base font-medium text-gray-700 mt-21">Confirm Password</label>
             <div className="relative mt-1">
               <input
                 type={showConfirmPassword ? "text" : "password"}
                 name="confirmPassword"
                 value={form.confirmPassword}
                 onChange={handleChange}
                 placeholder="Confirm password"
                 className="w-full rounded-lg border border-gray-700 px-10 py-3"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute left-3 top-4 text-gray-700"
               >
                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
               </button>
             </div>
           </div>
 
         </div>
 
         {/* Continue Button */}
         <div className="md:col-span-2 flex justify-center">
           <button
             type="submit"
              disabled={loading}
             className={`w-80 rounded-xl text-white text-lg py-3 transition-all flex items-center justify-center gap-2 ${loading ? "bg-blue-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
           >
            {loading && <FaSpinner className="animate-spin text-white text-lg"/>}
            <span>{loading ? "Please wait..." : "Continue"}</span>
           </button>
         </div>
 
       </form>
</div>

        </div>
        </div>
        {/* <div className="relative top-40">
        <div className="mt-6 space-y-2 text-gray-700 text-lg p-5">
          <p className="flex items-center gap-2 font-medium">
            <FaPhone className="text-black" /> {description}
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> WhatsApp: {whatsapp}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> Mail: {adminEmail}
          </p>
        </div>
        </div> */}
      </div>
    </div>
  );
}

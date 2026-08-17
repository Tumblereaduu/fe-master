// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaSpinner } from "react-icons/fa";
// import { Mail, Eye, EyeOff, RefreshCw } from "lucide-react";
// import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
// import LogoYellow from "../../assets/img/logo/Doin FX.svg";
// import PlayStoreIcon from "../../assets/img/PlayStoreIcon/playstore.png";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import "react-toastify/dist/ReactToastify.css"
// import { ToastContainer, Slide, toast } from "react-toastify";
// import { BACKEND_API_URL } from "../../api/config";
// import useContactDetails from "../hooks/useContactDetails"; 
// import { useTheme } from "../../context/ThemeContext";
// // import "../../assets/css/downloadButton.css";

// export default function Login() {
//   const { handleLogin } = useAuth()
//   const [form, setForm] = useState({ email: "", password: "", captchaInput: "" });
//   const [captcha, setCaptcha] = useState(generateCaptcha());
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate();
//   const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();
//   const {isDark} = useTheme();

//   function generateCaptcha() {
//     const chars = "ABCEFGHJKLMNPQRTUWXYZ2346789"; // I,O,S,D,V,5,0,1 (REMOVED items)
//     let result = "";
//     for (let i = 0; i < 5; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate captcha first
//     // if (form.captchaInput !== captcha) {
//     //   toast.error("Invalid captcha. Please try again.");
//     //   // setCaptcha(generateCaptcha());
//     //   setForm({ ...form, captchaInput: "" });
//     //   return;
//     // }
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BACKEND_API_URL}/auth/login`, {
//         email: form.email,
//         password: form.password,
//         // captcha: form.captchaInput
//       });

//       if (res.data.status === "success") {
//         toast.success(res.data.message);

//         // token store in state 
//          handleLogin(res.data.token, res.data.user.role, res.data.user);
//         // Correct token decoding
//        const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
//        localStorage.setItem("token_exp", decoded.exp * 1000);
//         localStorage.setItem("token", res.data.token)
//         localStorage.setItem("user", JSON.stringify(res.data.user))

//         setTimeout(() => {
//           setLoading(false)
//           navigate("/dashboard");
//       }, 2000);
//     }

//       else {
//         setLoading(false)
//         toast.error(res.data.message || "Email or password is incorrect");
//       }
//     } catch (error) {
//       console.error(error);
//       setLoading(false)
//       toast.error(error.response?.data?.message || "Invalid email or Password");
//     }
//   };


//   return (
//     <div>
//       {/* ⚠️ BROWSER AUTOFILL WHITE BG FIX ⚠️ */}
//       <style>{`
//         input:-webkit-autofill,
//         input:-webkit-autofill:hover,
//         input:-webkit-autofill:focus,
//         input:-webkit-autofill:active {
//           -webkit-box-shadow: 0 0 0px 1000px ${isDark ? '#1e2a36' : '#ffffff'} inset !important;
//           -webkit-text-fill-color: ${isDark ? '#e5e7eb' : '#000000'} !important;
//           transition: background-color 5000s ease-in-out 0s;
//         }
//       `}</style>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
//       <div className="min-h-screen bg-white relative">
//         {/* Logo top-left only for mobile */}
//         {/* <div className="absolute top-[-15px] left-3 md:hidden">
//           <img src={Logo} alt="Doin FX Logo" className="h-16 w-32 object-contain mt-4" />
//         </div> */}

//         {/* Create New Account link top-right */}
//         <a
//           href="/register"
//           className="absolute top-5 right-3 md:top-6 md:right-12 text-[#F7931A] font-semibold text-sm md:text-md md:text-base z-10 rounded-3xl p-1 px-2 py-0.5 hover:bg-orange-50"
//         >
//           Create New Account
//         </a>

//         {/* Left Section (Desktop only) */}
//         <div className=" md:flex w-1/2 flex-col justify-between p-6">
//           {/* Desktop Logo */}
//           <div className="">
//             <img 
//             src={ isDark ? LogoYellow : LogoBlack}
//             alt="Doin FX" 
//             className="h-20 w-36 absolute top-0 left-4 object-contain" />
//           </div>

//           {/* <div className="flex flex-col items-center justify-center flex-1">
//             <img src={loginImg} alt="Login Illustration" className="max-w-xl rounded-lg" />
//             <p className="mt-3 text-center text-gray-600 text-base px-0">
//               Trade at the speed of thought with our lightning-speed trade execution.
//             </p>
//           </div> */}

//           <div className="mt-6 space-y-2 text-gray-700 text-[13px] sm:text-lg absolute bottom-5 left-6">
//             <p className="flex items-center gap-2 font-medium text-gray-800 mb-2">
//               <FaPhoneAlt className="text-blue-600 " /> {description}
//             </p>
//             <p className="flex items-center gap-2">
//               <FaWhatsapp className="text-green-500" /> WhatsApp: {whatsapp}
//             </p>
//             <p className="flex items-center gap-2">
//               <FaEnvelope className="text-blue-500" /> Mail: {adminEmail}
//             </p>
//           </div>
//         </div>

//         {/* Right Section (Form + Mobile Illustration) */}
//         <div className="flex w-full items-center justify-center p-6 ">
//           {/* Illustration on mobile */}
//           {/* <div className="md:hidden mb-6 w-full flex justify-center mt-16">
//             <img src={loginImg} alt="Login Illustration" className="max-w-xs h-auto rounded-lg" />
//           </div> */}

//           {/* Login Form */}
//           <div className="w-full md:w-150 bg-white mt-20 md:mt-15 lg:mt-35">
//             <h2 className="mb-8 md:mb-10 text-center text-2xl md:text-3xl font-bold text-gray-800">
//               WELCOME TO  DOIN FX
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
//               {/* Email */}
//               <div>
//                 <label className="block text-sm md:text-base font-medium text-black">
//                   Your Email Address
//                 </label>
//                 <div className="relative mt-1">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
//                   <input
//                     type="email"
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     className="w-full rounded-lg border border-gray-700 pl-10 pr-3 py-3 md:py-2 md:pl-10 md:pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
//                     style={{ backgroundColor: isDark ? '#1e2a36' : '#ffffff' }}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm md:text-base font-medium text-black">
//                   Password
//                 </label>
//                 <div className="relative mt-1">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     className="w-full rounded-lg border border-gray-700 pl-10 pr-10 py-3 md:pl-10 md:py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
//                     style={{ backgroundColor: isDark ? '#1e2a36' : '#ffffff' }}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Captcha */}
//               {/* <div>
//                 <label className="block text-sm md:text-base font-medium text-gray-600">
//                   Captcha
//                 </label>
//                 <div className="mt-2 flex items-center space-x-2 md:space-x-3">
//                   <div className="select-none rounded-lg bg-gray-200 px-1 py-2 md:px-4 md:py-2 font-mono text-base md:text-lg font-bold tracking-widest">
//                     {captcha}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setCaptcha(generateCaptcha())}
//                     className="rounded-md bg-[#0080FF] p-2 "
//                   >
//                     <RefreshCw size={19} className="text-white " />
//                   </button>
//                   <input
//                     type="text"
//                     name="captchaInput"
//                     value={form.captchaInput}
//                     onChange={handleChange}
//                     placeholder="Enter captcha"
//                     className="flex-1 rounded-lg border border-gray-300 w-10 px-1 py-2 md:px-4 md:py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
//                     required
//                   />
//                 </div>
//               </div> */}

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-lg bg-[#F7931A] px-4 py-3 md:px-4 md:py-2 font-semibold text-white hover:bg-orange-400 transition disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
//               >
//                 {loading && <FaSpinner className="animate-spin text-white text-lg" />}
//                 <span>{loading ? "Logging in..." : "LOGIN"}</span>
//               </button>
//             </form>

//             <p
//               onClick={() => (window.location.href = "/forgot_password")}
//               className="mt-2 sm:mt-4 text-right text-sm md:text-base font-bold hover:underline cursor-pointer"
//             >
//               Forgot Password?
//             </p>

//             <a
//               href="https://doinfx.com/download.html"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="
//                 relative overflow-hidden group

//                 flex items-center justify-center gap-3

//                 w-full
//                 mt-4

//                 px-5 py-3
//                 sm:px-6 sm:py-3

//                 rounded-2xl

//                 bg-black/85
//                 backdrop-blur-xl

//                 border border-orange-400

//                 shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_40px_rgba(247,147,26,0.08)]

//                 transition-all duration-500
//                 hover:scale-[1.02]
//                 hover:border-orange-400/50
//               "
//             >
//               {/* Rotating Border */}
//               <span
//                 className="
//                   absolute inset-0 rounded-2xl
                  
//                   opacity-70
//                   bg-black
//                 "
//                 style={{ animationDuration: "3s" }}
//               />

//               {/* Inner Background */}
//               <span className="absolute inset-[1.5px] rounded-[15px] bg-black/90" />

//               {/* Text */}
//               <div className="relative z-10 flex flex-col">
//                 <span className="text-[9px] sm:text-[10px] uppercase tracking-[1.2px] text-white/50">
//                   GET IT ON
//                 </span>

//                 <span className="text-sm sm:text-base font-semibold text-white">
//                   Download App
//                 </span>
//               </div>

//               {/* Icon */}
//               <div
//                 className="
//                   relative z-10
//                   w-7 h-7
//                   sm:w-8 sm:h-8

//                   flex items-center justify-center

//                   transition duration-300
//                   group-hover:scale-110
//                 "
//               >
//                 <img
//                   src={PlayStoreIcon}
//                   alt="Download App"  
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );    
// }



















  import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { Mail, Eye, EyeOff, RefreshCw } from "lucide-react";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import PlayStoreIcon from "../../assets/img/PlayStoreIcon/playstore.png";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails"; 
import { useTheme } from "../../context/ThemeContext";
// import "../../assets/css/downloadButton.css";

export default function Login() {
  const { handleLogin } = useAuth()
  const [form, setForm] = useState({ email: "", password: "", captchaInput: "" });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();
  const {isDark} = useTheme();

  function generateCaptcha() {
    const chars = "ABCEFGHJKLMNPQRTUWXYZ2346789"; // I,O,S,D,V,5,0,1 (REMOVED items)
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate captcha first
    // if (form.captchaInput !== captcha) {
    //   toast.error("Invalid captcha. Please try again.");
    //   // setCaptcha(generateCaptcha());
    //   setForm({ ...form, captchaInput: "" });
    //   return;
    // }
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/login`, {
        email: form.email,
        password: form.password,
        // captcha: form.captchaInput
      });

      if (res.data.status === "success") {
        toast.success(res.data.message);

        // token store in state 
         handleLogin(res.data.token, res.data.user.role, res.data.user);
        // Correct token decoding
       const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
       localStorage.setItem("token_exp", decoded.exp * 1000);
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))

        setTimeout(() => {
          setLoading(false)
          navigate("/trading");
      }, 2000);
    }

      else {
        setLoading(false)
        toast.error(res.data.message || "Email or password is incorrect");
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
      toast.error(error.response?.data?.message || "Invalid email or Password");
    }
  };


  return (
    <div>
      {/* ⚠️ BROWSER AUTOFILL WHITE BG FIX ⚠️ */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px ${isDark ? '#1e2a36' : '#ffffff'} inset !important;
          -webkit-text-fill-color: ${isDark ? '#e5e7eb' : '#000000'} !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
      <div className="min-h-screen bg-white relative">
        {/* Logo top-left only for mobile */}
        {/* <div className="absolute top-[-15px] left-3 md:hidden">
          <img src={Logo} alt="Doin FX Logo" className="h-16 w-32 object-contain mt-4" />
        </div> */}

        {/* Create New Account link top-right */}
        <a
          href="/register"
          className="absolute top-5 right-3 md:top-6 md:right-12 text-blue-500 font-semibold text-sm md:text-md md:text-base z-10 rounded-3xl p-1 px-2 py-0.5 hover:bg-blue-50"
        >
          Create New Account
        </a>

        {/* Left Section (Desktop only) */}
        <div className=" md:flex w-1/2 flex-col justify-between p-6">
          {/* Desktop Logo */}
          <div className="">
            <img 
            src={ isDark ? LogoYellow : LogoBlack}
            alt="Doin FX" 
            className="h-20 w-36 absolute top-0 left-4 object-contain" />
          </div>

          {/* <div className="flex flex-col items-center justify-center flex-1">
            <img src={loginImg} alt="Login Illustration" className="max-w-xl rounded-lg" />
            <p className="mt-3 text-center text-gray-600 text-base px-0">
              Trade at the speed of thought with our lightning-speed trade execution.
            </p>
          </div> */}

          {/* <div className="mt-6 space-y-2 text-gray-700 text-[13px] sm:text-lg absolute bottom-5 left-6">
            <p className="flex items-center gap-2 font-medium text-gray-800 mb-2">
              <FaPhoneAlt className="text-blue-600 " /> {description}
            </p>
            <p className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500" /> WhatsApp: {whatsapp}
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> Mail: {adminEmail}
            </p>
          </div> */}
        </div>

        {/* Right Section (Form + Mobile Illustration) */}
        <div className="flex w-full items-center justify-center p-6 ">
          {/* Illustration on mobile */}
          {/* <div className="md:hidden mb-6 w-full flex justify-center mt-16">
            <img src={loginImg} alt="Login Illustration" className="max-w-xs h-auto rounded-lg" />
          </div> */}

          {/* Login Form */}
          <div className="w-full md:w-150 bg-white mt-20 md:mt-15 lg:mt-35">
            <h2 className="mb-8 md:mb-10 text-center text-2xl md:text-3xl font-bold text-gray-800">
              WELCOME TO  ONE BLUE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Email */}
              <div>
                <label className="block text-sm md:text-base font-medium text-black">
                  Your Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-700 pl-10 pr-3 py-3 md:py-2 md:pl-10 md:pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                    style={{ backgroundColor: isDark ? '#1e2a36' : '#ffffff' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm md:text-base font-medium text-black">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-700 pl-10 pr-10 py-3 md:pl-10 md:py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                    style={{ backgroundColor: isDark ? '#1e2a36' : '#ffffff' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              {/* <div>
                <label className="block text-sm md:text-base font-medium text-gray-600">
                  Captcha
                </label>
                <div className="mt-2 flex items-center space-x-2 md:space-x-3">
                  <div className="select-none rounded-lg bg-gray-200 px-1 py-2 md:px-4 md:py-2 font-mono text-base md:text-lg font-bold tracking-widest">
                    {captcha}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCaptcha(generateCaptcha())}
                    className="rounded-md bg-[#0080FF] p-2 "
                  >
                    <RefreshCw size={19} className="text-white " />
                  </button>
                  <input
                    type="text"
                    name="captchaInput"
                    value={form.captchaInput}
                    onChange={handleChange}
                    placeholder="Enter captcha"
                    className="flex-1 rounded-lg border border-gray-300 w-10 px-1 py-2 md:px-4 md:py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                    required
                  />
                </div>
              </div> */}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 md:px-4 md:py-2 font-semibold text-white hover:bg-blue-500 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {loading && <FaSpinner className="animate-spin text-white text-lg" />}
                <span>{loading ? "Logging in..." : "LOGIN"}</span>
              </button>
            </form>

            <p
              onClick={() => (window.location.href = "/forgot_password")}
              className="mt-2 sm:mt-4 text-right text-sm md:text-base font-bold hover:underline cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );    
}

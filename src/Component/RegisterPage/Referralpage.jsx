import { FaWhatsapp, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import referralImg from "../../assets/img/passwordpage/My-password-bro-1.png";
import Logo from "../../assets/img/logo/Doin FX.svg";
import { Slide, toast, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";

export default function ReferralPage() {
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();

  // Get user data from location state or localStorage
  const userData = location.state?.userData || JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    if (!userData || !userData.email) {
      navigate("/register");
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if(!referral.trim()){
    toast.warning("Please enter a Referral code before applying");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_API_URL}/auth/apply-referral`, {
        email: userData.email,
        referral_code: referral,
      });

      if (response.data.status === "success") {
       toast.success("Referal code applied")

        //  Update userData
        const updatedUserData = { ...userData, referred_by_id: referral };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setTimeout(() => { setLoading(false); navigate("/");}, 2000);
      } else {
        toast.error(response.data.message || "Failed to apply referral code");
        setLoading(false); 
      }
    } catch (error) {
      console.error("Referral error:", error);
      toast.error(error.response?.data?.message || "Network error. Please try again.");
      setLoading(false); 
    }
  };
  
  const handleSkip = (e) => {
    e.preventDefault();
    toast.info("Referal skipped!");
     setTimeout(() => navigate("/"),3000)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative">
      <ToastContainer  position="top-right"  autoClose={3000} transition={Slide} pauseOnFocusLoss draggable />
      {/* Logo on top-left for mobile */}
      <div className="absolute top-4 left-4 md:static md:p-3">
        <img src={Logo} alt="DOIN FX Logo" className="h-16 w-32 object-contain" />
      </div>

      {/* Left Section (Desktop) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-6">
        {/* Illustration + Text */}
        <div className="flex flex-col items-center justify-center flex-1 text-center mt-16">
          <img
            src={referralImg}
            alt="Referral Illustration"
            className="max-w-md rounded-lg mb-6"
          />
          <p className="text-gray-600 max-w-md text-base">
            Got a referral code? Apply it now for exclusive benefits! <br />
          </p>
        </div>

        {/* Support Info */}
        <div className="mt-6 space-y-2 text-gray-700 text-md absolute bottom-6 left-8">
          <p className="flex items-center gap-2 font-medium text-gray-800 mb-2">
            <FaPhone className="text-blue-600 text-lg" />
           {description}
          </p>
          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" />{" "}
            <span className="font-semibold">WhatsApp:</span> {whatsapp}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />{" "}
            <span className="font-semibold">Mail:</span> {adminEmail}
          </p>
        </div>
      </div>

      {/* Right Section (Form + Mobile Illustration) */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Illustration on top for mobile */}
        <div className="md:hidden mb-6 w-full flex justify-center mt-16">
          <img
            src={referralImg}
            alt="Referral Illustration"
            className="max-w-xs h-auto"
          />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white p-5 md:p-10">
          <h2 className="mb-6 md:mb-8 text-center text-xl md:text-2xl font-bold text-gray-800">
            Enter Referral Code
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-600 mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referral"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                placeholder="Enter referral code"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 md:px-4 md:py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#007FFF] px-4 py-2 md:px-4 md:py-2 font-medium text-white hover:bg-blue-600 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin w-5 h-5" /> : null}
              {loading ? "Applying..." : "Apply Referral"}
            </button>
            <button className="underline cursor-pointer text-md text-blue-400 ml-40" onClick={handleSkip}>Skip</button>
          </form>           
        </div>
      </div>
    </div>
  );
}

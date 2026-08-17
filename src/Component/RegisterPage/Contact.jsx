import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ContactImg from "../../assets/img/contactpage/Calling-pana-1.png";
import Logo from "../../assets/img/logo/Doin FX.svg";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import useContactDetails from "../hooks/useContactDetails";

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {description,adminEmail,whatsapp,loading: contactLoading} = useContactDetails();

  // Safe way to get user data
  const getStoredUserData = () => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored === "undefined" || stored === undefined || stored === null) {
        return null;
      }
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing userData:", error);
      return null;
    }
  };

  const userData = location.state?.userData || getStoredUserData();

  const [form, setForm] = useState({
    mobile: "",
    whatsapp: "",
    gender: ""
  });

  useEffect(() => {
    if (!userData || !userData.email) {
      navigate("/register");
    }
  }, [userData, navigate]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p>Redirecting to registration...</p>
        </div>
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.mobile || !form.whatsapp) {
      setError("Both mobile and WhatsApp numbers are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${BACKEND_API_URL}/auth/update-contact`, {
        email: userData.email,
        mobile_number: form.mobile,
        whatsapp_number: form.whatsapp,
        gender: form.gender
      });

      if (response.data.status === "success") {
        // Update userData in localStorage with contact numbers
        const updatedUserData = {
          ...userData,
          mobile_number: form.mobile,
          whatsapp_number: form.whatsapp
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
         setTimeout(()=>{
          navigate("/referral", { state: { userData: updatedUserData } });
          },3000)
      } else {
        setError(response.data.message || "Failed to update contact numbers");
      }
    } catch (error) {
      console.error("Contact update error:", error);
      setError(
        error.response?.data?.message ||
        "Network error. Please try again."
      );
    } finally {
      setTimeout(()=>{
         setLoading(false);
      },3000)
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative">
      {/* Logo on top-left (mobile & desktop) */}
      <div className="absolute top-4 left-4 md:static md:p-3 z-10">
        <img src={Logo} alt="Logo" className="h-16 w-32 md:h-20 md:w-36 object-contain" />
      </div>

      {/* Left Side (Desktop) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-6">
        {/* Illustration + tagline */}
        <div className="flex flex-col items-center justify-center flex-1 text-center mt-16">
          <img
            src={ContactImg}
            alt="Contact Illustration"
            className="max-w-md h-auto mb-6"
          />
          <p className="text-gray-600 max-w-md text-base">
            Let's stay in touch — enter your phone number to continue your
            trading journey.
          </p>
        </div>

        {/* Support Info */}
        <div className="mt-6 space-y-2 text-gray-700 text-md md:absolute md:bottom-5 md:left-5">
          <p className="flex items-center gap-2 font-medium">
            <FaPhone className="text-black" /> 
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

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Illustration on top for mobile */}
        <div className="md:hidden mb-6 w-full flex justify-center mt-16">
          <img
            src={ContactImg}
            alt="Contact Illustration"
            className="max-w-xs h-auto"
          />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white p-5 md:p-10">
          <h2 className="mb-6 md:mb-8 text-center text-xl md:text-2xl font-bold text-gray-800">
            Contact Details
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">
                Mobile Number *
              </label>
              <PhoneInput
                country={"in"}
                value={form.mobile}
                onChange={(value) => setForm({ ...form, mobile: value })}
                containerClass="w-full"
                inputClass="!w-full !h-12 !pl-12 !rounded-lg !border !border-gray-300 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200 text-sm md:text-base"
                buttonClass="!h-12 !border !border-gray-300 !rounded-l-lg !bg-white"
                disabled={loading}
                inputProps={{
                  required: true,
                }}
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-600 mb-2">
                WhatsApp Number *
              </label>
              <PhoneInput
                country={"in"}
                value={form.whatsapp}
                onChange={(value) => setForm({ ...form, whatsapp: value })}
                containerClass="w-full"
                inputClass="!w-full !h-12 !pl-12 !rounded-lg !border !border-gray-300 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200 text-sm md:text-base"
                buttonClass="!h-12 !border !border-gray-300 !rounded-l-lg !bg-white"
                disabled={loading}
                inputProps={{
                  required: true,
                }}
              />
            </div>

            {/* Gender */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-base font-medium text-gray-800 mb-3">
                Select Gender *
              </h3>
              <div className="gap-3 flex md:gap-6">
                {["Male", "Female", "Others"].map((option) => (
                  <label
                    key={option}
                    className={`px-2 flex items-center gap-2 cursor-pointer md:px-4.5 py-2 rounded-lg border transition shadow-sm ${form.gender === option
                      ? "bg-blue-100 border-blue-400"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={form.gender === option}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-4 h-4 accent-blue-600"
                      required
                    />
                    <span className="text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#007FFF] px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : null}
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>

          {/* Skip for now option */}
          <div className="mt-4 text-center">
      
          </div>
        </div>
      </div>
    </div>
  );
}
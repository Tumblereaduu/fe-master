import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Slide, ToastContainer, toast } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import btn from "../../assets/img/kyc/btnlogo.png";
import copy from "../../assets/img/navbar/copy.svg";
import NavbarForAccount from "../NavbarForAccount";
import MobileBottomNav from "../tradepage/MobileBottomNav";
import { FaSpinner } from "react-icons/fa";
import viewBanner from "../hooks/viewBanner";
import { useTheme } from "../../context/ThemeContext";
// ─── Account type & KYC context for top card ───
import { useAccountType } from "../hooks/accountTypeContext";
import { kycStatusContext } from "../hooks/kycStatusContext";
import { useNavigate } from "react-router-dom";

/* ─── Dark mode CSS overrides for browser-native elements ─── */
const darkModeCSS = `
  .dark input::placeholder { color: #6B7B88; }
  .dark select option { background: #141D22; color: #E8EDF0; }
  .dark input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
`;

export default function ProfilePage() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // ─── Account type & KYC ───
  const { accountType, setAccountType } = useAccountType();
  const { kycVerified, ibStatus, token: ctxToken, user: ctxUser } = kycStatusContext();

  /* ─── Dark colour tokens ─── */
  const dk = {
    pageBg: "bg-[#141D22]",
    card: "bg-[#141D22]",
    input: "bg-[#121A20] border-[#2A3640] text-[#E8EDF0]",
    disabled: "bg-[#0E151A] border-[#222E38] text-[#6B7B88]",
    border: "border-[#2A3640]",
    heading: "text-white",
    label: "text-[#8899A6]",
    value: "text-[#E8EDF0]",
    sub: "text-[#6B7B88]",
    muted: "text-[#6B7B88]",
    error: "text-[#FF6B6B]",
    selectHover: "hover:bg-[#1A242B]",
    // ─── Top account card tokens ───
    badgeReal: "bg-green-900/40 text-green-400",
    badgeDemo: "bg-blue-900/40 text-blue-400",
    kycVerified: "bg-[#1A1A3A]",
    kycPending: "bg-red-900/40 text-red-400",
    selectReal: "bg-green-800 text-green-300",
    selectDemo: "bg-blue-800 text-blue-300",
    selectOption: "bg-[#141D22] text-[#E8EDF0]",
    depositBtn: "bg-blue-700 hover:bg-blue-800 text-white",
    withdrawBtn: "bg-blue-700 hover:bg-blue-800 text-white",
    iconCircle: "bg-[#2A3038]",
    btnSecondary: "bg-[#2A3038] text-[#E8EDF0] hover:bg-[#353C44]",
  };

  const [formData, setFormData] = useState({
    email: "",
    date_of_birth: "",
    nationality: "",
    country: "",
    address: "",
    city: "",
    employment_status: "",
    source_of_income: "",
    trading_experience: "",
    income_range: "",
    occupation: "",
    referred_by_id: "",
  });

  const [profile, setProfile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({});
  const { token, user } = useAuth();
  const [currentView, setCurrentView] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const { banners, setBanners } = viewBanner();

  // ─── Balance state (like Dashboard) ───
  const [balance, setBalance] = useState(0.00);
  const [totalAmount, setTotalAmount] = useState(0);
  const [demoFund, setDemoFund] = useState("");
  const [showTopup, setShowTopup] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        nationality: user.nationality || "",
        country: user.country || "",
        address: user.address || "",
        city: user.city || "",
        employment_status: user.employment_status || "",
        source_of_income: user.source_of_income || "",
        trading_experience: user.trading_experience || "",
        income_range: user.income_range || "",
        occupation: user.occupation || "",
        referred_by_id: user.referred_by_id || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/auth/profile/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.data || response.data;

        setFormData((prv) => ({
          ...prv,
          date_of_birth: data.date_of_birth || "",
          nationality: data.nationality || "",
          country: data.country || "",
          address: data.address || "",
          city: data.city || "",
          employment_status: data.employment_status || "",
          source_of_income: data.source_of_income || "",
          trading_experience: data.trading_experience || "",
          income_range: data.income_range || "",
          occupation: data.occupation || "",
          referred_by_id: data.referred_by_id || "",
        }));
        setIsEditable(data.profile_completed !== 1);
        setWhatsapp(data.whatsapp_number || "");
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile details", error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // ─── Fetch LIVE balance ───
  useEffect(() => {
    if (!user || !user.user_id) return;
    const fetchWallet = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/wallet/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.status === "success") {
          setBalance(data.wallet);
          setTotalAmount(data.wallet);
        } else {
          setBalance(0);
          setTotalAmount(0);
        }
      } catch (error) {
        console.error("Failed to fetch total deposit:", error);
        setBalance(0);
      }
    };
    if (accountType === "LIVE") fetchWallet();
  }, [user, token, accountType]);

  // ─── Fetch DEMO balance ───
  useEffect(() => {
    if (!user || !user.user_id) return;
    const fetchDemoBalance = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/demoaccount/demo-account/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.status === "success") {
          setBalance(data.wallet);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch demo balance:", error);
        setBalance(0);
      }
    };
    if (accountType === "DEMO") {
      fetchDemoBalance();
    }
  }, [user, token, accountType]);

  // ─── Account type change (like Dashboard) ───
  const handleAccountTypeChange = async (type) => {
    try {
      setAccountType(type);
      localStorage.setItem("accountType", type);
      if (type === "LIVE") {
        setBalance(totalAmount);
      }
      setDemoFund("");
      await axios.put(`${BACKEND_API_URL}/demoaccount/demo/account-type/${user.user_id}`, {
        account_type: type,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const displayType = type === "LIVE" ? "REAL" : type;
      toast.success(`Account Switched to ${displayType}`);
    } catch (error) {
      console.error("Failed to update account", error);
      toast.error("Failed to change account type");
    }
  };

  // ─── Add demo fund (like Dashboard) ───
  const handleAddFund = async () => {
    const amount = parseFloat(demoFund);
    if (isNaN(amount) || amount <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/demoaccount/demo-account`,
        { user_id: user.user_id, balance: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "success") {
        setBalance(response.data.data.balance);
        setDemoFund("");
        toast.success("Fund added successfully");
      } else {
        toast.error("Failed to add: " + response.data.message);
      }
    } catch (err) {
      console.error("Error demo fund:", err);
      toast.error("Fund not added");
    }
  };

  const displayAccountType = accountType === "LIVE" ? "REAL" : accountType;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.date_of_birth.trim())
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.nationality.trim())
      newErrors.nationality = "Nationality is required";
    if (!formData.country.trim())
      newErrors.country = "Country is required";
    if (!formData.address.trim())
      newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.employment_status.trim())
      newErrors.employment_status = "Employment Status is required";
    if (!formData.source_of_income.trim())
      newErrors.source_of_income = "Source of Income is required";
    if (!formData.trading_experience.trim())
      newErrors.trading_experience = "Experience is required";
    if (!formData.income_range.trim())
      newErrors.income_range = "Annual Income is required";
    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";

    if (
      formData.referred_by_id &&
      !/^\d+$/.test(formData.referred_by_id)
    ) {
      newErrors.referred_by_id = "Referral must be numbers only";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isEditable && !isReferralEditable) {
      toast.error("Profile is already completed!");
      return;
    }

    try {
      setLoading(true);

      if (isEditable) {
        const payload = { ...formData };
        await axios.put(
          `${BACKEND_API_URL}/auth/profile/update`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Profile updated successfully!");
      }

      if (isReferralEditable && formData.referred_by_id?.trim() !== "") {
        try {
          await axios.put(
            `${BACKEND_API_URL}/auth/apply-referral`,
            {
              email: formData.email,
              referral_code: formData.referred_by_id.trim(),
            }
          );
          toast.success("Referral applied successfully!");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Invalid referral code"
          );
          return;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3500);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const today = new Date().toISOString().split("T")[0];
  const isReferralEditable = !profile?.referred_by_id;
  const canSubmit =
    isEditable ||
    (isReferralEditable && formData.referred_by_id?.trim() !== "");

  /* ─── Sun / Moon SVG icons ─── */
  const SunIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  /* ─── Helper: input className builder ─── */
  const inputClass = (fieldName, extra = "") => {
    const base = `w-full border rounded-md px-3 py-2 outline-none transition-colors duration-200`;
    let theme = "";
    if (isEditable) {
      theme = isDark
        ? dk.input
        : "bg-white border-gray-300 text-gray-800";
    } else {
      theme = isDark
        ? dk.disabled
        : "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-800";
    }
    const err = errors[fieldName]
      ? isDark
        ? "border-[#FF6B6B]"
        : "border-red-500"
      : "";
    return `${base} ${theme} ${err} ${extra}`;
  };

  const selectClass = (fieldName) => {
    const base = `w-full border rounded-md px-3 py-2 outline-none transition-colors duration-200`;
    let theme = "";
    if (isEditable) {
      theme = isDark
        ? `${dk.input} ${dk.selectHover}`
        : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50";
    } else {
      theme = isDark
        ? `${dk.disabled} cursor-not-allowed`
        : "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-800";
    }
    const err = errors[fieldName]
      ? isDark
        ? "border-[#FF6B6B]"
        : "border-red-500"
      : "";
    return `${base} ${theme} ${err}`;
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? dk.pageBg : ""
      }`}
    >
      {/* Dark-mode browser-native overrides */}
      <style>{darkModeCSS}</style>

      <ToastContainer
        autoClose={3000}
        position="top-right"
        transition={Slide}
        theme="dark"
      />

      <NavbarForAccount />

      <div className="flex flex-1">
        <DoinDashboardSidebar />

        <main
          className={`flex-1 p-4 md:p-8 pt-16 md:pt-20 md:ml-60 pb-21 md:pb-6 transition-colors duration-300 ${
            isDark ? dk.pageBg : "bg-[#FBFBFB]"
          }`}
        >
          {/* ─── NO BANNER HERE (removed as requested) ─── */}

          {/* ─── Top Account Card (like Dashboard image 1) ─── */}
          <div
            className={`border rounded-xl p-5 sm:p-6 mt-4 w-full max-w-[1500px] mx-auto transition-colors duration-300 ${
              isDark
                ? `${dk.card} ${dk.border}`
                : "border-blue-300 bg-[#FFFFFF]"
            }`}
          >
            <div className="flex flex-col space-y-5 lg:flex-row lg:items-center lg:justify-between">
              {/* ─── Left: Account ID, Name, Account Type dropdown ─── */}
              <div className="space-y-4">
                <h2
                  className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                    isDark ? dk.heading : "text-gray-900"
                  }`}
                >
                  {profile?.username || user?.username || "Loading..."}
                </h2>
                <p
                  className={`text-base transition-colors duration-300 ${
                    isDark ? dk.value : "text-gray-800"
                  }`}
                >
                  Account ID:{" "}
                  <span className="ml-2 font-semibold">
                    {profile?.id || user?.user_id || "Loading"}
                  </span>
                </p>

                {/* ─── Account Type Dropdown (REAL / DEMO toggle) ─── */}
                <div className="flex items-center text-base">
                  <label
                    className={`mr-3 pr-4 transition-colors duration-300 ${
                      isDark ? dk.value : "text-gray-800"
                    }`}
                  >
                    Account:
                  </label>
                  <div className="inline-flex rounded-md shadow-sm" role="tablist" aria-label="Account type">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={accountType === "LIVE"}
                      onClick={() => handleAccountTypeChange("LIVE")}
                      className={`px-4 py-1 font-semibold rounded-l-md focus:outline-none transition-colors duration-200 ${
                        accountType === "LIVE"
                          ? isDark
                            ? dk.selectReal
                            : "bg-green-700 text-white"
                          : isDark
                          ? "bg-transparent text-[#8899A6] hover:bg-[#1A242B]"
                          : "bg-gray-100 text-gray-700 hover:bg-[#EAF4FF]"
                      }`}
                    >
                      REAL
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={accountType === "DEMO"}
                      onClick={() => handleAccountTypeChange("DEMO")}
                      className={`px-4 py-1 font-semibold rounded-r-md focus:outline-none transition-colors duration-200 ${
                        accountType === "DEMO"
                          ? isDark
                            ? dk.selectDemo
                            : "bg-blue-700 text-white"
                          : isDark
                          ? "bg-transparent text-[#8899A6] hover:bg-[#1A242B]"
                          : "bg-gray-100 text-gray-700 hover:bg-[#EAF4FF]"
                      }`}
                    >
                      DEMO
                    </button>
                  </div>
                </div>

                {/* ─── KYC Status ─── */}
                <p
                  className={`text-base flex items-center transition-colors duration-300 ${
                    isDark ? dk.value : "text-gray-800"
                  }`}
                >
                  KYC Status:
                  {kycVerified ? (
                    <span
                      className={`ml-2 inline-flex items-center px-4 py-0.5 text-base font-semibold rounded-md transition-colors duration-300 ${
                        isDark ? dk.kycVerified : "bg-[#160c4e]"
                      }`}
                    >
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FFB347] bg-clip-text text-transparent font-bold">
                        Verified
                      </span>
                      <svg
                        className="ml-2 w-5 h-5"
                        style={{ stroke: "url(#verifiedGradientProf)", fill: "none" }}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 12l2 2 4-4" />
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                      </svg>
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient
                            id="verifiedGradientProf"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop stopColor="#FFD700" offset="0%" />
                            <stop stopColor="#FFB347" offset="100%" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  ) : (
                    <span
                      className={`ml-2 inline-flex items-center px-3 py-1 text-base font-semibold rounded-md transition-colors duration-300 ${
                        isDark ? dk.kycPending : "bg-red-600 text-white"
                      }`}
                    >
                      Not Verified
                    </span>
                  )}
                </p>
              </div>

              {/* ─── Right: Balance + Deposit/Withdraw ─── */}
              <div className="text-center lg:text-right">
                <p
                  className={`text-base transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-600"
                  }`}
                >
                  Balance
                </p>
                <h1
                  className={`text-3xl md:text-4xl font-extrabold transition-colors duration-300 ${
                    isDark ? dk.heading : "text-gray-800"
                  }`}
                >
                  {Number(Math.max(0, balance)).toFixed(2)} USD
                </h1>
                {accountType === "LIVE" ? (
                  <div className="flex flex-col sm:flex-row gap-3 mt-3 justify-center lg:justify-end w-full">
                    <button
                      className={`font-semibold text-base px-8 py-2.5 rounded-md transition-colors duration-200 ${
                        isDark
                          ? dk.depositBtn
                          : "bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
                      }`}
                      onClick={() => navigate("/deposit")}
                    >
                      Deposit
                    </button>
                    <button
                      className={`font-semibold text-base px-8 py-2.5 rounded-md transition-colors duration-200 ${
                        isDark
                          ? dk.withdrawBtn
                          : "bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
                      }`}
                      onClick={() => {
                        if (kycVerified) {
                          navigate("/withdraw");
                        } else {
                          toast.warning("Please complete your KYC verification before withdrawal.");
                        }
                      }}
                    >
                      Withdraw
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 mt-3 justify-center lg:justify-end w-full">
                   <input
  type="number"
  placeholder="Enter amount"
  min="0"
  value={demoFund}
  onChange={(e) => setDemoFund(e.target.value)}
  className={`w-full sm:w-[220px] px-4 py-2.5 text-base rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300 ${
    isDark
      ? "bg-[#121A20] border-[#4A5568] text-[#E8EDF0]"
      : "border-blue-300 bg-white text-gray-800"
  }`}
/>
                    <button
                      className={`font-semibold text-base px-8 py-2.5 rounded-md transition-colors duration-200 ${
                        isDark
                          ? dk.depositBtn
                          : "bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
                      }`}
                      onClick={handleAddFund}
                    >
                      Top UP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Profile Card: Info + Form (merged) ─── */}
          <form
            onSubmit={handleSubmit}
            className={`border rounded-xl p-4 mt-6 sm:p-6 lg:p-10 w-full max-w-[1500px] mx-auto transition-colors duration-300 ${
              isDark
                ? `${dk.card} ${dk.border}`
                : "border-blue-300 bg-[#FFFFFF]"
            }`}
          >
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {/* Email Address */}
              <div className="text-center lg:text-left break-all">
                <h3
                  className={`text-sm font-bold transition-colors duration-300 ${
                    isDark ? dk.sub : "text-gray-500"
                  }`}
                >
                  Email Address
                </h3>
                <h3
                  className={`text-base font-medium mt-1 transition-colors duration-300 ${
                    isDark ? dk.value : "text-gray-800"
                  }`}
                >
                  {profile?.email || user?.email || "N/A"}
                </h3>
              </div>

              {/* WhatsApp Number */}
              <div className="text-center lg:text-left">
                <h3
                  className={`text-sm font-bold transition-colors duration-300 ${
                    isDark ? dk.sub : "text-gray-500"
                  }`}
                >
                  WhatsApp Number
                </h3>
                <h3
                  className={`text-base font-medium mt-1 transition-colors duration-300 ${
                    isDark ? dk.value : "text-gray-800"
                  }`}
                >
                  {profile?.whatsapp_number || "N/A"}
                </h3>
              </div>
            </div>

            {/* Heading
            <div className="flex items-center justify-center gap-3 mt-6">
              <h2
                className={`text-2xl md:text-2xl font-extrabold transition-colors duration-300 ${
                  isDark ? dk.heading : "text-gray-900"
                }`}
              >
                My Profile
              </h2>
            </div> */}

            {/* ─── Profile Form Fields ─── */}
            <div className="grid grid-cols-1 gap-4 w-full p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:p-6 lg:p-1 max-w-8xl mx-auto mt-4">
              {/* Date of Birth */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  max={today}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={inputClass("date_of_birth")}
                />
                {errors.date_of_birth && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={inputClass("nationality")}
                />
                {errors.nationality && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.nationality}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Country Of Residence
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={inputClass("country")}
                />
                {errors.country && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.country}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={inputClass("address")}
                />
                {errors.address && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  className={inputClass("city")}
                />
                {errors.city && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Employment Status */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Employment Status
                </label>
                <select
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={selectClass("employment_status")}
                >
                  <option value="">Select Employment Status</option>
                  <option value="Employed">Employed (Full-Time)</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Employed (Part Time)</option>
                  <option value="Student">Unemployed</option>
                  <option value="Retired">Marketing / PR</option>
                  <option value="Retired">Student</option>
                  <option value="Retired">Retired</option>
                </select>
                {errors.employment_status && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.employment_status}
                  </p>
                )}
              </div>

              {/* Source Of Income */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Source Of Income
                </label>
                <select
                  name="source_of_income"
                  value={formData.source_of_income}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={selectClass("source_of_income")}
                >
                  <option value="">Select Source Of Income</option>
                  <option value="Savings">Savings</option>
                  <option value="Employment / Business Proceeds">
                    Employment / Business Proceeds
                  </option>
                  <option value="Rent">Rent</option>
                  <option value="Borrowed Fund / Loan">
                    Borrowed Fund / Loan
                  </option>
                  <option value="Pension">Pension</option>
                  <option value="Inheritance">Inheritance</option>
                </select>
                {errors.source_of_income && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.source_of_income}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Experience
                </label>
                <select
                  name="trading_experience"
                  value={formData.trading_experience}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={selectClass("trading_experience")}
                >
                  <option value="">Select Experience</option>
                  <option value="Yes, I have less than 1 year of trading experince">
                    Yes, I have less than 1 year of trading experience
                  </option>
                  <option value="Yes, I have 1+ years of trading experience">
                    Yes, I have 1+ years of trading experience
                  </option>
                  <option value="Yes, I have 2+ years of trading experience">
                    Yes, I have 2+ years of trading experience
                  </option>
                  <option value="Yes, I have 4+ years of trading experience">
                    Yes, I have 4+ years of trading experience
                  </option>
                  <option value="No">
                    No, I have no trading experince
                  </option>
                </select>
                {errors.trading_experience && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.trading_experience}
                  </p>
                )}
              </div>

              {/* Annual Income */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Annual Income
                </label>
                <select
                  name="income_range"
                  value={formData.income_range}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={selectClass("income_range")}
                >
                  <option value="">Select Annual Income</option>
                  <option value="$0 - $20,000">$0 - $20,000</option>
                  <option value="$20,000 - $50,000">
                    $20,000 - $50,000
                  </option>
                  <option value="$50,000 - $100,000 ">
                    $50,000 - $100,000
                  </option>
                  <option value="$100,000 - $200,000">
                    $100,000 - $200,000
                  </option>
                  <option value="More than $200,000">
                    More than $200,000
                  </option>
                </select>
                {errors.income_range && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.income_range}
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Occupation
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={selectClass("occupation")}
                >
                  <option value="">Select Occupation</option>
                  <option value="Accountancy">Accountancy</option>
                  <option value="Admin / Secretarial">
                    Admin / Secretarial
                  </option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Catering / Hospitality">
                    Catering / Hospitality
                  </option>
                  <option value="Marketing / PR">Marketing / PR</option>
                  <option value="Education">Education</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Others">Others</option>
                </select>
                {errors.occupation && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.occupation}
                  </p>
                )}
              </div>

              {/* Referral Code */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? dk.label : "text-gray-700"
                  }`}
                >
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  name="referred_by_id"
                  value={formData.referred_by_id}
                  readOnly={!isReferralEditable}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, referred_by_id: value });
                  }}
                  className={inputClass(
                    "referred_by_id",
                    !isReferralEditable
                      ? isDark
                        ? dk.disabled + " cursor-not-allowed"
                        : "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-800"
                      : ""
                  )}
                />
                {errors.referred_by_id && (
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isDark ? dk.error : "text-red-500"
                    }`}
                  >
                    {errors.referred_by_id}
                  </p>
                )}
              </div>
            </div>

            {/* ─── Submit Button ─── */}
            <div className="col-span-1 mb-20 md:mb-0 md:col-span-2 mt-6 flex flex-col items-center md:items-end 2xl:mr-14">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="bg-[#1877F2] text-white px-10 py-3 rounded-md text-base md:text-lg md:w-60 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1877F2]/80 transition-colors duration-200"
              >
                {loading && (
                  <FaSpinner className="animate-spin text-white text-lg" />
                )}
                <span>{loading ? "Loading..." : "Save Change"}</span>
              </button>

              <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center gap-2">
                  <img src={btn} alt="" className="w-5 h-5" />
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDark ? dk.muted : "text-gray-500"
                    }`}
                  >
                    All data is encrypted for security purpose
                  </p>
                </div>
              </div>
            </div>
          </form>
          <p class="ml-1 md:ml-15 mt-1 text-[11px] md:text-[13px] text-red-500">
            Delete Your Account?
            <a href="/accountdelete" class="text-red-400 hover:text-red-500 hover:underline ml-1">
              Click here
            </a>
          </p>
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileBottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      {/* ─── Top Up Modal (for DEMO) ─── */}
      {showTopup && (
        <div className="fixed inset-0 flex items-end justify-center z-40 pb-18 bg-black/60">
          <div
            className={`w-full rounded-t-3xl p-5 transition-colors duration-300 ${
              isDark ? dk.card : "bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold transition-colors duration-300 ${
                isDark ? dk.heading : "text-gray-800"
              }`}
            >
              Top up your demo account
            </h2>
        <div className="mt-4">
  <input
    type="number"
    placeholder="Enter amount in USD"
    min={0}
    value={demoFund}
    onChange={(e) => setDemoFund(e.target.value)}
    className={`w-full mt-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300 ${
      isDark ? "bg-[#121A20] border-[#4A5568] text-[#E8EDF0]" : "border-blue-300 bg-white text-gray-800"
    }`}
  />  
</div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowTopup(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 ${
                  isDark
                    ? dk.btnSecondary
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddFund();
                  setShowTopup(false);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 ${
                  isDark
                    ? dk.depositBtn
                    : "bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
                }`}
              >
                Top up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

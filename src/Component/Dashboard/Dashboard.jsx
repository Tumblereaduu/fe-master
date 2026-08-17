import { useState, useEffect } from "react";
import { Bell, User, BadgeCheck, Menu, X } from "lucide-react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import support from "../../assets/img/navbar/Customer service.svg";
import axios from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide, toast } from "react-toastify";
import { useMarginStore } from "../tradepage/marginStore";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_API_URL } from "../../api/config";
import MobileBottomNav from "../tradepage/MobileBottomNav";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import { useAccountType } from "../hooks/accountTypeContext";
import viewBanner from "../hooks/viewBanner";
import { kycStatusContext } from "../hooks/kycStatusContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Dashboard() {
  const { accountType, setAccountType } = useAccountType();
  const [balance, setBalance] = useState(0.00);
  const [currentView, setCurrentView] = useState("Dashboard");
  const [demoFund, setDemoFund] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const { banners, setBanners } = viewBanner();
  const { kycVerified, ibStatus, token, user } = kycStatusContext();
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  const { isDark, toggleTheme } = useTheme();

  const dk = {
    pageBg: "bg-[#141D22]",
    headerBg: "bg-[#141D22]",
    headerBorder: "border-[#4A5568]",
    card: "bg-[#252A30]",
    cardAlt: "bg-[#2A3038]",
    border: "border-[#3A424A]",
    heading: "text-white",
    label: "text-[#8A929B]",
    value: "text-[#E8EDF0]",    
    // muted: "text-[#6B7B88]",
    sub: "text-[#8A929B]",
    input: "bg-[#1C2127] border-[#3A424A] text-[#E8EDF0]",
    badgeReal: "bg-green-900/40 text-green-400",
    badgeDemo: "bg-blue-900/40 text-blue-400",
    kycVerified: "bg-[#1A1A3A]",
    kycPending: "bg-red-900/40 text-red-400",
    accountDetails: "bg-[#252A30]",
    accountDetailsTitle: "text-[#E8EDF0]",
    accountDetailsLabel: "text-[#8A929B]",
    accountDetailsValue: "text-white",
    drawerBg: "bg-[#1A2028]",
    drawerItem: "text-[#E8EDF0] hover:bg-[#2A3038]",
    grayBg: "bg-[#252A30]",
    iconCircle: "bg-[#2A3038]",
    // iconColor: "text-[#8A929B]",
    btnSecondary: "bg-[#2A3038] text-[#E8EDF0] hover:bg-[#353C44]",
    modalBg: "bg-[#252A30]",
    modalOverlay: "bg-black/60",
    selectReal: "bg-green-800 text-green-300",
    selectDemo: "bg-blue-800 text-blue-300",
    selectOption: "bg-[#141D22] text-[#E8EDF0]",
    depositBtn: "bg-blue-700 hover:bg-blue-800 text-white",
    withdrawBtn: "bg-blue-700 hover:bg-blue-800 text-white",
  };

  useEffect(() => {
    localStorage.setItem("accountType", accountType);
  }, [accountType]);

  const freeMargin = useMarginStore((s) => s.freeMargin);

  useEffect(() => {
    var s1 = document.createElement("script");
    var s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode.insertBefore(s1, s0);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

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

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <div className={`w-full min-h-screen font-sans transition-colors duration-300 ${isDark ? dk.pageBg : "bg-white"}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} theme="dark" />

      {/* ─── Navbar ─── */}
      <nav className={`w-full flex items-center justify-between px-4 py-3.5 border-b-2 md:px-6 z-50 fixed transition-colors duration-300 ${isDark ? `${dk.headerBg} ${dk.headerBorder}` : "bg-white border-gray-300"}`}>
        <div className="flex items-center space-x-2">
          <img
            src={isDark ? LogoYellow : LogoBlack}
            alt="DOIN FX"
            className="h-9 transition-opacity duration-200"
          />
          <span
            className={`px-3 py-1 text-sm mt-2 ml-1 font-semibold rounded-sm transition-colors duration-300
              ${accountType === "LIVE"
                ? (isDark ? dk.badgeReal : "bg-[#C5FFC9] text-black")
                : (isDark ? dk.badgeDemo : "bg-blue-100 text-blue-700")}`}
          >
            {displayAccountType}
          </span>
        </div>

        <div className="flex md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 transition-colors duration-300 ${isDark ? dk.value : "text-gray-700"}`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isDark ? dk.value : "text-gray-700"}`} />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className={`flex space-x-6 font-medium transition-colors duration-300 ${isDark ? dk.value : "text-gray-700"}`}>
            <Link to="/help" className={`flex gap-2 text-xl items-center transition-colors duration-200 ${isDark ? "hover:text-[#2368e9]" : "hover:text-blue-600"}`}>
              <img src={support} alt="" className={`w-5 h-5 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
              <span>Get Support</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer ─── */}
      {mobileMenuOpen && (
        <div className={`md:hidden shadow-md w-full absolute top-14 left-0 z-50 p-4 space-y-2 transition-colors duration-300 ${isDark ? dk.drawerBg : "bg-white"}`}>
          <Link to="/dashboard" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>My Account</Link>
          <Link to="/trading" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>Trading</Link>
          <button className={`block py-2 px-4 rounded w-full text-left transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => { if (accountType === "DEMO") { toast.warning("Switch to Real Account for Deposit"); return; } navigate("/deposit"); }}>Deposit</button>
          <button className={`block w-full text-left py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => { if (accountType === "DEMO") { toast.warning("Switch to Real Account for Withdrawal"); return; } if (kycVerified) { navigate('/withdraw'); } else { toast.warning('Please complete your KYC verification before withdrawal.'); } }}>Withdraw</button>
          <Link to="/position" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>Positions</Link>
          <Link to="/profile" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
          <Link to="/kyc" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>KYC</Link>
          <div className={`block py-2 px-4 rounded cursor-pointer transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => { if (ibStatus === "active") { navigate('/ib/dashboard'); } else { toast.error("Kindly contact the Admin team"); } }}>Refferal Partner</div>
          <Link to="/change_password" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>Change Password</Link>
          <Link to="/help" className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>Support</Link>

          <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors duration-300 ${isDark ? "bg-[#2A3038]" : "bg-gray-50"}`}>
            <div className={`flex items-center gap-3 transition-colors duration-300 ${isDark ? dk.value : "text-gray-700"}`}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span className="text-sm font-semibold">{isDark ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#141D22] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all after:duration-300 after:ease-in-out peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <button className="flex items-center gap-3 text-red-600 ml-4.5" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </div>
      )}

      {/* ─── Mobile View ─── */}
      <div className={`md:hidden pt-20 pb-20 p-2.5 space-y-3 min-h-screen transition-colors duration-300 ${isDark ? dk.pageBg : "bg-gray-100"}`}>
        {/* ACCOUNT CARD */}
        <div className={`rounded-xl p-4 drop-shadow-xl space-y-6 transition-colors duration-300 ${isDark ? dk.card : "bg-white"}`}>
          <div className="flex justify-between items-center">
            <p className={`text-sm font-bold transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Account ID  : {user.user_id}</p>
            <span className={`flex text-xs px-3 py-1 rounded-lg font-semibold transition-colors duration-300 ${isDark ? dk.kycVerified : "bg-black text-orange-400"}`}>
              <p className={`font-light mr-1 transition-colors duration-300 ${isDark ? dk.muted : "text-white"}`}>KYC :</p> {kycVerified ? "Verified ✔" : "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className={`font-bold transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Account Type</p>
            <select value={accountType} onChange={(e) => handleAccountTypeChange(e.target.value)} className={`text-sm px-3 py-1 rounded-lg font-semibold transition-colors duration-300 ${accountType === "LIVE" ? (isDark ? dk.selectReal : "bg-green-100 text-green-700") : (isDark ? dk.selectDemo : "bg-blue-100 text-blue-700")}`}>
              <option value="LIVE" className={isDark ? dk.selectOption : ""}>Real</option>
              <option value="DEMO" className={isDark ? dk.selectOption : ""}>Demo</option>
            </select>
          </div>
          <h1 className={`text-3xl font-extrabold transition-colors duration-300 ${isDark ? dk.heading : ""}`}>{Number(Math.max(0, balance)).toFixed(2)} USD</h1>
          <div className="grid grid-cols-3 gap-4 text-center">
            {accountType === "LIVE" ? (
              <>
                <button onClick={() => navigate("/deposit")} className="flex flex-col items-center">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${isDark ? dk.iconCircle : "bg-gray-100"}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDark ? dk.iconColor : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" /></svg>
                  </div>
                  <span className={`text-xs mt-2 transition-colors duration-300 ${isDark ? dk.muted : "text-gray-600"}`}>Deposit</span>
                </button>
                <button onClick={() => { if (kycVerified) navigate("/withdraw"); else toast.warning("Complete KYC first"); }} className="flex flex-col items-center">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${isDark ? dk.iconCircle : "bg-gray-100"}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDark ? dk.iconColor : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l6 6m-6-6l-6 6" /></svg>
                  </div>
                  <span className={`text-xs mt-2 transition-colors duration-300 ${isDark ? dk.muted : "text-gray-600"}`}>Withdraw</span>
                </button>
              </>
            ) : (
              <button onClick={() => setShowTopup(true)} className="flex flex-col items-center">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${isDark ? dk.iconCircle : "bg-gray-100"}`}>
                  <svg className={`w-6 h-6 transition-colors duration-300 ${isDark ? dk.iconColor : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" /></svg>
                  </div>
                  <span className={`text-xs mt-2 transition-colors duration-300 ${isDark ? dk.muted : "text-gray-600"}`}>Top Up</span>
              </button>
            )}
            <button onClick={() => navigate("/help")} className="flex flex-col items-center">
              <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${isDark ? dk.iconCircle : "bg-gray-100"}`}>
                <svg className={`w-7 h-7 transition-colors duration-300 ${isDark ? dk.iconColor : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 10c0-3.314-2.686-6-6-6S6 6.686 6 10v4a2 2 0 002 2h1v-6H8m8 0h-1v6h1a2 2 0 002-2v-4z" /></svg>
              </div>
              <span className={`text-xs mt-2 transition-colors duration-300 ${isDark ? dk.muted : "text-gray-600"}`}>Support</span>
            </button>
          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className={`rounded-xl drop-shadow-xl transition-colors duration-300 ${isDark ? dk.grayBg : "bg-gray-50"}`}>
          <h2 className={`ml-1.5 flex items-center gap-2 p-1 font-semibold transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}><MdOutlineAccountBalanceWallet size={19} /> Account Details</h2>
          <div className={`rounded-xl p-3 transition-colors duration-300 ${isDark ? dk.cardAlt : "bg-white"}`}>
            <div className={`flex justify-between items-center text-xs pr-2 pl-2 sm:pr-5 sm:pl-5 transition-colors duration-300 ${isDark ? dk.label : "text-gray-400"}`}>
              <div className="flex flex-col space-y-1"><span>ACCOUNT</span><span className={`font-bold text-xs transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>SPREAD</span></div>
              <div className="flex flex-col space-y-1"><span>SWAP</span><span className={`font-bold text-xs transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>ZERO</span></div>
              <div className="flex flex-col space-y-1"><span>COMMISSION</span><span className={`font-bold text-xs transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>ZERO</span></div>
              <div className="flex flex-col space-y-1"><span>LEVERAGE</span><span className={`font-bold text-xs transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Upto 1:2000</span></div>
            </div>
          </div>
        </div>

                          {/* BANNER - MOBILE */}
        {/* STRICT: Only show banners where location='dashboard' AND status='active' - NO fallback to other locations */}
        {(() => {
            const dashboardBanner = banners.find(b => b.location === 'dashboard' && b.status === 'active');
            return dashboardBanner ? (
                <img src={dashboardBanner.image} alt="banner" className="rounded-xl w-full" />
            ) : null;
        })()}


        {/* REFER & EARN */}
        <div className={`md:hidden rounded-2xl drop-shadow-xl transition-colors duration-300 ${isDark ? dk.card : "bg-white"}`}>
          <div className={`rounded-2xl p-4 transition-colors duration-300 ${isDark ? dk.cardAlt : "bg-white"}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-extrabold transition-colors duration-300 ${isDark ? dk.heading : "text-gray-800"}`}>Refer & Earn</h2>
              <button className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${isDark ? dk.iconCircle : "bg-gray-100"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-colors duration-300 ${isDark ? dk.iconColor : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className={`text-sm mt-2 transition-colors duration-300 ${isDark ? dk.sub : "text-gray-800"}`}>Earn 50% Revenue Sharing Instantly!</p>
            <div className="mt-3">
              <p className={`text-sm font-bold transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Total Earnings</p>
              <h1 className={`text-2xl font-extrabold mt-1 transition-colors duration-300 ${isDark ? dk.heading : "text-black"}`}>$0.00</h1>
            </div>
            <button onClick={() => navigate("/ib/dashboard")} className={`mt-4 w-full font-medium py-2.5 rounded-xl transition-colors duration-200 ${isDark ? dk.btnSecondary : "bg-gray-100 text-gray-800"}`}>Partner Dashboard</button>
          </div>
        </div>
      </div>

      {/* ─── Desktop Content ─── */}
      <div className="hidden md:block md:ml-60 lg:ml-65 xl:ml-64.5 p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="hidden md:block"><DoinDashboardSidebar /></div>
        <div className="lg:col-span-3 space-y-7 mt-16">
          {/* User Details Card */}
          <div className={`rounded-xl p-6 mt-10 md:p-12  md:mt-0 transition-colors duration-300 ${isDark ? dk.card : "bg-orange-0"}`}>
            <div className="flex flex-col space-y-6 md:space-y-0 md:flex-col lg:flex-row md:items-center md:justify-between">
              <div>
                {/* <h2 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${isDark ? dk.heading : "text-gray-900"}`}>{user.username || "Loading..."}</h2> */}
                <p className={`text-xl mt-6 transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Account ID: <span className="ml-2 font-semibold">{user.user_id || "Loading"}</span></p>
                <div className="flex text-xl items-center mt-6">
                  <label className={`mr-3 pr-7 transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>Account:</label>
                  <select value={accountType} onChange={(e) => handleAccountTypeChange(e.target.value)} className={`text-lg font-semibold px-4 py-0.5 rounded-md focus:outline-none transition-colors duration-300 ${accountType === "LIVE" ? (isDark ? dk.selectReal : "bg-green-700 text-white") : (isDark ? dk.selectDemo : "bg-blue-700 text-white")}`}>
                    <option value="LIVE" className={isDark ? dk.selectOption : "bg-gray-400"}>REAL</option>
                    <option value="DEMO" className={isDark ? dk.selectOption : "bg-gray-400"}>DEMO</option>
                  </select>
                </div>
                <p className={`mt-6 text-xl flex items-center transition-colors duration-300 ${isDark ? dk.value : "text-gray-800"}`}>
                  KYC Status:
                  {kycVerified ? (
                    <span className={`ml-2 inline-flex items-center px-5 py-0.5 text-lg font-semibold rounded-md transition-colors duration-300 ${isDark ? dk.kycVerified : "bg-[#160c4e]"}`}>
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FFB347] bg-clip-text text-transparent font-bold">Verified</span>
                      <BadgeCheck className="ml-2 w-5 h-5" style={{ stroke: "url(#verifiedGradient)", fill: "none" }} />
                      <svg width="0" height="0"><defs><linearGradient id="verifiedGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop stopColor="#FFD700" offset="0%" /><stop stopColor="#FFB347" offset="100%" /></linearGradient></defs></svg>
                    </span>
                  ) : (
                    <span className={`ml-2 inline-flex items-center px-3 py-1 text-lg font-semibold rounded-md transition-colors duration-300 ${isDark ? dk.kycPending : "bg-red-600 text-white"}`}>Not Verified</span>
                  )}
                </p>
              </div>
              <div className="mt-4 md:mt-5 lg:mt-0 text-center">
                <p className={`text-xl transition-colors duration-300 ${isDark ? dk.label : "text-gray-600"}`}>Balance</p>
                <h1 className={`text-3xl md:text-4xl font-extrabold font-leaguespart transition-colors duration-300 ${isDark ? dk.heading : "text-gray-800"}`}>{Number(Math.max(0, balance)).toFixed(2)} USD</h1>
                {accountType === "LIVE" ? (
                  <div className="flex flex-col xl:flex-row gap-3 mt-3 justify-center w-full">
                    <button className={`w-full xl:w-auto font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-9 md:px-13 lg:px-18 py-2.5 sm:py-3 md:py-3.5 rounded-md transition-colors duration-200 ${isDark ? dk.depositBtn : "bg-blue-600 hover:bg-blue-700 text-white"}`} onClick={() => navigate("/deposit")}>Deposit</button>
                    <button className={`w-full xl:w-auto font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-9 md:px-13 lg:px-18 py-2.5 sm:py-3 md:py-3.5 rounded-md flex items-center justify-center transition-colors duration-200 ${isDark ? dk.withdrawBtn : "bg-blue-600 hover:bg-blue-700 text-white"}`} onClick={() => { if (kycVerified) { navigate("/withdraw"); } else { toast.warning("Please complete your KYC verification before withdrawal."); } }}>Withdraw</button>
                  </div>
                ) : (
                  <div className="flex flex-col xl:flex-row gap-3 mt-3 justify-center w-full">
                    <input type="number" placeholder="Enter amount" min="0" value={demoFund} onChange={(e) => setDemoFund(e.target.value)} className={`w-full xl:w-[260px] px-4 sm:px-5 py-3 sm:py-3.5 text-base sm:text-lg rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300 ${isDark ? dk.input : "border border-gray-300"}`} />
                    <button className={`w-full xl:w-auto font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-9 md:px-13 lg:px-18 py-2.5 sm:py-3 md:py-3.5 rounded-md transition-colors duration-200 ${isDark ? dk.depositBtn : "bg-blue-600 hover:bg-blue-700 text-white"}`} onClick={handleAddFund}>Top UP</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Details Bar */}
          <div className={`w-full md:px-5 md:py-5 flex flex-col lg:flex-row md:items-center md:space-x-6 text-lg md:text-xl rounded-md shadow-m gap-2 md:gap-15 p-3 transition-colors duration-300 ${isDark ? dk.accountDetails : "bg-gray-100"}`}>
            <div className={`flex items-center space-x-1 font-semibold transition-colors duration-300 ${isDark ? dk.accountDetailsTitle : "text-black"}`}><span>Account Details</span><span className={isDark ? dk.muted : "text-gray-600"}>›</span></div>
            <div className="flex flex-col lg:flex-row lg:items-center space-x-3 lg:space-x-4 space-y-2 lg:space-y-0 mt-1.5 md:mt-0">
              <p className={`transition-colors duration-300 ${isDark ? dk.accountDetailsLabel : "text-gray-700"}`}>Account Type: <span className={`font-bold transition-colors duration-300 ${isDark ? dk.accountDetailsValue : "text-black"}`}>SPREAD</span></p>
              <p className={`transition-colors duration-300 ${isDark ? dk.accountDetailsLabel : "text-gray-700"}`}>Commission: <span className={`font-bold transition-colors duration-300 ${isDark ? dk.accountDetailsValue : "text-black"}`}>ZERO</span></p>
              <p className={`transition-colors duration-300 ${isDark ? dk.accountDetailsLabel : "text-gray-700"}`}>SWAP: <span className={`font-bold transition-colors duration-300 ${isDark ? dk.accountDetailsValue : "text-black"}`}>ZERO</span></p>
              <p className={`transition-colors duration-300 ${isDark ? dk.accountDetailsLabel : "text-gray-700"}`}>Leverage: <span className={`font-bold transition-colors duration-300 ${isDark ? dk.accountDetailsValue : "text-black"}`}>Up to 1:2000</span></p>
            </div>
          </div>

      {/* Banner - DESKTOP */}
          <div className="space-y-6 md:space-y-0 gap-6">
            <div className="pb-20">
                {/* STRICT: Only show banners where location='dashboard' AND status='active' - NO fallback to other locations */}
                {(() => {
                    const dashboardBanner = banners.find(b => b.location === 'dashboard' && b.status === 'active');
                    return dashboardBanner ? (
                        <img src={dashboardBanner.image} alt="N/A" className="w-full max-w-7xl rounded-xl object-cover" />
                    ) : null;
                })()}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50"><MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} /></div>

      {/* Top Up Modal */}
      {showTopup && (
        <div className={`fixed inset-0 flex items-end justify-center z-40 pb-18 transition-colors duration-300 ${isDark ? dk.modalOverlay : "bg-black/40"}`}>
          <div className={`w-full rounded-t-3xl p-5 transition-colors duration-300 ${isDark ? dk.modalBg : "bg-white"}`}>
            <h2 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? dk.heading : "text-gray-800"}`}>Top up your demo account</h2>
            <div className="mt-4"><input type="number" placeholder="Enter amount in USD" min={0} value={demoFund} onChange={(e) => setDemoFund(e.target.value)} className={`w-full mt-2 px-4 py-3 rounded-xl focus:outline-none transition-colors duration-300 ${isDark ? dk.input : "border border-gray-300"}`} /></div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowTopup(false)} className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 ${isDark ? dk.btnSecondary : "bg-gray-200 text-gray-700"}`}>Cancel</button>
              <button onClick={() => { handleAddFund(demoFund); setShowTopup(false); }} className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 ${isDark ? dk.depositBtn : "bg-blue-600 text-white"}`}>Top up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

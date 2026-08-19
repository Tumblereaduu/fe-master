import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LogoBlack from "../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../assets/img/logo/Doin FX.svg";
import { Menu, X } from "lucide-react";
import support from '../assets/img/navbar/Customer service.svg';
import { useAuth } from './context/AuthContext';
import { BACKEND_API_URL } from '../api/config';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { useAccountType } from './hooks/accountTypeContext';
import { kycStatusContext } from './hooks/kycStatusContext';
import { useTheme } from '../context/ThemeContext';



const NavbarForAccount = ({ isDark: isDarkProp }) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { kycVerified, ibStatus } = kycStatusContext();
  const { accountType, setAccountType, user, token } = useAccountType();
  const { isDark: contextDark } = useTheme();

  // Use prop if passed, otherwise fall back to context
  const isDark = isDarkProp !== undefined ? isDarkProp : contextDark;

  // KYC status 
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchKYCStatus = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/kyc/status/${user.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const kyc = Array.isArray(data) ? data[0] : data;

        if (!kyc) {
          setKycVerified(false);
          return;
        }

        const photo1 = kyc.photo_id_1_status?.toLowerCase() || "";
        const photo2 = kyc.photo_id_2_status?.toLowerCase() || "";
        const photo3 = kyc.photo_id_3_status?.toLowerCase() || "";
        const ib = kyc.ib_statys?.toLowerCase() || "";

        setFrontStatus(photo1);
        setBackStatus(photo2);
        setBankStatus(photo3);
        setBankStatus(ib);

        setKycVerified(
          photo1 === "approved" &&
          photo2 === "approved" &&
          photo3 === "approved"
        );

      } catch (error) {
        console.error("Failed to fetch KYC status", error);
        setKycVerified(false);
      }
    };

    fetchKYCStatus();
  }, [user, token]);

  // Handle account type change
  const handleAccountTypeChange = async (type) => {
    try {
      setAccountType(type);
      localStorage.setItem("accountType", type);

      if (type === "LIVE") {
        setBalance(totalAmount);
      }
      setDemoFund("");

      await axios.put(`${BACKEND_API_URL}/demoaccount/demo/account-type/${user.user_id}`, {
        account_type: type
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const displayType = type === "LIVE" ? "REAL" : type;
      toast.success(`Account Switched to ${displayType}`);
    } catch (error) {
      console.error("Failed to update account", error);
      toast.error("Failed to change account type")
    }
  };
  const displayAccountType = accountType === "LIVE" ? "REAL" : accountType;

  return (
    <div>
      <nav className={`fixed top-0 left-0 w-full shadow flex items-center justify-between px-4 py-3.5 border-b-4 md:px-6 z-50 transition-colors duration-300 ${isDark ? "bg-[#141D22] border-[#D1D5DB]/30" : "bg-white border-gray-300"}`}>
        <div className="flex items-center space-x-2" onClick={() => navigate('/trading')}>
          <img
            src={isDark ? LogoYellow : LogoBlack}
            alt="Logo"
            className="h-9 cursor-pointer transition-opacity duration-200"
          />
          <span
            className={`px-3 py-1 text-sm mt-2 font-semibold rounded-sm transition-colors duration-300
                ${accountType === "LIVE"
                ? (isDark ? "bg-[#1A3A2A] text-green-600" : "bg-[#C5FFC9] text-black")
                : (isDark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700")}`}
          >
            {displayAccountType}
          </span>
        </div>

        <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
          pauseOnHover theme='dark' transition={Slide} />

        <div className="flex md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-700"}`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-700"}`} />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className={`flex space-x-6 font-medium transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-gray-700"}`}>
            <div className='flex gap-2 items-center'>
              <img src={support} alt="" className={`w-5 h-5 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
              <Link to="/help" className={`transition-colors duration-200 ${isDark ? "hover:text-[#1a67f7]" : "hover:text-blue-600"}`}>
                Get Support
              </Link>
            </div>

          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden shadow-md w-full absolute top-20 left-0 z-50 p-4 space-y-4 transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
          <Link
            to="/dashboard"
            className={`block py-2 px-4 transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            My Account
          </Link>
          <Link
            to="/trading"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Trading
          </Link>
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => {
              if (accountType === "DEMO") {
                toast.warning("Switch to REAL account for Deposit.");
                return;
              }
              navigate("/deposit");
            }}
          >
            <span className={`text-[16px] transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-black"}`}>Deposit</span>
          </div>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => {
              if (accountType === "DEMO") {
                toast.warning("Switch the Real account");
                return;
              }
              if (kycVerified) {
                navigate("/withdraw");
              } else {
                toast.warning("Please complete your KYC verification before withdrawal.");
              }
            }} >
            <span className={`text-[16px] font-normal transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-black"}`}>Withdraw</span>
          </div>
          <Link
            to="/position"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Positions
          </Link>
          <Link
            to="/profile"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/kyc"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            KYC
          </Link>
          <div className={`block py-2 px-4 rounded cursor-pointer transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`} onClick={() => {
            if (ibStatus === "active") {
              navigate("/ib/dashboard");
            } else {
              toast.warning("Kindly contact the support team")
            }
          }}>
            Refferal Partner
          </div>
          <Link
            to="/change_password"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Change Password
          </Link>
          <Link
            to="/help"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-orange-100"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Support
          </Link>
          <button className="flex items-center gap-3 text-red-600 ml-4.5" onClick={() => {
            logout();
            navigate("/login")
          }}>
            Logout
          </button>
        </div>
      )}



    </div>
  );
}

export default NavbarForAccount

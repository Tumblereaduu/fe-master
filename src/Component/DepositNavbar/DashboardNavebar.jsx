import React, { useEffect, useState } from 'react'
import { Menu, X } from "lucide-react";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import { Link, useNavigate } from "react-router-dom";
import trading from '../../assets/img/navbar/Bar graph.svg';
import support from '../../assets/img/navbar/Customer service.svg';
import account from '../../assets/img/navbar/Vector.svg';
import { useAuth } from '../context/AuthContext';
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { useAccountType } from '../hooks/accountTypeContext';
import { kycStatusContext } from '../hooks/kycStatusContext';
import { useTheme } from "../../context/ThemeContext";

const DashboardNavebar = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { accountType, setAccountType } = useAccountType();
  const { kycVerified, ibStatus } = kycStatusContext();
  const { isDark } = useTheme();

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full shadow flex items-center justify-between px-4 py-3.5 border-b-4 md:px-6 z-50 transition-colors duration-300 ${
          isDark
            ? "bg-[#141D22] border-[#D1D5DB]/30"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="flex items-center space-x-2" onClick={() => navigate('/dashboard')}>
          <img
            src={isDark ? LogoYellow : LogoBlack}
            alt="Logo"
            className="h-9 cursor-pointer transition-opacity duration-200"
          />
        </div>

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
              <img src={account} alt="" className={`w-5 h-5 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
              <Link to="/dashboard" className={`transition-colors duration-200 ${isDark ? "hover:text-[#1a67f7]" : "hover:text-blue-600"}`}>
                My Account
              </Link>
            </div>
            <div className='flex gap-2 items-center'>
              <img src={trading} alt="" className={`w-5 h-5 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
              <Link to="/trading" className={`transition-colors duration-200 ${isDark ? "hover:text-[#1a67f7]" : "hover:text-blue-600"}`}>
                Trading
              </Link>
            </div>
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
        <div className={`md:hidden shadow-md w-full absolute top-14 left-0 z-50 p-4 space-y-4 transition-colors duration-300 ${
          isDark ? "bg-[#141D22]" : "bg-white"
        }`}>
          <Link
            to="/dashboard"
            className={`block py-2 px-4 border-t transition-colors duration-200 ${
              isDark ? "border-[#2A3640] text-[#E8EDF0] hover:bg-[#1E2830]" : "border-gray-200 hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            My Account
          </Link>
          <Link
            to="/trading"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Trading
          </Link>
          <div
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "text-gray-700 hover:bg-gray-100"
            }`}
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
          <div
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              if (accountType === "DEMO") {
                toast.warning("Switch to REAL account for Withdrawal.");
                return;
              }
              if (kycVerified) {
                navigate("/withdraw");
              } else {
                toast.warning("Please complete your KYC verification before withdrawal.");
              }
            }}
          >
            <span className={`text-[16px] transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : "text-black"}`}>Withdraw</span>
          </div>
          <Link
            to="/position"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Positions
          </Link>
          <Link
            to="/profile"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/kyc"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            KYC
          </Link>
          <div className={`block py-2 px-4 rounded cursor-pointer transition-colors duration-200 ${
            isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
          }`} onClick={() => {
            if (ibStatus === "active") {
              navigate("/ib/dashboard")
            } else {
              toast.error("Kindly contact the support team")
            }
          }}>Refferal Partner</div>
          <Link
            to="/change_password"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Change Password
          </Link>
          <Link
            to="/help"
            className={`block py-2 px-4 rounded transition-colors duration-200 ${
              isDark ? "text-[#E8EDF0] hover:bg-[#1E2830]" : "hover:bg-blue-100"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Support
          </Link>
          <button className="flex items-center text-[20px] gap-3 text-red-600 ml-4.5" onClick={() => {
            logout();
            navigate("/login")
          }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardNavebar;
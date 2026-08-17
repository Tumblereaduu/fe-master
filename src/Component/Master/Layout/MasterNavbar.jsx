import React, { useState, useRef, useEffect } from "react";
import { LogOut, Menu, Bell } from "lucide-react";
import logo from "../../../assets/img/logo/Doin FX.svg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";

const MasterNavbar = ({ mobileDrawerOpen, setMobileDrawerOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [masterName, setMasterName] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Live UTC time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString();
      setUtcTime(utc.replace("GMT", ""));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Get Master Name
  useEffect(() => {
    const masterInfo = Cookies.get("masterInfo")
      ? JSON.parse(Cookies.get("masterInfo"))
      : null;

    if (masterInfo?.name) {
      setMasterName(masterInfo.name);
    } else if (masterInfo?.email) {
      setMasterName(masterInfo.email.split("@")[0]);
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout("master");
    navigate("/master/login");
  };

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700 shadow-lg flex items-center justify-between px-2 sm:px-4 md:px-6 py-1 fixed top-0 left-0 right-0 z-50">
      {/* Left side — Logo + Hamburger */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Button (Mobile Only) */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden text-white p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo & Branding */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/master/dashboard")}
        >
          <img src={logo} alt="OneBlueTrade" className="w-24 md:w-32 object-contain" />
          <div className="hidden md:flex flex-col">
            <span className="text-lg font-bold text-blue-400">Master</span>
            <span className="text-xs text-gray-400">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Center — UTC Time */}
      {/* <div className="hidden lg:flex text-white text-sm">
        <div className="text-white">
          <span className="font-semibold text-blue-400">UTC:</span> {utcTime}
        </div>
      </div> */}

      {/* Right side — Notifications + User Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="text-gray-400 hover:text-white transition-colors relative p-2"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-white cursor-pointer focus:outline-none text-sm md:text-base hover:text-blue-400 transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {masterName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium">{masterName || "Master"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
              <ul className="py-2 text-sm">
                <li className="px-4 py-3 border-b border-gray-700">
                  <p className="text-xs text-gray-400">Logged in as</p>
                  <p className="font-semibold text-white">{masterName || "Master Admin"}</p>
                </li>
                <li
                  className="px-4 py-3 hover:bg-gray-700 flex items-center space-x-2 text-red-400 cursor-pointer transition"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterNavbar;

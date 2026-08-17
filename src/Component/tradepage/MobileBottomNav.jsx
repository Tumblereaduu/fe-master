import React from 'react';
import fchart from "../../assets/img/footericon/Bar-arrow.svg";
import ordericon from "../../assets/img/footericon/File.svg";
import fmarker from "../../assets/img/footericon/marker.svg";
import user from "../../assets/img/footericon/User.svg";
import dash from "../../assets/img/footericon/Layout.svg";
import { useNavigate } from 'react-router-dom';
import {
  MdOutlineDashboard, MdOutlineBookmarkBorder, MdOutlineBarChart, MdOutlineStickyNote2, MdOutlinePersonOutline
} from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";

const MobileBottomNav = ({ currentView, setCurrentView }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Default: muted grey | Active (clicked): white(dark) / orange(light)
  const defaultClass = isDark ? "text-[#8899A6]" : "text-gray-600";
  const activeClass = isDark ? "text-white" : "text-orange-600";

  const tabs = [
    { key: "Dashboard", icon: <MdOutlineDashboard size={25} />, label: "Account", path: "/dashboard", action: () => navigate("/dashboard") },
    { key: "instruments", icon: <MdOutlineBookmarkBorder size={25} />, label: "Watch", action: () => { setCurrentView("instruments"); navigate("/trading"); } },
    { key: "chart", icon: <MdOutlineBarChart size={25} />, label: "Trade", action: () => { setCurrentView("chart"); navigate("/trading"); } },
    { key: "orders", icon: <MdOutlineStickyNote2 size={25} />, label: "Orders", action: () => { setCurrentView("orders"); navigate("/trading"); } },
    { key: "profile", icon: <MdOutlinePersonOutline size={25} />, label: "Profile", action: () => navigate("/profile") },
  ];

  return (
    <div className={`border-t z-40 transition-colors duration-300 ${isDark ? "bg-[#141D22] border-[#2A3640]" : "bg-white border-gray-200"}`}>
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={tab.action}
            className={`flex flex-col items-center p-2 transition-colors duration-200 ${
              currentView === tab.key ? activeClass : defaultClass
            }`}
          >
            {tab.icon}
            <span className={`text-xs mt-1 ${
              currentView === tab.key ? activeClass : defaultClass
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;

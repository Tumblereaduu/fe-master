import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useAccountType } from "./hooks/accountTypeContext";
import { kycStatusContext } from "./hooks/kycStatusContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_API_URL } from "../api/config";
import tradingicon from "../assets/img/doinTradingSidebarIcons/Bar graph.svg";
import myaccounticon from "../assets/img/doinTradingSidebarIcons/Layout.svg";
import dashboardicon from "../assets/img/doinTradingSidebarIcons/Wallet.svg";
import withdrawalicon from "../assets/img/doinTradingSidebarIcons/Withdraw.svg";
import positiomicon from "../assets/img/doinTradingSidebarIcons/Check mark.svg";
import { button } from "framer-motion/client";
// ─── Extra icons for Profile / KYC / Referral / Change Password ───
import profileicon from "../assets/img/doinDashboardSidebar/User.svg";
import kycicon from "../assets/img/doinDashboardSidebar/Check.svg";
import invitefrnds from "../assets/img/doinDashboardSidebar/Friends.svg";
import changeicon from "../assets/img/doinDashboardSidebar/Key.svg";
// ─── Icons for Logout & Insights ───
import { LogOut, FileSearch, ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";

// Placeholder for Insights icon if you have a local asset
// import insightsicon from "../assets/img/...";

export default function DoinSidebar() {
  const navigate = useNavigate();
  const [kycVerified, setKycVerified] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // State to handle sub-menu toggling (Accordion)
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  
  const { token, user } = useAuth();
  const { accountType, setAccountType } = useAccountType();
  const { isDark } = useTheme();
  // ─── IB status for Referral Partner ───
  const { kycVerified: ctxKycVerified, ibStatus } = kycStatusContext();

  // ─── Light mode blue filter for SVG icons to match #1877F2 ───
  const lightBlueFilter = "invert(27%) sepia(99%) saturate(2476%) hue-rotate(207deg) brightness(97%) contrast(101%)";

  // ─── Dark colour tokens ───
  const dk = {
    bg: "bg-[#141D22]",
    border: "border-[#2A3640]",
    text: "text-[#E8EDF0]",
    muted: "text-[#6B7B88]",
    activeText: "text-orange-400",
    divider: "border-[#2A3640]",
  };

  // FETCH KYC STATUS
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchKYCStatus = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/kyc/status/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const kyc = Array.isArray(data) ? data[0] : data;

        if (!kyc) {
          setKycVerified(false);
          return;
        }

        const photo1 = kyc.photo_id_1_status?.toLowerCase() || "";
        const photo2 = kyc.photo_id_2_status?.toLowerCase() || "";
        const photo3 = kyc.photo_id_3_status?.toLowerCase() || "";

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

  // ─── Logout Handler ───
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ─── Menu Data ───
  const menu = [
    // { name: "My Account", icon: myaccounticon, path: "/dashboard" },
    // ─── Insights (With Sub-menu) ───
    // {
    //   name: "Insights",
    //   // Using Lucide icon as placeholder. Replace 'insightsicon' with your asset import.
    //   iconComponent: <FileSearch size={24} className="w-6" />, 
    //   hasSubmenu: true,
    //   children: [
    //     { name: "Trading signals", path: "/insights/signals" },
    //     { name: "News", path: "/insights/news" }
    //   ]
    // },
    { name: "Trading", icon: tradingicon, path: "/trading" },
    { name: "Deposit", icon: dashboardicon, path: "/deposit" },
    { name: "Withdrawal", icon: withdrawalicon, path: "/withdraw" },
    { name: "Positions", icon: positiomicon, path: "/position" },
    { name: "Profile", icon: profileicon, path: "/profile" },
    { name: "KYC", icon: kycicon, path: "/kyc" },
    { name: "Referral Partner", icon: invitefrnds, path: "/ib/dashboard" },
    { name: "Change Password", icon: changeicon, path: "/change_password" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${collapsed ? "w-20" : "w-40"} flex flex-col items-center py-4 gap-2 border-r-3 transition-colors duration-300 overflow-hidden ${
        isDark ? `${dk.bg} ${dk.border}` : "bg-white border-gray-300"
      }`}>
        <div className="w-full flex justify-center mb-3 border-b-2 border-gray-300 pb-3">

          <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#2A3640]"
          >
              {collapsed ? (
                  <PanelLeftOpen size={25}/>
              ) : (
                  <PanelLeftClose size={25}/>
              )}
          </button>

        </div>
        {/* Menu Items */}
        {menu.map((item, index) => {
          const isCustomClick = item.onClick !== undefined;
          const isSubmenuOpen = openMenuIndex === index;
          const hasSubmenu = item.hasSubmenu;

          // ─── Item with Submenu (Insights) ───
          // if (hasSubmenu) {
          //   return (
          //     <div key={index} className="w-full flex flex-col items-center">
          //       {/* Parent Button */}
          //       <div
          //         onClick={() => setOpenMenuIndex(isSubmenuOpen ? null : index)}
          //         className={`w-full flex flex-col items-center text-md p-1.5 cursor-pointer transition-colors duration-300 rounded-lg ${
          //           isSubmenuOpen
          //             ? `font-bold ${isDark ? dk.activeText : "text-[#1877F2] bg-[#EAF4FF]"}`
          //             : isDark ? `${dk.text} hover:bg-[#2A3640]` : `text-[#1877F2] hover:bg-[#EAF4FF]`
          //         }`}
          //       >
          //         {/* Icon */}
          //         <div className={isDark ? "text-[#E8EDF0]" : "text-[#1877F2]"}>
          //           {item.iconComponent || (item.icon && <img src={item.icon} className="w-6" style={!isDark ? { filter: lightBlueFilter } : undefined} />)}
          //         </div>
          //         {/* Chevron Indicator */}
          //         {isSubmenuOpen ? (
          //           <ChevronUp size={12} className={isDark ? "text-[#E8EDF0]" : "text-[#1877F2]"} />
          //         ) : (
          //           <ChevronDown size={12} className={isDark ? "text-[#6B7B88]" : "text-[#1877F2]"} />
          //         )}
          //         <span className={`mt-1 text-[9px] font-bold transition-colors duration-300 text-center whitespace-normal break-words ${
          //           isDark ? dk.muted : ""
          //         }`}>{item.name}</span>
          //       </div>

          //       {/* Submenu Items */}
          //       {isSubmenuOpen && (
          //         <div className={`w-full flex flex-col items-center gap-2 mt-2 pb-2 border-t ${isDark ? "border-[#2A3640]" : "border-gray-200"}`}>
          //           {item.children.map((child, childIdx) => (
          //             <NavLink
          //               key={childIdx}
          //               to={child.path}
          //               className={({ isActive }) =>
          //                 `w-full flex flex-col items-center px-2 py-1 text-[10px] cursor-pointer transition-colors rounded-md ${
          //                   isActive
          //                     ? `font-bold ${isDark ? "text-orange-400 bg-[#2A3640]" : "text-[#1877F2] bg-[#EAF4FF]"}`
          //                     : isDark ? "text-[#6B7B88] hover:text-white" : "text-[#1877F2] hover:bg-[#EAF4FF]"
          //                 }`
          //               }
          //             >
          //               {child.name}
          //             </NavLink>
          //           ))}
          //         </div>
          //       )}
          //     </div>
          //   );
          // }

          // ─── Standard Item ───
          return (         
            <div
              key={index}
              onClick={isCustomClick ? item.onClick : undefined}
              className="w-full flex flex-col p-1.5"
            >
              <NavLink
                to={isCustomClick ? "" : item.path}
                end
                className={({ isActive }) =>
                  `flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                  } w-full px-1 py-1.5 rounded-lg cursor-pointer transition-all duration-300 ${
                    isDark
                      ? isActive
                        ? "font-bold text-white"
                        : "text-[#79878b]"
                      : isActive
                      ? "font-bold text-[#1877F2] bg-[#EAF4FF]"
                      : "text-[#5f6772]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Icon */}
                    <div
                      style={!isDark && isActive ? { filter: lightBlueFilter } : undefined}
                      className={isDark && isActive ? "brightness-0 invert" : "invert-40"}
                    >
                      {item.iconComponent || (
                        <img
                          src={item.icon}
                          className={`w-6 ${!isDark && !isActive ? "opacity-60" : ""}`}
                        />
                      )}
                    </div>

                    {/* Text */}
                    {!collapsed && (
                      <span
                        className={`ml-1.5 text-xs font-medium whitespace-nowrap ${
                          !isDark
                            ? isActive
                              ? "text-[#1877F2]"
                              : "text-[#5f6772]"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          );
        })}

        {/* Bottom Section: Logout & Theme Toggle */}
        <div className={` pt-6 mt-5 border-t-1 w-full flex flex-col items-center gap-4 transition-colors duration-300 ${
          isDark ? dk.divider : "border-gray-300"
        }`}>
          
          {/* Logout Button */}
          <div 
            onClick={handleLogout}
            className="w-full flex flex-col items-center cursor-pointer group"
          >
             <div className={isDark ? "text-[#6B7B88] group-hover:text-red-500 transition-colors duration-300" : "text-[#1877F2]  group-hover:text-red-500 transition-colors duration-300"}>
                <LogOut size={24} />
             </div>
             <span className={`mt-1 text-[9px] font-bold transition-colors duration-300 text-center whitespace-normal break-words ${
                  isDark ? dk.muted : ""
                }`}>Logout</span>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle /> 
          </div>

        </div>
      </div>
    </div>
    
  );
}

// import { NavLink, useNavigate } from "react-router-dom";
// import { FaHome, FaChartBar, FaWallet, FaMoneyCheckAlt, FaClipboardList, FaUser, FaKey, FaUserShield, FaMoon, FaSignOutAlt, FaUsers } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import { useAuth } from "./context/AuthContext";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css"
// import { ToastContainer, Slide, toast } from "react-toastify";
// import { BACKEND_API_URL } from "../api/config";
// import myaccounticon from "../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg"
// import tradingicon from "../assets/img/doinDashboardSidebar/Bar graph.svg"
// import depositicon from "../assets/img/doinDashboardSidebar/Wallet.svg"
// import withdrawalicon from "../assets/img/doinDashboardSidebar/Withdraw.svg"
// import positonicon from "../assets/img/doinDashboardSidebar/Check mark.svg"
// import profileicon from "../assets/img/doinDashboardSidebar/User.svg"
// import kycicon from "../assets/img/doinDashboardSidebar/Check.svg"
// import changeicon from "../assets/img/doinDashboardSidebar/Key.svg"
// import invitefrnds from "../assets/img/doinDashboardSidebar/Friends.svg"
// import logoutic from "../assets/img/doinDashboardSidebar/logout.svg"
// import { useAccountType } from "./hooks/accountTypeContext";
// import { kycStatusContext } from "./hooks/kycStatusContext";

// export default function DoinDashboardSidebar() {

//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const {accountType,setAcountType} = useAccountType();
//   const {kycVerified, ibStatus,} = kycStatusContext();

//   return (
//     <div className="hidden mt-18 md:flex md:w-60 lg:w-64 xl:w-64 2xl:w-80 h-screen pb-13 bg-white border-r border-orange-300 flex-col fixed left-0 -top-1 overflow-y-auto">
//       {/* TOP SECTION */}
//       <div>
//         {/* Menu List */}
//         <nav className="px-3 mt-4 space-y-3">
//           <SidebarItem to="/dashboard" icon={<img src={myaccounticon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">My Account</span>} />
//           <SidebarItem to="/trading" icon={<img src={tradingicon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">Trading</span>} />

//           {/* ---- DEPOSIT (DEMO BLOCKED) ---- */}
//           <div
//             className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
//             onClick={() => {
//               if (accountType === "DEMO") {
//                 toast.warning("Switch to REAL account for Deposit.");
//                 return;
//               }
//               navigate("/deposit");
//             }}
//           >
//             <span className="text-lg"><img src={depositicon} className="w-6 h-6" /></span>
//             <span className="text-[20px] text-black">Deposit</span>
//           </div>

//           <div
//             className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
//             onClick={() => {
//               if (accountType === "DEMO") {
//                 toast.warning("Switch to REAL account for Withdrawal.");
//                 return;
//               }
//               if (kycVerified) {
//                 navigate("/withdraw");
//               } else {
//                 toast.warning("Please complete your KYC verification before withdrawal.");
//               }
//             }}
//           >
//             <span className="text-lg"><img src={withdrawalicon} className="w-6 h-6" /></span>
//             <span className="text-[20px] text-black">Withdraw</span>
//           </div>

//           <SidebarItem to="/position" icon={<img src={positonicon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">Positions</span>} />
//           <SidebarItem to="/profile" icon={<img src={profileicon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">Profile</span>} />
//           <SidebarItem to="/kyc" icon={<img src={kycicon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">KYC</span>} />
//           <div  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer text-black hover:bg-gray-100" onClick={()=>{
//           if(ibStatus === "active"){
//             navigate("/ib/dashboard")
//           }else{
//             toast.error("Kindly contact the support team")
//           }
//          }}>
//           <img src={invitefrnds} className="w-6 h-6"></img>
//           <span className="text-[20px]"> Refferal Partner </span>
//          </div>
//           <SidebarItem to="/change_password" icon={<img src={changeicon} alt="My Account" className="w-6 h-6" />} label={<span className="text-[20px] text-black">Change Password</span>} />      

//           {/* Invite Box */}
//           {/* <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-5 text-lg cursor-pointer" onClick={()=> navigate("/ib/dashboard")}>
//             <div className="flex items-center gap-2">
//               <img src={invitefrnds} alt="" />
//               <p>Earn more money by inviting your friends</p>
//             </div>
//           </div> */}
//         </nav>
//       </div>

//       {/* BOTTOM SECTION */}
//       <div className="p-5 space-y-3 mt-10 2xl:mt-40">
//         {/* Dark Mode */}
//         {/* <div className="flex items-center justify-between text-[20px]">
//           <div className="flex items-center gap-3 text-gray-700">
//             <FaMoon />
//             <span>Dark Mode</span>
//           </div>

//           <label className="relative inline-block w-12 h-6 cursor-pointer">
//             <input type="checkbox" className="peer sr-only" />
//             <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition"></div>
//             <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
//           </label>
//         </div> */}

//         {/* Logout */}
//         <button className="flex items-center text-[22px] gap-3 px-3 py-2 w-full rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => {
//           logout();
//           navigate("/login")
//         }}>
//           <img src={logoutic} alt="" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// function SidebarItem({ to, icon, label }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition 
//         ${isActive
//           ? "bg-orange-50 border border-orange-300 text-black"
//           : "text-gray-700 hover:bg-gray-50"
//         }`
//       }
//     >
//       <span className="text-lg">{icon}</span>
//       {label}
//     </NavLink>  
//   );
// }


import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { BACKEND_API_URL } from "../api/config";
import myaccounticon from "../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg";
import tradingicon from "../assets/img/doinDashboardSidebar/Bar graph.svg";
import depositicon from "../assets/img/doinDashboardSidebar/Wallet.svg";
import withdrawalicon from "../assets/img/doinDashboardSidebar/Withdraw.svg";
import positonicon from "../assets/img/doinDashboardSidebar/Check mark.svg";
import profileicon from "../assets/img/doinDashboardSidebar/User.svg";
import kycicon from "../assets/img/doinDashboardSidebar/Check.svg";
import changeicon from "../assets/img/doinDashboardSidebar/Key.svg";
import invitefrnds from "../assets/img/doinDashboardSidebar/Friends.svg";
import logoutic from "../assets/img/doinDashboardSidebar/logout.svg";
import { useAccountType } from "./hooks/accountTypeContext";
import { kycStatusContext } from "./hooks/kycStatusContext";
import { useTheme } from "../context/ThemeContext";

export default function DoinDashboardSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { accountType } = useAccountType();
  const { kycVerified, ibStatus } = kycStatusContext();
  const { isDark, toggleTheme } = useTheme();

  const dk = {
    bg: "bg-[#141D22]",
    border: "border-[#2A3640]",
    text: "text-[#E8EDF0]",
    muted: "text-[#8899A6]",
    hover: "hover:bg-[#222E38]",
    activeBg: "bg-[#222E38] border border-[#4A5568]/30 text-white",
    inactiveText: "text-[#E8EDF0]",
    iconFilter: "brightness-0 invert",
  };

  return (
    <>
      <div className={`hidden mt-17 md:flex md:w-60 lg:w-64 xl:w-64 h-screen pb-13 border-r flex-col fixed left-0 -top-1 overflow-y-auto transition-colors duration-300 ${
        isDark ? `${dk.bg} ${dk.border}` : "bg-white border-gray-300"
      }`}>
        <div>
          <nav className="px-3 mt-4 space-y-3">
            <SidebarItem to="/dashboard" icon={<img src={myaccounticon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>My Account</span>} isDark={isDark} dk={dk} />
            <SidebarItem to="/trading" icon={<img src={tradingicon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Trading</span>} isDark={isDark} dk={dk} />

            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300 ${isDark ? `${dk.inactiveText} ${dk.hover}` : "text-gray-700 hover:bg-gray-100"}`} onClick={() => { if (accountType === "DEMO") { toast.warning("Switch to REAL account for Deposit."); return; } navigate("/deposit"); }}>
              <span className="text-lg"><img src={depositicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} /></span>
              <span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Deposit</span>
            </div>

            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300 ${isDark ? `${dk.inactiveText} ${dk.hover}` : "text-gray-700 hover:bg-gray-100"}`} onClick={() => { if (accountType === "DEMO") { toast.warning("Switch to REAL account for Withdrawal."); return; } if (kycVerified) { navigate("/withdraw"); } else { toast.warning("Please complete your KYC verification before withdrawal."); } }}>
              <span className="text-lg"><img src={withdrawalicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} /></span>
              <span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Withdraw</span>
            </div>

            <SidebarItem to="/position" icon={<img src={positonicon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Positions</span>} isDark={isDark} dk={dk} />
            <SidebarItem to="/profile" icon={<img src={profileicon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Profile</span>} isDark={isDark} dk={dk} />
            <SidebarItem to="/kyc" icon={<img src={kycicon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>KYC</span>} isDark={isDark} dk={dk} />
            
            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-300 ${isDark ? `${dk.inactiveText} ${dk.hover}` : "text-black hover:bg-gray-100"}`} onClick={() => { if (ibStatus === "active") { navigate("/ib/dashboard"); } else { toast.error("Kindly contact the support team"); } }}>
              <img src={invitefrnds} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} alt="" />
              <span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Refferal Partner</span>
            </div>

            <SidebarItem to="/change_password" icon={<img src={changeicon} alt="" className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label={<span className={`text-[18px] transition-colors duration-300 ${isDark ? dk.text : "text-black"}`}>Change Password</span>} isDark={isDark} dk={dk} />
          </nav>
        </div>

        <div className="p-5 space-y-3 mt-10 2xl:mt-40">
          <div className={`flex items-center justify-between text-[18px] px-3 py-2 rounded-lg transition-colors duration-300  ${isDark ? dk.hover : "hover:bg-gray-100"}`}>
            <div className={`flex items-center gap-3 transition-colors duration-300 ${isDark ? dk.text : "text-gray-700"}`}>
              {isDark ? <span className="text-orange-400 text-xl">☀️</span> : <FaMoon/>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gray-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all after:duration-300 after:ease-in-out peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          <button className={`flex items-center text-[18px] gap-3 px-3 py-2 w-full rounded-lg font-medium cursor-pointer transition-colors duration-300 ${isDark ? `${dk.text} ${dk.hover}` : "text-gray-700 hover:bg-gray-50"}`} onClick={() => { logout(); navigate("/login"); }}>
            <img src={logoutic} alt="Logout" className={isDark ? dk.iconFilter : ""} />
            Logout
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button onClick={toggleTheme} className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 active:scale-90 text-white" style={{ backgroundColor: isDark ? "#141D22" : "#1F2937" }} aria-label="Toggle theme">
          {isDark ? <span className="text-lg">☀️</span> : <FaMoon className="text-lg" />}
        </button>
      </div>
    </>
  );
}

function SidebarItem({ to, icon, label, isDark, dk }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
          isActive
            ? isDark ? dk.activeBg : "bg-gray-100 text-black"
            : isDark ? `${dk.inactiveText} ${dk.hover}` : "text-gray-700 hover:bg-gray-100 hover:"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}

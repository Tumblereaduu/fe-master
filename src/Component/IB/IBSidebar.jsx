// import { NavLink } from "react-router-dom";
// import myaccounticon from "../../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg"
// import tradingicon from "../../assets/img/doinDashboardSidebar/Bar graph.svg"
// import depositicon from "../../assets/img/doinDashboardSidebar/Wallet.svg"
// import positonicon from "../../assets/img/ib/transfer/transfericon.svg"
// import earnicon from "../../assets/img/ib/Earnings/earnings.svg"
// import changeicon from "../../assets/img/doinDashboardSidebar/Key.svg"

// export default function IBSidebar() {

//   return (
//     <div className="hidden md:flex md:w-64 2xl:w-80 h-screen bg-white border-r border-orange-300 flex-col fixed left-0 top-17 overflow-y-auto">

//       {/* MENU */}
//       <nav className="px-3 mt-6 space-y-3">

//         {/* Dashboard */}
//         <SidebarItem
//           to="/ib/dashboard"
//           icon={<img src={myaccounticon} className="w-6 h-6" />}
//           label="Dashboard"
//         />

//         {/* View Profile */}
//         <SidebarItem
//           to="/ib/kyc"
//           icon={<img src={tradingicon} className="w-6 h-6" />}
//           label="View Profile"
//         />

//         {/* My Clients */}
//         <SidebarItem
//           to="/ib/clients"
//           icon={<img src={depositicon} className="w-6 h-6" />}
//           label="My Clients"
//         />

//         {/* Earnings */}
//         <SidebarItem
//           to="/ib/earnings"
//           icon={<img src={earnicon} className="w-6 h-6" />}
//           label="Earnings"
//         />

//         {/* Transfer */}
//         <SidebarItem
//           to="/ib/deposit"
//           icon={<img src={positonicon} className="w-6 h-6" />}
//           label="Transfer"
//         />

//         {/* Claim Bonus */}
//         {/* <SidebarItem
//           to="/profile"
//           icon={<img src={profileicon} className="w-6 h-6" />}
//           label="Claim Bonus"
//         /> */}

//         {/* Support */}
//         <SidebarItem
//           to="/help"
//           icon={<img src={changeicon} className="w-6 h-6" />}
//           label="Support"
//         />
//       </nav>
//     </div>
//   );
// }

// /* Sidebar Item Component */
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
//       {icon}
//       <span className="text-[20px]">{label}</span>
//     </NavLink>
//   );
// }



import { NavLink } from "react-router-dom";
import myaccounticon from "../../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg";
import tradingicon from "../../assets/img/doinDashboardSidebar/Bar graph.svg";
import depositicon from "../../assets/img/doinDashboardSidebar/Wallet.svg";
import positonicon from "../../assets/img/ib/transfer/transfericon.svg";
import earnicon from "../../assets/img/ib/Earnings/earnings.svg";
import changeicon from "../../assets/img/doinDashboardSidebar/Key.svg";
import { useTheme } from "../../context/ThemeContext";

export default function IBSidebar() {
  const { isDark } = useTheme();

  const dk = {
    bg: "bg-[#141D22]",
    border: "border-[#2A3640]",
    text: "text-[#E8EDF0]",
    hover: "hover:bg-[#222E38]",
    activeBg: "bg-[#222E38] border border-[#4A5568]/30 text-white",
    iconFilter: "brightness-0 invert",
  };

  return (
    <div className={`hidden md:flex md:w-64 2xl:w-80 h-screen border-r flex-col fixed left-0 top-17 overflow-y-auto transition-colors duration-300 ${
      isDark ? `${dk.bg} ${dk.border}` : "bg-white border-gray-300"
    }`}>
      <nav className="px-3 mt-6 space-y-3">
        <SidebarItem to="/ib/dashboard" icon={<img src={myaccounticon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="Dashboard" isDark={isDark} dk={dk} />
        <SidebarItem to="/ib/kyc" icon={<img src={tradingicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="View Profile" isDark={isDark} dk={dk} />
        <SidebarItem to="/ib/clients" icon={<img src={depositicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="My Clients" isDark={isDark} dk={dk} />
        <SidebarItem to="/ib/earnings" icon={<img src={earnicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="Earnings" isDark={isDark} dk={dk} />
        <SidebarItem to="/ib/deposit" icon={<img src={positonicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="Transfer" isDark={isDark} dk={dk} />
        <SidebarItem to="/help" icon={<img src={changeicon} className={`w-6 h-6 ${isDark ? dk.iconFilter : ""}`} />} label="Support" isDark={isDark} dk={dk} />
      </nav>
    </div>
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
            : isDark ? `${dk.text} ${dk.hover}` : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span className="text-[20px]">{label}</span>
    </NavLink>
  );
}
// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import Logo from "../../assets/img/logo/Doin FX.svg";
// import { Menu, X } from "lucide-react";
// import myaccounticon from "../../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg"
// import tradingicon from "../../assets/img/doinDashboardSidebar/Bar graph.svg"
// import "react-toastify/dist/ReactToastify.css"
// import { ToastContainer, Slide, toast } from "react-toastify";

// const IBNavbar = () => {

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div>
//       <nav className="fixed top-0 left-0 w-full bg-white shadow flex items-center justify-between px-4 py-3.5 border-b-4 border-orange-300 md:px-6 z-50">
//         <div className="flex items-center space-x-2" onClick={() => navigate('/dashboard')}>
//           <img src={Logo} alt="Logo" className="h-9" />
//           <p className='text-xl mt-4 font-medium'>
//             Partner
//           </p>
//         </div>

//         <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable
//           pauseOnHover theme='light' transition={Slide} />

//         <div className="flex md:hidden">
//           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             {mobileMenuOpen ? (
//               <X className="h-6 w-6 text-gray-700" />
//             ) : (
//               <Menu className="h-6 w-6 text-gray-700" />
//             )}
//           </button>
//         </div>

//         <div className="hidden md:flex items-center space-x-6">
//           <div className="flex space-x-6 font-medium text-gray-700">
//             <div className='flex gap-2 items-center'>
//               <img src={myaccounticon} alt="" className='w-5 h-5' />
//               <Link to="/dashboard" className="hover:text-orange-600">
//                 My Account
//               </Link>
//             </div>
//             <div className='flex gap-2 items-center'>
//               <img src={tradingicon} alt="" className='w-5 h-5' />
//               <Link to="/trading" className="hover:text-orange-600">
//                 Trading
//               </Link>
//             </div>
//           </div>
//         </div>

//       </nav>

//       {/* Mobile Drawer */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-md w-full absolute top-14 left-0 z-50 p-4 space-y-4">
//           <Link
//             to="/dashboard"
//             className="block py-2 px-4 hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             My Account
//           </Link>
//           <Link
//             to="/ib/dashboard"
//             className="block py-2 px-4 hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/ib/kyc"
//             className="block py-2 px-4 rounded hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             View Profile
//           </Link>

//           <Link
//             to="/ib/clients"
//             className="block py-2 px-4 rounded hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             My Clients
//           </Link>
//           <Link
//             to="/ib/earnings"
//             className="block py-2 px-4 rounded hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Earnings
//           </Link>
//           <Link
//             to="/ib/deposit"
//             className="block py-2 px-4 rounded hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Transfer
//           </Link>

//           <Link
//             to="/help"
//             className="block py-2 px-4 rounded hover:bg-orange-100"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Support
//           </Link>
//         </div>
//       )}

//     </div>
//   );
// }

// export default IBNavbar;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoBlack from "../../assets/img/logo/Doin FX (2).svg";
import LogoYellow from "../../assets/img/logo/Doin FX.svg";
import { Menu, X } from "lucide-react";
import myaccounticon from "../../assets/img/doinDashboardSidebar/akar-icons_dashboard.svg";
import tradingicon from "../../assets/img/doinDashboardSidebar/Bar graph.svg";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const IBNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const dk = {
    bg: "bg-[#141D22]",
    border: "border-[#4A5568]/30",
    text: "text-[#E8EDF0]",
    muted: "text-[#8899A6]",
    drawerBg: "bg-[#141D22]",
    drawerItem: "text-[#E8EDF0] hover:bg-[#222E38]",
  };

  return (
    <div>
      <nav className={`fixed top-0 left-0 w-full shadow flex items-center justify-between px-4 py-3.5 border-b-3 md:px-6 z-50 transition-colors duration-300 ${
        isDark ? `${dk.bg} ${dk.border}` : "bg-white border-gray-300"
      }`}>
        <div className="flex items-center space-x-2" onClick={() => navigate("/dashboard")}>
          <img
            src={isDark ? LogoYellow : LogoBlack}
            alt="Logo"
            className="h-9 transition-opacity duration-200"
          />
          <p className={`text-xl mt-4 font-medium transition-colors duration-300 ${isDark ? dk.text : ""}`}>
            Partner
          </p>
        </div>

        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />

        <div className="flex md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 transition-colors duration-300 ${isDark ? dk.text : "text-gray-700"}`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isDark ? dk.text : "text-gray-700"}`} />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className={`flex space-x-6 font-medium transition-colors duration-300 ${isDark ? dk.text : "text-gray-700"}`}>
            <div className="flex gap-2 items-center">
              <img src={myaccounticon} alt="" className={`w-5 h-5 ${isDark ? "brightness-0 invert" : ""}`} />
              <Link to="/dashboard" className={`transition-colors duration-200 ${isDark ? "hover:text-blue-500" : "hover:text-blue-600"}`}>
                My Account
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <img src={tradingicon} alt="" className={`w-5 h-5 ${isDark ? "brightness-0 invert" : ""}`} />
              <Link to="/trading" className={`transition-colors duration-200 ${isDark ? "hover:text-blue-500" : "hover:text-blue-600"}`}>
                Trading
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden shadow-md w-full absolute top-14 left-0 z-50 p-4 space-y-4 transition-colors duration-300 ${isDark ? dk.drawerBg : "bg-white"}`}>
          <Link to="/dashboard" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            My Account
          </Link>
          <Link to="/ib/dashboard" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/ib/kyc" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            View Profile
          </Link>
          <Link to="/ib/clients" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            My Clients
          </Link>
          <Link to="/ib/earnings" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            Earnings
          </Link>
          <Link to="/ib/deposit" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            Transfer
          </Link>
          <Link to="/help" className={`block py-2 px-4 transition-colors duration-200 ${isDark ? dk.drawerItem : "hover:bg-orange-100"}`} onClick={() => setMobileMenuOpen(false)}>
            Support
          </Link>
        </div>
      )}
    </div>
  );
};

export default IBNavbar;
import { NavLink } from "react-router-dom";
import { FaUser, FaWallet, FaKey, FaLifeRing, FaSignOutAlt } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { BACKEND_API_URL } from "../../api/config";

export default function Sidebar({ sidebarOpen }) {
  const linkClass = ({ isActive }) =>
    `px-6 py-2 flex items-center transition-colors duration-200 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`;

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      window.location.href = '/login';
      return;
    }
    try {
      const decoded  = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if(decoded.exp < currentTime){
        localStorage.clear();
        sessionStorage.clear();
        window.location.href="/login";
      }
    } catch (error) {
      console.error("Token decoded error",error);
      window.location.href="/login"
    }
  },[])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      
      setTimeout(()=>{
      localStorage.clear();
      sessionStorage.clear(); 
      window.location.href = "/login";
      },1500)

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      className={`fixed top-13 left-0 h-screen w-60 bg-white border-r-3 border-blue-200 z-40 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <ul className="py-6 space-y-2">
        <li>
          <NavLink to="/profile" className={linkClass}> <FaUser className="mr-2" /> Profile </NavLink>
        </li>
        <li>
          {/* <NavLink to="/earn" className={linkClass}> <FaWallet className="mr-2" /> Earn With Us </NavLink> */}
        </li>
        <li>
          <NavLink to="/kyc" className={linkClass}> <RiVerifiedBadgeFill className="mr-2 w-5 h-5" /> KYC </NavLink>
        </li>
        <li>
          <NavLink to="/change_password" className={linkClass}> <FaKey className="mr-2" /> Change Password </NavLink>
        </li>
        <li>
          <NavLink to="/help" className={linkClass}> <MdSupportAgent className="mr-2 w-5 h-5" /> Help Center </NavLink>
        </li>
        <li>
          <button className="w-full text-left px-6 py-2 flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </li>
      </ul>

      {/* Invite Banner */}
      <div className="m-4 p-3 bg-green-100 border border-green-200 rounded-md text-sm text-gray-800">
        Invite your friends and earn more money
      </div>
    </aside>
  );
}

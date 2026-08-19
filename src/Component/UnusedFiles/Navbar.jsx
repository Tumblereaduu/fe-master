import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import Logo from "../../assets/img/logo/Doin FX.svg";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center border-b-3 border-blue-200 justify-between px-4 py-3 z-50 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard">
            <img src={Logo} alt="Logo" className="h-9 cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="space-x-6 font-medium text-gray-700">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/trading" className="hover:text-blue-600">Trading</Link>
            <Link to="/position" className="hover:text-blue-600">Positions</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* User avatar */}
            <Link
              to="/dashboard"
              className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-blue-600" />
            </Link>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 text-xl"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
                    <Link
              to="/dashboard"
              className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-blue-600" />
            </Link>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Sidebar sidebarOpen={mobileMenuOpen} />
    </>
  );
}

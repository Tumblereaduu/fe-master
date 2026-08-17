import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Globe,
  BarChart3,
  LogOut,
  Menu,
  ChevronLeft,
  X,
  Building2,
  Activity,
  Settings,
  ChevronDown,
} from "lucide-react";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MasterSidebar = ({
  collapsed,
  setCollapsed,
  mobileDrawerOpen,
  setMobileDrawerOpen,
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    const newMenu = openMenu === menu ? null : menu;
    setOpenMenu(newMenu);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  const handleMobileMenuItemClick = () => {
    closeMobileDrawer();
  };

  const handleLogout = () => {
    logout("master");
    navigate("/master/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-3 flex items-center text-[13px] font-medium rounded-lg transition-colors duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-300 hover:bg-blue-500 hover:text-white"
     }`;

  const menuButtonClass =
    "w-full text-left px-3 py-3 flex justify-between items-center text-[13px] font-medium rounded-lg text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200";

  return (
    <div>
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={closeMobileDrawer}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`mt-15 pb-10 scroll-area fixed top-0 left-0 h-screen bg-gray-900 z-40 transform transition-all duration-300 ease-in-out hidden md:block ${
          collapsed ? "w-16 md:w-20" : "w-40 md:w-45"
        }`}
      >
        {/* Toggle Button */}
        <div className="p-1.5 border-b border-gray-700 flex justify-center">
          <button
            onClick={toggleCollapse}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        <SidebarMenu
          collapsed={collapsed}
          openMenu={openMenu}
          handleMenuClick={handleMenuClick}
          linkClass={linkClass}
          menuButtonClass={menuButtonClass}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`mt-12 pb-10 scroll-area fixed top-0 left-0 h-screen bg-gray-900 z-40 transform transition-all duration-300 ease-in-out md:hidden w-48 ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="p-3 border-b border-gray-700 flex justify-end">
          <button
            onClick={closeMobileDrawer}
            className="text-gray-300 hover:text-white"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <SidebarMenu
          collapsed={false}
          openMenu={openMenu}
          handleMenuClick={handleMenuClick}
          linkClass={linkClass}
          menuButtonClass={menuButtonClass}
          handleLogout={handleLogout}
          isMobile={true}
          onItemClick={handleMobileMenuItemClick}
        />
      </aside>
    </div>
  );
};

const SidebarMenu = ({
  collapsed,
  openMenu,
  handleMenuClick,
  linkClass,
  menuButtonClass,
  handleLogout,
  isMobile,
  onItemClick,
}) => {
  return (
    <ul className="py-5 space-y-0.5 text-[13px]">
      {/* Dashboard */}
      <li>
        <NavLink
          to="/master/dashboard"
          className={linkClass}
          title={collapsed ? "Dashboard" : ""}
          onClick={onItemClick}
        >
          <LayoutDashboard className="mr-3 w-5 h-5" />
          {!collapsed && "Dashboard"}
        </NavLink>
      </li>

      {/* Clients */}
      <button
        type="button"
        onClick={() => handleMenuClick("clients")}
        className={menuButtonClass}
        title={collapsed ? "Clients" : ""}
      >
        <span className="flex items-center">
          <Building2 className="mr-3 w-5 h-5" />
          {!collapsed && "Clients"}
        </span>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              openMenu === "clients" ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {openMenu === "clients" && (
        <ul className="ml-5 mt-1 space-y-1">
          <li>
            <NavLink
              to="/master/clients"
              className={linkClass}
              onClick={onItemClick}
            >
              All Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/master/clients/create"
              className={linkClass}
              onClick={onItemClick}
            >
              Add Client
            </NavLink>
          </li>
        </ul>
      )}

      {/* Domains */}
      <button
        type="button"
        onClick={() => handleMenuClick("domains")}
        className={menuButtonClass}
        title={collapsed ? "Domains" : ""}
      >
        <span className="flex items-center">
          <Globe className="mr-3 w-5 h-5" />
          {!collapsed && "Domains"}
        </span>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              openMenu === "domains" ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {openMenu === "domains" && (
        <ul className="ml-5 mt-1 space-y-1">
          <li>
            <NavLink
              to="/master/domains"
              className={linkClass}
              onClick={onItemClick}
            >
              All Domains
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/master/domains/create"
              className={linkClass}
              onClick={onItemClick}
            >
              Add Domain
            </NavLink>
          </li>
        </ul>
      )}

      {/* Admins */}
      <button
        type="button"
        onClick={() => handleMenuClick("admins")}
        className={menuButtonClass}
        title={collapsed ? "Admins" : ""}
      >
        <span className="flex items-center">
          <Users className="mr-3 w-5 h-5" />
          {!collapsed && "Admins"}
        </span>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              openMenu === "admins" ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {openMenu === "admins" && (
        <ul className="ml-5 mt-1 space-y-1">
          <li>
            <NavLink
              to="/master/admins"
              className={linkClass}
              onClick={onItemClick}
            >
              All Admins
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/master/admins/create"
              className={linkClass}
              onClick={onItemClick}
            >
              Add Admin
            </NavLink>
          </li>
        </ul>
      )}

      {/* Analytics */}
      <li>
        <NavLink
          to="/master/analytics"
          className={linkClass}
          title={collapsed ? "Analytics" : ""}
          onClick={onItemClick}
        >
          <BarChart3 className="mr-3 w-5 h-5" />
          {!collapsed && "Analytics"}
        </NavLink>
      </li>

      {/* Activity Logs */}
      <li>
        <NavLink
          to="/master/activity-logs"
          className={linkClass}
          title={collapsed ? "Activity Logs" : ""}
          onClick={onItemClick}
        >
          <Activity className="mr-3 w-5 h-5" />
          {!collapsed && "Activity Logs"}
        </NavLink>
      </li>

      {/* Settings */}
      <li>
        <NavLink
          to="/master/settings"
          className={linkClass}
          title={collapsed ? "Settings" : ""}
          onClick={onItemClick}
        >
          <Settings className="mr-3 w-5 h-5" />
          {!collapsed && "Settings"}
        </NavLink>
      </li>

      {/* Divider */}
      <li className="my-3 border-t border-gray-700"></li>

      {/* Logout */}
      <li>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-3 flex items-center text-[13px] font-medium rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-600 hover:text-white"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut className="mr-3 w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </li>
    </ul>
  );
};

export default MasterSidebar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Edit3, Users, Wallet, DollarSign, ArrowDownCircle, Megaphone, Landmark, Notebook, TicketCheck, Share2, Menu, ChevronLeft, X } from "lucide-react";
import { LuFileSpreadsheet } from "react-icons/lu";
import { RiAdminLine } from "react-icons/ri";
import AdminNavbar from "./AdminNavebar";
import { adminRoutes } from "../../App";
import Cookies from "js-cookie";

const AdminSidenav = ({ collapsed, setCollapsed, mobileDrawerOpen, setMobileDrawerOpen }) => {
  const [openMenu, setOpenMenu] = useState(() => { return Cookies.get("admin_menu") || null });

  let permissions = [];

  try {
    const stored = Cookies.get("adminInfo");
    const parsed = stored ? JSON.parse(stored) : null;
    permissions = parsed?.permission || [];
  } catch {
    permissions = [];
  }

  permissions = permissions.map(p => p.trim().toLowerCase());

  const handleMenuClick = (menu) => {
    const newMenu = openMenu === menu ? null : menu;
    setOpenMenu(newMenu);
    Cookies.set("admin_menu", newMenu, { expires: 7 });
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMobileMenuClick = (menu) => {
    const newMenu = openMenu === menu ? null : menu;
    setOpenMenu(newMenu);
    Cookies.set("admin_menu", newMenu, { expires: 7 });
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  const handleMobileMenuItemClick = () => {
    closeMobileDrawer();
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-3 flex items-center text-[13px] font-medium rounded-lg transition-colors duration-200
     ${isActive
      ? "bg-blue-600 text-white shadow-md"
      : "text-gray-300 hover:bg-blue-500 hover:text-white"
    }`;

  const menuButtonClass = "w-full text-left px-3 py-3 flex justify-between items-center text-[13px] font-medium rounded-lg text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200";

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
        className={`mt-12 pb-10 scroll-area fixed top-0 left-0 h-screen bg-gray-900 z-40 transform transition-all duration-300 ease-in-out hidden md:block ${collapsed ? "w-16 md:w-20" : "w-48 md:w-50"}`}
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
          permissions={permissions}
          linkClass={linkClass}
          menuButtonClass={menuButtonClass}
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
          handleMenuClick={handleMobileMenuClick}
          permissions={permissions}
          linkClass={linkClass}
          menuButtonClass={menuButtonClass}
          isMobile={true}
          onItemClick={handleMobileMenuItemClick}
        />
      </aside>
    </div>
  );
};

const SidebarMenu = ({ collapsed, openMenu, handleMenuClick, permissions, linkClass, menuButtonClass, isMobile, onItemClick }) => {
  return (
    <ul className="py-5 space-y-0.5 text-[13px]">
      {/* Dashboard */}
      <li>
        <NavLink to={`${adminRoutes}dashboard`} className={linkClass} title={collapsed ? "Dashboard" : ""} onClick={onItemClick}>
          <LayoutDashboard className="mr-3 w-5 h-5" /> {!collapsed && "Dashboard"}
        </NavLink>
      </li>

      {/* Orders */}
      {permissions.includes("orderedit") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("orders")}
            className={menuButtonClass}
            title={collapsed ? "Orders" : ""}
          >
            <span className="flex items-center">
              <Edit3 className="mr-3 w-5 h-5" /> {!collapsed && "Orders"}
            </span>
          </button>

          {openMenu === "orders" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}order/open`} className={linkClass} onClick={onItemClick}>Open Orders</NavLink></li>
              <li><NavLink to={`${adminRoutes}order/pending`} className={linkClass} onClick={onItemClick}>Pending Orders</NavLink></li>
              <li><NavLink to={`${adminRoutes}squareoff`} className={linkClass} onClick={onItemClick}>Auto Squareoff</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Order History */}
      {(permissions.includes("orderhistory") || permissions.includes("orderhistroy")) && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("history")}
            className={menuButtonClass}
            title={collapsed ? "Order History" : ""}
          >
            <span className="flex items-center">
              <Landmark className="mr-3 w-5 h-5" />{!collapsed && "Order History"}
            </span>
          </button>

          {openMenu === "history" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}order/buy`} className={linkClass} onClick={onItemClick}>Buy Orders</NavLink></li>
              <li><NavLink to={`${adminRoutes}order/sell`} className={linkClass} onClick={onItemClick}>Sell Orders</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* USERS */}
      {permissions.includes("balance") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("users")}
            className={menuButtonClass}
            title={collapsed ? "Users" : ""}
          >
            <span className="flex items-center">
              <Users className="mr-3 w-5 h-5" /> {!collapsed && "Users"}
            </span>
          </button>

          {openMenu === "users" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}user/all`} className={linkClass} onClick={onItemClick}>All Users</NavLink></li>
              <li><NavLink to={`${adminRoutes}user/inactive`} className={linkClass} onClick={onItemClick}>Inactive Users</NavLink></li>
              <li><NavLink to={`${adminRoutes}user/monitor`} className={linkClass} onClick={onItemClick}>Monitor Users</NavLink></li>
              <li><NavLink to={`${adminRoutes}user/add`} className={linkClass} onClick={onItemClick}>Add User</NavLink></li>
              <li><NavLink to={`${adminRoutes}addKyc`} className={linkClass} onClick={onItemClick}>Add User KYC</NavLink></li>
              <li><NavLink to={`${adminRoutes}LP`} className={linkClass} onClick={onItemClick}>LP PNL</NavLink></li>
              <li><NavLink to={`${adminRoutes}account/delete/requests`} className={linkClass} onClick={onItemClick}>Account Delete</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* DEPOSITS */}
      {permissions.includes("deposits") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("deposits")}
            className={menuButtonClass}
            title={collapsed ? "Deposits" : ""}
          >
            <span className="flex items-center">
              <DollarSign className="mr-3 w-5 h-5" /> {!collapsed && "Deposits"}
            </span>
          </button>
          {openMenu === "deposits" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}deposit`} className={linkClass} onClick={onItemClick}>Deposit List</NavLink></li>
              <li><NavLink to={`${adminRoutes}add_fund`} className={linkClass} onClick={onItemClick}>Add Fund</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Users Withdraw */}
      {permissions.includes("withdrawals") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("withdrawals")}
            className={menuButtonClass}
            title={collapsed ? "Users Withdraw" : ""}
          >
            <span className="flex items-center">
              <ArrowDownCircle className="mr-3 w-5 h-5" /> {!collapsed && "Users Withdraw"}
            </span>
          </button>

          {openMenu === "withdrawals" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}withdraw`} className={linkClass} onClick={onItemClick}>Withdrawal list</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Account Balances */}
      {permissions.includes("users") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("balances")}
            className={menuButtonClass}
            title={collapsed ? "Account Balances" : ""}
          >
            <span className="flex items-center">
              <Wallet className="mr-3 w-5 h-5" /> {!collapsed && "Account Balances"}
            </span>
          </button>

          {openMenu === "balances" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}update_wallet`} className={linkClass} onClick={onItemClick}>User Balances</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Support Ticket */}
      {permissions.includes("tickets") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("tickets")}
            className={menuButtonClass}
            title={collapsed ? "Support Ticket" : ""}
          >
            <span className="flex items-center">
              <TicketCheck className="mr-3 w-5 h-5" /> {!collapsed && "Support Ticket"}
            </span>
          </button>

          {openMenu === "tickets" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}support`} className={linkClass} onClick={onItemClick}>Support Ticket</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Admin */}
      {permissions.includes("admin") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("addadmin")}
            className={menuButtonClass}
            title={collapsed ? "Admin" : ""}
          >
            <span className="flex items-center">
              <RiAdminLine className="h-5 w-5 mr-3" /> {!collapsed && "Admin"}
            </span>
          </button>

          {openMenu === "addadmin" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}payment_configuration`} className={linkClass} onClick={onItemClick}>Payment Configuration</NavLink></li>
              <li><NavLink to={`${adminRoutes}add`} className={linkClass} onClick={onItemClick}>Add Admin</NavLink></li>
              <li><NavLink to={`${adminRoutes}view`} className={linkClass} onClick={onItemClick}>View Admin</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Payment Mode */}
      {permissions.includes("paymentmode") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("payment")}
            className={menuButtonClass}
            title={collapsed ? "Payment Mode" : ""}
          >
            <span className="flex items-center">
              <Users className="mr-3 w-5 h-5" /> {!collapsed && "Payment Mode"}
            </span>
          </button>

          {openMenu === "payment" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}usdt`} className={linkClass} onClick={onItemClick}>USDT</NavLink></li>
              <li><NavLink to={`${adminRoutes}upi`} className={linkClass} onClick={onItemClick}>UPI</NavLink></li>
              <li><NavLink to={`${adminRoutes}crypto`} className={linkClass} onClick={onItemClick}>CRYPTO</NavLink></li>
              <li><NavLink to={`${adminRoutes}addbank`} className={linkClass} onClick={onItemClick}>Add Bank</NavLink></li>
              <li><NavLink to={`${adminRoutes}banktransfer`} className={linkClass} onClick={onItemClick}>Bank Transfer</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Announcement */}
      {permissions.includes("announcement") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("announcement")}
            className={menuButtonClass}
            title={collapsed ? "Announcement" : ""}
          >
            <span className="flex items-center">
              <Megaphone className="mr-3 w-5 h-5" />{!collapsed && "Announcement"}
            </span>
          </button>

          {openMenu === "announcement" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}user/contact`} className={linkClass} onClick={onItemClick}>Edit Contact</NavLink></li>
              <li><NavLink to={`${adminRoutes}banner/create`} className={linkClass} onClick={onItemClick}>Create New</NavLink></li>
              <li><NavLink to={`${adminRoutes}banner/viewall`} className={linkClass} onClick={onItemClick}>View All</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Spread */}
      {permissions.includes("addspread") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("spread")}
            className={menuButtonClass}
            title={collapsed ? "Pairs Management" : ""}
          >
            <span className="flex items-center">
              <LuFileSpreadsheet className="w-5 h-5 mr-3.5" />{!collapsed && "Pairs Management"}
            </span>
          </button>

          {openMenu === "spread" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}add_spread`} className={linkClass} onClick={onItemClick}>Add Spread</NavLink></li>
              <li><NavLink to={`${adminRoutes}view_spread`} className={linkClass} onClick={onItemClick}>View Spread</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* IB */}
      {permissions.includes("ib") && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("ibValues")}
            className={menuButtonClass}
            title={collapsed ? "IB" : ""}
          >
            <span className="flex items-center">
              <Share2 className="mr-3 w-5 h-5" />{!collapsed && "IB"}
            </span>
          </button>

          {openMenu === "ibValues" && (
            <ul className="ml-5 mt-1 space-y-1">
              {/* <li><NavLink to={`${adminRoutes}commission`} className={linkClass} onClick={onItemClick}>IB Per Lot</NavLink></li> */}
              <li><NavLink to={`${adminRoutes}admin/ib/deposit`} className={linkClass} onClick={onItemClick}>IB Deposit</NavLink></li>
              <li><NavLink to={`${adminRoutes}admin/ib/kyc`} className={linkClass} onClick={onItemClick}>IB KYC</NavLink></li>
              <li><NavLink to={`${adminRoutes}admin/ib/all/commission`} className={linkClass} onClick={onItemClick}>IB Commission History</NavLink></li>
            </ul>
          )}
        </>
      )}

      {/* Demo Order History */}
      {(permissions.includes("demoorderhistory")) && (
        <>
          <button
            type="button"
            onClick={() => handleMenuClick("demohistory")}
            className={menuButtonClass}
            title={collapsed ? "Demo Order History" : ""}
          >
            <span className="flex items-center">
              <Notebook className="mr-3 w-5 h-5" />{!collapsed && "Demo Order History"}
            </span>
          </button>

          {openMenu === "demohistory" && (
            <ul className="ml-5 mt-1 space-y-1">
              <li><NavLink to={`${adminRoutes}order/demo/buy`} className={linkClass} onClick={onItemClick}>Demo Buy Orders</NavLink></li>
              <li><NavLink to={`${adminRoutes}order/demo/sell`} className={linkClass} onClick={onItemClick}>Demo Sell Orders</NavLink></li>
            </ul>
          )}
        </>
      )}
    </ul>
  );
};

export default AdminSidenav;

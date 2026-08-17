import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard,Edit3,Users,Wallet,DollarSign,ArrowDownCircle,Megaphone,Landmark,History,Share2,LogOut,ChevronDown,} from "lucide-react";
import AdminNavbar from "./AdminNavebar";
import { adminRoutes } from "../../App"


const AdminSidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="h-screen w-64 bg-gray-900 text-gray-300 flex flex-col fixed left-0 top-12 border-r border-gray-800">

            {/* Sidebar Header */}
            <div className="p-4 text-center text-lg font-semibold text-white border-b border-gray-700">
                
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto mt-2">
                <ul className="space-y-1">
                    {/* Dashboard */}
                    <li>
                        <button onClick={`${adminRoutes}admin/dashboard`}
                            className="flex items-center px-4 py-2 space-x-3 text-sm font-medium text-white hover:bg-gray-700"
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </button>
                    </li>

                    {/* Order Edit */}
                    <li>
                        <button
                            onClick={() => toggleMenu("orderEdit")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Edit3 size={18} />
                                <span>Order Edit</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "orderEdit" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "orderEdit" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">Pending Orders</li>
                                <li className="py-2 hover:text-white">Completed Orders</li>
                            </ul>
                        )}
                    </li>

                    {/* Users */}
                    <li>
                        <button
                            onClick={() => toggleMenu("users")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Users size={18} />
                                <span>Users</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "users" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "users" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">All Users</li>
                                <li className="py-2 hover:text-white">Add User</li>
                            </ul>
                        )}
                    </li>

                    {/* Account Balances */}
                    <li>
                        <button
                            onClick={() => toggleMenu("balances")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Wallet size={18} />
                                <span>Account Balances</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "balances" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "balances" && (
                            <ul className="pl-10 text-sm">
                                <li className="py-2 hover:text-white">User Balances</li>
                                <li className="py-2 hover:text-white">Adjust Balance</li>
                            </ul>
                        )}
                    </li>

                    {/* Users Deposit */}
                    <li>
                        <button
                            onClick={() => toggleMenu("deposit")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <DollarSign size={18} />
                                <span>Users Deposit</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "deposit" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "deposit" && (
                            <ul className="pl-10 text-sm">
                                <li className="py-2 hover:text-white">Add Fund</li>
                                <li className="py-2 hover:text-white">Pending Deposits</li>
                                <li className="py-2 hover:text-white">Completed Deposits</li>
                            </ul>
                        )}
                    </li>

                    {/* Users Withdraw */}
                    <li>
                        <button
                            onClick={() => toggleMenu("withdraw")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <ArrowDownCircle size={18} />
                                <span>Users Withdraw</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "withdraw" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "withdraw" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">Pending Withdraws</li>
                                <li className="py-2 hover:text-white">Completed Withdraws</li>
                            </ul>
                        )}
                    </li>

                    {/* Announcement */}
                    <li>
                        <button
                            onClick={() => toggleMenu("announcement")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Megaphone size={18} />
                                <span>Announcement</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "announcement" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "announcement" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">View All</li>
                                <li className="py-2 hover:text-white">Create New</li>
                            </ul>
                        )}
                    </li>

                    {/* Bank */}
                    <li>
                        <button
                            onClick={() => toggleMenu("bank")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Landmark size={18} />
                                <span>Bank</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "bank" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "bank" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">All Banks</li>
                                <li className="py-2 hover:text-white">Add Bank</li>
                            </ul>
                        )}
                    </li>

                    {/* Order History */}
                    <li>
                        <button
                            onClick={() => toggleMenu("history")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <History size={18} />
                                <span>Order History</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "history" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "history" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">Buy Orders</li>
                                <li className="py-2 hover:text-white">Sell Orders</li>
                            </ul>
                        )}
                    </li>

                    {/* IB */}
                    <li>
                        <button
                            onClick={() => toggleMenu("ib")}
                            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <Share2 size={18} />
                                <span>IB</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${openMenu === "ib" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {openMenu === "ib" && (
                            <ul className="pl-10 text-sm ">
                                <li className="py-2 hover:text-white">IB Users</li>
                                <li className="py-2 hover:text-white">IB Commissions</li>
                            </ul>
                        )}
                    </li>

                    {/* Logout */}
                    <li className="hover:bg-gray-700 mt-2">
                        <Link
                            to="/logout"
                            className="flex items-center px-4 py-2 space-x-3 text-red-400"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar;
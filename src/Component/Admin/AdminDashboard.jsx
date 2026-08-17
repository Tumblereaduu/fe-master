import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminSidebar from "./AdminSidebar";
import { BACKEND_API_URL } from "../../api/config";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, sellOrders: 0, buyOrders: 0, deposits: 0, withdrawals: 0, support: 0, kycVerified: 0, kycUnverified: 0, pendingKYC: 0, liveActiveUsers: 0, openTrades: 0, closedTrades: 0, blockedUsers: 0,
  });
  const [timeRange, setTimeRange] = useState("24h");
  const [timeStats, setTimeStats] = useState({ kycUser: 0, registerUser: 0, totalProfit: 0, totalloss: 0 })

  //   const [recentRegistered, setRecentRegistered] = useState([]);
  //   const [recentLogins, setRecentLogins] = useState([]);

  //  Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/admindash`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch time static 

  useEffect(() => {
    const fetchTimeStats = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/admindash/timerange?range=${timeRange}`);
        const data = await res.json();
        if (data.success) setTimeStats(data.stats);
      } catch (err) {
        console.error("Error fetching time stats:", err);
      }
    };
    fetchTimeStats();
  }, [timeRange]);

  //  Fetch recent user activities
  //   useEffect(() => {
  //     const fetchRecent = async () => {
  //       try {
  //         const [regRes, loginRes] = await Promise.all([
  //           fetch("http://localhost:5000/api/admin/recent-registered"),
  //           fetch("http://localhost:5000/api/admin/recent-logins"),
  //         ]);

  //         const regData = await regRes.json();
  //         const loginData = await loginRes.json();

  //         if (regData.success) setRecentRegistered(regData.users);
  //         if (loginData.success) setRecentLogins(loginData.users);
  //       } catch (err) {
  //         console.error("Error fetching recent users:", err);
  //       }
  //     };
  //     fetchRecent();
  //   }, []);

  // const [recentRegistered,] = useState([
  //   {
  //     name: "Kishore Kumar",
  //     email: "kishore@example.com",
  //     date: "2025-10-25T14:32:00Z",
  //     ip_address: "192.168.1.15",
  //     activity: "Registered",
  //   },
  //   {
  //     name: "Priya R",
  //     email: "priya@example.com",
  //     date: "2025-10-25T13:12:00Z",
  //     ip_address: "192.168.1.24",
  //     activity: "Login",
  //   },
  //   {
  //     name: "Rahul",
  //     email: "rahul@example.com",
  //     date: "2025-10-24T17:45:00Z",
  //     ip_address: "192.168.1.37",
  //     activity: "Registered",
  //   },
  // ]);


  //  Cards configuration
  const cards = [
    { title: "Total Users", value: stats.totalUsers, color: "bg-blue-400" },
    { title: "Sell Orders", value: stats.sellOrders, color: "bg-red-400" },
    { title: "Buy Orders", value: stats.buyOrders, color: "bg-green-400" },
    { title: "Deposits", value: stats.deposits, color: "bg-amber-400" },
    { title: "Withdrawals", value: stats.withdrawals, color: "bg-orange-400" },
    { title: "KYC Verified Users", value: stats.kycVerified, color: "bg-emerald-400" },
    { title: "KYC Unverified Users", value: stats.kycUnverified, color: "bg-gray-400" },
    { title: "Pending KYC", value: stats.pendingKYC, color: "bg-yellow-400" },
    // { title: "Live Active Users", value: stats.liveActiveUsers, color: "bg-indigo-400" },
    { title: "Open Trades", value: stats.openTrades, color: "bg-cyan-400" },
    { title: "Closed Trades", value: stats.closedTrades, color: "bg-purple-400" },
    { title: "De-activated Users", value: stats.blockedUsers, color: "bg-pink-400" },
    { title: "LP Users", value: stats.lpUsers, color: "bg-green-400" },
  ];

  const card = [
    { title: "Total USER", value: timeStats.registerUser, color: "bg-violet-500" },
    { title: "KYC Verified", value: timeStats.kycUser, color: "bg-teal-500" },
    { title: "TOTAL USER PROFIT", value: `$ ${timeStats.totalProfit}`, color: "bg-amber-600" },
    { title: "TOTAL USER LOSS", value: `$ ${timeStats.totalloss}`, color: "bg-red-600" },
  ];

  return (
    <AdminLayout>
        <div
          className="transition-all duration-300 w-full px-3 py-4 sm:py-8 overflow-hidden"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>

          <div className="p-5 bg-gray-700 rounded-3xl md:hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:hidden">
              <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-white">Last Dashboard</h3>

              <select
                className="bg-gray-700 text-white border border-gray-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="24h">24 Hours</option>
                <option value="week">1 Week</option>
                <option value="15days">15 Days</option>
                <option value="month">1 Month</option>
              </select>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-10 md:mt-20 md:hidden">
              {card.map((card, index) => (
                <div
                  key={index}
                  className={`${card.color} text-white rounded-2xl shadow-md p-4 sm:p-5 md:p-6 transition-transform transform hover:scale-105`}
                >
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold">{card.title}</h2>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-green-50 my-3 sm:my-4 md:hidden"></div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-10">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.color} text-white rounded-2xl shadow-md p-4 sm:p-5 md:p-6 transition-transform transform hover:scale-105`}
              >
                <h2 className="text-sm sm:text-base md:text-lg font-semibold">{card.title}</h2>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="hidden md:block border border-green-50 my-3 sm:my-4"></div>

          <div className="hidden md:block">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 sm:mt-5 gap-3 sm:gap-0">
            <h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-white">Last Dashboard</h3>

            <select
              className="bg-gray-700 text-white border border-gray-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">24 Hours</option>
              <option value="week">1 Week</option>
              <option value="15days">15 Days</option>
              <option value="month">1 Month</option>
            </select>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-10 md:mt-20">
            {card.map((card, index) => (
              <div
                key={index}
                className={`${card.color} text-white rounded-2xl shadow-md p-4 sm:p-5 md:p-6 transition-transform transform hover:scale-105`}
              >
                <h2 className="text-sm sm:text-base md:text-lg font-semibold">{card.title}</h2>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>
          </div>

          {/* Recent Users Table */}
          {/* <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent User Activity</h2>
        <div className="gap-6">
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-center">Name</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Date & time</th>
                    <th className="px-4 py-2 text-center">IP-Address</th>
                    <th className="px-4 py-2 text-center">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistered.length > 0 ? (
                    recentRegistered.map((user, i) => (
                      <tr key={i} className="border-t border-gray-900 bg-gray-800 hover:bg-gray-700">
                        <td className="px-4 py-2 text-center">{user.name}</td>
                        <td className="px-4 py-2 text-center">{user.email}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(user.date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        </td>
                        <td className="px-4 py-2 text-center">{user.ip_address}</td>
                        <td className="px-4 py-2 text-center">{user.activity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-gray-400">
                        No recent registrations
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

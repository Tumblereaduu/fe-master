import React, { useState } from "react";
import Logo from "../../assets/img/logo/Doin FX.png"; // ✅ Update with your logo path
import { Search } from "lucide-react";

export default function WithdrawalPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  const balance = 4467.0;

  const withdrawals = [
    { id: 3351, amount: 30, date: "2025-01-01 10:32:11", method: "Bank Transfer", status: "Completed" },
    { id: 3353, amount: 200, date: "2025-02-20 10:32:11", method: "USDT", status: "Rejected" },
    { id: 3353, amount: 450, date: "2025-05-03 10:32:11", method: "UPI", status: "Pending" },
    { id: 3352, amount: 1000, date: "2025-04-05 10:32:11", method: "Bank Transfer", status: "Cancelled" },
    { id: 3352, amount: 98.15, date: "2025-03-30 10:32:11", method: "USDT", status: "Completed" },
  ];

  const filteredData = withdrawals.filter(
    (w) =>
      w.id.toString().includes(search) ||
      w.date.includes(search) ||
      w.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Navbar */}
      <header className="flex items-center justify-between bg-white shadow px-6 py-3">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="DOIN FX" className="h-8" />
        </div>
        <nav className="flex items-center space-x-6 font-medium text-gray-700">
          <a href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </a>
          <a href="/trading" className="hover:text-blue-600">
            Trading
          </a>
          <a href="/orders" className="hover:text-blue-600">
            Orders
          </a>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            K
          </div>
        </nav>
      </header>

      {/* ✅ Gradient Section */}
      <section className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-10 px-6 text-center">
        <h1 className="text-2xl font-bold">WITHDRAWAL</h1>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Balance Box */}
          <div className="bg-white text-gray-800 px-10 py-6 rounded-lg shadow text-center">
            <p className="text-lg">Available Balance</p>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
            <p className="text-sm">USD</p>
          </div>

          {/* Note Box */}
          <div className="bg-white text-red-600 px-6 py-4 rounded-lg shadow max-w-md">
            <p className="font-semibold">
              Minimum Withdrawal Amount: <span className="text-black">30 $</span>
            </p>
            <p className="text-xs text-gray-600">
              Transaction will process within 24 hours for all working days.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Withdrawal Methods */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-xl font-semibold mb-6">Select Withdrawal Method:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          {["USDT", "UPI", "Cash On Hand", "Bank Transfer"].map((method) => (
            <div
              key={method}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 rounded-lg shadow cursor-pointer hover:scale-105 transition"
            >
              <p className="font-semibold">{method}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Withdrawal History */}
      <section className="px-6 pb-10">
        <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <label>Show</label>
            <select
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {[10, 25, 50, 100, "All"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border rounded-md px-2 py-1">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Withdrawal ID</th>
                <th className="px-4 py-2">Amount in USD</th>
                <th className="px-4 py-2">Date and Time</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, entries === "All" ? filteredData.length : entries).map((w, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{w.id}</td>
                  <td className="px-4 py-2">${w.amount}</td>
                  <td className="px-4 py-2">{w.date}</td>
                  <td className="px-4 py-2">{w.method}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        w.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : w.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : w.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

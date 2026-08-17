import React, { useEffect, useState, useRef } from "react";
import DashboardNavebar from "../DepositNavbar/DashboardNavebar";
import DoinDashboardSidebar from "../DoinDashboardSidebar";
import { BACKEND_API_URL } from "../../api/config";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import cal from "../../assets/img/transfer/Calendar.svg";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import NavbarForAccount from "../NavbarForAccount";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const calendarRef = useRef(null);

  // Body background sync
  useEffect(() => {
    if (isDark) {
      document.body.style.backgroundColor = '#141D22';
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [isDark]);

  let userId = user;

  if (token) {
    const payload = token.split(".")[1];
    if (payload) {
      const decodedPayload = JSON.parse(atob(payload));
      userId = decodedPayload.id;
    }
  }

  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!userId) return;

      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/withdrawal/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("🔴 WITHDRAWAL Full API Response:", data);

        setWithdrawals(data.withdraw || []);
      } catch (error) {
        console.error("Failed to fetch withdrawal:", error.response || error);
      }
    };

    fetchWithdrawals();
  }, [userId, token]);

  // Search + Show Count
  const [searchQuery, setSearchQuery] = useState("");
  const [showCount, setShowCount] = useState(10);

  const filteredData = withdrawals.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // --------------- DATE RANGE FILTER (Same as Deposit Page) --------------- //
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const filteredByDate = isDateSelected
    ? filteredData.filter((item) => {
        const itemDate = new Date(item.withdrawal_request_at);
        return (
          itemDate >= range[0].startDate &&
          itemDate <= new Date(range[0].endDate.getTime() + 24 * 60 * 60 * 1000)
        );
      })
    : filteredData;

  const handleSelect = (ranges) => {
    setIsDateSelected(true);
    setRange([ranges.selection]);
  };

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCalendar]);

  const displayedData =
    showCount === "all" ? filteredByDate : filteredByDate.slice(0, showCount);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400 text-black";
      case "rejected":
        return "bg-red-600 text-white";
      case "completed":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  // ✅ NEW: State for viewing reason/details
  const [viewReason, setViewReason] = useState({ open: false, text: "", type: "" });

  // ✅ DEBUG HELPER: Get rejection reason from multiple possible field names
  const getRejectReason = (item) => {
    return item.withdrawal_reject_reason || item.reject_reason || item.rejection_reason || item.reason || item.rejectReason || item.rejectionReason || item.deposit_reject_reason || null;
  };

  // ✅ Handle View click for both rejected and completed
  const handleViewClick = (item) => {
    if (String(item.withdrawal_status).toLowerCase() === "rejected") {
      const reason = getRejectReason(item);
      setViewReason({
        open: true,
        text: reason || "No reason provided.",
        type: "rejected"
      });
    } else if (String(item.withdrawal_status).toLowerCase() === "completed") {
      setViewReason({
        open: true,
        text: "Your withdrawal has been successfully processed and transferred to your account.",
        type: "completed"
      });
    }
  };

  // ✅ Check if View link should show
  const shouldShowView = (item) => {
    const status = String(item.withdrawal_status).toLowerCase();
    if (status === "rejected" && getRejectReason(item)) return true;
    if (status === "completed") return true;
    return false;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
      <NavbarForAccount />
      <DoinDashboardSidebar />

      <div className="mt-20 md:ml-60 lg:ml-65 xl:ml-64">
        {/* Mobile-only back icon */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`md:hidden ml-2 mt-3 inline-flex items-center justify-center rounded-full p-2 shadow-md border transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#2A3640]" : "bg-white border-gray-200"}`}
          aria-label="Go back"
        >
          <IoArrowBack size={20} className={isDark ? "text-white" : "text-gray-700"} />
        </button>

        <h1 className={`text-xl font-semibold md:border-b-2 mb-4 mt-4 p-2 md:p-6 transition-colors duration-300 ${isDark ? "text-white border-[#2A3640]" : "text-gray-900 border-gray-300"}`}>
          Withdrawal History
        </h1>

        {/* Search + Show Count Row */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center md:mt-10 px-6 gap-4">

          {/* Show Count + Date */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">

            {/* Show Count */}
            <div className="flex items-center space-x-3">
              <label className={`font-medium text-sm md:text-base transition-colors duration-300 ${isDark ? "text-[#8899A6]" : "text-gray-700"}`}>
                Show
              </label>
              <select
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
                className={`border px-3 py-2 rounded-md text-sm md:text-base transition-colors duration-300 ${isDark ? "border-[#2A3640] bg-[#1A242B] text-[#E8EDF0]" : "border-gray-400"}`}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* DATE RANGE PICKER - MATCHED FROM DEPOSIT PAGE */}
            <div className={`relative border rounded-md w-full lg:w-auto transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-[#ACACAC]"}`}>
              <div
                className={`flex justify-between items-center gap-2 px-3 py-2 text-sm md:text-base rounded-md cursor-pointer transition-colors duration-300 ${isDark ? "bg-[#1A242B] text-[#E8EDF0]" : "bg-white"}`}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <p className="truncate">
                  {format(range[0].startDate, "dd-MM-yyyy")} to{" "}
                  {format(range[0].endDate, "dd-MM-yyyy")}
                </p>
                <img src={cal} alt="calendar" className={`w-5 h-5 transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`} />
              </div>

              {showCalendar && (
                <div
                  ref={calendarRef}
                  className={`absolute left-0 mt-2 z-50 shadow-lg rounded-md transition-colors duration-300 ${isDark ? "bg-[#1A242B]" : "bg-white"}`}
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className={`flex items-center border rounded-md px-3 py-2 w-full lg:w-auto transition-colors duration-300 ${isDark ? "border-[#2A3640]" : "border-gray-400"}`}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`outline-none w-full md:w-auto text-sm md:text-base transition-colors duration-300 ${isDark ? "text-[#E8EDF0] bg-transparent" : "text-gray-700"}`}
            />
            <i className={`fa fa-search ml-2 transition-colors duration-300 ${isDark ? "text-[#8899A6]" : "text-gray-600"}`}></i>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto mt-5 md:mt-10">
          <table className="w-full text-left text-sm md:text-lg">
            <thead className={`border-b border-t text-xs md:text-base transition-colors duration-300 ${isDark ? "bg-[#1A242B] text-[#8899A6] border-[#2A3640]" : "bg-gray-100 text-gray-700 border-gray-400"}`}>
              <tr>
                <th className="py-3 text-center">Withdrawal ID</th>
                <th className="py-3 text-center">Amount(USD)</th>
                <th className="py-3 text-center">Time</th>
                <th className="py-3 text-center">Method</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-center">Details</th>
              </tr>
            </thead>

            <tbody>
              {displayedData.map((item, index) => {
                // ✅ DEBUG: Log rejected item to check what fields exist
                if (String(item.withdrawal_status).toLowerCase() === "rejected") {
                  console.log(" REJECTED WITHDRAWAL KEYS:", Object.keys(item));
                  console.log(" REJECTED WITHDRAWAL DATA:", item);
                  console.log(" REASON VALUE:", getRejectReason(item));
                }

                return (
                <tr
                  key={index}
                  className={`border-b transition-colors duration-200 ${isDark ? "border-[#2A3640] hover:bg-[#1E2830] text-[#E8EDF0] text-xs md:text-lg" : "border-gray-400 hover:bg-gray-50 text-xs md:text-lg"}`}
                >
                  <td className="py-4 text-center">{item.withdrawal_id}</td>
                  <td className="py-4 text-center">
                    {item.requested_amount_usd} USD
                  </td>
                  <td className="py-4 text-center">
                    {item.withdrawal_request_at}
                  </td>
                  <td className="py-4 text-center">{item.payment_method ? item.payment_method.toUpperCase() : "-"}</td>
                  <td className="py-4 text-center">
                    <span
                      className={`px-4 py-1 rounded-md text-[10px] md:text-xs font-semibold ${getStatusColor(
                        item.withdrawal_status
                      )}`}
                    >
                      {item.withdrawal_status}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    {shouldShowView(item) ? (
                      <span
                        onClick={() => handleViewClick(item)}
                        className={`text-sm font-medium cursor-pointer underline underline-offset-2 transition-colors duration-200 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
                      >
                        View
                      </span>
                    ) : (
                      <span className={`text-sm ${isDark ? "text-[#6B7B88]" : "text-gray-400"}`}>-</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* ✅ NEW: Rejection / Completed Reason Popup */}
      {viewReason.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setViewReason({ open: false, text: "", type: "" })}>
          <div
            className={`rounded-xl p-6 w-[90vw] max-w-md shadow-2xl transition-colors duration-300 ${isDark ? "bg-[#1A242B] border border-[#2A3640]" : "bg-white border border-gray-200"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${isDark ? "border-[#2A3640]" : "border-gray-200"}`}>
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                {viewReason.type === "rejected" ? "Rejection Reason" : "Withdrawal Details"}
              </h3>
              <button
                onClick={() => setViewReason({ open: false, text: "", type: "" })}
                className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"} transition`}
              >
                <X size={20} />
              </button>
            </div>
            <div className={`p-4 rounded-lg break-words whitespace-pre-wrap text-sm leading-relaxed ${
              viewReason.type === "rejected"
                ? isDark
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-700 border border-red-200"
                : isDark
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {viewReason.text}
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewReason({ open: false, text: "", type: "" })}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${isDark ? "bg-[#2A3640] text-white hover:bg-[#34404D]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;

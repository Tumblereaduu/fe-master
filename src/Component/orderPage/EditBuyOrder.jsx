import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, Slide, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";

const EditBuyOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    lot_size: "",
    entry_price: "",
    stop_loss: "",
    sl_pnl: "",
    entry_time: "",
    exit_time: "",
    exit_price: "",
    order_status: "",
    take_profit: "",
    tp_pnl: "",
    pnl: "",
  });

  // Parse any date format (ISO, MySQL, DD/MM/YYYY) into a Date object
  const parseAnyDate = (dateStr) => {
    if (!dateStr) return null;
    // Try direct parse (handles ISO like "2026-06-19T05:06:24.000Z")
    let d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    // Try MySQL format "2026-06-19 05:06:24"
    d = new Date(dateStr.replace(" ", "T"));
    if (!isNaN(d.getTime())) return d;
    // Try display format "19/06/2026, 05:06:24"
    const parts = dateStr.split(/[\/,\s:]+/);
    if (parts.length >= 3) {
      d = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0]),
        parseInt(parts[3]) || 0,
        parseInt(parts[4]) || 0,
        parseInt(parts[5]) || 0
      );
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  // Convert to datetime-local input format: "YYYY-MM-DDTHH:MM:SS" (UTC)
  const toDatetimeLocal = (dateStr) => {
    const d = parseAnyDate(dateStr);
    if (!d) return "";
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // Convert datetime-local value "YYYY-MM-DDTHH:MM:SS" to MySQL format "YYYY-MM-DD HH:MM:SS"
  const toMySQLDatetime = (dateStr) => {
    if (!dateStr) return "";
    // Already in MySQL format
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    // Convert from datetime-local format (just replace T with space)
    const converted = dateStr.replace("T", " ");
    // If browser stripped seconds (no step="1"), append :00 so MySQL accepts it
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(converted)) {
      return converted + ":00";
    }
    return converted;
  };

  // Get status color classes
  const getStatusColor = (status) => {
    if (!status) return "text-white/70 bg-white/10 border-white/20";
    const s = status.toLowerCase();
    if (
      s === "completed" ||
      s === "closed" ||
      s === "profit" ||
      s === "won" ||
      s === "tp_hit"
    )
      return "text-green-400 bg-green-500/20 border-green-500/30";
    if (
      s === "cancelled" ||
      s === "loss" ||
      s === "lost" ||
      s === "sl_hit"
    )
      return "text-red-400 bg-red-500/20 border-red-500/30";
    if (
      s === "pending" ||
      s === "open" ||
      s === "running" ||
      s === "active"
    )
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-white/70 bg-white/10 border-white/20";
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/order/${id}`);
        const data = response.data.data;
        setOrder(data);

        setFormData({
          lot_size: data.lot_size || "",
          entry_price: data.entry_price || "",
          stop_loss: data.stop_loss || "",
          take_profit: data.take_profit || "",
          sl_pnl: data.sl_pnl || "",
          tp_pnl: data.tp_pnl || "",
          // KEY FIX: Convert to datetime-local format for the input (UTC)
          entry_time: toDatetimeLocal(data.entry_time),
          exit_time: toDatetimeLocal(data.exit_time),
          order_status: data.order_status || "",
          exit_price: data.exit_price || "",
          pnl: data.pnl || "",
        });

        // Fetch user info separately
        if (data.user_id) {
          try {
            const userRes = await axios.get(
              `${BACKEND_API_URL}/auth/user/${data.user_id}`
            );
            if (userRes.data.status === "success") {
              setUserInfo(userRes.data.data);
            }
          } catch (userErr) {
            console.error("Error fetching user info:", userErr);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    // KEY FIX: Convert datetime-local values to MySQL format before sending
    const submitData = {
      ...formData,
      entry_time: toMySQLDatetime(formData.entry_time),
      exit_time: toMySQLDatetime(formData.exit_time),
    };

    try {
      await axios.put(
        `${BACKEND_API_URL}/order/order/update/${id}`,
        submitData
      );
      toast.success("Order updated successfully!");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order!");
      setShowConfirm(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirm(false);
  };

  if (loading)
    return <AdminLayout><div className="text-white text-center mt-20">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        transition={Slide}
      />

      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Update
              </h3>
              <p className="text-white/60 text-sm">
                Are you sure you want to save changes for Order{" "}
                <span className="text-cyan-400 font-semibold">
                  {order.trade_id}
                </span>
                ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSave}
                className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/80 font-medium hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-medium shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-white/90">
          Update Order - {order.trade_id}
        </h2>

        <div className="max-w-5xl mx-auto flex gap-6 items-start">
          {/* LEFT: Form Card */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {[
                { label: "Lot Size", name: "lot_size" },
                { label: "Entry Price", name: "entry_price" },
                { label: "Stop Loss", name: "stop_loss" },
                { label: "Take Profit", name: "take_profit" },
                { label: "Stop Loss PnL", name: "sl_pnl" },
                { label: "Take Profit PnL", name: "tp_pnl" },
                {
                  label: "Entry Time (UTC)",
                  name: "entry_time",
                  isDate: true,
                },
                {
                  label: "Exit Time (UTC)",
                  name: "exit_time",
                  isDate: true,
                },
                {
                  label: "Order Status",
                  name: "order_status",
                  isStatus: true,
                },
                { label: "Exit Price", name: "exit_price" },
                { label: "Profit (PnL)", name: "pnl" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-white/80 font-medium mb-2">
                    {field.label}
                  </label>
                  {field.isDate ? (
                    <input
                      type="datetime-local"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      step="1"
                      className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50 [color-scheme:dark]"
                    />
                  ) : field.isStatus ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50 ${getStatusColor(
                        formData[field.name]
                      )}`}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50"
                    />
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: User Info Card */}
          <div className="flex-shrink-0 w-[270px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-base font-bold text-white shadow-md flex-shrink-0">
                {userInfo.username
                  ? userInfo.username.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  {userInfo.username || "N/A"}
                </p>
                <p className="text-white/40 text-[11px]">User</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div>
                <p className="text-white/40 text-[11px] mb-0.5">User ID</p>
                <p className="text-cyan-400 font-semibold text-sm">
                  {order.user_id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-[11px] mb-0.5">Email</p>
                <p className="text-white/80 font-medium text-sm truncate">
                  {userInfo.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBuyOrder;

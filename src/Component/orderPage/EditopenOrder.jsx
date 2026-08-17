import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css"
import { toast,Slide, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import { useLivePrice } from "../hooks/tradePage/useLivePriceContext";

const EditopenOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    lot_size: "",
    entry_price: "",
    Symbol: "",
    stop_loss: "",
    take_profit: "",
    sl_pnl: "",
    tp_pnl: "",
    entry_time: "",
    exit_price: "",
    exit_time: "",
    pnl: "",
    order_status:"",
    closed_by:""
  });

  const formatUTC = (isoString)=>{
    if(!isoString) return "";
    return isoString.replace("T", " ").replace("Z", " ")
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/order/${id}`);
        const data = response.data.data;
        setOrder(data);
        setFormData({
          lot_size: data.lot_size || "",
          type: data.type || "",
          Symbol: data.symbol || "",
          entry_price: data.entry_price || "",
          stop_loss: data.stop_loss || "",
          take_profit: data.take_profit || "",
          sl_pnl: data.sl_pnl || "",
          tp_pnl: data.tp_pnl || "",
          entry_time:formatUTC(data.entry_time) || "",
          exit_time:formatUTC(data.exit_time) || "",
          exit_price: data.exit_price || "",
          pnl: data.pnl || "",
        });
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_API_URL}/order/order/update/${id}`, formData);
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order!");
    }
  };
  const { livePrices } = useLivePrice();

const cleanSymbol = formData.Symbol
  ?.toUpperCase()
  ?.replace(/OANDA:/g, "")
  ?.replace(/[\/_]/g, "")
  ?.trim();

const currentPrice = livePrices?.[cleanSymbol] ?? null;

const B_PAIR = ["US30USD", "BTCUSD", "ETHUSD"];

    let contractSize = 100000;
    if (cleanSymbol === "XAUUSD" || cleanSymbol === "XPDUSD") contractSize = 100;
    if (cleanSymbol === "XCUUSD") contractSize = 2300;
    if (cleanSymbol === "XAGUSD") contractSize = 5000;
    if (B_PAIR.includes(cleanSymbol)) contractSize = 1;

// Inputs from your form / order
const entryPrice = Number(formData.entry_price); // your order price
const lotSize = Number(formData.lot_size); // lot size
const orderType = formData.type; // "BUY" or "SELL"

let pnl = 0;

if (currentPrice && entryPrice && lotSize) {
  if (orderType === "BUY") {
    pnl = (currentPrice - entryPrice) * lotSize * contractSize;
  } else if (orderType === "SELL") {
    pnl = (entryPrice - currentPrice) * lotSize * contractSize;
  }
}

// Optional: round to 2 decimals
pnl = Number(pnl.toFixed(2));

console.log("Symbol:", cleanSymbol);
console.log("Price:", currentPrice);
console.log("PnL:", pnl);


  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />

      <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 mt-20 text-white/90">
          Update Order - {order.trade_id}
        </h2>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-white/20 space-y-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "Lot Size", name: "lot_size" },
              { label: "Order Type", name: "type" },
              { label: "Entry Price", name: "entry_price" },
              { label: "Stop Loss", name: "stop_loss" },
              { label: "Take Profit", name: "take_profit" },
              { label: "Stop Loss PnL", name: "sl_pnl" },
              { label: "Take Profit PnL", name: "tp_pnl" },
              { label: "Exit Price", name: "exit_price" },
              { label: "Entry Time", name: "entry_time" },
              { label: "Exit Time", name: "exit_time" },
              { label: "Order Status", name: "order_status" },
              { label: "Closed BY", name: "closed_by" },
              { label: "Profit (PnL)", name: "pnl" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-white/80 font-medium mb-2">
                  {field.label}
                </label>
                {
                  field.name === 'type' ? (
                    <select name={field.name} value={formData[field.name]}  onChange={handleChange} className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50">
                    <option value="" className="bg-gray-800">  Select Type </option>
                    <option value="BUY" className="bg-gray-800">BUY</option>
                    <option value="SELL" className="bg-gray-800">SELL</option>
                    </select>
                  ) :
                  
                   field.name === 'order_status' ? (
                    <select name={field.name} value={formData[field.name]}  onChange={handleChange} className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50">
                    <option value="" className="bg-gray-800">  Select Type </option>
                    <option value="active" className="bg-gray-800">Active</option>
                    <option value="completed" className="bg-gray-800">completed</option>
                    <option value="cancelled" className="bg-gray-800">Cancelled</option>
                    <option value="pending_close" className="bg-gray-800">Pending Close</option>

                    </select>
                  ) : field.name === 'closed_by' ? (
                    <select name={field.name} value={formData[field.name]}  onChange={handleChange} className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50">
                    <option value="" className="bg-gray-800">  Select Type </option>
                    <option value="user" className="bg-gray-800">User</option>
                    <option value="square_off" className="bg-gray-800">AutoSquare Off</option>
                    <option value="stop_loss" className="bg-gray-800">Stop Loss</option>
                    <option value="take_profit" className="bg-gray-800">Take Profit</option>

                    </select>
                  ) 
                  : (
                  <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50"
                />
                  )
                }            
              </div>
            ))}

          {/* Price and PnL Display */}
          <div className="bg-[#0f172a] px-4 py-3 rounded-xl shadow-md flex items-center justify-between">
            
            {/* Left: Symbol */}
            <div>
              <h1 className="text-lg font-semibold text-white">
                {cleanSymbol}
              </h1>
              <p className="text-sm text-gray-400">Live Price</p>
            </div>

            {/* Center: Price */}
            <div className="text-center">
              <p className="text-xl font-bold text-white">
                {currentPrice?.toFixed(5) || "--"}
              </p>
            </div>

            {/* Right: PnL */}
            <div className="text-right">
              <p className="text-sm text-gray-400">PnL</p>
              <p
                className={`text-lg font-bold ${
                  pnl > 0
                    ? "text-green-400"
                    : pnl < 0
                    ? "text-red-400"
                    : "text-gray-300"
                }`}
              >
                {pnl > 0 ? "+" : ""}
                {pnl?.toFixed(2)}
              </p>
            </div>

          </div>
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
      </div>
    </AdminLayout>
  );
};

export default EditopenOrder;

import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, Slide, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";

const DemoSellEdit = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    lot_size: "",
    entry_price: "",
    stop_loss: "",
    entry_time: "",
    exit_time: "",
    exit_price: "",
    take_profit: "",
    pnl: "",
  });

  // Helper to format ISO string to local date/time
const formatUTC = (isoString)=>{
   if(!isoString) return "";
    return isoString.replace("T", " ").replace("Z", " ")  
}


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/demo/order/${id}`);
        const data = response.data.data;
        setOrder(data);

        setFormData({
          lot_size: data.lot_size || "",
          entry_price: data.entry_price || "",
          stop_loss: data.stop_loss || "",
          take_profit: data.take_profit || "",
          entry_time: formatUTC(data.entry_time),
          exit_time: formatUTC(data.exit_time),
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_API_URL}/demo/order/order/update/${id}`, formData);
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order!");
    }
  };

  if (loading) return <AdminLayout><div className="text-white text-center mt-20">Loading...</div></AdminLayout>;

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

      <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-white/90">
          Update Order - {order.trade_id}
        </h2>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl p-6 md:p-8 border border-white/20">
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {[
              { label: "Lot Size", name: "lot_size" },
              { label: "Entry Price", name: "entry_price" },
              { label: "Stop Loss", name: "stop_loss" },
              { label: "Target Price", name: "take_profit" },
              { label: "Entry Time", name: "entry_time" },
              { label: "Exit Time", name: "exit_time" },
              { label: "Exit Price", name: "exit_price" },
              { label: "Profit (PnL)", name: "pnl" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-white/80 font-medium mb-2 text-sm md:text-base">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-400 outline-none placeholder-white/50"
                />
              </div>
            ))}

            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-6 md:px-8 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200 text-sm md:text-base"
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

export default DemoSellEdit;

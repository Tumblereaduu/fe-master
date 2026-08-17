import React, { useState } from "react";
import axios from "axios";
import { Slide,toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";

const AddSpread = () => {

  const [symbol, setSymbol] = useState("");
  const [spread, setSpread] = useState("");
  const [commission, setCommission] = useState("");
  const [category, setCategory] = useState([]);

  const categories = ["Most Traded","Majors","Minors","Forex","Metals","Crypto","Indices","Energy","Stocks","All",];

  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (!symbol || !spread || !commission || category.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${BACKEND_API_URL}/spread/addspread`, {
        symbol,
        spread,
        ib_commission_percentage: commission,
        category,
      });

      toast.success("Spread added successfully!");
      setSymbol("");
      setSpread("");
      setCommission("");
      setCategory([]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 mt-12">
        <div className="bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-lg border border-gray-700">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 text-center text-white/90">Add Spread</h1>

          {/* Symbol Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white/70">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700/50 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              placeholder="Enter symbol"
            />
          </div>

          {/* Spread Field */}
          <div className="mb-6"> 
            <label className="block text-sm font-medium mb-2 text-white/70">Spread (in Pips)</label>
            <input
              type="text"
              value={spread}
              onChange={(e)=> setSpread(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700/50 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              placeholder="Enter spread value in pips"
            />
          </div> 
  
          {/* commission Field */}
          <div className="mb-6"> 
            <label className="block text-sm font-medium mb-2 text-white/70">IB Commission (%)</label>
            <input
              type="text"
              value={commission}
              onChange={(e)=> setCommission(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700/50 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              placeholder="Enter IB commission value in %"
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white/70">Category</label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {categories.map((c, i) => {
                const isChecked = category.includes(c);

                return (
                  <label
                    key={i}
                    className={`flex items-center gap-2 cursor-pointer p-2 md:p-3 rounded-lg border text-xs md:text-sm
                      ${
                        isChecked
                          ? "border-blue-400 bg-blue-500/20"
                          : "border-gray-600 bg-gray-700/50"
                      } transition`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(c)}
                      className="hidden"
                    />

                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center
                        ${
                          isChecked
                            ? "border-blue-400"
                            : "border-gray-400"
                        }`}
                    >
                      {isChecked && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      )}
                    </span>

                    <span>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition text-sm md:text-base" onClick={handleSubmit}>
            Submit
          </button>
        </div>
         {/* Background Glow Orbs  */}
        {/* <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}
      </div>
    </AdminLayout>
  );
};

export default AddSpread;

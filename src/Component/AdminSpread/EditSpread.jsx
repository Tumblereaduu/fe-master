import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Slide, ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { BACKEND_API_URL } from '../../api/config';
import AdminLayout from "../Admin/AdminLayout";


const EditSpread = () => {

  const {id} = useParams();

  const [symbol, setSymbol] = useState("");
  const [spread, setSpread] = useState("");
  const [status, setStatus] = useState("active");
  const [category, setCategory] = useState([]);
  const [ibCommission, setIbCommission] = useState("")

  const categories = [
    "Most Traded",
    "Majors",
    "Minors",
    "Forex",
    "Metals",
    "Crypto",
    "Indices",
    "Energy",
    "Stocks",
    "All",
  ];

  // Fetch spread
  const fetchSpread = async () => {
    try {
      const res = await axios.get(`${BACKEND_API_URL}/spread/getspread/${id}`);
      const data = res.data.data.flat()[0];

      setSymbol(data.symbol);
      setSpread(data.spread);
      setStatus(data.status);
      setIbCommission(data.ib_commission_percentage)

      // Parse JSON category
      let parsedCategory = [];
      try {
        parsedCategory = Array.isArray(data.category)
          ? data.category
          : JSON.parse(data.category);
      } catch {
        parsedCategory = [];
      }

      setCategory(parsedCategory);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch spread");
    }
  };

  useEffect(() => {
    fetchSpread();
  }, [id]);

  // Toggle category (MULTI)
  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  // Update
  const handleUpdate = async () => {
    if (!symbol || !spread || category.length === 0) {
      toast.error("All fields required");
      return;
    }

    try {
      const res = await axios.put(
        `${BACKEND_API_URL}/spread/updatespread/${id}`,
        {
          symbol,
          spread,
          status,
          category,
          ibCommission
        }
      );

      toast.success(res.data.message || "Spread updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 mt-12">
        <div className="bg-gray-800/90 shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-lg border border-gray-700">
          <h1 className="text-xl md:text-2xl font-semibold mb-5 text-center">Edit Spread : {symbol}</h1>

          {/* Symbol */}
            <div className='flex flex-col gap-3'>
                <h1 className="text-sm md:text-base"> Symbol: </h1>
                <input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full mb-4 p-2 md:p-3 rounded bg-gray-700 border border-gray-600 text-sm" />
            </div> 

          {/* Spread */}
          <div className='flex flex-col gap-3'>
            <h1 className="text-sm md:text-base">Spread:</h1>
            <input value={spread} onChange={(e) => setSpread(e.target.value)} className="w-full mb-4 p-2 md:p-3 rounded bg-gray-700 border border-gray-600 text-sm"/>
          </div>

            {/* IB Commission */}
            <div className='flex flex-col gap-2'>
              <h1 className="text-sm md:text-base">IB Commission (%) </h1>
              <input value={ibCommission} onChange={(e) => setIbCommission(e.target.value)} className="w-full mb-4 p-2 md:p-3 rounded bg-gray-700 border border-gray-600 text-sm"/>
            </div>
           

          {/* Status */}
          <div className='flex flex-col gap-2'>
            <h1 className="text-sm md:text-base">Status:</h1>
          <select value={status}  onChange={(e) => setStatus(e.target.value)} className="w-full mb-6 p-2 md:p-3 rounded bg-gray-700 border border-gray-600 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          </div>   

          {/* Category (MULTI) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6">
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
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(c)}
                    className="hidden"
                  />

                  <span className="w-4 h-4 rounded border flex items-center justify-center">
                    {isChecked && (
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </span>

                  <span>{c}</span>
                </label>
              );
            })}
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 text-sm md:text-base"
          >
            Update
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditSpread;

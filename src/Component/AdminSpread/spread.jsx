import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";
import AdminLayout from "../Admin/AdminLayout";

const Spread = () => {

  const [spread, setSpread] = useState([]);
  const [searchTerm,SetSearchTerm] = useState("");
  const [currentPage,setCurrentPage] = useState(1);
  const [itemsPerPage,setItemsPerPage] = useState(10);  
  const navigate = useNavigate();

  const fetchSpreads = async () => {
    try {
      const res = await axios.get(`${BACKEND_API_URL}/spread/getspread`);
      setSpread(res.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSpreads()
  }, [])

  // Search Function

  const filterSpreads = spread.filter((item)=> 
  item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) 
 
  );

  // pagination

  const totalPages = Math.ceil(filterSpreads.length/itemsPerPage);
  const startIndex = (currentPage-1)* itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSpreads = filterSpreads.slice(startIndex, endIndex);

  const handleNextPage = ()=>{
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }
    const handlePrevPage = ()=>{
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide} />
      {/* Main Content */}
      <div className="flex-1 p-5 mt-12 md:ml-0">
        <h1 className="text-2xl font-bold mb-6 text-white/90 text-center">Spread List</h1>

      {/* Search function */}

    <div className="flex justify-between items-center mb-4">
       <input type="text" placeholder="Search here" value={searchTerm} onChange={(e)=> {SetSearchTerm(e.target.value); setCurrentPage(1)}}  
       className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"/>
            <select value={itemsPerPage} onChange={(e)=> {setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }} 
            className="px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
            </select>
      </div>


        <div className="bg-gray-800/70 p-5 rounded-xl shadow-md overflow-x-auto max-w-full border border-gray-700">
          <table className="min-w-full border border-gray-600 text-white text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Spread</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">IB Commission</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Created At</th>
                <th>Action</th>
              </tr>
            </thead>

              <tbody>       
              {paginatedSpreads.length > 0 ? (
                paginatedSpreads.map((item, i) => (
                  <tr key={i} className="text-center border-t border-gray-700">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.symbol}</td>
                    <td className="px-4 py-2">{item.spread}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">{item.ib_commission_percentage || 0}%</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => navigate(`${adminRoutes}view_spread/${item.id}`)}
                        className="bg-blue-400 px-2 py-1 rounded-xl cursor-pointer hover:bg-blue-500 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No spreads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

 {/* Pagination Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Previous
          </button>
          <span className="flex items-center px-2 text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>

        </div>
         {/* Optional Background Gradient Orbs */}
        {/* <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}
      </div>
    </AdminLayout>
  );
};

export default Spread;

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../Admin/AdminLayout";
import { BACKEND_API_URL } from "../../../api/config";

const AdminAllCommission = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ibHistory, setIbHistory] = useState([])

  useEffect(() => {
    const commission = async () => {
      try {
         const response = await axios.get(`${BACKEND_API_URL}/ib/all/commission?page=${currentPage}&limit=${rowsPerPage}`)
         setIbHistory(response.data.data || [])
       } catch (error) {
        console.log("Commission error while fetching", error)
       }
    }
    commission()
  }, [currentPage, rowsPerPage])

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // reset page when searching
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-3 sm:p-4 md:p-5 w-full">
        {/*  show logged-in admin name */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-extrabold text-white/90 border-b-2 border-cyan-400 inline-block pb-2 mt-12">
            IB COMMISSION HISTORY
          </h1>
        </div>

        {/* Search & Rows Per Page */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-64 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none"
          />

          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(e.target.value === "All" ? "All" : Number(e.target.value)); setCurrentPage(1); }}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-white/20 text-white">
            <thead className="bg-white/10 backdrop-blur border border-white/20 text-center" >
              <tr>
                <th className="px-4 py-2 border">S.NO</th>
                <th className="px-4 py-2 border">IB ID</th>
                <th className="px-4 py-2 border">Trade ID</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Commission Amount</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>

            <tbody>
              {
                ibHistory.length > 0 ? (
                  ibHistory.map((ib,index) =>
                   (
                      <tr key={ib.id} className="text-center">
                      <td className="px-4 py-3 border-b border-white/10">{index+1}</td>
                      <td className="px-4 py-3 border-b border-white/10">{ib.ib_id}</td>
                      <td className="px-4 py-3 border-b border-white/10">{ib.trade_id}</td>
                      <td className="px-4 py-3 border-b border-white/10">{ib.user_id}</td>
                      <td className="px-4 py-3 border-b border-white/10">{ib.commission_amount}</td>
                      <td className="px-4 py-3 border-b border-white/10">{new Date (ib.created_at).toLocaleString()}</td>
                    </tr>
                    )         
                  )
                ) : (
                  <tr className="text-center py-6 text-gray-500">
                   <td colSpan="5" className="text-center py-6 text-gray-500"> No IB commission Histroy Found</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
       
      <div className="flex justify-center items-center gap-4 mt-6">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-white">Page {currentPage}</span>

  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={ibHistory.length < rowsPerPage}
    className="px-4 py-2 bg-cyan-600 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
      </div>
    </AdminLayout>
  );
};

export default AdminAllCommission;

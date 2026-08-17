import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../api/config";
import toast from "react-hot-toast";
import { adminRoutes } from "../../App";

const Alluser = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/auth/all-users`);
                const data = response.data;

                if (data.status === "success") {
                    setUsers(data.data);
                } else {
                    console.error("Failed to fetch data", data.message);
                }
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.id.toString().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) 
            // ||
            // (user.mobile_number || "").includes(searchTerm) ||
            // (user.gender || "").toLowerCase().includes(searchTerm.toLowerCase())||
            // (user.state || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            // (user.country || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // pagination 

    const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredUsers.length/itemsPerPage);
    const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage === "all" ? filteredUsers.length : startIndex + itemsPerPage;
    const paginatedUsers = itemsPerPage === "all" ? filteredUsers : filteredUsers.slice(startIndex, endIndex);

    if (loading)
        return (
            <AdminLayout>
                <p className="text-center mt-10 text-gray-400">Loading users...</p>
            </AdminLayout>
        );

    return (
        <AdminLayout>
            <div className="flex-1 px-2 sm:px-4 md:px-5 py-10 relative z-10">
                <h3 className="text-3xl font-bold text-center mb-5 mt-10 text-white/90">All Users</h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between mb-4">
    
    {/* Items Per Page Dropdown */}
    <select
        value={itemsPerPage}
        onChange={(e) => {
            setItemsPerPage(e.target.value === "all" ? "all" : Number(e.target.value));
            setCurrentPage(1);
        }}
        className="px-3 py-2 bg-gray-800 border text-white rounded-lg text-sm"
    >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value="all">All</option>
    </select>

    {/* Search Input */}
    <input
        type="text"
        placeholder="Search by ID, Email, or Mobile..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 outline-none w-full sm:w-64 transition-all duration-200 text-sm"
    />
            </div>

        

                {/* Table */}
                <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-2 sm:p-4 border border-white/20">
                    <table className="min-w-full text-left border border-white/10 rounded-lg overflow-hidden text-xs sm:text-sm">
                        <thead className="bg-white/10 text-white/80">
                            <tr>
                                <th className="px-4 py-3 text-center">S.No</th>
                                <th className="px-4 py-3 text-center">ID</th>
                                <th className="px-4 py-3 text-center">Email</th>
                                <th className="px-4 py-3 text-center">Whatsapp No</th>
                                <th className="px-4 py-3 text-center">KYC Status</th>
                                <th className="px-4 py-3 text-center">Account Status</th>
                                <th className="px-4 py-3 text-center">Date & Time</th>
                                <th className="px-4 py-3 text-center">IB Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-white/10 hover:bg-white/5 transition"
                                    >
                                        <td className="px-4 py-3 text-center">{index + 1}</td>
                                        <td
                                            className="px-4 py-3 text-cyan-400 font-medium cursor-pointer text-center"
                                            onClick={() => navigate(`${adminRoutes}userdetails/${user.id}`)}
                                        >
                                            {user.id}
                                        </td>
                                        <td className={`px-4 py-3 text-center ${user.is_lp_added === 0 ? "text-red-600" : "text-white"}`}>{user.email}</td>
                                        <td className="px-4 py-3 text-center">{user.whatsapp_number}</td>
                                        <td
                                            className={`px-4 py-3 font-semibold text-center ${user.photo_verification_status === "approved"
                                                    ? "text-green-400"
                                                    : user.photo_verification_status === "rejected"
                                                        ? "text-red-400"
                                                        : "text-yellow-400"
                                                }`}
                                        >
                                            {user.photo_verification_status || "Not Uploaded"}
                                        </td>
                                        <td className={`px-4 py-3 text-center ${user.user_status === "active" ? "text-white" : "text-red-600"}`}>{user.user_status}</td>
                                        <td className="px-4 py-3 text-center">
                                            {new Date(user.account_created_at).toLocaleString(
                                                "en-IN",
                                                { dateStyle: "medium", timeStyle: "short" }
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 text-center ${user.ib_status === "active" ? "text-white" : "text-red-600"}`}>{user.ib_status}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                                                onClick={() => window.open(`${adminRoutes}user/${user.id}`,'_blank')}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-6 text-white/50">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
 
                  <div className="flex justify-center items-center mt-4">
    {/* Pagination Buttons */}
  
{itemsPerPage !== "all" && totalPages > 1 && (
  <div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      « First
    </button>

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      ‹ Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(
        (page) =>
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 2 && page <= currentPage + 2)
      )
      .map((page, index, array) => {
        const prev = array[index - 1];
        const showDots = prev && page - prev > 1;
        return (
          <React.Fragment key={page}>
            {showDots && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? "bg-cyan-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next ›
    </button>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(totalPages)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Last »
    </button>

    {/* Go To Page */}
    <div className="flex items-center space-x-2 ml-4 ">
      <input
        type="text"
        min="1"
        max={totalPages}
        placeholder="Go to..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const page = Number(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
              e.target.value = "";
            } else {
              toast.error(`Enter valid page (1 - ${totalPages})`);
            }
          }
        }}
        className="w-20 border rounded px-2 py-1 text-center"
      />
      <span className="text-gray-300 text-sm">/ {totalPages}</span>
    </div>
  </div>
)}

                  </div>

                </div>
            </div>

            {/* </div> */}
        </AdminLayout>
    );
};

export default Alluser;

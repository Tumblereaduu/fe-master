import React, { useEffect, useState } from "react";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterAdmins } from "../../../services/masterApi";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import AdminTable from "./components/AdminTable";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMasterAdmins();
      console.log("API Response:", response);
      if (response.status === "success") {
         setAdmins(response.data.admins);
      } else {
        setError(response.message || "Failed to fetch admins");
        toast.error(response.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Full Error:", err);
      console.error("Response:", err.response);
      console.error("Response Data:", err.response?.data);

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error fetching admins";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter admins based on search
  const adminList = Array.isArray(admins) ? admins : [];

  const filteredAdmins = adminList.filter((admin) =>
    Object.values(admin).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination calculations
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === "all" ? filteredAdmins.length : startIndex + itemsPerPage;
  const paginatedAdmins = itemsPerPage === "all" ? filteredAdmins : filteredAdmins.slice(startIndex, endIndex);

  if (loading) {
    return (
      <MasterLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading admins...</p>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Admin Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage administrators across all clients
            </p>
          </div>
          <button
            onClick={() => navigate("/master/admins/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Admin
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between mb-4">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(e.target.value === "all" ? "all" : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value="all">All</option>
          </select>

          <div className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 w-full sm:w-64">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error Loading Admins</p>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={fetchAdmins}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && paginatedAdmins.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <p className="text-gray-400 mb-4">
              {searchTerm ? "No admins found matching your search." : "No admins found."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/master/admins/create")}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Create the first admin
              </button>
            )}
          </div>
        )}

        {/* Admins Table */}
        {paginatedAdmins.length > 0 && (
          <>
            <AdminTable admins={paginatedAdmins} onRefresh={fetchAdmins} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages} ({filteredAdmins.length} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MasterLayout>
  );
};

export default AdminsPage;

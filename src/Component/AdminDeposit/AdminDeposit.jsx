import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";

// Helper to get current admin info from localStorage
const getAdminInfo = () => {
  try {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      return { admin_id: payload.id || null, admin_name: payload.name || payload.admin_name || payload.username || null };
    }
  } catch (e) {}
  return { admin_id: null, admin_name: null };
};

const AdminDeposit = () => {
  const [adminDeposit, setAdminDeposit] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/deposit/list/all`
        );
        if (Array.isArray(data)) {
          setAdminDeposit(data);
          setFilteredDeposits(data);
        } else {
          toast.error("Invalid data format from server");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deposits");
        toast.error("Error fetching deposits");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [location.key]);

  //  Search filter (only by Deposit ID)
  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      // page is scrollable if total page height > viewport height + threshold
      const isScrollable = scrollHeight > clientHeight + 100;
      setShowScrollBtn(isScrollable);

      // if there's more to scroll (not near bottom) show "down", else show "up"
      if (scrollTop < scrollHeight - clientHeight - 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
    };

    // listen to actual scrolling
    window.addEventListener("scroll", checkScroll);
    // run once immediately when component mounts or dependencies change
    checkScroll();

    return () => window.removeEventListener("scroll", checkScroll);
    // IMPORTANT: use your real state variable names here
  }, [adminDeposit, itemsPerPage, currentPage, filteredDeposits]);

  // scroll effect 

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = window.innerHeight;

      // show button only if content is scrollable
      const isScrollable = scrollHeight > clientHeight + 100;
      setShowScrollBtn(isScrollable);

      // determine scroll direction
      if (scrollTop < scrollHeight - clientHeight - 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
    };

    // Listen for scroll
    window.addEventListener("scroll", checkScroll);

    // Check immediately when data or pagination changes
    checkScroll();

    return () => window.removeEventListener("scroll", checkScroll);
  }, [adminDeposit]);


  const copyTableData = () => {
    if (!paginatedDeposits || paginatedDeposits.length === 0) {
      alert("No deposit data available to copy!");
      return;
    }

    // Map only the visible (paginated) data
    const rows = paginatedDeposits.map(dep => [
      dep.deposit_id,
      dep.payment_method,
      dep.requested_amount_usd,
      dep.transfer_amount_usd,
      dep.currency_name,
      new Date(dep.deposit_request_at).toLocaleString(),
      dep.deposit_status
    ]);

    // Join into a tab-separated, newline-separated text
    const tableString = rows.map(r => r.join("\t")).join("\n");

    // Copy to clipboard
    navigator.clipboard.writeText(tableString)
      .then(() => {
        toast.success(" Visible table data copied!", { autoClose: 1500 });
      })
      .catch(err => {
        console.error("Copy failed:", err);
        toast.error(" Failed to copy data.");
      });
  };

  useEffect(() => {
  if (!searchTerm) {
    setFilteredDeposits(adminDeposit);
    setCurrentPage(1);
    return;
  }

  const lowerSearch = searchTerm.toLowerCase();

  const filtered = adminDeposit.filter(dep => dep.deposit_id?.toString().includes(lowerSearch) || dep.user_id?.toString().includes(lowerSearch) || dep.username?.toLowerCase().includes(lowerSearch) || dep.email?.toLowerCase().includes(lowerSearch));

  setFilteredDeposits(filtered);
  setCurrentPage(1);
}, [searchTerm, adminDeposit]);



  //  Pagination
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredDeposits.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all"
      ? filteredDeposits.length
      : startIndex + itemsPerPage;
  const paginatedDeposits =
    itemsPerPage === "all"
      ? filteredDeposits
      : filteredDeposits.slice(startIndex, endIndex);

  // Helper component for Action Taken By column
  const ActionTakenByCell = ({ status, adminName, actionTime }) => {
    if (status === "pending" || !status) {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            ⏳ Pending
          </span>
          <span className="text-gray-500 text-[10px]">No action yet</span>
        </div>
      );
    }

    const isApproved = status === "completed";
    const isRejected = status === "rejected";

    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            isApproved
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : isRejected
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          }`}
        >
          {isApproved ? "✅ Approved" : isRejected ? "❌ Rejected" : "⏳ Pending"}
        </span>
        {adminName ? (
          <span className="text-cyan-300 text-[11px] font-semibold">
            By: {adminName}
          </span>
        ) : (
          <span className="text-gray-500 text-[10px]">By: —</span>
        )}
        {actionTime ? (
          <span className="text-white/40 text-[10px]">
            {new Date(actionTime).toLocaleString()}
          </span>
        ) : null}
      </div>
    );
  };

  if (loading)
    return <AdminLayout><p className="text-center mt-10 text-gray-600">Loading deposits...</p></AdminLayout>;
  if (error)
    return <AdminLayout><p className="text-center mt-10 text-red-600">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

        {/* Page Content */}
        <main className="flex-1 p-2 sm:p-3 md:p-5 bg-transparent">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white/90 mb-4 sm:mb-6 md:mb-10 text-center">
            Admin Deposit Management 
          </h1>

          {/* Search + Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center mb-2 sm:mb-3 bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-2xl shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="bg-white/10 border border-white/20 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto"
              >
                <option className="text-black" value={10}>10</option>
                <option className="text-black"value={20}>20</option>
                <option className="text-black"value={50}>50</option>
                <option className="text-black"value="all">All</option>
              </select>
            </div>

            <input
              type="text"
              placeholder=" Search deposits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none w-full text-xs sm:text-sm text-white placeholder-white/40"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20">
            <table className="w-full border-collapse text-xs sm:text-sm text-center text-white/90">
              <thead className="bg-white/10 sticky top-0">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Deposit ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">User ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">UserName</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Email</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Payment Type</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Request Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Receive Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Currency</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Created At</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 whitespace-nowrap">Source</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 min-w-[120px] sm:min-w-[150px] md:min-w-[180px] whitespace-nowrap">Action Taken By</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeposits.length > 0 ? (
                  paginatedDeposits.map((dep) => (
                    <tr
                      key={dep.deposit_id}
                      className="hover:bg-white/10 even:bg-white/5 transition border-b border-white/10"
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{dep.deposit_id}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => navigate(`${adminRoutes}userdetails/${dep.user_id}`)}>
                        {dep.user_id}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{dep.username}</td>
                      <td className={`px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap ${dep.is_lp_added === 0 ? "text-red-500" : "text-white"}`}>
                        {dep.email}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        {dep.payment_method}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        ${dep.requested_amount_usd}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        ${dep.transfer_amount_usd}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{dep.currency_name}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        {new Date(dep.deposit_request_at).toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">
                        {dep.deposit_status}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          dep.deposit_source === 'mobile_app'
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        }`}>
                          {dep.deposit_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
                        </span>
                      </td>
                      {/* UPDATED: Action Taken By column with full details */}
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <ActionTakenByCell
                          status={dep.deposit_status}
                          adminName={dep.verified_by_admin_name}
                          actionTime={dep.deposit_verified_at}
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`${adminRoutes}deposit/${dep.deposit_id}`)
                          }
                          className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="13"
                      className="text-center py-6 text-gray-500"
                    >
                      No deposits found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/*  Floating Scroll Button */}
          {showScrollBtn && (
            <button
              onClick={() => {
                if (scrollDirection === "down") {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`fixed bottom-8 right-0 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce`}
            >
              {scrollDirection === "down" ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          )}



          {/* Pagination */}
          {itemsPerPage !== "all" && totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-4 sm:mt-6 space-x-1 sm:space-x-2 gap-1 sm:gap-0">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
              >
                « First
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
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
                      {showDots && <span className="px-1 text-xs">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded ${currentPage === page
                          ? "bg-blue-500 text-white"
                          : "hover:bg-white/10"
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
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
              >
                Next ›
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50"
              >
                Last »
              </button>

              <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 mt-2">
                <input
                  type="number"
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
                        toast.warn(`Enter valid page (1 - ${totalPages})`);
                      }
                    }
                  }}
                  className="w-12 sm:w-20 border rounded px-2 py-1 text-center text-xs sm:text-sm"
                />
                <span className="text-white text-xs sm:text-sm">/ {totalPages}</span>
              </div>
            </div>
          )}


          <div>
            <button
              onClick={() => copyTableData()}
              className="mb-4 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer text-xs sm:text-sm">
              Copy Table Data
            </button>
          </div>

        </main>
    </AdminLayout>
  );
};

export default AdminDeposit;

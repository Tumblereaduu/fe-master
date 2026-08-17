import React, { useEffect, useState } from "react";
import AdminLayout from "../../Admin/AdminLayout";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BACKEND_API_URL } from "../../../api/config";
import { adminRoutes } from "../../../App";

const AdminIBDeposit = () => {
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

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/ib/list/all`);
        const data = res.data.data;
        if (Array.isArray(data)) {
          setAdminDeposit(data);
          setFilteredDeposits(data);
        } else {
          toast.error("Invalid data format from server");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch IB Transfer");
        toast.error("Error fetching IB Transfer");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      const isScrollable = scrollHeight > clientHeight + 100;
      setShowScrollBtn(isScrollable);

      if (scrollTop < scrollHeight - clientHeight - 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
    };

    window.addEventListener("scroll", checkScroll);
    checkScroll();

    return () => window.removeEventListener("scroll", checkScroll);
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

    window.addEventListener("scroll", checkScroll);
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

  if (loading)
    return <AdminLayout><p className="text-center mt-10 text-gray-600">Loading IB Transfer...</p></AdminLayout>;
  if (error)
    return <AdminLayout><p className="text-center mt-10 text-red-600">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

        {/* Page Content */}
        <main className="flex-1 p-5 bg-transparent">
          <h1 className="text-3xl font-extrabold text-white/90 mb-5 text-center">
            Admin IB Transfer
          </h1>

          {/* Search + Controls */}
          <div className="flex flex-wrap justify-between items-center mb-5 bg-white/10 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-cyan-400"
              >
                <option className="text-black" value={10}>10</option>
                <option className="text-black"value={20}>20</option>
                <option className="text-black"value={50}>50</option>
                <option className="text-black"value="all">All</option>
              </select>
            </div>

            <input
              type="text"
              placeholder=" Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none w-64 text-sm text-white placeholder-white/40"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-4 border border-white/20">
            <table className="w-full border-collapse text-sm text-center text-white/90">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 border-b border-white/10">IB.Tr ID</th>
                  <th className="px-4 py-3 border-b border-white/10">User ID</th>
                  <th className="px-4 py-3 border-b border-white/10">Username</th>
                  <th className="px-4 py-3 border-b border-white/10">Email</th>
                  <th className="px-4 py-3 border-b border-white/10">Requested Amount</th>
                  {/* <th className="px-4 py-3 border-b border-white/10">Transfer Amount</th> */}
                  <th className="px-4 py-3 border-b border-white/10">Created At</th>
                  <th className="px-4 py-3 border-b border-white/10">Status</th>
                  <th className="px-4 py-3 border-b border-white/10 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeposits.length > 0 ? (
                  paginatedDeposits.map((dep) => (
                    <tr
                      key={dep.ib_id}
                      className="hover:bg-white/10 even:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 border-b border-white/10">{dep.ib_id}</td>
                      <td className="px-4 py-3 border-b border-white/10">
                        {dep.user_id}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10">{dep.username}</td>
                      <td className={`px-4 py-3 border-b border-white/10`}>
                        {dep.email}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10">
                        ${dep.enter_amount}
                      </td>
                      {/* <td className="px-4 py-3 border-b border-white/10">
                        ${dep.transfer_amount_usd}
                      </td> */}
                      <td className="px-4 py-3 border-b border-white/10 ">
                        {new Date(dep.deposit_request_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10 font-semibold">
                        {dep.deposit_status}
                      </td>
                      <td className="px-4 py-3 border-b border-white/10 text-center">
                        <button
                          onClick={() =>
                            navigate(`${adminRoutes}ib/deposit/${dep.ib_id}`)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-500"
                    >
                      No IB Transfer found
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
                        className={`px-3 py-1 border rounded ${currentPage === page
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

              <div className="flex items-center space-x-2 ml-4 mt-2">
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
                  className="w-20 border rounded px-2 py-1 text-center"
                />
                <span className="text-white text-sm">/ {totalPages}</span>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={() => copyTableData()}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer">
              Copy Table Data
            </button>
          </div>

        </main>
    </AdminLayout>
  );
};

export default AdminIBDeposit;

import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "../../App";

const AddFund = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [fundHistory, setFundHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmAddFund,setConfirmAddFund] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistoryFund();
  }, []);

  const fetchHistoryFund = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/wallet/history`);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setFundHistory(data.data);
      } else {
        toast.error("Failed to load history");
      }
    } catch (error) {
      toast.error("Error fetching history: " + error.message);
    }
  };

  const handleSubmit = async () => {
    const trimmedUserId = userId.trim();
    const trimmedAmount = amount.trim();

    if (!trimmedUserId) return toast.error("Please enter a valid User ID!");
    if (!trimmedAmount) return toast.error("Please enter an amount!");
    // if (isNaN(trimmedAmount) || Number(trimmedAmount) < 10)
    //   return toast.error("Please enter amount 10 or more!");

    try {
      const response = await fetch(`${BACKEND_API_URL}/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: trimmedUserId,
          amount: parseFloat(trimmedAmount),
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast.success("Fund added successfully!");
        setUserId("");
        setAmount("");
        fetchHistoryFund();
      } else if (response.status === 404) {
        toast.error(data.message || "User not found!");
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    }
  };

  // Filter + Pagination
  const filteredHistory = fundHistory.filter((item) =>
    item.user_id.toString().includes(searchTerm)
  );
  const loadUser = async () => {
  if (!userId) return;

  try {
    const res = await fetch(`${BACKEND_API_URL}/wallet/${userId}`);
    const data = await res.json();

    if (res.ok && data.status === "success") {
      setUsername(data.username || data.name || "");
      setEmail(data.email || "");
    } else {
      setUsername("Unknown User");
      setEmail("");
    }
  } catch (err) {
    setUsername("Unknown User");
    setEmail("");
  }
  };
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === "all" ? filteredHistory.length : startIndex + itemsPerPage;
  const paginatedHistory =
    itemsPerPage === "all"
      ? filteredHistory
      : filteredHistory.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

        {/* Page Content */}
        <main className="flex-1 p-5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white/90 mb-7 text-center">
             Admin Fund Management
          </h1>

          {/* Add Fund Form */}
          <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 shadow-xl rounded-2xl p-5 border border-white/20">
            <h2 className="text-2xl font-bold text-white/90 mb-3 text-center">
              Add Funds to User
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none bg-white/10 text-white placeholder-white/50 transition"
              />
              <input
                type="text"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none bg-white/10 text-white placeholder-white/50 transition"
              />
              <button
                onClick={async ()=> {await loadUser(); setConfirmAddFund(true)}}
                className="bg-cyan-500/80 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Add Fund
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="mt-12 bg-white/10 shadow-xl rounded-2xl p-5 border border-white/20 text-white">
            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
              <h2 className="text-xl font-bold text-white/90">
                 User Fund History
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    );
                    setCurrentPage(1);
                  }}
                  className="border border-white/20 rounded-md px-3 py-1 text-sm bg-gray-900 text-white focus:ring-1 focus:ring-cyan-400"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="all">All</option>
                </select>

                <input
                  type="text"
                  placeholder=" Search by User ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-white/20 rounded-md outline-none focus:ring-1 focus:ring-cyan-400 text-sm bg-white/10 text-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-w-full rounded-xl border border-white/20">
              <table className="w-full border-collapse text-center text-xs text-white">
                <thead className="bg-white/10 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 border-b border-white/20">S.No</th>
                    <th className="px-4 py-3 border-b border-white/20">User ID</th>
                    <th className="px-4 py-3 border-b border-white/20">Amount</th>
                    <th className="px-4 py-3 border-b border-white/20">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.length > 0 ? (
                    paginatedHistory.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-white/10 transition-colors even:bg-white/5"
                      >
                        <td className="px-4 py-3 border-b border-white/20">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 border-b border-white/20">{item.user_id}</td>
                        <td className="px-4 py-3 border-b border-white/20 text-green-400 font-semibold">
                          ${item.amount}
                        </td>
                        <td className="px-4 py-3 border-b border-white/20 text-white/80">
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-white/50">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
                    const prevPage = array[index - 1];
                    const showDots = prevPage && page - prevPage > 1;
                    return (
                      <React.Fragment key={page}>
                        {showDots && <span className="px-2">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === page
                              ? "bg-cyan-500 text-white"
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
                    className="w-20 border rounded px-2 py-1 text-center bg-white/10 text-white"
                  />
                  <span className="text-white/70 text-sm">/ {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        </main>

          {confirmAddFund && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Confirm Add Fund
          </h2>

          <p className="text-gray-700 mb-6" onClick={() => navigate(`${adminRoutes}userdetails/${userId}`)}>
            Are you sure you want to add <b>${amount}</b> to <b><b className="underline cursor-pointer">{userId||"Unknown User"}</b> {username || "-"} ({email || "-"})</b>?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmAddFund(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleSubmit();
                setConfirmAddFund(false);
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
           )}

    </AdminLayout>
  );
};

export default AddFund;

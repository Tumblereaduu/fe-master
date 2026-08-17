import React, { useEffect, useState } from "react";
import AdminLayout from "../../Admin/AdminLayout";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../../api/config";

const IBCommision = () => {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [commission, setCommission] = useState([]);

  useEffect(() => {
    fetchWalletHistory();
    fetchCommission();
  }, []);

  const fetchWalletHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/wallet/walletHistory`);
      if (response.data.status === "success") {
        setWallet(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching wallet data");
    }
  };

  const fetchCommission = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/ib/commission`);
      if (response.data.status === "success" && response.data.data) {
        setCommission(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching commission data");
    }
  };


  const handleSubmit = async () => {
    if (!amount) {
      toast.error("Please enter lot Size");
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_API_URL}/ib/commission`, {
        lot_usd: amount,
      });

      if (response.data.status === "success") {
        toast.success("Commission updated successfully!");
      } else {
        toast.error(response.data.message || "Commission Update failed!");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "server Error";
      toast.error(msg);
    }
  };

  //  Filter + Pagination
  const filteredWallet = wallet.filter((item) =>
    item.user_id.toString().includes(searchTerm)
  );

  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(filteredWallet.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all"
      ? filteredWallet.length
      : startIndex + itemsPerPage;
  const paginatedWallet =
    itemsPerPage === "all"
      ? filteredWallet
      : filteredWallet.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2500} transition={Slide} />

      {/* Main Content */}
      <div className="flex-1 p-5 relative">


        {/* Wallet Update Form */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20 mt-24">
          <h2 className="text-2xl font-bold text-white/90 mb-6 text-center">
            IB Commission
          </h2>

          <div className="flex flex-col gap-4">
            {/* <input
              type="number"
              placeholder="Enter Lot size"
              value={lot}
              onChange={(e) => setUserId(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            /> */}
            <div className="flex  items-center justify-center gap-10">
              <h3 className="text-2xl font-semibold">1 Lot = </h3>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <button
              onClick={() => setConfirmUpdate(true)}
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Update
            </button>
          </div>
        </div>

        {/* Wallet Table */}
        <div className="mt-12 bg-white/10 shadow-xl rounded-2xl p-6 border border-white/20">
          <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
            <h2 className="text-xl font-bold text-white/90">
              Lot Commission 
            </h2>

            {/* <div className="flex flex-wrap items-center gap-3">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="border border-white/20 rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-cyan-400 bg-black/20 text-white"
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
                className="px-3 py-2 border border-white/20 rounded-md outline-none focus:ring-1 focus:ring-cyan-400 text-sm bg-black/20 text-white"
              />
            </div> */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-white/20">
            <table className="w-full border-collapse text-center text-sm text-white">
              <thead className="bg-white/10 sticky top-0">
                <tr>
                  <th className="px-4 py-3 border-b border-white/20">S.No</th>
                  <th className="px-4 py-3 border-b border-white/20">ID</th>
                  <th className="px-4 py-3 border-b border-white/20">lot_usd</th>
                  <th className="px-4 py-3 border-b border-white/20">Created At</th>
                </tr>
              </thead>
              <tbody>
                {commission.length > 0 ? (
                  commission.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/10 transition-colors even:bg-white/5"
                    >
                      <td className="px-4 py-3 border-b border-white/20">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-b border-white/20">{item.id}</td>
                      <td className="px-4 py-3 border-b border-white/20 text-green-400 font-semibold">
                        ${item.lot_usd}
                      </td>
                      <td className="px-4 py-3 border-b border-white/20 text-white/70">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-white/50">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination + Go To */}
          {/* {itemsPerPage !== "all" && totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-6 space-x-2 text-white">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="px-3 py-1 border rounded disabled:opacity-50">« First</button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-50"> ‹ Prev </button>

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
                        className={`px-3 py-1 border rounded ${currentPage === page
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
                  className="w-20 border rounded px-2 py-1 text-center"
                />
                <span className="text-white text-sm">/ {totalPages}</span>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {confirmUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Confirm Update
            </h2>

            <p className="text-gray-700 mb-6">
              Are you sure you want to update commission of
              <b> ${amount}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmUpdate(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleSubmit();
                  setConfirmUpdate(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default IBCommision;

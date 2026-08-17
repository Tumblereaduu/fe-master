import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";
import { formatUTC } from "../../api/trade/date";

const SellOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Floating Scroll Button States
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const fetchSellOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/adminorder/selltrade`);
        setOrders(response.data.trades || []);
      } catch (error) {
        console.error("Error while Fetching Sell orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellOrders();
  }, []);

  // Filter Search by Trade ID
  const filteredOrders = orders.filter((order) => order.trade_id.toString().includes(searchTerm) || order.user_id.toString().includes(searchTerm) || order.email.toLowerCase().includes(searchTerm)
  );

  // Pagination Logic
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredOrders.length / itemsPerPage);

  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? filteredOrders.length : startIndex + itemsPerPage;

  const paginatedOrders =
    itemsPerPage === "all"
      ? filteredOrders
      : filteredOrders.slice(startIndex, endIndex);

  /* Floating Scroll Button Logic */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = window.innerHeight;

      const scrollable = scrollHeight > clientHeight + 150;
      setShowScrollBtn(scrollable);

      if (scrollTop < scrollHeight - clientHeight - 150) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [orders, paginatedOrders]);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <AdminLayout>
        <h3 className="text-center text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 mt-12 text-white/90">
          SELL Order History
        </h3>

        {/* Search & Items Per Page */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center mb-3 sm:mb-4 bg-white/10 p-2 sm:p-3 rounded-xl border border-white/20">
          <input
            type="text"
            placeholder="Search by Trade ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white placeholder-white/50 text-sm sm:text-base w-full sm:w-auto"
          />

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(
                e.target.value === "all" ? "all" : Number(e.target.value)
              );
              setCurrentPage(1);
            }}
            className="px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white text-sm sm:text-base w-full sm:w-auto"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full border border-white/20 rounded-lg backdrop-blur-xl bg-white/10 shadow-lg text-xs sm:text-sm">
            <thead className="bg-white/10 border-b border-white/20 sticky top-0">
              <tr className=" text-xs font-semibold text-white/80 text-center">
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">S.No</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Order ID</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">User ID</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Email</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Symbol</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Order Type</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Lot Size</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Entry Price</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">SL</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">TP</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Exit Price</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Open Time</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Close Time</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Profit</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Status</th>
                {/* Source column added */}
                {/* <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Source</th> */}
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Open Source</th>
<th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Close Source</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-xs text-white/70">
              {loading ? (
                <tr>
                  <td colSpan="17" className="text-center py-6 text-white/50">
                    Loading SELL orders...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="17" className="text-center py-6 text-white/50">
                    No SELL orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr key={order.trade_id} className="hover:bg-white/10 transition text-center text-xs sm:text-sm border-b border-white/10">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{startIndex + index + 1}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.trade_id}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => navigate(`${adminRoutes}userdetails/${order.user_id}`)}>
                      {order.user_id}
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap ${order.is_lp_added === 0 ? "text-red-500" : "text-white"}`}>{order.email}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.symbol}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.order_type}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.lot_size}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.entry_price}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.stop_loss}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.take_profit}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.exit_price}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                      {order.entry_time ? formatUTC(order.entry_time) : "-"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                      {order.exit_time ? formatUTC(order.exit_time) : "-"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.pnl}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{order.order_status}</td>
                    {/* Source column added */}
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
    order.trade_source === 'mobile_app'
      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
      : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  }`}>
    {order.trade_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
  </span>
</td>
<td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
  {order.close_source ? (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
      order.close_source === 'mobile_app'
        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    }`}>
      {order.close_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
    </span>
  ) : (
    <span className="text-white/30 text-[10px]">—</span>
  )}
</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                      <button
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                        onClick={() => window.open(`${adminRoutes}buysell/edit/${order.trade_id}`,'_blank')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      {itemsPerPage !== "all" && totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
             <button disabled={currentPage === 1}  onClick={() => setCurrentPage(1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50">« First</button>
             <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50">‹ Prev</button>
    
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter( (page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                    .map((page, index, array) => {
                      const prev = array[index - 1];
                      const showDots = prev && page - prev > 1;
                      return (
                        <React.Fragment key={page}>
                          {showDots && <span className="px-1 text-xs">...</span>}
                          <button onClick={() => setCurrentPage(page)} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-white/10" }`}>
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
    
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50">Next ›</button>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50">Last »</button>
    
                  <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 mt-2">
                    <input type="number" min="1" max={totalPages} placeholder="Go to..." onKeyDown={(e) => {
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

        {/* Floating Scroll Button (Same as AdminDeposit) */}
        {showScrollBtn && (
          <button
            onClick={() =>
              scrollDirection === "down" ? scrollBottom() : scrollTop()
            }
            className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white p-4 rounded-full shadow-xl hover:bg-cyan-700 transition-all animate-bounce"
          >
            {scrollDirection === "down" ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
        )}
    </AdminLayout>
  );
};

export default SellOrder;

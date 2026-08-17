import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";
import { formatUTC } from "../../api/trade/date";

const DemoSellOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Floating Scroll Button
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

useEffect(() => {
  const fetchBuyOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/adminorder/demoselltrade`);
      setOrders(response.data.trades || []); 
    } catch (error) {
      console.error("Error while Fetching Buy orders", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBuyOrders();
}, []);

  // SEARCH by Trade ID
  const filteredOrders = orders.filter((order) => order.trade_id.toString().includes(searchTerm) || order.user_id.toString().includes(searchTerm) || order.email.toLowerCase().includes(searchTerm)
  );

  // PAGINATION Calculations
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
      <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 relative z-10">
        <h3 className="text-center text-3xl font-bold mb-5 text-white/90">
        Demo SELL Order History
        </h3>

        {/* Search + Items Per Page */}
        <div className="flex justify-between items-center mb-2 bg-white/10 p-2 rounded-xl border border-white/20">
          <input
            type="text"
            placeholder="Search by Trade ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded bg-black/30 border border-white/30 text-white placeholder-white/50"
          />

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(
                e.target.value === "all" ? "all" : Number(e.target.value)
              );
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded bg-black/30 border border-white/30 text-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full border border-white/20 rounded-lg backdrop-blur-xl bg-white/10 shadow-lg">
            <thead className=" border-b border-white/20">
              <tr className="text-xs font-semibold bg-white/10 text-white/90 text-center">
                <th className="py-3 px-4 border-b border-white/20">S.No</th>
                <th className="py-3 px-4 border-b border-white/20">Order ID</th>
                <th className="py-3 px-4 border-b border-white/20">User ID</th>
                <th className="py-3 px-4 border-b border-white/20">Email</th>
                <th className="py-3 px-4 border-b border-white/20">Symbol</th>
                <th className="py-3 px-4 border-b border-white/20">Order Type</th>
                <th className="py-3 px-4 border-b border-white/20">Lot Size</th>
                <th className="py-3 px-4 border-b border-white/20">Entry Price</th>
                <th className="py-3 px-4 border-b border-white/20">SL</th>
                <th className="py-3 px-4 border-b border-white/20">TP</th>
                <th className="py-3 px-4 border-b border-white/20">Exit Price</th>
                <th className="py-3 px-4 border-b border-white/20">Open Time</th>
                <th className="py-3 px-4 border-b border-white/20">Close Time</th>
                <th className="py-3 px-4 border-b border-white/20">Profit</th>
                <th className="py-3 px-4 border-b border-white/20">Status</th>
                <th className="py-3 px-4 border-b border-white/20 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-xs text-white/70">
              {loading ? (
                <tr>
                  <td colSpan="15" className="text-center py-6 text-white/50">
                    Loading Sell orders...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="15" className="text-center py-6 text-white/50">
                    No Sell orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr key={order.trade_id} className="hover:bg-white/10 transition text-center">
                    <td className="py-3 px-4 border-b border-white/10">
                      {startIndex + index + 1}
                    </td>
                    <td className="py-3 px-4 border-b border-white/10">{order.trade_id}</td>
                    <td className="py-3 px-4 border-b border-white/10 text-blue-400 cursor-pointer" onClick={() => navigate(`${adminRoutes}userdetails/${order.user_id}`)}>
                      {order.user_id}
                    </td>
                    <td className={`px-4 py-3 border-b border-white/10 ${order.is_lp_added === 0 ? "text-red-500" : "text-white"}`}>{order.email}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.symbol}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.order_type}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.lot_size}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.entry_price}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.stop_loss}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.take_profit}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.exit_price}</td>
                    <td className="py-3 px-4 border-b border-white/10">
                      {order.entry_time ? formatUTC(order.entry_time) : "-"}
                    </td>
                    <td className="py-3 px-4 border-b border-white/10">
                      {order.exit_time ? formatUTC(order.exit_time) : "-"}
                    </td>
                    <td className="py-3 px-4 border-b border-white/10">{order.pnl}</td>
                    <td className="py-3 px-4 border-b border-white/10">{order.order_status}</td>
                    <td className="py-3 px-4 border-b border-white/10 text-center">
                      <button
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-all duration-200"
                        onClick={() =>
                          navigate(`${adminRoutes}order/demoSell/edit/${order.trade_id}`)
                        }
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

        {/* PAGINATION BUTTONS */}
       {itemsPerPage !== "all" && totalPages > 1 && (
         <div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
              <button disabled={currentPage === 1}  onClick={() => setCurrentPage(1)} className="px-3 py-1 border rounded disabled:opacity-50">« First</button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-50">‹ Prev</button>
     
                   {Array.from({ length: totalPages }, (_, i) => i + 1).filter( (page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                     .map((page, index, array) => {
                       const prev = array[index - 1];
                       const showDots = prev && page - prev > 1;
                       return (
                         <React.Fragment key={page}>
                           {showDots && <span className="px-2">...</span>}
                           <button onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-white/10" }`}>
                             {page}
                           </button>
                         </React.Fragment>
                       );
                     })}
     
                   <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next ›</button>
                   <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 border rounded disabled:opacity-50">Last »</button>
     
                   <div className="flex items-center space-x-2 ml-4 mt-2">
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
                       className="w-20 border rounded px-2 py-1 text-center"
                     />
                     <span className="text-white text-sm">/ {totalPages}</span>
                   </div>
                 </div>
        )}


        {/* FLOATING SCROLL BUTTON */}
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
      </div>
    </AdminLayout>
  );
};

export default DemoSellOrder;

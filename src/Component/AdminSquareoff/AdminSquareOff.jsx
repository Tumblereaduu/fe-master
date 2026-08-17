import React, { use, useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import socket from "../../socket/socket-file";
import { formatUTC } from "../../api/trade/date";
import { object, span } from "framer-motion/client";
import {  useLivePrice } from "../hooks/tradePage/useLivePriceContext";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "../../App";


const AdminSquareOff = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [grouped, setGrouped] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/adminorder/lpactive`);
        setOrders(response.data.trades || []);
      } catch (error) {
        console.error("Error while Fetching orders", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [])

  // const [livePrices, setLivePrices] = useState([]);
  const {livePrices, allPairs} = useLivePrice()

 

  // Fetch user Wallet

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/adminorder/lpactive`);
        const trades = response.data.trades || [];
        setOrders(trades);

        // Fetch wallet for each unique user
        const userIds = [...new Set(trades.map(t => t.user_id))];

        const walletData = {};
        await Promise.all(
          userIds.map(async (uid) => {
            const w = await axios.get(`${BACKEND_API_URL}/wallet/${uid}`);
            walletData[uid] = w.data.wallet || 0;
          })
        );

        setWallets(walletData);

      } catch (error) {
        console.error("Error while Fetching orders", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getExitPrice = (symbol) => {
    if (!symbol || livePrices.length === 0) return "—";

    const normalized = symbol.replace("/", "").trim().toUpperCase();

    const found = livePrices?.[normalized];

    return found ??  "—";
  };

  // calculate pnl
  const calculatePnL = (trade, allPairs) => {
    if (!trade || !allPairs) return 0;

    // Clean symbol
    const cleanSymbol = trade.symbol ?.replace("OANDA:", "")?.replace().replace("/", "") .trim().toUpperCase();

    if (!cleanSymbol) return 0;

    // Live price
    const liveData = allPairs?.[cleanSymbol];
    if (!liveData?.price) return 0;

    const livePrice = parseFloat(liveData.price);
    const entryPrice = parseFloat(trade.entry_price);
    const lot = parseFloat(trade.lot_size);
    const type = trade.type?.toUpperCase();

    // Determine contract size
    let contractSize = 100000;  // default Forex
    if (cleanSymbol === "XAUUSD" || cleanSymbol === 'XPDUSD') contractSize = 100;
    if (cleanSymbol === "XAGUSD") contractSize = 5000;
    if (cleanSymbol === 'XCUUSD') contractSize = 2300;
    if (cleanSymbol === 'BTCUSD' || cleanSymbol === 'ETHUSD') contractSize = 1;

    // Basic PnL in QUOTE currency
    const rawPnL =
      type === "BUY"
        ? (livePrice - entryPrice) * lot * contractSize
        : (entryPrice - livePrice) * lot * contractSize;

    // If quote currency is USD → already in USD
    const quote = cleanSymbol.slice(3);  // e.g., AUDCAD → "CAD"

    if (quote === "USD") return rawPnL; // No conversion needed

    // Find conversion pair: QUOTE → USD (e.g., CADUSD)
    const convPair = allPairs?.[`${quote}USD`];

    if (!convPair?.price) {
      // Try USDQUOTE (invert rate)
      const invPair = allPairs?.[`USD${quote}`];
      if (invPair?.price) {
        return rawPnL / parseFloat(invPair.price); // invert conversion
      }
      return rawPnL; // fallback
    }

    // Convert to USD
    return rawPnL * parseFloat(convPair.price);
  };

  // search function
  const filteredOrders = orders.filter((order) => order.trade_id.toString().includes(searchTerm))

    const groupedOrders = Object.values(
    filteredOrders.reduce((acc, order)=>{

      const email = order.email;
      const pnl = calculatePnL(order, allPairs);
      const userWallet = wallets[order.user_id] ?? 0;

      if(!acc[email]){
        acc[email] = {...order, count: 1, totalPnl: pnl, wallet: userWallet}
      }
      else{
        acc[email].count += 1;
        acc[email].totalPnl += pnl;
      }
      return acc;
    }, {})
  )

  // pagination
  const baseData = grouped ? groupedOrders : filteredOrders;
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(baseData.length / itemsPerPage);
  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === 'all' ? baseData.length : startIndex + itemsPerPage;
  const paginatedOrders = itemsPerPage === 'all' ? baseData : baseData.slice(startIndex, endIndex);

  // Total pnl

  // const totalPnl = paginatedOrders.reduce((sum, order) => {
  //   return sum + calculatePnL(order, livePrices);
  // }, 0)


  return (
    <AdminLayout>
      <div className="p-2 sm:p-3 md:p-5 relative z-10 w-full">
        {/* Adjust ML based on your sidebar width */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-5 mt-12 text-white text-center">Square Off Positions</h2>
        {/* Search + Items per page */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center mb-3 sm:mb-4 bg-white/10 p-2 sm:p-3 rounded-xl border border-white/20">
          <input  type="text"  placeholder="Search by Trade ID..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white placeholder-white/50 text-sm sm:text-base w-full sm:w-auto" />
          {/* Total PNL Display */}
          {/* <span
            className={`font-bold px-4 py-2 rounded-lg ${totalPnl >= 0 ? "text-green-400" : "text-red-400"
              }`}
          >
            Total PNL: {totalPnl.toFixed(2)}
          </span> */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-10 items-center w-full sm:w-auto">
          {/* <div className="flex gap-2 items-center">
              <h2 className="cursor-pointer bg-red-600 px-2 py-1 rounded-xl" onClick={()=> setGrouped(true)}>Group</h2>
              <h2 className="cursor-pointer bg-green-400 px-2 py-1 rounded-xl" onClick={()=> setGrouped(false)}>UnGroup</h2>
          </div> */}
            
          <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1);}} className="px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white text-sm sm:text-base w-full sm:w-auto">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className=" border border-white/20 rounded-lg backdrop-blur-xl w-full shadow-lg text-xs sm:text-sm">
            <thead className="bg-white/10 border-b border-white/20">
              <tr className="text-left text-xs font-semibold text-white/80">
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">S.No</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Trade ID</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">User ID</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Email</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Open Time</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Symbol</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Type</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Lot</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Used Margin</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Open Price</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Status</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">Exit Price</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">TP</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center">SL</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center" >PNL</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center" >Balance</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center" >After Balance</th>

              </tr>
            </thead>

            <tbody className="text-xs text-white/70">
              {
                loading ? (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-white/50">
                      Loading orders...
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-white/50">
                      No open orders found.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, index) => {

                    const pnl = grouped ? order.totalPnl : calculatePnL(order, allPairs);
                    const userWallet = grouped ? order.wallet : wallets[order.user_id] ?? 0;
                    const afterBalance = Number(userWallet) + Number(pnl);

                    return (
                      <tr key={order.trade_id} className="hover:bg-white/10 transition">
                        <td className="py-3 px-4 border-b border-white/10 text-center">{index + 1}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{order.trade_id}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center text-blue-400 cursor-pointer" onClick={() => navigate(`${adminRoutes}userdetails/${order.user_id}`)}>
                          {order.user_id}
                        </td>
                        <td className={`py-3 px-4 border-b border-white/10 text-center ${order.is_lp_added  === 0 ? 'text-red-500' : 'text-white'}`}>{order.email}{grouped
                        && order.count > 1 && (<span className="ml-2 text-yellow-400">({order.count} trades)</span>)}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">
                          {formatUTC(order.entry_time)}
                        </td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{order.symbol}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{order.type}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{Number(order.lot_size).toString()}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{order.used_margin}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{order.entry_price}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-green-400 font-medium text-center">
                          {order.order_status}
                        </td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{getExitPrice(order.symbol)}</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{
                          order.take_profit != null && order.take_profit !== ""
                            ? order.take_profit
                            : order.tp_pnl != null && order.tp_pnl !== ""
                              ? `${Number(order.tp_pnl).toFixed(2)} USD`
                              : "-"
                        }</td>
                        <td className="py-3 px-4 border-b border-white/10 text-center">{
                          order.stop_loss != null && order.stop_loss !== ""
                            ? order.stop_loss
                            : order.sl_pnl != null && order.sl_pnl !== ""
                              ? `${Number(order.sl_pnl).toFixed(2)} USD`
                            : "-"
                        }</td>
                        {/* PNL */}
                        <td
                          className={`py-3 px-4 border-b border-white/10 text-center font-semibold ${pnl >= 0 ? "text-green-400" : "text-red-500"
                            }`}
                        >
                          {pnl.toFixed(2)}
                        </td>


                        {/* Wallet Balance */}
                        <td className="py-3 px-4 border-b border-white/10 text-center">
                          {Number(userWallet || 0).toFixed(2)}
                        </td>

                        {/* After Balance */}
                        <td
                          className={`py-3 px-4 border-b border-white/10 text-center font-semibold ${afterBalance >= 0 ? "text-green-400" : "text-red-500"
                            }`}
                        >
                          {afterBalance.toFixed(2)}
                        </td>

                      </tr>
                    );
                  })

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
                const prev = array[index - 1];
                const showDots = prev && page - prev > 1;
                return (
                  <React.Fragment key={page}>
                    {showDots && <span className="px-2">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded ${currentPage === page
                        ? "bg-cyan-500 text-white"
                        : "hover:bg-white/20"
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
                      alert(`Enter valid page (1 - ${totalPages})`);
                    }
                  }
                }}
                className="w-20 border rounded px-2 py-1 text-center"
              />
              <span className="text-white/70 text-sm">/ {totalPages}</span>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminSquareOff;

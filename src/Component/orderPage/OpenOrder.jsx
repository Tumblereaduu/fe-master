import React, { useEffect, useState } from 'react';
import AdminLayout from '../Admin/AdminLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../../api/config';
import { adminRoutes } from '../../App';
import { formatUTC } from '../../api/trade/date';

const OpenOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    // search & pagnation
    
    const [searchTerm,setSearchTerm] = useState('');
    const [currentPage,setCurrentPage] = useState(1);
    const [itemsPerPage,setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/adminorder/active`);
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

    // Search 

    const filteredOrders = orders.filter((order)=> order.trade_id.toString().includes(searchTerm));

    // Pagination

    const totalPagination = itemsPerPage === "all" ? 1 : Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex  = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage === "all" ? filteredOrders.length : startIndex + itemsPerPage;
    const PaginationOrders = itemsPerPage === "all" ? filteredOrders : filteredOrders.slice(startIndex, endIndex);

    return (
        <AdminLayout>
            <h1 className="text-center text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 mt-12 text-white/90">
                Open Orders
            </h1>
                
                {/* search */}
                <div className='mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center bg-white/10 p-2 sm:p-3 rounded-xl border border-white/20'>
                    <input type="text" placeholder='Search by tradeId' value={searchTerm} onChange={(e)=> {setSearchTerm(e.target.value); setCurrentPage(1); }} 
                    className='px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white text-sm sm:text-base w-full sm:w-auto' />
                    
                     {/* Pagination */}

                <select value={itemsPerPage} onChange={(e)=> {setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1);}} 
                    className='px-2 sm:px-3 py-2 rounded bg-black/30 border border-white/30 text-white text-sm sm:text-base w-full sm:w-auto'>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value="all">All</option>
                    </select>
                </div>           

                {/* Table */}
                <div className="overflow-x-auto max-w-full">
                    <table className="w-full border border-white/20 rounded-lg backdrop-blur-xl bg-white/10 shadow-lg text-xs sm:text-sm">
                        <thead className="bg-white/10 border-b border-white/20 sticky top-0">
                            <tr className="text-left text-xs font-semibold text-white/80">
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">S.No</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Trade ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">User ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Email</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Symbol</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Type</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Order Type</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Lot Size</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Entry Price</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Entry Time</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Status</th>
                                {/* <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Source</th> */}
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">Open Source</th>
                                {/* <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 whitespace-nowrap">Close Source</th> */}
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b border-white/20 text-center whitespace-nowrap">View</th>
                            </tr>
                        </thead>

                        <tbody className="text-xs text-white/70">
                            {
                            loading ? (
                                <tr>
                                    <td colSpan="13" className="text-center py-6 text-white/50">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : PaginationOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="text-center py-6 text-white/50">
                                        No open orders found.
                                    </td>
                                </tr>
                            ) : (
                                PaginationOrders.map((order, index) => (
                                    <tr key={order.trade_id} className="hover:bg-white/10 transition text-xs sm:text-sm border-b border-white/10">
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{index + 1}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.trade_id}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => navigate(`${adminRoutes}userdetails/${order.user_id}`)}>
                                            {order.user_id}
                                        </td>
                                        <td className={`py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap ${order.is_lp_added === 0 ? 'text-red-500' : 'text-white'}` }>{order.email}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.symbol}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.type}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.order_type}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.lot_size}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.entry_price}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                                            {formatUTC(order.entry_time)}
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-400 font-medium text-center whitespace-nowrap">
                                            {order.order_status}
                                        </td>
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
                                            <button
                                                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-2 sm:px-3 py-1 rounded-md font-medium hover:opacity-90 hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                                                onClick={() => window.open(`${adminRoutes}edit/${order.trade_id}`,'_blank')}
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

              {/* Advanced Pagination */}
            {itemsPerPage !== "all" && totalPagination > 1 && (
                <div className="ml-0 sm:ml-10 mt-4 sm:mt-6 flex flex-wrap justify-center items-center gap-1 sm:gap-2">

                {/* First */}
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-40"> « First </button>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-40"> ‹ Prev </button>

                {/* Page Numbers with dots */}
                {Array.from({ length: totalPagination }, (_, i) => i + 1).filter( (page) => page === 1 || page === totalPagination || (page >= currentPage - 2 && page <= currentPage + 2))
                    .map((page, index, array) => { const prev = array[index - 1]; const showDots = prev && page - prev > 1;
                        return (
                        <React.Fragment key={page}> {showDots && <span className="px-1 text-xs">...</span>}
                            <button onClick={() => setCurrentPage(page)} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded ${currentPage === page ? "bg-cyan-500 text-white" : "hover:bg-white/20"}`}> {page} </button>
                        </React.Fragment>
                                );
                })}
                <button disabled={currentPage === totalPagination} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-40" > Next ›</button>
                <button disabled={currentPage === totalPagination} onClick={() => setCurrentPage(totalPagination)} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-40"> Last » </button>

                {/* Jump to page */}
                <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 mt-2">
                    <input  type="number" min="1" max={totalPagination} placeholder="Go to..." onKeyDown={(e) => { if (e.key === "Enter") {const page = Number(e.target.value);
                        if (page >= 1 && page <= totalPagination) { setCurrentPage(page); e.target.value = ""; } else { alert(`Enter valid page (1 - ${totalPagination})`);}}}}
                        className="w-12 sm:w-20 border rounded px-2 py-1 text-center bg-black/30 text-white text-xs sm:text-sm" />
                    <span className="text-white/60 text-xs sm:text-sm">/ {totalPagination}</span>
                    </div>
                </div>
                )}
        </AdminLayout>
    );
};

export default OpenOrder;

import React, { useEffect, useState } from 'react';
import AdminLayout from '../Admin/AdminLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { BACKEND_API_URL } from '../../api/config';
import { adminRoutes } from '../../App';
import { formatUTC } from '../../api/trade/date';

const PendingOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Floating Scroll Button
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BACKEND_API_URL}/adminorder/pending/admin`);
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

  // SEARCH
  const filteredOrders = orders.filter(order =>
    order.trade_id.toString().includes(searchTerm)
  );

  // PAGINATION
  const totalPages =
    itemsPerPage === 'all' ? 1 : Math.ceil(filteredOrders.length / itemsPerPage);

  const startIndex =
    itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage;

  const endIndex =
    itemsPerPage === 'all' ? filteredOrders.length : startIndex + itemsPerPage;

  const paginatedOrders =
    itemsPerPage === 'all' ? filteredOrders : filteredOrders.slice(startIndex, endIndex);

  // Floating scroll button logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = window.innerHeight;

      const scrollable = scrollHeight > clientHeight + 150;
      setShowScrollBtn(scrollable);

      if (scrollTop < scrollHeight - clientHeight - 150) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [orders, paginatedOrders]);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    return (
        <AdminLayout>
            <h1 className="text-center text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 mt-12 text-white/90">
                Pending Orders
            </h1>

        {/* Search + Items per page */}
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
              setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
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
                <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
                    <table className="w-full text-xs sm:text-sm text-white">
                        <thead className="bg-white/10 text-gray-300 sticky top-0">
                            <tr className="text-left font-semibold">
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">S.No</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Trade ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">User ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Email</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Symbol</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Type</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Order Type</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Lot Size</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Entry Price</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Entry Time</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">Order Status</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-center border-gray-700 whitespace-nowrap">View</th>
                            </tr>
                        </thead>

                        <tbody className="text-xs text-gray-300">
                            {
                            loading ? (
                                   <tr>
                                    <td colSpan="12" className="text-center py-6 text-gray-400">
                                        Loading orders...
                                    </td>
                                </tr>
              ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-6 text-gray-400">
                                        No open orders found.
                                    </td>
                                </tr>
                            ) : (
                paginatedOrders.map((order, index) => (
                          <tr 
                     key={order.trade_id} className="hover:bg-white/5 transition-all duration-200 text-xs sm:text-sm border-b border-gray-800">
                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.trade_id}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => navigate(`${adminRoutes}userdetails/${order.user_id}`)}>
                                            {order.user_id}
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.email}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.symbol}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.type}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.order_type}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.lot_size}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">{order.entry_price}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                                            {formatUTC(order.entry_time)}
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-yellow-300 whitespace-nowrap">
                                            {order.order_status}
                                        </td>
                                         <td className="py-2 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                                            <button
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
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

        {/* Pagination Buttons */}
        <div className="flex flex-wrap justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2 gap-1 sm:gap-0">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${currentPage === i + 1
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Floating Scroll Button */}
        {showScrollBtn && (
          <button
            onClick={() =>
              scrollDirection === 'down' ? scrollBottom() : scrollTop()
            }
            className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white p-4 rounded-full shadow-xl hover:bg-cyan-700 transition-all animate-bounce"
          >
            {scrollDirection === 'down' ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        )}
    </AdminLayout>
  );
};

export default PendingOrder;

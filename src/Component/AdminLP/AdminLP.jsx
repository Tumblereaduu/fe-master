import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BACKEND_API_URL } from '../../api/config';
import { useNavigate, useParams } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import AdminLayout from '../Admin/AdminLayout';
import { ChevronUp, ChevronDown } from "lucide-react";
import { adminRoutes } from "../../App";


const AdminLP = () => {
  const [adminLP, setadminLP] = useState([]);
  const [filteredLP, setfilteredLP] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [sortOption, setSortOption] = useState("");

  const navigate = useNavigate();

    const sortedLP = React.useMemo(() => {
    const data = [...filteredLP];

    const getNumber = (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    const getDate = (value) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    switch (sortOption) {
      case "pnl_high_low":
        return data.sort((a, b) => getNumber(b.total_pnl) - getNumber(a.total_pnl));

      case "pnl_low_high":
        return data.sort((a, b) => getNumber(a.total_pnl) - getNumber(b.total_pnl));

      case "deposit_high_low":
        return data.sort((a, b) => getNumber(b.total_deposit) - getNumber(a.total_deposit));

      case "deposit_low_high":
        return data.sort((a, b) => getNumber(a.total_deposit) - getNumber(b.total_deposit));

      case "withdrawal_high_low":
        return data.sort((a, b) => getNumber(b.total_withdrawal) - getNumber(a.total_withdrawal));

      case "withdrawal_low_high":
        return data.sort((a, b) => getNumber(a.total_withdrawal) - getNumber(b.total_withdrawal));

      case "final_high_low":
        return data.sort((a, b) => getNumber(b.totalFinalBalance) - getNumber(a.totalFinalBalance));

      case "final_low_high":
        return data.sort((a, b) => getNumber(a.totalFinalBalance) - getNumber(b.totalFinalBalance));

      case "wallet_high_low":
        return data.sort((a, b) => getNumber(b.wallet) - getNumber(a.wallet));

      case "wallet_low_high":
        return data.sort((a, b) => getNumber(a.wallet) - getNumber(b.wallet));

      case "date_new_old":
        return data.sort(
          (a, b) =>
            getDate(b.created_at || b.account_created_at || b.date) -
            getDate(a.created_at || a.account_created_at || a.date)
        );

      case "date_old_new":
        return data.sort(
          (a, b) =>
            getDate(a.created_at || a.account_created_at || a.date) -
            getDate(b.created_at || b.account_created_at || b.date)
        );

      default:
        return data;
    }
  }, [filteredLP, sortOption]);

  useEffect(() => {
    const fetchLP = async () => {
      try {
        const  res  = await axios.get(
          `${BACKEND_API_URL}/admindash/lp-status`
        );
        setadminLP(res.data.data || [])
        setfilteredLP(res.data.data || [])
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deposits");
        toast.error("Error fetching deposits");
      } finally {
        setLoading(false);
      }
    };

    fetchLP();
  }, []);

  //  Search filter
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
  }, [adminLP, itemsPerPage, currentPage, filteredLP]);

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
  }, [adminLP]);


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
    setfilteredLP(adminLP);
    setCurrentPage(1);
    return;
  }

  const lowerSearch = searchTerm.toLowerCase();

  const filtered = adminLP.filter(lp => lp.user_id?.toString().includes(lowerSearch) || lp.username?.toLowerCase().includes(lowerSearch) || lp.email?.toLowerCase().includes(lowerSearch) || lp.user_status?.toLowerCase().includes(lowerSearch));

  setfilteredLP(filtered);
  setCurrentPage(1);
}, [searchTerm, adminLP]);


// const totals = React.useMemo(()=>{
  
//   let deposit = 0; let withdraw = 0 ; let pnl = 0 ; let balance = 0 ;
  
//   filteredLP.forEach(item => {
//     deposit += Number(item.total_deposit) || 0;
//     withdraw += Number(item.total_withdrawal) || 0;
//     pnl += Number(item.total_pnl ?? 0) || 0;
//     balance = deposit - withdraw || 0
//   });

//   return {deposit,withdraw,pnl,balance}
  
// },[filteredLP])

  // Dynamic totals calculation - Deposit, Withdrawal, Total PNL, Profit PNL, Loss PNL, Final Balance, Wallet Balance
  const totals = React.useMemo(() => {
    let deposit = 0;
    let withdraw = 0;
    let pnl = 0;
    let profitPnl = 0;
    let lossPnl = 0;
    let finalBalance = 0;
    let walletBalance = 0;

    filteredLP.forEach(item => {
      const dep = Number(item.total_deposit) || 0;
      const wit = Number(item.total_withdrawal) || 0;
      const pnlVal = Number(item.total_pnl) ?? 0;
      const fb = Number(item.totalFinalBalance) || 0;
      const wb = Number(item.wallet) || 0;

      deposit += dep;
      withdraw += wit;
      pnl += pnlVal;
      finalBalance += fb;
      walletBalance += wb;

      // Separate profit and loss PNL
      if (pnlVal > 0) {
        profitPnl += pnlVal;
      } else if (pnlVal < 0) {
        lossPnl += pnlVal; // lossPnl stays negative
      }
    });

    return { deposit, withdraw, pnl, profitPnl, lossPnl, finalBalance, walletBalance };
  }, [filteredLP]);

  //  Pagination
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(sortedLP.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all"
      ? sortedLP.length
      : startIndex + itemsPerPage;
  const paginatedDeposits =
    itemsPerPage === "all"
      ? sortedLP
      : sortedLP.slice(startIndex, endIndex);

  if (loading)
    return <AdminLayout><p className="text-center mt-10 text-gray-600">Loading LP Status...</p></AdminLayout>;
  if (error)
    return <AdminLayout><p className="text-center mt-10 text-red-600">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

        {/* Page Content */}
        <main className="flex-1 p-2 sm:p-3 md:p-5 bg-transparent">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white/90 mb-3 sm:mb-5 text-center">
            LP PNL  
          </h1>

          {/* Search + Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-between mb-3 bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-2xl shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="bg-white/10 border border-white/20 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400"
              >
                <option className="text-black" value={10}>10</option>
                <option className="text-black" value={20}>20</option>
                <option className="text-black" value={50}>50</option>
                <option className="text-black" value="all">All</option>
              </select>

              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/10 border border-white/20 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400"
              >
                <option className="text-black" value="">Sort By</option>

                <option className="text-black" value="pnl_high_low">Total PNL: High to Low</option>
                <option className="text-black" value="pnl_low_high">Total PNL: Low to High</option>

                <option className="text-black" value="deposit_high_low">Deposit: High to Low</option>
                <option className="text-black" value="deposit_low_high">Deposit: Low to High</option>

                <option className="text-black" value="withdrawal_high_low">Withdrawal: High to Low</option>
                <option className="text-black" value="withdrawal_low_high">Withdrawal: Low to High</option>

                <option className="text-black" value="final_high_low">Final Balance: High to Low</option>
                <option className="text-black" value="final_low_high">Final Balance: Low to High</option>

                <option className="text-black" value="wallet_high_low">Wallet Balance: High to Low</option>
                <option className="text-black" value="wallet_low_high">Wallet Balance: Low to High</option>

              </select>
            </div>

            <input
              type="text"
              placeholder=" Search LP Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none w-full sm:w-64 text-xs sm:text-sm text-white placeholder-white/40"
            />
          </div>

          {/* Total Summary Cards */}
          <div className="mt-2 sm:mt-3 mb-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 text-center">
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total LP Users</h3>
              <p className='text-sm sm:text-lg font-bold text-cyan-400'>{filteredLP.length}</p>
            </div>
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total Deposit</h3>
              <p className='text-sm sm:text-lg font-bold text-blue-400'>$ {totals.deposit.toFixed(2)}</p>
            </div>
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total Withdrawal</h3>
              <p className='text-sm sm:text-lg font-bold text-orange-400'>$ {totals.withdraw.toFixed(2)}</p>
            </div>
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total Profit PNL</h3>
              <p className='text-sm sm:text-lg font-bold text-emerald-400'>$ {totals.profitPnl.toFixed(2)}</p>
            </div>
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total Loss PNL</h3>
              <p className='text-sm sm:text-lg font-bold text-rose-400'>$ {totals.lossPnl.toFixed(2)}</p>
            </div>
                 <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total PNL</h3>
              <p className={`text-sm sm:text-lg font-bold ${totals.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>$ {totals.pnl.toFixed(2)}</p>
            </div>
            <div className='bg-white/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs mb-1'>Total Final Balance</h3>
              <p className='text-sm sm:text-lg font-bold text-purple-400'>$ {totals.finalBalance.toFixed(2)}</p>
            </div>
            {/* <div className='bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-lg'>
              <h3 className='text-gray-300 text-xs sm:text-sm mb-1'>Total Wallet Balance</h3>
              <p className='text-lg sm:text-xl font-bold text-cyan-400'>$ {totals.walletBalance.toFixed(2)}</p>
            </div> */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-w-full bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-2 sm:p-3 md:p-4 border border-white/20">
            <table className="w-full border-collapse text-xs sm:text-sm text-center text-white/90">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">S.NO</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">User ID</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Username</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Email</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Deposit</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Withdrawal</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Total PNL</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Final Balance</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Wallet Balance</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeposits.length > 0 ? (
                  paginatedDeposits.map((lp,index) => (
                    <tr
                      key={lp.user_id}
                      className="hover:bg-white/10 even:bg-white/5 transition text-xs"
                    >
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10'>{index + 1}</td>
                     <td className="px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 text-blue-400 cursor-pointer" onClick={() => navigate(`${adminRoutes}userdetails/${lp.user_id}`)}>
                        {lp.user_id}
                      </td>
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10'>{lp.username}</td>
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 truncate'>{lp.email}</td>
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10'>{lp.total_deposit}</td>
                     <td className={`px-2 sm:px-3 md:px-4 py-2 border-b border-white/10`}>{lp.total_withdrawal}</td>
                     <td className={`px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 ${lp.total_pnl >=0 ? "text-green-500" : "text-red-500" }`}>{lp.total_pnl}</td>
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10'>{lp.totalFinalBalance}</td>
                     <td className='px-2 sm:px-3 md:px-4 py-2 border-b border-white/10'>{Number(lp.wallet ?? 0).toFixed(2)}</td>
                     <td className={`px-2 sm:px-3 md:px-4 py-2 border-b border-white/10 ${lp.user_status === "active" ? "text-green-500" : "text-red-600"}`}>{lp.user_status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-500"
                    >
                      No LP status found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

                 {/* <div className='mt-6 grid grid-cols-4 gap-4 text-center'>
                      <div className='bg-white/10 p-4 rounded-xl border border-white/20'>
                        <h3 className='text-gray-300 text-sm'>Total Deposit</h3>
                        <p className='text-2xl font-bold text-red-400'>$ {totals.deposit.toFixed(2)}</p>
                      </div>
                     <div className='bg-white/10 p-4 rounded-xl border border-white/20'>
                        <h3 className='text-gray-300 text-sm'>Total Withdraw</h3>
                        <p className='text-2xl font-bold text-red-400'>$ {totals.withdraw.toFixed(2)}</p>
                      </div>
                      <div className='bg-white/10 p-4 rounded-xl border border-white/20'>
                        <h3 className='text-gray-300 text-sm'>Total PNL</h3>
                        <p className='text-2xl font-bold text-red-400'>$ {totals.pnl.toFixed(2)}</p>
                      </div>
                     <div className='bg-white/10 p-4 rounded-xl border border-white/20'>
                        <h3 className='text-gray-300 text-sm'>Total Balacnce</h3>
                        <p className='text-2xl font-bold text-red-400'>$ {totals.balance.toFixed(2)}</p>
                      </div>
                  </div> */}

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


          {/* <div>
            <button
              onClick={() => copyTableData()}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer">
              Copy Table Data
            </button>
          </div> */}

        </main>
    </AdminLayout>
  );
};

export default AdminLP;

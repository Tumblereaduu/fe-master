// import React, { useEffect, useState } from "react";
// import AdminSidenav from "../Admin/AdminSidenav";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BACKEND_API_URL } from "../../api/config";
// import { adminRoutes } from "../../App";

// const AdminWithdraw = () => {
//   const [adminWithdraw, setAdminWithdraw] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination + Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchWithdraw();
//   }, []);

//   const fetchWithdraw = async () => {
//     try {
//       const { data } = await axios.get(`${BACKEND_API_URL}/withdrawal`);
//       setAdminWithdraw(data);
//     } catch (error) {
//       console.error(error);
//       setError("Failed to fetch withdrawals");
//       toast.error("Error fetching withdrawals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter by search
//   const filteredWithdraws = adminWithdraw.filter((item) =>  item.withdrawal_id.toString().includes(searchTerm) || item.user_id.toString().includes(searchTerm) || item.email.toLowerCase().includes(searchTerm)
//   );

//   // Pagination logic
//   const totalPages =
//     itemsPerPage === "all"
//       ? 1
//       : Math.ceil(filteredWithdraws.length / itemsPerPage);

//   const startIndex =
//     itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
//   const endIndex =
//     itemsPerPage === "all"
//       ? filteredWithdraws.length
//       : startIndex + itemsPerPage;

//   const paginatedWithdraws =
//     itemsPerPage === "all"
//       ? filteredWithdraws
//       : filteredWithdraws.slice(startIndex, endIndex);

//   if (loading)
//     return <p className="text-center mt-10">Loading withdrawals...</p>;
//   if (error)
//     return <p className="text-center mt-10 text-red-600">{error}</p>;

//   return (
//     <div className="md:ml-60 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-auto">
//       <ToastContainer position="top-right" autoClose={2500} transition={Slide} />

//       {/* Sidebar */}
//       <div className="hidden md:block md:w-64 bg-white shadow-lg">
//         <AdminSidenav />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 mt-20 md:p-10">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center">
//           Admin Withdrawal Management
//         </h1>

//         <div className="bg-white/10 shadow-xl rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
//           <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
//             <h2 className="text-xl font-bold text-white">
//               All Withdrawal Requests
//             </h2>

//             <div className="flex flex-wrap items-center gap-3 relative z-50">
//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   setItemsPerPage(
//                     e.target.value === "all" ? "all" : Number(e.target.value)
//                   );
//                   setCurrentPage(1);
//                 }}
//                 className="border border-white/40 rounded-md px-3 py-1 text-sm text-white bg-black/20 focus:ring-1 focus:ring-cyan-400"
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//                 <option value="all">All</option>
//               </select>

//               <input
//                 type="text"
//                 placeholder=" Search by Withdraw ID..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="px-3 py-2 border border-white/40 rounded-md outline-none focus:ring-1 focus:ring-cyan-400 text-sm bg-black/20 text-white placeholder-white/50"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-auto rounded-xl border border-white/20">
//             <table className="w-full border-collapse text-left text-sm text-white">
//               <thead className="bg-white/20 sticky top-0">
//                 <tr>
//                   <th className="px-4 py-3 text-center border-b">Withdraw ID</th>
//                   <th className="px-4 py-3 text-center border-b">User ID</th>
//                   <th className="px-4 py-3 text-center border-b">UserName</th>
//                   <th className="px-4 py-3 text-center border-b">Email</th>
//                   <th className="px-4 py-3 text-center border-b">Payment Type</th>
//                   <th className="px-4 py-3 text-center border-b">Request Amount</th>
//                   <th className="px-4 py-3 text-center border-b">Receive Amount</th>
//                   <th className="px-4 py-3 text-center border-b">Created At</th>
//                   <th className="px-4 py-3 text-center border-b">Status</th>
//                   <th className="px-4 py-3 text-center border-b">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedWithdraws.length > 0 ? (
//                   paginatedWithdraws.map((wid) => (
//                     <tr
//                       key={wid.withdrawal_id}
//                       className= "hover:bg-white/10 transition-colors even:bg-white/5 text-center overflow-auto"
//                     >
//                       <td className="px-4 py-3 border-b">{wid.withdrawal_id}</td>
//                       <td className="px-4 py-3 border-b border-white text-blue-400 mouse-pointer" onClick={() => navigate(`${adminRoutes}userdetails/${wid.user_id}`)}>{wid.user_id}</td>
//                       <td className="px-4 py-3 border-b">{wid.username}</td>
//                       <td className={`px-4 py-3 border-b border-white ${wid.is_lp_added === 0 ? "text-red-500" : "text-white"}`}>{wid.email}</td>
//                       <td className="px-4 py-3 border-b">{wid.payment_method}</td>
//                       <td className="px-4 py-3 border-b">${wid.requested_amount_usd}</td>
//                       <td className="px-4 py-3 border-b">${wid.transfer_amount_usd}</td>
//                       <td className="px-4 py-3 border-b">
//                         {new Date(wid.withdrawal_request_at).toLocaleString()}
//                       </td>
//                       <td className="px-4 py-3 border-b">{wid.withdrawal_status}</td>
//                       <td className="px-4 py-3 border-b">
//                         <button
//                           onClick={() =>
//                             navigate(`${adminRoutes}withdraw/${wid.withdrawal_id}`)
//                           }
//                           className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="text-center py-6 text-white/70 font-medium"
//                     >
//                       No withdrawal records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {itemsPerPage !== "all" && totalPages > 1 && (
//             <div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(1)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 « First
//               </button>
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 ‹ Prev
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(
//                   (page) =>
//                     page === 1 ||
//                     page === totalPages ||
//                     (page >= currentPage - 2 && page <= currentPage + 2)
//                 )
//                 .map((page, index, array) => {
//                   const prevPage = array[index - 1];
//                   const showDots = prevPage && page - prevPage > 1;
//                   return (
//                     <React.Fragment key={page}>
//                       {showDots && <span className="px-2">...</span>}
//                       <button
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-3 py-1 border rounded ${
//                           currentPage === page
//                             ? "bg-cyan-500 text-white"
//                             : "hover:bg-white/10"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     </React.Fragment>
//                   );
//                 })}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next ›
//               </button>
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(totalPages)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Last » 
//               </button>

//               {/* Go To Page */}
//               <div className="flex items-center space-x-2 ml-4 mt-2">
//                 <input
//                   type="number"
//                   min="1"
//                   max={totalPages}
//                   placeholder="Go to..."
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       const page = Number(e.target.value);
//                       if (page >= 1 && page <= totalPages) {
//                         setCurrentPage(page);
//                         e.target.value = "";
//                       } else {
//                         toast.warn(`Enter valid page (1 - ${totalPages})`);
//                       }
//                     }
//                   }}
//                   className="w-20 border rounded px-2 py-1 text-center bg-black/20 text-white border-white/40"
//                 />
//                 <span className="text-white/70 text-sm">/ {totalPages}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Background gradient orbs */}
//         {/* <div className="absolute pointer-events-none top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute pointer-events-none bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}
//     </div>
//   );
// };

// export default AdminWithdraw;


import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";  // ← ADD useLocation
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";

const AdminWithdraw = () => {
  const [adminWithdraw, setAdminWithdraw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination + Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();  // ← ADD THIS

  const fetchWithdraw = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_API_URL}/withdrawal`);
      setAdminWithdraw(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch withdrawals");
      toast.error("Error fetching withdrawals");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount + re-fetch every time user navigates back to this page
  useEffect(() => {
    fetchWithdraw();
  }, [location.key]);  // ← CHANGE THIS (was empty array)

  // Filter by search
  const filteredWithdraws = adminWithdraw.filter((item) =>  item.withdrawal_id.toString().includes(searchTerm) || item.user_id.toString().includes(searchTerm) || item.email.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredWithdraws.length / itemsPerPage);

  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all"
      ? filteredWithdraws.length
      : startIndex + itemsPerPage;

  const paginatedWithdraws =
    itemsPerPage === "all"
      ? filteredWithdraws
      : filteredWithdraws.slice(startIndex, endIndex);

  // Helper component for Action Taken By column
  const WithdrawActionCell = ({ status, adminName, actionTime }) => {
    if (status === "pending" || !status) {
      return (
        <div className="flex flex-col items-center gap-1">
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
      <div className="flex flex-col items-center gap-1">
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
    return <p className="text-center mt-10">Loading withdrawals...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2500} transition={Slide} />

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-3 md:p-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 md:mb-10 text-center">
          Admin Withdrawal Management
        </h1>

        <div className="bg-white/10 shadow-xl rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              All Withdrawal Requests
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 relative z-50 w-full sm:w-auto">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="border border-white/40 rounded-md px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-white bg-black/20 focus:ring-1 focus:ring-cyan-400 w-full sm:w-auto"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value="all">All</option>
              </select>

              <input
                type="text"
                placeholder=" Search by Withdraw ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 sm:px-3 py-1 sm:py-2 border border-white/40 rounded-md outline-none focus:ring-1 focus:ring-cyan-400 text-xs sm:text-sm bg-black/20 text-white placeholder-white/50 w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-w-full rounded-xl border border-white/20">
            <table className="w-full border-collapse text-left text-xs sm:text-sm text-white">
              <thead className="bg-white/20 sticky top-0">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Withdraw ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">User ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">UserName</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Email</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Payment Type</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Request Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Receive Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Created At</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Source</th>
                  {/* UPDATED: min-width for Action Taken By */}
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b min-w-[120px] sm:min-w-[150px] md:min-w-[180px] whitespace-nowrap">Action Taken By</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center border-b whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWithdraws.length > 0 ? (
                  paginatedWithdraws.map((wid) => (
                    <tr
                      key={wid.withdrawal_id}
                      className= "hover:bg-white/10 transition-colors even:bg-white/5 text-center overflow-auto text-xs sm:text-sm border-b"
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{wid.withdrawal_id}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-white text-blue-400 cursor-pointer whitespace-nowrap" onClick={() => navigate(`${adminRoutes}userdetails/${wid.user_id}`)}>{wid.user_id}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{wid.username}</td>
                      <td className={`px-2 sm:px-4 py-2 sm:py-3 border-white whitespace-nowrap ${wid.is_lp_added === 0 ? "text-red-500" : "text-white"}`}>{wid.email}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{wid.payment_method}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">${wid.requested_amount_usd}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">${wid.transfer_amount_usd}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        {new Date(wid.withdrawal_request_at).toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{wid.withdrawal_status}</td>
                      <td className="px-4 py-3 border-b">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          wid.withdrawal_source === 'mobile_app'
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        }`}>
                          {wid.withdrawal_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <WithdrawActionCell
                          status={wid.withdrawal_status}
                          adminName={wid.verified_by_admin_name}
                          actionTime={wid.withdrawal_verified_at}
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`${adminRoutes}withdraw/${wid.withdrawal_id}`)
                          }
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center py-6 text-white/70 font-medium"
                    >
                      No withdrawal records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                  const prevPage = array[index - 1];
                  const showDots = prevPage && page - prevPage > 1;
                  return (
                    <React.Fragment key={page}>
                      {showDots && <span className="px-1 text-xs">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded ${
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

              {/* Go To Page */}
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
                  className="w-12 sm:w-20 border rounded px-2 py-1 text-center bg-black/20 text-white border-white/40 text-xs sm:text-sm"
                />
                <span className="text-white/70 text-xs sm:text-sm">/ {totalPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWithdraw;

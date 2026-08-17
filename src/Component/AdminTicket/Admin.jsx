// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import AdminSidenav from "../Admin/AdminSidenav";
// import AdminNavbar from "../Admin/AdminNavebar";
// import Reply from "./Reply";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BACKEND_API_URL } from "../../api/config";
// import { adminRoutes } from "../../App";
// import { Navigate } from "react-router-dom";

// const Admin = () => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedTicket, setSelectedTicket] = useState(null);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const { data } = await axios.get(`${BACKEND_API_URL}/support`);
//         setTickets(data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch tickets");
//         setLoading(false);
//       }
//     };
//     fetchTickets();
//   }, []);

//   if (loading)
//     return <p className="text-center mt-10 text-gray-600">Loading tickets...</p>;
//   if (error)
//     return <p className="text-center mt-10 text-red-600">{error}</p>;

//   //  Filter tickets
//   const filteredTickets = tickets.filter( (t) => t.id.toString().includes(searchTerm) || t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.user_id.toString().includes(searchTerm)
//   );

//   // Pagination logic
//   const totalPages =
//     itemsPerPage === "all" ? 1 : Math.ceil(filteredTickets.length / itemsPerPage);
//   const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
//   const endIndex =
//     itemsPerPage === "all" ? filteredTickets.length : startIndex + itemsPerPage;
//   const paginatedTickets =
//     itemsPerPage === "all"
//       ? filteredTickets
//       : filteredTickets.slice(startIndex, endIndex);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
//       <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

//       {/* Sidebar */}
//       <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900/90 shadow-lg border-r border-gray-700 hidden md:block">
//         <AdminSidenav />
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 md:ml-64 flex flex-col">
//         <header className="sticky top-0 bg-gray-900 shadow-md border-b border-gray-700 z-10">
//           <AdminNavbar />
//         </header>

//         <main className="flex-1 p-6 md:p-10 my-20">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center">
//              Support Ticket Management
//           </h1>

//           {/* Table Container */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
//             {/* Search + Filter */}
//             <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
//               <h2 className="text-xl font-bold text-white/90">All Tickets</h2>

//               <div className="flex flex-wrap items-center gap-3">
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(
//                       e.target.value === "all" ? "all" : Number(e.target.value)
//                     );
//                     setCurrentPage(1);
//                   }}
//                   className="border border-gray-400 rounded-md px-3 py-1 text-sm bg-gray-800 text-white focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                   <option value="all">All</option>
//                 </select>

//                 <input
//                   type="text"
//                   placeholder=" Search by ID or Subject..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-gray-800 text-white"
//                 />
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto rounded-xl border border-gray-200 ">
//               <table className="w-full border-collapse text-left text-sm">
//                 <thead className="bg-gray-800/80 sticky top-0 text-white">
//                   <tr>
//                     <th className="px-4 py-3 border-b text-center">Ticket ID</th>
//                     <th className="px-4 py-3 border-b text-center">Subject</th>
//                     <th className="px-4 py-3 border-b text-center">User Id</th>
//                     <th className="px-4 py-3 border-b text-center">Status</th>
//                     <th className="px-4 py-3 border-b text-center">File</th>
//                     <th className="px-4 py-3 border-b text-center">Created At</th>
//                     <th className="px-4 py-3 border-b text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedTickets.length > 0 ? (
//                     paginatedTickets.map((t) => (
//                       <tr
//                         key={t.id}
//                         className="hover:bg-white/10 transition-colors even:bg-white/5 text-center"
//                       >
//                         <td className="px-4 py-3 border-b text-white/90">{t.id}</td>
//                         <td className="px-4 py-3 border-b text-white/90">{t.subject}</td>
//                         <td className="px-4 py-3 border-b border-white/90 text-blue-400 cursor-pointer" onClick={() => Navigate(`${adminRoutes}userdetails/${t.user_id}`)}>
//                           {t.user_id}
//                         </td>
//                         <td
//                           className={`px-4 py-3 border-b font-semibold ${
//                             t.status === "closed" ? "text-green-600" : "text-orange-500"
//                           }`}
//                         >
//                           {t.status}
//                         </td>
//                         <td className="px-4 py-3 border-b text-white/90">
//                           {t.message_img ? "Yes" : "No"}
//                         </td>
//                         <td className="px-4 py-3 border-b text-white/90">
//                           {new Date(t.created_at).toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 border-b text-white/90">
//                           <button
//                             onClick={() => setSelectedTicket(t)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center py-6 text-gray-4 00">
//                         No tickets found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {itemsPerPage !== "all" && totalPages > 1 && (
//               <div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(1)}
//                   className="px-3 py-1 border rounded disabled:opacity-50 text-white"
//                 >
//                   « First
//                 </button>
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   className="px-3 py-1 border rounded disabled:opacity-50 text-white"
//                 >
//                   ‹ Prev
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(
//                     (page) =>
//                       page === 1 ||
//                       page === totalPages ||
//                       (page >= currentPage - 2 && page <= currentPage + 2)
//                   )
//                   .map((page, index, array) => {
//                     const prevPage = array[index - 1];
//                     const showDots = prevPage && page - prevPage > 1;
//                     return (
//                       <React.Fragment key={page}>
//                         {showDots && <span className="px-2">...</span>}
//                         <button
//                           onClick={() => setCurrentPage(page)}
//                           className={`px-3 py-1 border rounded ${
//                             currentPage === page
//                               ? "bg-blue-500 text-white"
//                               : "hover:bg-gray-700 text-white"
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       </React.Fragment>
//                     );
//                   })}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   className="px-3 py-1 border rounded disabled:opacity-50 text-white"
//                 >
//                   Next ›
//                 </button>
//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(totalPages)}
//                   className="px-3 py-1 border rounded disabled:opacity-50 text-white"
//                 >
//                   Last »
//                 </button>

//                 <div className="flex items-center space-x-2 ml-4 mt-2">
//                   <input
//                     type="number"
//                     min="1"
//                     max={totalPages}
//                     placeholder="Go to..."
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         const page = Number(e.target.value);
//                         if (page >= 1 && page <= totalPages) {
//                           setCurrentPage(page);
//                           e.target.value = "";
//                         } else {
//                           toast.warn(`Enter valid page (1 - ${totalPages})`);
//                         }
//                       }
//                     }}
//                     className="w-20 border rounded px-2 py-1 text-center bg-gray-800 text-white"
//                   />
//                   <span className="text-white text-sm">/ {totalPages}</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {selectedTicket && (
//             <Reply
//               ticket={selectedTicket}
//               setTickets={setTickets}
//               onclose={() => setSelectedTicket(null)}
//             />
//           )}
//         </main>
//          {/* Optional background glowing orbs */}
//         {/* <div className="absolute pointer-events-none top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute pointer-events-none bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}
//       </div>
//     </div>
//   );
// };

// export default Admin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../Admin/AdminLayout";
import Reply from "./Reply";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/support`);
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tickets");
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading tickets...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  //  Filter tickets
  const filteredTickets = tickets.filter( (t) => t.id.toString().includes(searchTerm) || t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.user_id.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? filteredTickets.length : startIndex + itemsPerPage;
  const paginatedTickets =
    itemsPerPage === "all"
      ? filteredTickets
      : filteredTickets.slice(startIndex, endIndex);

  // Helper component for Support Action Taken By column
  const SupportActionCell = ({ ticket }) => {
    const isClosed = ticket.status === "closed" || ticket.chat_ended === "yes";
    const isOpen = ticket.status === "open";

    if (isOpen && ticket.chat_ended !== "yes") {
      return (
        <div className="flex flex-col items-center gap-1 ">
          {/* <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            ⏳ Open
          </span> */}
          <span className="text-gray-400 text-xs px-2 py-1.5">No action yet</span>
        </div>
      );
    }

    // Closed / acted upon
    return (
      <div className="flex flex-col items-center gap-0.5">
        {/* <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">
          ✅ Closed
        </span> */}
        {ticket.closed_by_admin_name ? (
          <span className="text-cyan-300 text-[11px] font-semibold">
            By: {ticket.closed_by_admin_name}
          </span>
        ) : (
          <span className="text-gray-100 text-[10px]">By: —</span>
        )}
        {ticket.updated_at ? (
          <span className="text-white/50 text-[10px]">
            {new Date(ticket.updated_at).toLocaleString()}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

        <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center">
             Support Ticket Management
          </h1>

          {/* Table Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-3 md:p-4 lg:p-6 border border-white/20 overflow-x-auto">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <h2 className="text-lg md:text-xl font-bold text-white/90">All Tickets</h2>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    );
                    setCurrentPage(1);
                  }}
                  className="border border-gray-400 rounded-md px-3 py-1 text-xs md:text-sm bg-gray-800 text-white focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="all">All</option>
                </select>

                <input
                  type="text"
                  placeholder="Search by ID or Subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-500 text-xs md:text-sm bg-gray-800 text-white w-full md:w-auto"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 max-w-full">
              <table className="w-full border-collapse text-center text-xs md:text-sm">
                <thead className="bg-gray-800/80 sticky top-0 text-white">
                  <tr>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Ticket ID</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Subject</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">User Id</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Status</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">File</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Created At</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Source</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center min-w-[140px] md:min-w-[180px]">Action Taken By</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-white/10 transition-colors even:bg-white/5 text-center"
                      >
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b text-white/90 text-xs md:text-sm">{t.id}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b text-white/90 text-xs md:text-sm">{t.subject}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b border-white/90 text-blue-400 cursor-pointer text-xs md:text-sm" onClick={() => navigate(`${adminRoutes}userdetails/${t.user_id}`)}>
                          {t.user_id}
                        </td>
                        <td
                          className={`px-2 md:px-4 py-2 md:py-3 border-b font-semibold text-xs md:text-sm ${
                            t.status === "closed" ? "text-green-600" : "text-orange-500"
                          }`}
                        >
                          {t.status}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b text-white/90 text-xs md:text-sm">
                          {t.message_img ? "Yes" : "No"}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b text-white/90 text-xs md:text-sm">
                          {new Date(t.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            t.ticket_source === 'mobile_app'
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                          }`}>
                            {t.ticket_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
                          </span>
                        </td>
                        <td className="flex items-center justify-center px-2 md:px-4 py-2 md:py-3 border-b">
                          <SupportActionCell ticket={t} />
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 border-b text-white/90">
                          <button
                            onClick={() => setSelectedTicket(t)}
                            className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded hover:bg-blue-700 transition text-xs md:text-sm whitespace-nowrap"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 md:py-6 text-gray-400 text-xs md:text-sm">
                        No tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {itemsPerPage !== "all" && totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-4 md:mt-6 gap-1 md:gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2 md:px-3 py-1 border rounded disabled:opacity-50 text-white text-xs md:text-sm"
                >
                  « First
                </button>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-2 md:px-3 py-1 border rounded disabled:opacity-50 text-white text-xs md:text-sm"
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
                          className={`px-2 md:px-3 py-1 border rounded text-xs md:text-sm ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-700 text-white"
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
                  className="px-2 md:px-3 py-1 border rounded disabled:opacity-50 text-white text-xs md:text-sm"
                >
                  Next ›
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2 md:px-3 py-1 border rounded disabled:opacity-50 text-white text-xs md:text-sm"
                >
                  Last »
                </button>

                <div className="flex items-center gap-1 md:gap-2 ml-2 mt-2 md:mt-0 w-full md:w-auto">
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
                    className="w-16 md:w-20 border rounded px-2 py-1 text-center bg-gray-800 text-white text-xs md:text-sm"
                  />
                  <span className="text-white text-xs md:text-sm">/ {totalPages}</span>
                </div>
              </div>
            )}
          </div>

          {selectedTicket && (
            <Reply
              ticket={selectedTicket}
              setTickets={setTickets}
              onclose={() => setSelectedTicket(null)}
            />
          )}
        </main>
    </AdminLayout>
  );
};

export default Admin;


// import React, { useEffect, useState } from "react";
// import myclientIcon from "../../../assets/img/ib/Earnings/total_earnings.svg";
// import monthclientIcon from "../../../assets/img/ib/Earnings/month.svg";
// import yesterdayIcon from "../../../assets/img/ib/Earnings/Income.svg";
// import earningIcon from "../../../assets/img/ib/Earnings/earnings.svg";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import IBNavbar from "../IbNavbar";
// import IBSidebar from "../IbSidebar";
// import { BACKEND_API_URL } from "../../../api/config";
// import useDashboardstats from "../../hooks/useDashboardStats";

// const IBEarnings = () => {

//   const { user, token } = useAuth();
//   const [earn, setEarn] = useState([]);
//   const {dashboardStasts}= useDashboardstats();
//   const IbId = user?.user_id;
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [search, setSearch] = useState("");


//   // Clients
//   useEffect(() => {
//     const fetchClientDetails = async () => {  
//       try {
//         const res = await axios.get(`${BACKEND_API_URL}/ib/earnings-clients-data/${IbId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (res.data.status === "success") {
//           setEarn(res.data.data)
//         }
//       } catch (error) {
//         console.error("Failed to fetch client details", error);
//       }
//     }
//     if (token && IbId) fetchClientDetails();
//   }, [token, IbId])

//       // Search Functionallity

//   const filterTransfer = earn.filter((earn) => {
//     const keyWord = search.toLowerCase();

//     return (
//       earn.id?.toString().toLowerCase().includes(keyWord) || earn.username.toString().toLowerCase().includes(keyWord)
//     );
//   });

//   const displayedData = itemsPerPage === 'all' ? filterTransfer : filterTransfer.slice(0,itemsPerPage);


//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <IBNavbar />

//       <div className="flex pt-20">
//         {/* Sidebar (hidden on mobile) */}
//         <div className="md:w-64 2xl:w-80">
//           <IBSidebar />
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 px-4 sm:px-4 lg:px-5 py-6 space-y-8">
//           {/* Page Title */}
//           <div className="flex items-center gap-3 mb-8">
//             <img src={earningIcon} alt="" className="w-16" />
//             <h1 className="text-4xl font-semibold">Earnings</h1>
//           </div>

//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {/* Card */}
//             <div className="border border-[#FF7801] rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36">
//               {/* <div className="w-15 h-15 rounded-full bg-[#FFF3E9] flex items-center justify-center"></div> */}
//               <img src={myclientIcon} className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-500">
//                   Total Earnings
//                 </p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold text-black">
//                   $ {Number(dashboardStasts.total_revenue).toFixed(2)}
//                 </h2>
//               </div>
//             </div>

//             <div className="border border-[#FF7801] rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36">
//               {/* <div className="w-15 h-15 rounded-full bg-[#FFF3E9] flex items-center justify-center"></div> */}
//               <img src={monthclientIcon} className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-500">
//                   This Month Earnings
//                 </p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold text-black">
//                   $ {Number(dashboardStasts.month_revenue).toFixed(2)}
//                 </h2>
//               </div>
//             </div>

//             <div className="border border-[#FF7801] rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36">
//               {/* <div className="w-15 h-15 rounded-full bg-[#FFF3E9] flex items-center justify-center"></div> */}
//               <img src={yesterdayIcon} className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-500">
//                   Yesterday Earnings
//                 </p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold text-black">
//                   $ {Number(dashboardStasts.yesterday_revenue).toFixed(2)}
//                 </h2>
//               </div>
//             </div>
//           </div>

//           {/* Analytics Section */}
//           {/* <div className="border border-[#FF7801] rounded-lg overflow-hidden">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b">
//               <div className="bg-[#024AFF] text-white px-5 py-3 text-sm font-medium w-fit">
//                 Client’s Analytics
//               </div>

//               <select className="border rounded-md px-3 py-2 text-sm mx-4 mb-3 sm:mb-0 sm:mr-4">
//                 <option>Last 7 Days</option>
//                 <option>Last 30 Days</option>
//               </select>
//             </div>

//             <div className="p-4">
//               <div className="h-52 sm:h-64 border border-dashed rounded-lg flex items-center justify-center text-gray-400 text-sm">
//                 Line Chart Here
//               </div>
//             </div>
//           </div> */}

//           {/* Client Data Section */}
//           <div className="border border-[#FF7801] rounded-lg p-4 sm:p-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//               <h2 className="text-2xl font-semibold text-black">
//                 Earnings Data
//               </h2>
// <div className="flex items-center gap-2">

//              <select value={itemsPerPage} onChange={(e)=> setItemsPerPage(e.target.value)} className=' p-0.5 border border-black rounded-sm'>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value="all">All</option>
//             </select>

//               <input
//                 type="text" value={search}
//                 placeholder="Search anything here..."
//                 className="border rounded-md px-3 py-2 text-sm w-full sm:w-64" onChange={(e)=> setSearch(e.target.value)}
//               />
// </div>

//             </div>

//             {/* Table */}
//             <div className="w-full  rounded-lg bg-white">
//               {/* ================= Desktop Table ================= */}
//               <div className="hidden lg:block max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg">
//                 <table className="w-full border-collapse">
//                   <thead className="sticky top-0 bg-[#FFF9F2] z-10 text-xl font-semibold text-gray-800">
//                     <tr className="text-center">
//                       <th className="px-4 py-4">S.No</th>
//                       <th className="px-4 py-4">Name</th>
//                       <th className="px-4 py-4">Account ID</th>
//                       {/* <th className="px-4 py-4">Phone</th> */}
//                       <th className="px-4 py-4">Date and Time</th>
//                       <th className="px-4 py-4">Earnings</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {displayedData.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="text-center py-6 text-gray-500">
//                           No earnings data found
//                         </td>
//                       </tr>
//                     ) : (
//                       displayedData.map((row, i) => (
//                         <tr
//                           key={row.id}
//                           className="text-lg bg-[#FFFBF7] hover:bg-[#fff4ead7] text-gray-800 text-center"
//                         >
//                           <td className="px-4 py-5">{i + 1}</td>
//                           <td className="px-4 py-5">{row.username}</td>
//                           <td className="px-4 py-5">{row.id}</td>
//                           {/* <td className="px-4 py-5">{row.whatsapp_number}</td> */}
//                           <td className="px-4 py-5">
//                             {new Date(row.account_created_at).toLocaleString()}
//                           </td>
//                           <td className="px-4 py-5 font-semibold text-orange-500">
//                             {Number(row.total_commission).toFixed(2)} USD
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>

//                 </table>
//               </div>

//               {/* ================= Mobile Card View ================= */}
//               <div className="lg:hidden p-3 space-y-4 bg-[#FFFCF8]">
//                 {
//                   displayedData.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="text-center py-6 px-10 text-gray-500">No earnings data found</td>
//                     </tr>
//                   ) :


//                     displayedData.map((row, i) => (
//                       <div
//                         key={i}
//                         className="border rounded-lg p-4 shadow-sm bg-white text-sm"
//                       >
//                         <div className="flex justify-between">
//                           <span className="font-medium text-gray-500">S.No</span>
//                           <span>{i + 1}</span>
//                         </div>

//                         <div className="flex justify-between mt-2">
//                           <span className="font-medium text-gray-500">Name</span>
//                           <span>{row.username}</span>
//                         </div>

//                         <div className="flex justify-between mt-2">
//                           <span className="font-medium text-gray-500">Account ID</span>
//                           <span>{row.id}</span>
//                         </div>

//                         {/* <div className="flex justify-between mt-2">
//                           <span className="font-medium text-gray-500">Phone</span>
//                           <span>{row.whatsapp_number}</span>
//                         </div> */}

//                         <div className="flex justify-between mt-2">
//                           <span className="font-medium text-gray-500">Date & Time</span>
//                           <span>{new Date(row.account_created_at).toLocaleString()}</span>
//                         </div>

//                         <div className="flex justify-between mt-2">
//                           <span className="font-medium text-gray-500">Earnings</span>
//                           <span className="font-semibold text-orange-500">
//                             {row.total_commission}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//               </div>
//             </div>

//             {/* Pagination */}
//             {/* <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mt-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <span>Show:</span>
//                 <select className="border rounded px-2 py-1">
//                   <option>10</option>
//                   <option>25</option>
//                   <option>50</option>
//                   <option>ALL</option>
//                 </select>
//               </div>

//               <span>1 - 10 of 100</span>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IBEarnings;



import React, { useEffect, useState } from "react";
import myclientIcon from "../../../assets/img/ib/Earnings/total_earnings.svg";
import monthclientIcon from "../../../assets/img/ib/Earnings/month.svg";
import yesterdayIcon from "../../../assets/img/ib/Earnings/Income.svg";
import earningIcon from "../../../assets/img/ib/Earnings/earnings.svg";
import axios from "../../../services/api";
import { useAuth } from "../../context/AuthContext";
import IBNavbar from "../IBNavbar";
import IBSidebar from "../IBSidebar";
import { BACKEND_API_URL } from "../../../api/config";
import useDashboardstats from "../../hooks/useDashboardStats";
import { useTheme } from "../../../context/ThemeContext";

const IBEarnings = () => {

  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [earn, setEarn] = useState([]);
  const {dashboardStasts}= useDashboardstats();
  const IbId = user?.user_id;
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");


  // Clients
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/ib/earnings-clients-data/${IbId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status === "success") {
          setEarn(res.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch client details", error);
      }
    }
    if (token && IbId) fetchClientDetails();
  }, [token, IbId])

  // Search Functionallity

  const filterTransfer = earn.filter((earn) => {
    const keyWord = search.toLowerCase();

    return (
      earn.id?.toString().toLowerCase().includes(keyWord) || earn.username.toString().toLowerCase().includes(keyWord)
    );
  });

  const displayedData = itemsPerPage === 'all' ? filterTransfer : filterTransfer.slice(0,itemsPerPage);


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
      {/* Navbar */}
      <IBNavbar />

      <div className="flex pt-20">
        {/* Sidebar (hidden on mobile) */}
        <div className="md:w-64 2xl:w-80">
          <IBSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-4 lg:px-5 py-6 space-y-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <img src={earningIcon} alt="" className={`w-16 transition-all duration-200 ${isDark ? "brightness-0 invert" : ""}`} />
            <h1 className={`text-4xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>Earnings</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card */}
            <div className={`border rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#1A242B]" : "border-blue-300"}`}>
              <img src={myclientIcon} className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>
                  Total Earnings
                </p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
                  $ {Number(dashboardStasts.total_revenue).toFixed(2)}
                </h2>
              </div>
            </div>

            <div className={`border rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#1A242B]" : "border-blue-300"}`}>
              <img src={monthclientIcon} className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>
                  This Month Earnings
                </p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
                  $ {Number(dashboardStasts.month_revenue).toFixed(2)}
                </h2>
              </div>
            </div>

            <div className={`border rounded-lg p-4 sm:p-5 flex items-center gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#1A242B]" : "border-blue-300"}`}>
              <img src={yesterdayIcon} className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>
                  Yesterday Earnings
                </p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
                  $ {Number(dashboardStasts.yesterday_revenue).toFixed(2)}
                </h2>
              </div>
            </div>
          </div>

          {/* Client Data Section */}
          <div className={`border rounded-lg p-4 sm:p-6 transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#141D22]" : "border-blue-300 bg-white"}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
                Earnings Data
              </h2>
              <div className="flex items-center gap-2">
                <select 
                  value={itemsPerPage} 
                  onChange={(e)=> setItemsPerPage(e.target.value)} 
                  className={`p-0.5 border rounded-sm outline-none transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : "border-black"}`}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value="all">All</option>
                </select>

                <input
                  type="text" 
                  value={search}
                  placeholder="Search anything here..."
                  className={`border rounded-md px-3 py-2 text-sm w-full sm:w-64 outline-none focus:ring-1 focus:ring-blue-400 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : ""}`} 
                  onChange={(e)=> setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className={`w-full rounded-lg transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
              {/* ================= Desktop Table ================= */}
              <div className="hidden lg:block max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg">
                <table className="w-full border-collapse">
                  <thead className={`sticky top-0 z-10 text-xl font-semibold text-center transition-colors duration-300 ${isDark ? "bg-[#1A242B] text-white" : "bg-blue-100 text-gray-800"}`}>
                    <tr className="text-center">
                      <th className="px-4 py-4">S.No</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Account ID</th>
                      <th className="px-4 py-4">Date and Time</th>
                      <th className="px-4 py-4">Earnings</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={`text-center py-6 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>
                          No earnings data found
                        </td>
                      </tr>
                    ) : (
                      displayedData.map((row, i) => (
                        <tr
                          key={row.id}
                          className={`text-lg text-center transition-colors duration-300 ${isDark ? "bg-[#141D22] hover:bg-[#1A242B] text-white border-b border-[#4A5568]" : "bg-[#f7fdff] hover:bg-blue-50 text-gray-800"}`}
                        >
                          <td className="px-4 py-5">{i + 1}</td>
                          <td className="px-4 py-5">{row.username}</td>
                          <td className="px-4 py-5">{row.id}</td>
                          <td className="px-4 py-5">
                            {new Date(row.account_created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-5 font-semibold text-blue-500">
                            {Number(row.total_commission).toFixed(2)} USD
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>

              {/* ================= Mobile Card View ================= */}
              <div className={`lg:hidden p-3 space-y-4 transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-[#FFFCF8]"}`}>
                {
                  displayedData.length === 0 ? (
                    <div className={`text-center py-6 px-10 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>No earnings data found</div>
                  ) :
                    displayedData.map((row, i) => (
                      <div
                        key={i}
                        className={`border rounded-lg p-4 shadow-sm text-sm transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-white"}`}
                      >
                        <div className="flex justify-between">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>S.No</span>
                          <span className={isDark ? "text-white" : ""}>{i + 1}</span>
                        </div>

                        <div className="flex justify-between mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Name</span>
                          <span className={isDark ? "text-white" : ""}>{row.username}</span>
                        </div>

                        <div className="flex justify-between mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Account ID</span>
                          <span className={isDark ? "text-white" : ""}>{row.id}</span>
                        </div>

                        <div className="flex justify-between mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Date & Time</span>
                          <span className={isDark ? "text-white" : ""}>{new Date(row.account_created_at).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Earnings</span>
                          <span className="font-semibold text-orange-500">
                            {row.total_commission}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBEarnings;

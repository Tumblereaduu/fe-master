// import React, { useEffect, useState } from "react";
// import IBSidebar from "../IbSidebar";
// import IBNavbar from "../IbNavbar";
// import myclientIcon from "../../../assets/img/ib/clients/total_clients.svg";
// import monthclientIcon from "../../../assets/img/ib/clients/month.svg";
// import yesterdayIcon from "../../../assets/img/ib/clients/yesterday_client.svg";
// import clientIcon from "../../../assets/img/ib/clients/client.svg";
// import { useAuth } from "../../context/AuthContext";
// import { BACKEND_API_URL } from "../../../api/config";
// import axios from "axios";
// import useDashboardstats from "../../hooks/useDashboardStats";

// const IBMyClients = () => {

//   const { user, token } = useAuth();
//   const [earn, setEarn] = useState([]);
//   const {dashboardStasts} = useDashboardstats();
//   const IbId = user?.user_id;
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [search, setSearch] = useState("");



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

//     // Search Functionallity

//   const filterTransfer = earn.filter((earn) => {
//     const keyWord = search.toLowerCase();

//     return (
//       earn.id?.toString().toLowerCase().includes(keyWord) || earn.username.toString().toLowerCase().includes(keyWord)
//     );
//   });

//   const displayedData = itemsPerPage === 'all' ? filterTransfer : filterTransfer.slice(0,itemsPerPage);

//   return (
//     <div className="min-h-screen bg-white">
//       <IBNavbar />

//       <div className="flex pt-20">
//         {/* Sidebar */}
//         <div className="md:w-64 2xl:w-80">
//           <IBSidebar />
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 px-4 sm:px-4 lg:px-5 py-6 space-y-8">
//           {/* Page Title */}
//           <div className="flex items-center gap-3 mb-8">
//             <img src={clientIcon} alt="" className="w-16" />
//             <h1 className="text-4xl font-semibold">My Clients </h1>
//           </div>


//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

//             {/* Total Clients */}
//             <div className="bg-white border border-[#FF7801] rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36">
//               {/* <div className="w-12 h-12 rounded-full bg-[#FFF3E9]" /> */}
//               <img src={myclientIcon} alt="" className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-700">Total Clients</p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold">{dashboardStasts.total_clients}</h2>
//               </div>
//             </div>

//             {/* This Month Clients */}
//             <div className="bg-white border border-[#FF7801] rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36">
//               {/* <div className="w-12 h-12 rounded-full bg-[#FFF3E9]" /> */}
//               <img src={monthclientIcon} alt="" className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-700">This Month Clients</p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold">{dashboardStasts.month_clients}</h2>
//               </div>
//             </div>

//             {/* Yesterday Clients */}
//             <div className="bg-white border border-[#FF7801] rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36">
//               {/* <div className="w-12 h-12 rounded-full bg-[#FFF3E9]" /> */}
//               <img src={yesterdayIcon} alt="" className="lg:w-20" />
//               <div>
//                 <p className="text-sm lg:text-2xl text-gray-700">Yesterday Clients</p>
//                 <h2 className="text-2xl lg:text-3xl font-semibold ">{dashboardStasts.yesterday_clients}</h2>
//               </div>
//             </div>

//           </div>

//           {/* Analytics Section */}
//           {/* <div className="bg-white border border-[#FF7801] rounded-lg p-6 mb-8">
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#024AFF] text-white px-4 py-2 rounded-md text-sm font-medium">
//                   Client’s Analytics
//                 </div>
//               </div>

//               <select className="border rounded-md px-3 py-1 text-sm mt-2">
//                 <option>Last 7 Days</option>
//                 <option>Last 30 Days</option>
//               </select>
//             </div>

//             <div className="h-64 border border-dashed rounded-lg flex items-center justify-center text-gray-400 text-sm">
//               Line Chart Here
//             </div>
//           </div> */}

//           {/* Client Data Table */}
//           <div className="bg-white border border-[#FF7801] rounded-lg p-6">

//  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//               <h2 className="text-2xl font-semibold">Client’s Data</h2>
              
//             <div className="flex items-center gap-2">
//              <select value={itemsPerPage} onChange={(e)=> setItemsPerPage(e.target.value)} className=' p-0.5 border border-black rounded-sm'>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value="all">All</option>
//             </select>

//               <input
//                 type="text"
//                 placeholder="Search anything here..."
//                 value={search} onChange={(e)=> setSearch(e.target.value)}
//                 className="border rounded-md px-3 py-2 text-sm w-55 md:w-64"
//               />
//               </div>
//             </div>

//             <div className="w-full">
//               {/* Desktop Table */}
//               <div className="hidden lg:block overflow-x-auto  rounded-lg">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-[#FFF6EE] text-center text-xl">
//                       <th className="px-4 py-4">S.No</th>
//                       <th className="px-4 py-4">Name</th>
//                       <th className="px-4 py-4">Account ID</th>
//                       {/* <th className="px-4 py-4">Phone</th>
//                       <th className="px-4 py-4">Email</th> */}
//                       <th className="px-4 py-4">Joined Date</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {
//                       displayedData.length === 0 ? (
//                         <tr>
//                           <td colspan="6" className="text-center py-6 text-gray-500">No Client data found</td>
//                         </tr>
//                       ) : (
//                         displayedData.map((row, i) => (
//                           <tr
//                             key={i}
//                             className="bg-[#FFFBF7] hover:bg-[#fff4ead7] text-center"
//                           >
//                             <td className="px-4 py-4">{i + 1}</td>
//                             <td className="px-4 py-4">{row.username}</td>
//                             <td className="px-4 py-4">{row.id}</td>
//                             {/* <td className="px-4 py-4">{row.whatsapp_number}</td>
//                                  <td className="px-4 py-4">{row.email}</td> */}
//                             <td className="px-4 py-4">{new Date(row.account_created_at).toLocaleString()}</td>
//                           </tr>
//                         ))
//                       )
//                     }

//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Card View */}
//               <div className="lg:hidden space-y-4">
//                 {
//                   displayedData.length === 0 ? (
//                     <tr>
//                       <td colspan="6" className="text-center py-6 px-10  text-gray-500">No Client Data found</td>
//                     </tr>
//                   ) : (
//                     displayedData.map((row, i) => (
//                       <div
//                         key={i}
//                         className="border rounded-lg p-4 shadow-sm bg-white"
//                       >
//                         <div className="flex justify-between text-sm">
//                           <span className="font-medium">S.No</span>
//                           <span>{i + 1}</span>
//                         </div>

//                         <div className="flex justify-between text-sm mt-2">
//                           <span className="font-medium">Name</span>
//                           <span>{row.username}</span>
//                         </div>

//                         <div className="flex justify-between text-sm mt-2">
//                           <span className="font-medium">Account ID</span>
//                           <span>{row.id}</span>
//                         </div>

//                         {/* <div className="flex justify-between text-sm mt-2">
//                           <span className="font-medium">Phone</span>
//                           <span>7804868241</span>
//                         </div> */}
// {/* 
//                         <div className="flex justify-between text-sm mt-2 break-all">
//                           <span className="font-medium">Email</span>
//                           <span>{row.email}</span>
//                         </div> */}

//                         <div className="flex justify-between text-sm mt-2">
//                           <span className="font-medium">Joined</span>
//                           <span>{new Date(row.account_created_at).toLocaleString()}</span>
//                         </div>
//                       </div>
//                     ))
//                   )
//                 }

//               </div>
//             </div>


//             {/* Pagination */}
//             {/* <div className="flex justify-end items-center gap-4 mt-4 text-sm">
//               <span>Show:</span>
//               <select className="border rounded px-2 py-1">
//                 <option>10</option>
//                 <option>25</option>
//                 <option>50</option>
//                 <option>ALL</option>
//               </select>
//               <span>1 - 10 of 100</span>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IBMyClients;




import React, { useEffect, useState } from "react";
import IBSidebar from "../IBSidebar";
import IBNavbar from "../IBNavbar";
import myclientIcon from "../../../assets/img/ib/clients/total_clients.svg";
import monthclientIcon from "../../../assets/img/ib/clients/month.svg";
import yesterdayIcon from "../../../assets/img/ib/clients/yesterday_client.svg";
import clientIcon from "../../../assets/img/ib/clients/client.svg";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_API_URL } from "../../../api/config";
import axios from "../../../services/api";
import useDashboardstats from "../../hooks/useDashboardStats";
import { useTheme } from "../../../context/ThemeContext";

const IBMyClients = () => {

  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [earn, setEarn] = useState([]);
  const {dashboardStasts} = useDashboardstats();
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
      <IBNavbar />

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="md:w-64 2xl:w-80">
          <IBSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-4 lg:px-5 py-6 space-y-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <img src={clientIcon} alt="" className={`w-16 transition-all duration-200 ${isDark ? "brightness-0 invert" : ""}`} />
            <h1 className={`text-4xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>My Clients </h1>
          </div>


          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Total Clients */}
            <div className={`border rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-white border-blue-300"}`}>
              <img src={myclientIcon} alt="" className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-700"}`}>Total Clients</p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>{dashboardStasts.total_clients}</h2>
              </div>
            </div>

            {/* This Month Clients */}
            <div className={`border rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-white border-blue-300"}`}>
              <img src={monthclientIcon} alt="" className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-700"}`}>This Month Clients</p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>{dashboardStasts.month_clients}</h2>
              </div>
            </div>

            {/* Yesterday Clients */}
            <div className={`border rounded-lg p-1 lg:p-5 flex items-center gap-1 lg:gap-4 h-28 md:h-36 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-white border-blue-300"}`}>
              <img src={yesterdayIcon} alt="" className="lg:w-20" />
              <div>
                <p className={`text-sm lg:text-2xl transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-700"}`}>Yesterday Clients</p>
                <h2 className={`text-2xl lg:text-3xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>{dashboardStasts.yesterday_clients}</h2>
              </div>
            </div>

          </div>

          {/* Client Data Table */}
          <div className={`border rounded-lg p-6 transition-colors duration-300 ${isDark ? "bg-[#141D22] border-[#4A5568]" : "bg-white border-blue-300"}`}>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>Client’s Data</h2>
              
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
                  placeholder="Search anything here..."
                  value={search} onChange={(e)=> setSearch(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm w-55 md:w-64 outline-none focus:ring-1 focus:ring-blue-400 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : ""}`}
                />
              </div>
            </div>

            <div className={`w-full transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`text-center text-xl transition-colors duration-300 ${isDark ? "bg-[#1A242B] text-white" : "bg-blue-100"}`}>
                      <th className="px-4 py-4">S.No</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Account ID</th>
                      <th className="px-4 py-4">Joined Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      displayedData.length === 0 ? (
                        <tr>
                          <td colspan="6" className={`text-center py-6 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>No Client data found</td>
                        </tr>
                      ) : (
                        displayedData.map((row, i) => (
                          <tr
                            key={i}
                            className={`text-center transition-colors duration-300 ${isDark ? "bg-[#141D22] hover:bg-[#1A242B] text-white border-b border-[#4A5568]" : "bg-[#f7fdff] hover:bg-blue-50"}`}
                          >
                            <td className="px-4 py-4">{i + 1}</td>
                            <td className="px-4 py-4">{row.username}</td>
                            <td className="px-4 py-4">{row.id}</td>
                            <td className="px-4 py-4">{new Date(row.account_created_at).toLocaleString()}</td>
                          </tr>
                        ))
                      )
                    }

                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className={`lg:hidden space-y-4 transition-colors duration-300 ${isDark ? "bg-[#141D22]" : ""}`}>
                {
                  displayedData.length === 0 ? (
                    <div className={`text-center py-6 px-10 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>No Client Data found</div>
                  ) : (
                    displayedData.map((row, i) => (
                      <div
                        key={i}
                        className={`border rounded-lg p-4 shadow-sm text-sm transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#1A242B]" : "bg-white"}`}
                      >
                        <div className="flex justify-between text-sm">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : ""}`}>S.No</span>
                          <span className={isDark ? "text-white" : ""}>{i + 1}</span>
                        </div>

                        <div className="flex justify-between text-sm mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : ""}`}>Name</span>
                          <span className={isDark ? "text-white" : ""}>{row.username}</span>
                        </div>

                        <div className="flex justify-between text-sm mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : ""}`}>Account ID</span>
                          <span className={isDark ? "text-white" : ""}>{row.id}</span>
                        </div>

                        <div className="flex justify-between text-sm mt-2">
                          <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : ""}`}>Joined</span>
                          <span className={isDark ? "text-white" : ""}>{new Date(row.account_created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBMyClients;

// import React, { useEffect, useState } from 'react'
// import { FaSpinner } from "react-icons/fa";
// import IBSidebar from '../IBSidebar'
// import IBNavbar from '../IBNavbar'
// import currentImg from '../../../assets/img/ib/transfer/current-image.svg'
// import tranferIcon from '../../../assets/img/ib/transfer/transfericon.svg'
// import transferredImg from '../../../assets/img/ib/transfer/transferimg.svg'
// import { useAuth } from '../../context/AuthContext'
// import axios from 'axios'
// import { BACKEND_API_URL } from '../../../api/config'
// import { toast } from 'react-toastify'
// import useDashboardstats from '../../hooks/useDashboardStats';
// import { useNavigate } from 'react-router-dom';
// import viewBanner from '../../hooks/viewBanner';

// const IBDeposit = () => {

//   const { token, user } = useAuth();
//   // const [userId,setUserId] =useState(null);
//   const [amount, setAmount] = useState("");
//   const [ibDeposit, setIbDeposit] = useState([]);
//   const {dashboardStasts} = useDashboardstats();
//   const [totalTransferred, setTotalTransferred] = useState(0);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const navigate = useNavigate()
//     const {banners,setBanners} = viewBanner();

//   // Get user info from localStorage
//   //  const storedUser = JSON.parse(localStorage.getItem("user")); // adjust key if different
//   //  const partnerId = storedUser?.user_id;

//   const userId = user?.user_id || user?.id

//   // useEffect(()=>{
//   //     if(user?.id){
//   //         setUserId(user.id)
//   //     }
//   // },[user]);

//   // IB Transfer

//   useEffect(() => {
//     if (!token) return;

//     const fetchIBDeposits = async () => {
//       try {
//         const { data } = await axios.get(`${BACKEND_API_URL}/ib/ib-get/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setIbDeposit(data.data || []);
//         setTotalTransferred(Number(data.total_amount || 0))
//       } catch (error) {
//         console.error("Failed to fetch IB deposits", error);
//         toast.error("Failed to fetch IB deposits");
//       }
//     };

//     fetchIBDeposits();
//   }, [token, userId]);

//   const handleIBDeposit = async () => {

//     const availableAmount = Number(dashboardStasts?.current_earnings || 0)
//     const enterAmount = Number(amount)

//     if (enterAmount > availableAmount) {
//       toast.error("Amount is Insufficient");
//       return;
//     }

//     if (!enterAmount || enterAmount <= 0) {
//       toast.error("Please enter a valid amount")
//       return;
//     }
//     setLoading(true);

//     try {
//       const payload = {
//         enter_amount: amount
//       }

//       const response = await axios.post(`${BACKEND_API_URL}/ib/ib-deposit`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       })
//       toast.success(response.data.message);
//       setTimeout(()=>{
//       navigate("/ib/dashboard")
//       },2500)
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "An error while IB Transfer")
//     } finally {
//       setTimeout(() => {
//         setLoading(false)
//       }, 2500);
//     }
//   }

//   // Search Functionallity

//   const filterTransfer = ibDeposit.filter((ib) => {
//     const keyWord = search.toLowerCase();

//     return (
//       ib.ib_id?.toString().toLowerCase().includes(keyWord) || ib.deposit_status?.toLowerCase().includes(keyWord)
//     );
//   });

//   const displayedData = itemsPerPage === 'all' ? filterTransfer : filterTransfer.slice(0,itemsPerPage);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <IBNavbar />

//       <div className="flex mt-20">
//         {/* Sidebar */}
//         <div className="md:w-64 2xl:w-80">
//           <IBSidebar />
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col gap-5 px-8 py-3">
//           {/* Transfer Header */}
//           <div className="flex items-center gap-3">
//             <img src={tranferIcon} alt="" className="w-10 h-10" />
//             <h2 className="text-2xl font-semibold">Transfer 00</h2>
//           </div>

//           {/* Earnings & Bonus */}
//           <div className="flex flex-col lg:flex-row justify-between gap-10 px-5 md:px-10 border border-[#FF7801] bg-[#FAFAFA] py-5">
//             <div className="flex items-center gap-5">
//               <img src={currentImg} alt="Current" className="w-25 md:w-30 lg:w-35" />
//               <div>
//                 <h2 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-light">Current Earnings</h2>
//                 <h2 className="text-2xl lg:text-5xl font-bold mt-1 lg:mt-5">$ {Number(dashboardStasts.current_earnings).toFixed(2)}</h2>
//               </div>
//             </div>

//             <div className="flex items-center gap-5">
//               <img src={transferredImg} alt="Bonus" className="w-25 md:w-30 lg:w-35" />
//               <div>
//                 <h2 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-light">Transferred Earnings</h2>
//                 <h2 className="text-2xl lg:text-5xl font-bold mt-1 lg:mt-5">$ {totalTransferred.toFixed(2)}</h2>
//               </div>
//             </div>
//           </div>

//           <div className="border border-[#CECECE] my-5"></div>

//           {/* Transfer Form */}
//           <div className="flex justify-between gap-10">
//             <div className="flex flex-col gap-5 w-full max-w-md">
//               <div className="flex flex-col gap-2">
//                 <h2 className="text-xl md:text-2xl lg:text-4xl font-medium">Transfer to</h2>
//                 <input type="text" value={userId} readOnly className="border border-[#FF7902] bg-[#FAFAFA] px-10 py-2.5 lg:py-5 outline-none" />
//               </div>

//               <div className="flex flex-col gap-2" >
//                 <h2 className="text-xl md:text-2xl lg:text-4xl font-medium">Enter Amount in USD</h2>
//                 <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-[#FF7902] bg-[#FAFAFA] px-10 py-2.5 lg:py-5 outline-none" />
//               </div>

//               <span className="text-[#DB0000]">
//                 *Minumum Transfer Amount is 50 USD
//               </span>

//               <button
//                 className="bg-[#F7931A] text-26+xl text-white px-5 py-2 flex items-center justify-center
//                   lg:py-4 cursor-pointer"  onClick={handleIBDeposit}>
//                 {
//                   loading && <FaSpinner className='animate-spin text-white text-lg' />
//                 }
//                 <span>{loading ? "Transfering" : "Confrim"}</span>
//               </button>
//             </div>

//             {/* <div className=" hidden lg:block border border-[#FFCD02] w-fit px-10 py-5 bg-[#FAFAFA]">
//               <img src={currentImg} alt="AD" className="w-90" />
//             </div> */}
//             <div className="hidden md:flex border-2 border-[#FFB200] bg-[#FAFAFA] rounded-lg flex items-center justify-center text-[32px] w-105 font-bold text-black">
//               <img src={banners[1]?.image} alt="N/A" />
//             </div>
//           </div>

//           {/* IB Transfer History */}
//           <div className="mt-10 border-2 border-[#FFB200] rounded-xl p-6 bg-white">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//               <h2 className="text-2xl font-semibold text-black">
//                 IB Transfer History
//               </h2>

//              <div className='flex gap-2 items-center'>
//               <select value={itemsPerPage} onChange={(e)=> setItemsPerPage(e.target.value)} className=' p-0.5 border border-black rounded-sm'>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value="all">All</option>
//             </select>

//               {/* Search */}
//               <div className="relative w-full sm:w-72">
//                 <input
//                   type="text"
//                   placeholder="Search anything here..." value={search} onChange={(e) => setSearch(e.target.value)}
//                   className="w-60 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-400"
//                 />
//               </div>
//               </div>
//             </div>

//             {/* ================= Desktop Table ================= */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full border-collapse text-center text-lg">
//                 <thead>
//                   <tr className="bg-[#FFF9F2] text-black font-medium">
//                     <th className="py-4">IBTr.ID</th>
//                     <th className="py-4">Account ID</th>
//                     <th className="py-4">Date and Time</th>
//                     <th className="py-4">Status</th>
//                     <th className="py-4">Fund</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {
//                     displayedData.length === 0 ? (
//                       <tr>
//                         <td colspan="6" className="text-center py-6 text-gray-500">No Transfer History found</td>
//                       </tr>
//                     ) : (
//                       displayedData.map((ib) => (
//                         <tr
//                           key={ib.ib_id}
//                           className="bg-[#FFFBF7] border-b border-[#EFEFEF] hover:bg-[#fff4ead7]">
//                           <td className="py-6">{ib.ib_id}</td>
//                           <td className="py-6">{ib.user_id}</td>
//                           <td className="py-6">
//                             {new Date(ib.deposit_request_at).toLocaleString()}
//                           </td>
//                           <td className="py-6">{ib.deposit_status}</td>
//                           <td className="py-6 font-semibold text-[#0B5CFF]">
//                             {ib.enter_amount} USD
//                           </td>
//                         </tr>
//                       ))
//                     )
//                   }

//                 </tbody>
//               </table>
//             </div>

//             {/* ================= Mobile Card View ================= */}
//             <div className="lg:hidden space-y-4">
//               {
//                 displayedData.length === 0 ? (
//                   <tr>
//                     <td colspan="6" className="text-center py-6 px-10  text-gray-500">No Transfer History found</td>
//                   </tr>
//                 ) : (
//                   displayedData.map((ib) => (
//                     <div
//                       key={ib.ib_id}
//                       className="border rounded-lg p-4 bg-gray-50 shadow-sm text-sm">
//                       <div className="flex justify-between">
//                         <span className="font-medium text-gray-500">IBTr.ID</span>
//                         <span>{ib.ib_id}</span>
//                       </div>

//                       <div className="flex justify-between mt-2">
//                         <span className="font-medium text-gray-500">Account</span>
//                         <span>{ib.user_id}</span>
//                       </div>

//                       <div className="flex justify-between mt-2">
//                         <span className="font-medium text-gray-500">Date & Time</span>
//                         <span className="text-right">
//                           {new Date(ib.deposit_request_at).toLocaleString()}
//                         </span>
//                       </div>

//                       <div className="flex justify-between mt-2">
//                         <span className="font-medium text-gray-500">Status</span>
//                         <span>{ib.deposit_status}</span>
//                       </div>

//                       <div className="flex justify-between mt-2">
//                         <span className="font-medium text-gray-500">Fund</span>
//                         <span className="font-semibold text-[#0B5CFF]">
//                           {ib.enter_amount} USD
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 )
//               }

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default IBDeposit;


import React, { useEffect, useState } from 'react'
import { FaSpinner } from "react-icons/fa";
import IBSidebar from '../IBSidebar'
import IBNavbar from '../IBNavbar'
import currentImg from '../../../assets/img/ib/transfer/current-image.svg'
import tranferIcon from '../../../assets/img/ib/transfer/transfericon.svg'
import transferredImg from '../../../assets/img/ib/transfer/transferimg.svg'
import { useAuth } from '../../context/AuthContext'
import axios from '../../../services/api'
import { BACKEND_API_URL } from '../../../api/config'
import { toast } from 'react-toastify'
import useDashboardstats from '../../hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import viewBanner from '../../hooks/viewBanner';
import { useTheme } from '../../../context/ThemeContext';

const IBDeposit = () => {

  const { token, user } = useAuth();
  const { isDark } = useTheme();
  const [amount, setAmount] = useState("");
  const [ibDeposit, setIbDeposit] = useState([]);
  const {dashboardStasts} = useDashboardstats();
  const [totalTransferred, setTotalTransferred] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate()
  const {banners,setBanners} = viewBanner();

  const userId = user?.user_id || user?.id

  useEffect(() => {
    if (!token) return;

    const fetchIBDeposits = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/ib/ib-get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIbDeposit(data.data || []);
        setTotalTransferred(Number(data.total_amount || 0))
      } catch (error) {
        console.error("Failed to fetch IB deposits", error);
        toast.error("Failed to fetch IB deposits");
      }
    };

    fetchIBDeposits();
  }, [token, userId]);

  const handleIBDeposit = async () => {

    const availableAmount = Number(dashboardStasts?.current_earnings || 0)
    const enterAmount = Number(amount)

    if (enterAmount > availableAmount) {
      toast.error("Amount is Insufficient");
      return;
    }

    if (!enterAmount || enterAmount <= 0) {
      toast.error("Please enter a valid amount")
      return;
    }
    setLoading(true);

    try {
      const payload = {
        enter_amount: amount
      }

      const response = await axios.post(`${BACKEND_API_URL}/ib/ib-deposit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      toast.success(response.data.message);
      setTimeout(()=>{
      navigate("/ib/dashboard")
      },2500)
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error while IB Transfer")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2500);
    }
  }

  const filterTransfer = ibDeposit.filter((ib) => {
    const keyWord = search.toLowerCase();

    return (
      ib.ib_id?.toString().toLowerCase().includes(keyWord) || ib.deposit_status?.toLowerCase().includes(keyWord)
    );
  });

  const displayedData = itemsPerPage === 'all' ? filterTransfer : filterTransfer.slice(0,itemsPerPage);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
      <IBNavbar />

      <div className="flex mt-20">
        {/* Sidebar */}
        <div className="md:w-64 2xl:w-80">
          <IBSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-5 px-8 py-3">
          {/* Transfer Header */}
          <div className="flex items-center gap-3">
            <img src={tranferIcon} alt="" className={`w-10 h-10 transition-all duration-200 ${isDark ? "brightness-0 invert" : ""}`} />
            <h2 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : ""}`}>Transfer 00</h2>
          </div>

          {/* Earnings & Bonus */}
          <div className={`flex flex-col lg:flex-row justify-between gap-10 px-5 md:px-10 border py-5 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-[#FAFAFA] border-blue-300"}`}>
            <div className="flex items-center gap-5">
              <img src={currentImg} alt="Current" className="w-25 md:w-30 lg:w-35" />
              <div>
                <h2 className={`text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-light transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>Current Earnings</h2>
                <h2 className={`text-2xl lg:text-5xl font-bold mt-1 lg:mt-5 transition-colors duration-300 ${isDark ? "text-white" : ""}`}>$ {Number(dashboardStasts.current_earnings).toFixed(2)}</h2>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <img src={transferredImg} alt="Bonus" className="w-25 md:w-30 lg:w-35" />
              <div>
                <h2 className={`text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-light transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>Transferred Earnings</h2>
                <h2 className={`text-2xl lg:text-5xl font-bold mt-1 lg:mt-5 transition-colors duration-300 ${isDark ? "text-white" : ""}`}>$ {totalTransferred.toFixed(2)}</h2>
              </div>
            </div>
          </div>

          <div className={`border my-5 transition-colors duration-300 ${isDark ? "border-[#4A5568]" : "border-[#CECECE]"}`}></div>

          {/* Transfer Form */}
          <div className="flex justify-between gap-10">
            <div className="flex flex-col gap-5 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <h2 className={`text-xl md:text-2xl lg:text-4xl font-medium transition-colors duration-300 ${isDark ? "text-white" : ""}`}>Transfer to</h2>
                <input type="text" value={userId} readOnly className={`border px-10 py-2.5 lg:py-5 outline-none transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : "border-blue-300 bg-[#FAFAFA]"}`} />
              </div>

              <div className="flex flex-col gap-2" >
                <h2 className={`text-xl md:text-2xl lg:text-4xl font-medium transition-colors duration-300 ${isDark ? "text-white" : ""}`}>Enter Amount in USD</h2>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className={`border px-10 py-2.5 lg:py-5 outline-none transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : "border-blue-300 bg-[#FAFAFA]"}`} />
              </div>

              <span className="text-[#DB0000]">
                *Minumum Transfer Amount is 50 USD
              </span>

              <button
                className="bg-blue-500 text-26+xl text-white px-5 py-2 flex items-center justify-center lg:py-4 cursor-pointer" onClick={handleIBDeposit}>
                {
                  loading && <FaSpinner className='animate-spin text-white text-lg' />
                }
                <span>{loading ? "Transfering" : "Confrim"}</span>
              </button>
            </div>

            <div className={`hidden md:flex border-2 rounded-lg flex items-center justify-center text-[32px] w-105 font-bold transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#1A242B] text-white" : "border-blue-300 bg-[#f7fdff] text-black"}`}>
              <img src={banners[1]?.image} alt="N/A" />
            </div>
          </div>

          {/* IB Transfer History */}
          <div className={`mt-10 border-2 rounded-xl p-6 transition-colors duration-300 ${isDark ? "border-[#4A5568] bg-[#141D22]" : "border-blue-300 bg-white"}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
                IB Transfer History
              </h2>

             <div className='flex gap-2 items-center'>
              <select value={itemsPerPage} onChange={(e)=> setItemsPerPage(e.target.value)} className={`p-0.5 border rounded-sm transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : "border-black"}`}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value="all">All</option>
            </select>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search anything here..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className={`w-60 border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568] text-white" : "border-gray-300"}`}
                />
              </div>
              </div>
            </div>

            {/* ================= Desktop Table ================= */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse text-center text-lg">
                <thead>
                  <tr className={`font-medium transition-colors duration-300 ${isDark ? "bg-[#1A242B] text-white" : "bg-blue-100 text-black"}`}>
                    <th className="py-4">IBTr.ID</th>
                    <th className="py-4">Account ID</th>
                    <th className="py-4">Date and Time</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Fund</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    displayedData.length === 0 ? (
                      <tr>
                        <td colspan="6" className={`text-center py-6 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>No Transfer History found</td>
                      </tr>
                    ) : (
                      displayedData.map((ib) => (
                        <tr
                          key={ib.ib_id}
                          className={`border-b transition-colors duration-300 ${isDark ? "bg-[#141D22] border-[#4A5568] hover:bg-[#1A242B] text-white" : "bg-[#f7fdff] border-[#EFEFEF] hover:bg-blue-50"}`}>
                          <td className="py-6">{ib.ib_id}</td>
                          <td className="py-6">{ib.user_id}</td>
                          <td className="py-6">
                            {new Date(ib.deposit_request_at).toLocaleString()}
                          </td>
                          <td className="py-6">{ib.deposit_status}</td>
                          <td className="py-6 font-semibold text-[#0B5CFF]">
                            {ib.enter_amount} USD
                          </td>
                        </tr>
                      ))
                    )
                  }

                </tbody>
              </table>
            </div>

            {/* ================= Mobile Card View ================= */}
            <div className="lg:hidden space-y-4">
              {
                displayedData.length === 0 ? (
                  <div className={`text-center py-6 px-10 transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>No Transfer History found</div>
                ) : (
                  displayedData.map((ib) => (
                    <div
                      key={ib.ib_id}
                      className={`border rounded-lg p-4 shadow-sm text-sm transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#4A5568]" : "bg-gray-50"}`}>
                      <div className="flex justify-between">
                        <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>IBTr.ID</span>
                        <span className={isDark ? "text-white" : ""}>{ib.ib_id}</span>
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Account</span>
                        <span className={isDark ? "text-white" : ""}>{ib.user_id}</span>
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Date & Time</span>
                        <span className={`text-right ${isDark ? "text-white" : ""}`}>
                          {new Date(ib.deposit_request_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Status</span>
                        <span className={isDark ? "text-white" : ""}>{ib.deposit_status}</span>
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className={`font-medium transition-colors duration-300 ${isDark ? "text-[#A0AEC0]" : "text-gray-500"}`}>Fund</span>
                        <span className="font-semibold text-[#0B5CFF]">
                          {ib.enter_amount} USD
                        </span>
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
  )
}

export default IBDeposit;


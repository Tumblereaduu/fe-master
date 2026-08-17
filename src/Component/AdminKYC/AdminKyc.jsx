// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import AdminSidenav from "../Admin/AdminSidenav";
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from "react-router-dom";
// import { BACKEND_API_URL } from "../../api/config";
// import { adminRoutes } from "../../App";

// const AdminKyc = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { token, user } = useAuth();
//     const navigate = useNavigate();
//     const [search,setSearch] = useState("");
//     const [currentPage,setCurrentPage] = useState(1);
//     const [rowsPerPage,setRowsPerPage] = useState(10);

//     useEffect(() => {
//         const fetchKycData = async () => {
//             try {      
//                 const response = await axios.get(`${BACKEND_API_URL}/kyc/admin/kyc`, {              
//                 });

//                 if (response.data.status === "success") {
//                     const rawData = response.data.data;
//                     const usersArray = Array.isArray(rawData[0]) ? rawData[0] : rawData;
//                     setUsers(usersArray);
//                 } else {
//                     console.error("Unexpected response:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching KYC data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchKycData();
//     }, [token]);

//     if (loading) return <p className="text-center mt-6">Loading KYC data...</p>;

//         // Filter by search     
//         const filteredUsers = users.filter((u) => {
//         const keyword = search.toLowerCase();
//         return (
//         u?.username?.toLowerCase().includes(keyword) ||
//         u?.email?.toLowerCase().includes(keyword) ||
//         String(u?.id).includes(keyword)
//         );
//     });
        
//     // Pagination logic
//     // Pagination logic
//     const totalPages = rowsPerPage === "All" ? 1 : Math.ceil(filteredUsers.length / rowsPerPage);
//     const indexOfLastUser = rowsPerPage === "All" ? filteredUsers.length : currentPage * rowsPerPage;
//     const indexOfFirstUser = rowsPerPage === "All" ? 0 : indexOfLastUser - rowsPerPage;
//     const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

//     const handleSearchChange = (e) => {
//         setSearch(e.target.value);
//         setCurrentPage(1); // reset page when searching
//     };

//     return (
//         <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
//             <div className="hidden md:block md:w-64">
//                 <AdminSidenav />
//             </div>

//             <div className="flex-1 p-6 md:p-10">
//                 {/*  show logged-in admin name */}
//                 <div className="text-center mb-10">
//                     <h1 className="text-3xl md:text-4xl font-extrabold text-white/90 border-b-2 border-cyan-400 inline-block pb-2 mt-20">
//                         KYC VERIFICATION
//                     </h1>
//                 </div>

//                    {/* Search & Rows Per Page */}
//                 <div className="flex justify-between items-center mb-6">
//                 <input
//                     type="text"
//                     value={search}
//                     onChange={handleSearchChange}
//                     placeholder="Search by ID, username, or email..."
//                     className="w-64 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none"
//                 />

//                 <select
//                     value={rowsPerPage}
//                     onChange={(e) => { setRowsPerPage(e.target.value === "All" ? "All" : Number(e.target.value)); setCurrentPage(1); }}
//                     className="px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white"
//                 >
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value="All">All</option>
//                 </select>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border border-white/20 text-white">
//                         <thead className="bg-white/10 backdrop-blur border border-white/20">
//                             <tr>
//                                 <th className="px-4 py-2 border">User ID</th>
//                                 <th className="px-4 py-2 border">User Name</th>
//                                 <th className="px-4 py-2 border">Email</th>
//                                 <th className="px-4 py-2 border">Photo 1</th>
//                                 <th className="px-4 py-2 border">Photo 2</th>
//                                 <th className="px-4 py-2 border">Photo 3</th>
//                                 <th className="px-4 py-2 border">Photo Upload At</th>
//                                 <th className="px-4 py-2 border">Photo Verified At</th>
//                                 <th className="px-4 py-2 border">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {currentUsers.length > 0 ? (
//                                 currentUsers.map((userData, index) => (
//                                     <tr key={userData.id ?? index} className="text-center hover:bg-white/10 transition">
//                                         <td className="px-4 py-2 border">{userData.id ?? "—"}</td>
//                                         <td className="px-4 py-2 border">{userData.username || "—"}</td>
//                                         <td className="px-4 py-2 border">{userData.email || "—"}</td>

//                                         <td className="px-4 py-2 border">
//                                             { userData.photo_id_1_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
//                                               userData.photo_id_1_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
//                                               userData.photo_id_1_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
//                                               userData.photo_id_1 ?(
//                                                 <a href={userData.photo_id_1} target="_blank" rel="noreferrer">
//                                                     {/* <img
//                                                         src={userData.photo_id_1}
//                                                         alt="Photo 1"
//                                                         className="w-16 h-16 object-cover mx-auto rounded"
//                                                     /> */}
//                                                     <span className="text-green-400"> File Attached </span>

//                                                 </a>
//                                             ) : (
//                                                 <span className="text-red-600">No File</span>
//                                             )}
//                                         </td>

//                                         <td className="px-4 py-2 border">
//                                             {userData.photo_id_2_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
//                                               userData.photo_id_2_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
//                                               userData.photo_id_2_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
//                                               userData.photo_id_2 ?(
//                                                 <a href={userData.photo_id_2} target="_blank" rel="noreferrer">
//                                                     {/* <img
//                                                         src={userData.photo_id_2}
//                                                         alt="Photo 2"
//                                                         className="w-16 h-16 object-cover mx-auto rounded"
//                                                     /> */}
//                                                     <span className="text-green-400"> File Attached </span>

//                                                 </a>
//                                             ) : (
//                                                 <span className="text-red-600">No File</span>
//                                             )}
//                                         </td>

//                                         <td className="px-4 py-2 border">
//                                             {userData.photo_id_3_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
//                                               userData.photo_id_3_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
//                                               userData.photo_id_3_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
//                                               userData.photo_id_3 ?(
//                                                 <a href={userData.photo_id_3} target="_blank" rel="noreferrer">
//                                                     <span className="text-green-400"> File Attached </span>
//                                                 </a>
//                                             ) : (
//                                                 <span className="text-red-600">No File</span>
//                                             )}
//                                         </td>
//                                          <td className="px-4 py-2 border">{userData.photo_uploaded_at ? new Date(userData.photo_uploaded_at).toLocaleString() : "—"}</td>
//                                          <td className="px-4 py-2 border">{userData.photo_verification_timestamp ? new Date(userData.photo_verification_timestamp).toLocaleString() : "—"}</td>
//                                         <td className="px-4 py-2 border">
//                                             <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={() => navigate(`${adminRoutes}kyc/${userData.id}`)}>
//                                                 View
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="7" className="text-center py-4 text-white/60">
//                                         No users found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//                 {totalPages > 1 && (
//                 <div className="flex justify-center items-center gap-3 mt-6">
//                     <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
//                     >
//                     Prev
//                     </button>

//                     <span className="text-white/70">
//                     Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                     onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
//                     >
//                     Next
//                     </button>
//                 </div>
//                 )}
//             </div>
//             {/* Background gradient orbs */}
//                 <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
//         </div>
//     );
// };

// export default AdminKyc;


import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../Admin/AdminLayout";
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";

const AdminKyc = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [search,setSearch] = useState("");
    const [currentPage,setCurrentPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchKycData = async () => {
            try {      
                const response = await axios.get(`${BACKEND_API_URL}/kyc/admin/kyc`, {              
                });

                if (response.data.status === "success") {
                    const rawData = response.data.data;
                    const usersArray = Array.isArray(rawData[0]) ? rawData[0] : rawData;
                    setUsers(usersArray);
                } else {
                    console.error("Unexpected response:", response.data);
                }
            } catch (error) {
                console.error("Error fetching KYC data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKycData();
    }, [token, location.key]);

    if (loading) return <p className="text-center mt-6">Loading KYC data...</p>;

        // Filter by search     
        const filteredUsers = users.filter((u) => {
        const keyword = search.toLowerCase();
        return (
        u?.username?.toLowerCase().includes(keyword) ||
        u?.email?.toLowerCase().includes(keyword) ||
        String(u?.id).includes(keyword)
        );
    });
        
    // Pagination logic
    const totalPages = rowsPerPage === "All" ? 1 : Math.ceil(filteredUsers.length / rowsPerPage);
    const indexOfLastUser = rowsPerPage === "All" ? filteredUsers.length : currentPage * rowsPerPage;
    const indexOfFirstUser = rowsPerPage === "All" ? 0 : indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // reset page when searching
    };

    // Helper component for KYC Action Taken By column
    const KycActionCell = ({ user }) => {
        // Determine overall status from individual photo statuses
        const photo1Status = user.photo_id_1_status;
        const photo2Status = user.photo_id_2_status;
        const photo3Status = user.photo_id_3_status;

        const isAllApproved = photo1Status === "approved" && photo2Status === "approved" && photo3Status === "approved";
        const hasRejected = photo1Status === "rejected" || photo2Status === "rejected" || photo3Status === "rejected";
        const hasAnyPhoto = user.photo_id_1 || user.photo_id_2 || user.photo_id_3;

        let overallStatus = "pending";
        if (isAllApproved) overallStatus = "approved";
        else if (hasRejected) overallStatus = "rejected";
        else if (!hasAnyPhoto) overallStatus = "none";

        if (overallStatus === "none" || overallStatus === "pending") {
            return (
                <div className="flex flex-col items-start gap-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        ⏳ Pending
                    </span>
                    <span className="text-gray-500 text-[10px]">No action yet</span>
                </div>
            );
        }

        const isApproved = overallStatus === "approved";

        return (
            <div className="flex flex-col items-start gap-1">
                <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isApproved
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                >
                    {isApproved ? "✅ Approved" : "❌ Rejected"}
                </span>
                {user.photo_verified_by_admin_name ? (
                    <span className="text-cyan-300 text-[11px] font-semibold">
                        By: {user.photo_verified_by_admin_name}
                    </span>
                ) : (
                    <span className="text-gray-500 text-[10px]">By: —</span>
                )}
                {user.photo_verification_timestamp ? (
                    <span className="text-white/40 text-[10px]">
                        {new Date(user.photo_verification_timestamp).toLocaleString()}
                    </span>
                ) : null}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="w-full px-2 sm:px-4 md:px-6 py-4 sm:py-6">
                {/*  show logged-in admin name */}
                <div className="text-center mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white/90 border-b-2 border-cyan-400 inline-block pb-2 pt-12">
                        KYC VERIFICATION
                    </h1>
                </div>

                   {/* Search & Rows Per Page */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by ID, username, or email..."
                    className="w-full sm:w-64 px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none text-sm"
                />

                <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(e.target.value === "All" ? "All" : Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white text-sm"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value="All">All</option>
                </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-white/20 text-white">
                        <thead className="bg-white/10 backdrop-blur border border-white/20">
                            <tr>
                                <th className="px-4 py-2 border">User ID</th>
                                <th className="px-4 py-2 border">User Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Photo 1</th>
                                <th className="px-4 py-2 border">Photo 2</th>
                                <th className="px-4 py-2 border">Photo 3</th>
                                <th className="px-4 py-2 border">Photo Upload At</th>
                                <th className="px-4 py-2 border">Photo Verified At</th>
                                {/* UPDATED: min-width for Action Taken By */}
                                <th className="px-4 py-2 border min-w-[180px]">Action Taken By</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((userData, index) => (
                                    <tr key={userData.id ?? index} className="text-center hover:bg-white/10 transition">
                                        <td className="px-4 py-2 border">{userData.id ?? "—"}</td>
                                        <td className="px-4 py-2 border">{userData.username || "—"}</td>
                                        <td className="px-4 py-2 border">{userData.email || "—"}</td>

                                        <td className="px-4 py-2 border">
                                            { userData.photo_id_1_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
                                              userData.photo_id_1_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
                                              userData.photo_id_1_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
                                              userData.photo_id_1 ?(
                                                <a href={userData.photo_id_1} target="_blank" rel="noreferrer">
                                                    {/* <img
                                                        src={userData.photo_id_1}
                                                        alt="Photo 1"
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    /> */}
                                                    <span className="text-green-400"> File Attached </span>

                                                </a>
                                            ) : (
                                                <span className="text-red-600">No File</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.photo_id_2_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
                                              userData.photo_id_2_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
                                              userData.photo_id_2_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
                                              userData.photo_id_2 ?(
                                                <a href={userData.photo_id_2} target="_blank" rel="noreferrer">
                                                    {/* <img
                                                        src={userData.photo_id_2}
                                                        alt="Photo 2"
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    /> */}
                                                    <span className="text-green-400"> File Attached </span>

                                                </a>
                                            ) : (
                                                <span className="text-red-600">No File</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {userData.photo_id_3_status === "approved" ?(<span className="text-green-400 font-semibold">Verified</span> ):
                                              userData.photo_id_3_status === "pending" ?(<span className="text-yellow-400 font-semibold">Pending</span> ):
                                              userData.photo_id_3_status === "rejected" ?(<span className="text-red-600 font-semibold">Rejected</span> ):
                                              userData.photo_id_3 ?(
                                                <a href={userData.photo_id_3} target="_blank" rel="noreferrer">
                                                    <span className="text-green-400"> File Attached </span>
                                                </a>
                                            ) : (
                                                <span className="text-red-600">No File</span>
                                            )}
                                        </td>
                                         <td className="px-4 py-2 border">{userData.photo_uploaded_at ? new Date(userData.photo_uploaded_at).toLocaleString() : "—"}</td>
                                         <td className="px-4 py-2 border">{userData.photo_verification_timestamp ? new Date(userData.photo_verification_timestamp).toLocaleString() : "—"}</td>
                                        {/* UPDATED: Action Taken By with full details */}
                                        <td className="px-4 py-2 border">
                                            <KycActionCell user={userData} />
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={() => navigate(`${adminRoutes}kyc/${userData.id}`)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4 text-white/60">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
                    >
                    Prev
                    </button>

                    <span className="text-white/70">
                    Page {currentPage} of {totalPages}
                    </span>

                    <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50"
                    >
                    Next
                    </button>
                </div>
                )}
            </div>
            {/* Background gradient orbs */}
                <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        </AdminLayout>
    );
};

export default AdminKyc;

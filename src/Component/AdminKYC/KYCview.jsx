// import React, { useEffect, useState } from "react";
// import AdminSidenav from "../Admin/AdminSidenav";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { Slide, toast, ToastContainer } from "react-toastify";
// import { BACKEND_API_URL } from "../../api/config";

// const KYCview = () => {
//   const { id } = useParams();
//   const { token } = useAuth();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingStatus, setLoadingStatus] = useState({ photo_id_1: false, photo_id_2: false, photo_id_3: false, });
//   const [rejectModel, setRejectModel] = useState({ open: false, photoKey: "", reason: "" });
//   const [confirmApprove,setConfirmApprove] = useState({open:false,photoKey:""});


//   const handleRejectClick = (photoKey) => {
//     setRejectModel({ open: true, photoKey, reason: "" });
//   }

//   const submitReject = async () => {
//     if (!rejectModel.reason.trim()) return toast.warning("Reason is Required!.");

//     await handleStatusChange(rejectModel.photoKey, "rejected", rejectModel.reason);
//     setRejectModel({ open: false, photoKey: "", reason: "" });
//   }

//   //  Update photo status (Approve / Reject)
//   const handleStatusChange = async (photoKey, status, reason = null) => {
//     try {
//       setLoadingStatus((prev) => ({ ...prev, [photoKey]: true }));

//       const response = await axios.patch(
//         `${BACKEND_API_URL}/kyc/admin/kyc/${id}/status`,
//         { photokey: photoKey, status, reason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setUserData((prev) => ({
//         ...prev,
//         [`${photoKey}_status`]: status,
//         photo_verification_status: response.data.overallStatus,
//       }));

//       toast.success(` ${photoKey.toUpperCase()} marked as ${status}`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update KYC status");
//     }
//   };

//   //  Fetch KYC details for this user
//   useEffect(() => {
//     const fetchUserKyc = async () => {
//       try {
//         const res = await axios.get(
//           `${BACKEND_API_URL}/kyc/admin/kyc/${id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data && res.data.data) {
//           setUserData(res.data.data[0]);
//           // console.log("Fetched KYC data:", res.data.data);
//         } else {
//           setUserData(null);
//         }
//       } catch (err) {
//         console.error("Error fetching user KYC:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserKyc();
//   }, [id, token]);

//   if (loading) return <p className="text-center mt-10">Loading user details...</p>;
//   if (!userData) return <p className="text-center mt-10 text-red-500">No data found.</p>;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
//       <ToastContainer position="top-right" autoClose={3000} transition={Slide} pauseOnFocusLoss draggable />
//       {/* Sidebar */}
//       <div className="hidden md:block md:w-64 bg-white shadow-lg">
//         <AdminSidenav />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 md:p-10">
//         {/* Header */}
//         <div className="text-center mb-20">
//         </div>

//         {/* User Info */}
//         <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2">
//             User Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
//             <p><span className="font-bold">User ID:</span> {userData.id}</p>
//             <p><span className="font-bold">Username:</span> {userData.username}</p>
//             <p><span className="font-bold">Email:</span> {userData.email}</p>
//           </div>
//         </div>

//         {/* Photo Verification */}
//         <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl font-semibold text-white/90 mb-4 border-b border-white/20 pb-2">
//             Photo Verification
//           </h2>

//           <div className="space-y-6">
//             {["photo_id_1", "photo_id_2", "photo_id_3"].map((key, i) => {
//               const photoUrl = userData[key];
//               const status = userData[`${key}_status`];
//               const isLoading = loadingStatus[key];

//               return (
//                 <div
//                   key={i}
//                   className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl"
//                 >
//                   <div className="flex items-center gap-6">
//                     <p className="text-white/80 font-medium mb-3 md:mb-0 w-24">
//                       {key.toUpperCase()}
//                     </p>

//                     {photoUrl ? (
//                       photoUrl.toLowerCase().endsWith(".pdf") ? (
//                         <div>
//                           <img src="" alt="pdf" className="w-14 h-14" />
//                         </div>
//                       ) : (
//                       <img
//                         src={photoUrl}
//                         alt={key}
//                         onError={(e) => {
//                           e.target.src =
//                             "https://via.placeholder.com/100?text=No+Image";
//                         }}
//                         className="w-20 h-20 rounded-lg object-cover shadow"
//                       />
//                     ) ): (
//                       <p className="text-red-600">No File</p>
//                     )}
//                   </div>

//                   <div className="space-x-3 mt-3 md:mt-0 flex flex-wrap gap-2">
//                     {/* View Button */}
//                     <button
//                       onClick={() => photoUrl && window.open(photoUrl, "_blank")}
//                       disabled={!photoUrl}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 "
//                     >
//                       View
//                     </button>

//                     {/* Approve Button */}
//                     <button
//                       onClick={() => setConfirmApprove({open:true,photoKey:key})}
//                       disabled={!photoUrl || status === "approved" || status === "rejected" || isLoading}
//                       className={`px-4 py-2 rounded-lg text-white transition ${!photoUrl
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : status === "approved"
//                           ? "bg-green-500 cursor-not-allowed"
//                           : "bg-green-600 hover:bg-green-700"
//                       }`}
//                     >
//                       {isLoading && loadingStatus[key] === "approved"
//                         ? "Processing..."
//                         : status === "approved"
//                           ? "Approved"
//                           : "Accept"}
//                     </button>

//                     {/* Reject Button */}
//                     <button
//                       onClick={() => handleRejectClick(key)}
//                       disabled={!photoUrl || status === "rejected" || status === "approved" || isLoading}
//                       className={`px-4 py-2 rounded-lg text-white transition ${!photoUrl
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : status === "rejected"
//                           ? "bg-red-500 cursor-not-allowed"
//                           : "bg-red-600 hover:bg-red-700"
//                       }`}
//                     >
//                       {isLoading && loadingStatus[key] === "rejected"
//                         ? "Processing..."
//                         : status === "rejected"
//                           ? "Rejected"
//                           : "Reject"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//               {confirmApprove.open && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-gray-900/90 backdrop-blur border border-white/20 rounded-xl p-6 w-96 shadow-2xl text-white">
//             <h2 className="text-lg font-bold mb-4 text-white">
//               Confirm Approval
//             </h2>
//             <p className="text-white/70 mb-6">
//               Are you sure you want to approve this document?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() =>
//                   setConfirmApprove({ open: false, photoKey: "" })
//                 }
//                 className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   handleStatusChange(confirmApprove.photoKey, "approved");
//                   setConfirmApprove({ open: false, photoKey: "" });
//                 }}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//               )}

//         {/* Additional Details */}
//         <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
//           <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2">
//             Additional Details
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
//             <p><span className="font-bold">Employment Status:</span> {userData.employment_status || "—"}</p>
//             <p><span className="font-bold">Occupation:</span> {userData.occupation || "—"}</p>
//             <p><span className="font-bold">Trading Experience:</span> {userData.trading_experience || "—"}</p>
//             <p><span className="font-bold">Income Range:</span> {userData.income_range || "—"}</p>
//             <p><span className="font-bold">Source of Income:</span> {userData.source_of_income || "—"}</p>
//           </div>
//         </div>
//       </div>

//       {rejectModel.open && (
//         <div className="fixed inset-x-0 top-0 flex justify-center z-50">
//           <div
//             className={`bg-gray-900/95 backdrop-blur border border-white/20 rounded-b-xl p-6 w-96 shadow-lg text-white transform transition-transform duration-500 ${rejectModel.open ? "translate-y-20" : "-translate-y-full"
//               }`}
//           >
//             <h2 className="text-xl font-bold mb-4">Enter Rejection Reason</h2>
//             <textarea
//               className="w-full bg-black/40 border border-white/20 p-2 rounded mb-4 text-white placeholder-white/40"
//               rows={4}
//               value={rejectModel.reason}
//               onChange={(e) =>
//                 setRejectModel((prev) => ({ ...prev, reason: e.target.value }))
//               }
//               placeholder="Enter reason here..."
//             ></textarea>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() =>
//                   setRejectModel({ open: false, photoKey: "", reason: "" })
//                 }
//                 className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitReject}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KYCview;


import React, { useEffect, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../api/config";

// Helper to get current admin info from token
// Standardized Frontend Helper
const getAdminInfo = () => {
  try {
    // 1. Check 'admin' object (usually in AdminDeposit.jsx)
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      return { 
        admin_id: parsed.id || null, 
        admin_name: parsed.admin_name || parsed.name || null 
      };
    }
    
    // 2. Check Token (for other pages)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      return {
        admin_id: payload.id || null,
        admin_name: payload.name || payload.admin_name || payload.username || null
      };
    }
  } catch (e) {
    console.log("Could not parse admin info", e);
  }
  return { admin_id: null, admin_name: null };
};

// Helper component for KYC Action Details
const KycActionDetailsBlock = ({ userData }) => {
  const photo1Status = userData.photo_id_1_status;
  const photo2Status = userData.photo_id_2_status;
  const photo3Status = userData.photo_id_3_status;

  const isAllApproved = photo1Status === "approved" && photo2Status === "approved" && photo3Status === "approved";
  const hasRejected = photo1Status === "rejected" || photo2Status === "rejected" || photo3Status === "rejected";

  let overallStatus = "pending";
  if (isAllApproved) overallStatus = "approved";
  else if (hasRejected) overallStatus = "rejected";

  const isPending = overallStatus === "pending";
  const isApproved = overallStatus === "approved";
  const isRejected = overallStatus === "rejected";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider border-b border-white/10 pb-2">
        Action Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Status */}
        <div>
          <span className="text-white/50 text-xs block mb-1">Status</span>
          {isPending ? (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              ⏳ Pending
            </span>
          ) : isApproved ? (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">
              ✅ Approved
            </span>
          ) : isRejected ? (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
              ❌ Rejected
            </span>
          ) : (
            <span className="text-gray-400 text-xs">{overallStatus}</span>
          )}
        </div>

        {/* Action By */}
        <div>
          <span className="text-white/50 text-xs block mb-1">Action By</span>
          {userData.photo_verified_by_admin_name ? (
            <span className="text-cyan-300 text-sm font-semibold">{userData.photo_verified_by_admin_name}</span>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </div>

        {/* Action Time */}
        <div>
          <span className="text-white/50 text-xs block mb-1">Action Time</span>
          {userData.photo_verification_timestamp ? (
            <span className="text-white/80 text-sm">{new Date(userData.photo_verification_timestamp).toLocaleString()}</span>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </div>

        {/* Individual photo statuses */}
        <div className="sm:col-span-2">
          <span className="text-white/50 text-xs block mb-1">Photo Statuses</span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "Photo 1", status: photo1Status },
              { key: "Photo 2", status: photo2Status },
              { key: "Photo 3", status: photo3Status },
            ].map((p) => (
              <span
                key={p.key}
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                  p.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : p.status === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {p.key}: {p.status || "—"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KYCview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState({ photo_id_1: false, photo_id_2: false, photo_id_3: false });
  const [rejectModel, setRejectModel] = useState({ open: false, photoKey: "", reason: "" });
  const [confirmApprove, setConfirmApprove] = useState({ open: false, photoKey: "" });

  const handleRejectClick = (photoKey) => {
    setRejectModel({ open: true, photoKey, reason: "" });
  };

  const submitReject = async () => {
    if (!rejectModel.reason.trim()) return toast.warning("Reason is Required!.");
    await handleStatusChange(rejectModel.photoKey, "rejected", rejectModel.reason);
    setRejectModel({ open: false, photoKey: "", reason: "" });
  };

  //  Update photo status (Approve / Reject)
  const handleStatusChange = async (photoKey, status, reason = null) => {
    try {
      setLoadingStatus((prev) => ({ ...prev, [photoKey]: true }));

      const adminInfo = getAdminInfo();

      const response = await axios.patch(
        `${BACKEND_API_URL}/kyc/admin/kyc/${id}/status`,
        {
          photokey: photoKey,
          status,
          reason,
          photo_verified_by_admin_id: adminInfo.admin_id,
          photo_verified_by_admin_name: adminInfo.admin_name
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData((prev) => ({
        ...prev,
        [`${photoKey}_status`]: status,
        photo_verification_status: response.data.overallStatus,
        photo_verified_by_admin_name: adminInfo.admin_name,
        photo_verification_timestamp: new Date().toISOString()
      }));

      toast.success(` ${photoKey.toUpperCase()} marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update KYC status");
    }
  };

  //  Fetch KYC details for this user
  useEffect(() => {
    const fetchUserKyc = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_API_URL}/kyc/admin/kyc/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data.data) {
          setUserData(res.data.data[0]);
          // console.log("Fetched KYC data:", res.data.data);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching user KYC:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserKyc();
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Loading user details...</p>;
  if (!userData) return <p className="text-center mt-10 text-red-500">No data found.</p>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} pauseOnFocusLoss draggable />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-20">
        </div>

        {/* User Info */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2">
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <p><span className="font-bold">User ID:</span> {userData.id}</p>
            <p><span className="font-bold">Username:</span> {userData.username}</p>
            <p><span className="font-bold">Email:</span> {userData.email}</p>
          </div>
        </div>

        {/* UPDATED: Action Details Section - added before Photo Verification */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
          <KycActionDetailsBlock userData={userData} />
        </div>

        {/* Photo Verification */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
            <h2 className="text-2xl font-semibold text-white/90">
              Photo Verification
            </h2>
          </div>

          <div className="space-y-6">
            {["photo_id_1", "photo_id_2", "photo_id_3"].map((key, i) => {
              const photoUrl = userData[key];
              const status = userData[`${key}_status`];
              const isLoading = loadingStatus[key];

              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-6">
                    <p className="text-white/80 font-medium mb-3 md:mb-0 w-24">
                      {key.toUpperCase()}
                    </p>

                    {photoUrl ? (
                      photoUrl.toLowerCase().endsWith(".pdf") ? (
                        <div>
                          <img src="" alt="pdf" className="w-14 h-14" />
                        </div>
                      ) : (
                        <img
                          src={photoUrl}
                          alt={key}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100?text=No+Image";
                          }}
                          className="w-20 h-20 rounded-lg object-cover shadow"
                        />
                      )
                    ) : (
                      <p className="text-red-600">No File</p>
                    )}
                  </div>

                  <div className="space-x-3 mt-3 md:mt-0 flex flex-wrap gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => photoUrl && window.open(photoUrl, "_blank")}
                      disabled={!photoUrl}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 "
                    >
                      View
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => setConfirmApprove({ open: true, photoKey: key })}
                      disabled={!photoUrl || status === "approved" || status === "rejected" || isLoading}
                      className={`px-4 py-2 rounded-lg text-white transition ${!photoUrl
                        ? "bg-gray-400 cursor-not-allowed"
                        : status === "approved"
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {isLoading && loadingStatus[key] === "approved"
                        ? "Processing..."
                        : status === "approved"
                          ? "Approved"
                          : "Accept"}
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => handleRejectClick(key)}
                      disabled={!photoUrl || status === "rejected" || status === "approved" || isLoading}
                      className={`px-4 py-2 rounded-lg text-white transition ${!photoUrl
                        ? "bg-gray-400 cursor-not-allowed"
                        : status === "rejected"
                          ? "bg-red-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                      {isLoading && loadingStatus[key] === "rejected"
                        ? "Processing..."
                        : status === "rejected"
                          ? "Rejected"
                          : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {confirmApprove.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-900/90 backdrop-blur border border-white/20 rounded-xl p-6 w-96 shadow-2xl text-white">
              <h2 className="text-lg font-bold mb-4 text-white">
                Confirm Approval
              </h2>
              <p className="text-white/70 mb-6">
                Are you sure you want to approve this document?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setConfirmApprove({ open: false, photoKey: "" })
                  }
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(confirmApprove.photoKey, "approved");
                    setConfirmApprove({ open: false, photoKey: "" });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <p><span className="font-bold">Employment Status:</span> {userData.employment_status || "—"}</p>
            <p><span className="font-bold">Occupation:</span> {userData.occupation || "—"}</p>
            <p><span className="font-bold">Trading Experience:</span> {userData.trading_experience || "—"}</p>
            <p><span className="font-bold">Income Range:</span> {userData.income_range || "—"}</p>
            <p><span className="font-bold">Source of Income:</span> {userData.source_of_income || "—"}</p>
          </div>
        </div>
      </div>

      {rejectModel.open && (
        <div className="fixed inset-x-0 top-0 flex justify-center z-50">
          <div
            className={`bg-gray-900/95 backdrop-blur border border-white/20 rounded-b-xl p-6 w-96 shadow-lg text-white transform transition-transform duration-500 ${rejectModel.open ? "translate-y-20" : "-translate-y-full"
              }`}
          >
            <h2 className="text-xl font-bold mb-4">Enter Rejection Reason</h2>
            <textarea
              className="w-full bg-black/40 border border-white/20 p-2 rounded mb-4 text-white placeholder-white/40"
              rows={4}
              value={rejectModel.reason}
              onChange={(e) =>
                setRejectModel((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Enter reason here..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setRejectModel({ open: false, photoKey: "", reason: "" })
                }
                className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default KYCview;

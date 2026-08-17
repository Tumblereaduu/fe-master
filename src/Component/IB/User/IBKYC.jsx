// import React, { useEffect, useRef, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import IBSidebar from "../IbSidebar";
// import IBNavbar from "../IbNavbar";
// import uploadIcon from "../../../assets/img/kyc/cloud-upload.png";
// import idCardIcon from "../../../assets/img/ib/kyc/idImage.svg";
// import profile from "../../../assets/img/ib/kyc/profile.png";
// import { useAuth } from "../../context/AuthContext";
// import axios from "axios";
// import { BACKEND_API_URL } from "../../../api/config";
// import { toast } from "react-toastify";

// const proofsList = ["Address Proof Front", "Address Proof Back", "National ID Front", "National ID Back", "Bank Statement", "Other Proof"];


// const IBKYC = () => {
//   const fileRefs = useRef([]);
//   const [proofStatuses, setProofStatuses] = useState(Array(6).fill(null));
//   const [proofs, setProofs] = useState(
//     proofsList.map(() => ({
//       status: "NOT_UPLOADED",
//       file: null,
//       date: null,
//     }))
//   );

//   const handleUploadClick = (index) => {
//     fileRefs.current[index].click();
//   };

//   const handleFileChange = (e, index) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const updated = [...proofs];
//     updated[index] = {
//       file,
//       status: "PENDING",
//       date: new Date().toLocaleString(),
//     };

//     setProofs(updated);
//   };

//   const getStatusBadge = (status) => {
//     if (!status) return "bg-gray-100 text-gray-600"

//     switch (status.toUpperCase()) {
//       case "APPROVED":
//       case "VERIFIED":
//         return "bg-green-100 text-green-700 "

//       case "PENDING":
//         return "bg-yellow-100 text-yellow-700";

//       case "REJECTED":
//         return "bg-red-100 text-red-700";

//       default:
//         return "bg-gray-100 text-gray-600";
//     }

//   };

//   const { token, user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [ibStatus, setIbStatus] = useState("NOT_SUBMITTED");
//   const [ib, setIb] = useState("NOT_SUBMITTED");

//   // Get user info from localStorage
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const partnerId = storedUser?.user_id;


//   useEffect(() => {
//     const fetchIBKYCStatus = async () => {
//       try {
//         const { data } = await axios.get(`${BACKEND_API_URL}/ib/kyc/status/ib/${partnerId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const record = Array.isArray(data) ? data[0] : data;

//         // const status = data?.ib_kyc_status || "NOT_SUBMITTED";
//         setIbStatus(record?.ib_kyc_status || "Not submited");
//         setIb(record?.ib_status || "not");        

//         const normalized = [
//           record?.ib_photo_id_1_status,
//           record?.ib_photo_id_2_status,
//           record?.ib_photo_id_3_status,
//           record?.ib_photo_id_4_status,
//           record?.ib_photo_id_5_status,
//           record?.ib_photo_id_6_status,
//         ].map((s) => (s ? s.toUpperCase() : null))

//         setProofStatuses(normalized);

//       } catch (err) {
//         console.error("Failed to fetch IB KYC status", err);
//         toast.error("Failed to fetch IB KYC status");
//       }
//     };

//     if (partnerId && token) fetchIBKYCStatus();
//   }, [token, partnerId]);

//   const submitKYC = async () => {
//     if (loading) return;
//     setLoading(true);

//     const formData = new FormData();
//     proofs.forEach((p, i) => {
//       if (p.file) {
//         formData.append(`ib_kyc_id_${i + 1}`, p.file);
//       }
//     });

//     try {
//       await axios.post(`${BACKEND_API_URL}/ib/kyc/ib/kyc`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       toast.success("IB KYC Submitted successfully");
//     } catch (error) {
//       console.error("IB KYC Submitted error", error);
//       toast.error(error?.response?.data?.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const firstSubmission = proofStatuses.every(s => s === null || s.toLowerCase() === "not_uploaded");

//   const rejectedIndices = proofStatuses.map((status, i) => (status === "REJECTED" ? i : null)).filter((i) => i !== null);

//   const uploadFileCount = proofs.filter(p => p.file).length;
//   const firstSubmissionHasAllFiles = uploadFileCount === 6;

//   const canSubmit = (firstSubmission && firstSubmissionHasAllFiles) || (rejectedIndices.length > 0 && rejectedIndices.every((i) => proofs[i]?.file));


//   return (
//     <div className="min-h-screen bg-white">
//       <IBNavbar />

//       <div className="flex pt-20">
//         <div className="md:w-72">
//           <IBSidebar />
//         </div>

//         <div className="flex-1 ml-0 xl:ml-5 px-4 md:px-8 py-6">
//           {/* Page Header */}
//           <h1 className="text-2xl font-semibold flex items-center gap-2 mb-6">
//             <img src={profile} alt="" className="h-10" /> View Profile 
//           </h1>

//           {/* Partner Info */}
//           <div className="border border-orange-400 rounded-lg p-6 mb-6
//                           flex flex-col gap-4
//                           lg:flex-row lg:items-center md:w-full lg:justify-between">

//             {/* Partner ID */}
//             <div className="flex flex-wrap items-center gap-2">
//               <h2 className="font-semibold text-base md:text-lg">
//                 Partner ID:
//               </h2>
//               <span className="bg-yellow-300 px-3 py-1 rounded text-sm font-bold">
//                 {partnerId || "N/A"}
//               </span>
//             </div>

//             {/* Status Section */}
//             <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">

//               <span className="flex items-center gap-2 font-semibold">
//                 IB KYC:
//                 <span className={`px-3 py-1 rounded text-sm ${ibStatus === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
//                   {ibStatus === "completed" ? "Verified" : "Not Verified"}
//                 </span>
//               </span>
//             </div>
//             <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
//               <span className="flex items-center gap-2 font-semibold">
//                 IB Status:
//                 {
//                   ib === "active" ? <>
//                 <span className="bg-[#008236] text-white px-3 py-1 rounded text-sm">
//                   Active
//                 </span>
//                   </> :
//                 <span className="bg-[#E7000B] text-white px-3 py-1 rounded text-sm">
//                   In Active
//                 </span>
//                 }
//               </span>
//             </div>
//           </div>


//           {/* Proof Cards */}
//           <div className="space-y-4">
//             {proofsList.map((proof, index) => (
//               <div
//                 key={index}
//                 className="border border-orange-400 rounded-lg p-4 flex items-center justify-between"
//               >
//                 <div className="flex-1 lg:flex items-center gap-4">
//                   <img src={idCardIcon} alt="ID" className="w-32" />

//                   <div>
//                     <p className="font-semibold">
//                       Proof Type :{" "}
//                       <span className="font-normal">{proof}</span>
//                     </p>

//                     <p className="mt-1">
//                       Status:{" "}
//                       <span
//                         className={`px-3 py-1 rounded text-sm ${getStatusBadge(
//                           proofStatuses[index]
//                         )}`}
//                       >
//                         {proofStatuses[index] ? proofStatuses[index] === "REJECTED" && proofs[index]?.file ? "Re-Uploaded" : proofStatuses[index] : proofs[index]?.file ? "Uploaded" : "Not-Uploaded"}
//                       </span>
//                     </p>


//                     {proofs[index].date && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         Date & Time : {proofs[index].date}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Upload */}
//                 {/* <div className="flex flex-col items-center">
//                   <button
//                     onClick={() => handleUploadClick(index)}
//                     className={`p-3 border rounded-full hover:bg-gray-100 ${proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED" ? "cursor-not-allowd opacity-50 hover:bg-none" :""}`}
//                     disabled={proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED"}
//                   >
//                     <img src={uploadIcon} alt="Upload" className="w-6 h-6" />
//                   </button>

//                   <input
//                     type="file"
//                     ref={(el) => (fileRefs.current[index] = el)}
//                     className="hidden"
//                     onChange={(e) => handleFileChange(e, index)}
//                   />
//                   Upload here
//                 </div> */}
                
//                 <div className="flex flex-col items-center">
//                   <button
//                     onClick={() => handleUploadClick(index)}
//                     className={`p-3 border rounded-full hover:bg-gray-100 ${proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED"
//                       ? "cursor-not-allowed opacity-50 hover:bg-none"
//                       : ""
//                       }`}
//                     disabled={
//                       proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED"
//                     }
//                   >
//                     <img src={uploadIcon} alt="Upload" className="w-6 h-6" />
//                   </button>

//                   <input
//                     type="file"
//                     ref={(el) => (fileRefs.current[index] = el)}
//                     className="hidden"
//                     onChange={(e) => handleFileChange(e, index)}
//                   />
//                   Upload here
//                 </div>

//               </div>
//             ))}
//           </div>
//           <div className="flex justify-center items-center">
//             <button className={
//               `bg-orange-500 px-4 py-2 text-2xl text-white rounded-lg mt-5 cursor-pointer flex justify-center ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
//               onClick={submitKYC} disabled={!canSubmit || loading}>
//                 {loading && <FaSpinner className="animate-spin text-white text-lg mt-1.5 gap-2" />}
//                <span> {loading ? "Uploading..." : "Submit"}</span></button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IBKYC;

import React, { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import IBSidebar from "../IBSidebar";
import IBNavbar from "../IBNavbar";
import uploadIcon from "../../../assets/img/kyc/cloud-upload.png";
import idCardIcon from "../../../assets/img/ib/kyc/idImage.svg";
import profile from "../../../assets/img/ib/kyc/profile.png";
import { useAuth } from "../../context/AuthContext";
import axios from "../../../services/api";
import { BACKEND_API_URL } from "../../../api/config";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext";

const proofsList = ["Address Proof Front", "Address Proof Back", "National ID Front", "National ID Back", "Bank Statement", "Other Proof"];

const IBKYC = () => {
  const fileRefs = useRef([]);
  const [proofStatuses, setProofStatuses] = useState(Array(6).fill(null));
  const [proofs, setProofs] = useState(
    proofsList.map(() => ({
      status: "NOT_UPLOADED",
      file: null,
      date: null,
    }))
  );

  const { isDark } = useTheme();

  const handleUploadClick = (index) => {
    fileRefs.current[index].click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...proofs];
    updated[index] = {
      file,
      status: "PENDING",
      date: new Date().toLocaleString(),
    };

    setProofs(updated);
  };

  const getStatusBadge = (status) => {
    if (!status) return isDark ? "bg-[#222E38] text-[#6B7B88]" : "bg-gray-100 text-gray-600";

    switch (status.toUpperCase()) {
      case "APPROVED":
      case "VERIFIED":
        return isDark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700";
      case "PENDING":
        return isDark ? "bg-yellow-900/40 text-yellow-400" : "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return isDark ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700";
      default:
        return isDark ? "bg-[#222E38] text-[#6B7B88]" : "bg-gray-100 text-gray-600";
    }
  };

  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ibStatus, setIbStatus] = useState("NOT_SUBMITTED");
  const [ib, setIb] = useState("NOT_SUBMITTED");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const partnerId = storedUser?.user_id;

  useEffect(() => {
    const fetchIBKYCStatus = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/ib/kyc/status/ib/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const record = Array.isArray(data) ? data[0] : data;

        setIbStatus(record?.ib_kyc_status || "Not submited");
        setIb(record?.ib_status || "not");

        const normalized = [
          record?.ib_photo_id_1_status,
          record?.ib_photo_id_2_status,
          record?.ib_photo_id_3_status,
          record?.ib_photo_id_4_status,
          record?.ib_photo_id_5_status,
          record?.ib_photo_id_6_status,
        ].map((s) => (s ? s.toUpperCase() : null));

        setProofStatuses(normalized);
      } catch (err) {
        console.error("Failed to fetch IB KYC status", err);
        toast.error("Failed to fetch IB KYC status");
      }
    };

    if (partnerId && token) fetchIBKYCStatus();
  }, [token, partnerId]);

  const submitKYC = async () => {
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    proofs.forEach((p, i) => {
      if (p.file) {
        formData.append(`ib_kyc_id_${i + 1}`, p.file);
      }
    });

    try {
      await axios.post(`${BACKEND_API_URL}/ib/kyc/ib/kyc`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("IB KYC Submitted successfully");
    } catch (error) {
      console.error("IB KYC Submitted error", error);
      toast.error(error?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const firstSubmission = proofStatuses.every(s => s === null || s.toLowerCase() === "not_uploaded");

  const rejectedIndices = proofStatuses.map((status, i) => (status === "REJECTED" ? i : null)).filter((i) => i !== null);

  const uploadFileCount = proofs.filter(p => p.file).length;
  const firstSubmissionHasAllFiles = uploadFileCount === 6;

  const canSubmit = (firstSubmission && firstSubmissionHasAllFiles) || (rejectedIndices.length > 0 && rejectedIndices.every((i) => proofs[i]?.file));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#141D22]" : "bg-white"}`}>
      <IBNavbar />

      <div className="flex pt-20">
        <div className="md:w-72">
          <IBSidebar />
        </div>

        <div className="flex-1 ml-0 xl:ml-5 px-4 md:px-8 py-6">

          {/* Page Header */}
          <h1 className={`text-2xl font-semibold flex items-center gap-2 mb-6 transition-colors duration-300 ${isDark ? "text-white" : ""}`}>
            <img src={profile} alt="" className={`h-10 transition-all duration-200 ${isDark ? "brightness-0 invert" : ""}`} />
            View Profile
          </h1>

          {/* Partner Info */}
          <div className={`border rounded-lg p-6 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center md:w-full lg:justify-between transition-colors duration-300 ${isDark ? "bg-[#1A242B] border-[#2A3640]" : "border-gray-300"}`}>

            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`font-semibold text-base md:text-lg transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>
                Partner ID:
              </h2>
              <span className={`px-3 py-1 rounded text-sm font-bold transition-colors duration-300 ${isDark ? "bg-yellow-900/40 text-yellow-400" : "bg-yellow-300"}`}>
                {partnerId || "N/A"}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <span className="flex items-center gap-2 font-semibold">
                <span className={`transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>IB KYC:</span>
                <span className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${ibStatus === "completed" ? (isDark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700") : (isDark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700")}`}>
                  {ibStatus === "completed" ? "Verified" : "Not Verified"}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <span className="flex items-center gap-2 font-semibold">
                <span className={`transition-colors duration-300 ${isDark ? "text-[#E8EDF0]" : ""}`}>IB Status:</span>
                {ib === "active" ? (
                  <span className="bg-[#008236] text-white px-3 py-1 rounded text-sm">Active</span>
                ) : (
                  <span className="bg-[#E7000B] text-white px-3 py-1 rounded text-sm">In Active</span>
                )}
              </span>
            </div>
          </div>

          {/* Proof Cards */}
          <div className="space-y-4">
             {proofsList.map((proof, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1 lg:flex items-center gap-4">
                  <img src={idCardIcon} alt="ID" className="w-32" />

                  <div>
                    <p className="font-semibold">
                      Proof Type :{" "}
                      <span className="font-normal">{proof}</span>
                    </p>

                    <p className="mt-1">
                      Status:{" "}
                      <span
                        className={`px-3 py-1 rounded text-sm ${getStatusBadge(
                          proofStatuses[index]
                        )}`}
                      >
                        {proofStatuses[index] ? proofStatuses[index] === "REJECTED" && proofs[index]?.file ? "Re-Uploaded" : proofStatuses[index] : proofs[index]?.file ? "Uploaded" : "Not-Uploaded"}
                      </span>
                    </p>


                    {proofs[index].date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Date & Time : {proofs[index].date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleUploadClick(index)}
                    className={`p-3 border rounded-full hover:bg-gray-100 ${proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED"
                      ? "cursor-not-allowed opacity-50 hover:bg-none"
                      : ""
                      }`}
                    disabled={
                      proofStatuses[index] === "PENDING" || proofStatuses[index] === "APPROVED"
                    }
                  >
                    <img src={uploadIcon} alt="Upload" className="w-6 h-6" />
                  </button>

                  <input
                    type="file"
                    ref={(el) => (fileRefs.current[index] = el)}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                  Upload here
                </div>

              </div>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <button className={
              `bg-blue-500 px-4 py-2 text-2xl text-white rounded-lg mt-5 cursor-pointer flex justify-center ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={submitKYC} disabled={!canSubmit || loading}>
                {loading && <FaSpinner className="animate-spin text-white text-lg mt-1.5 gap-2" />}
               <span> {loading ? "Uploading..." : "Submit"}</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBKYC;

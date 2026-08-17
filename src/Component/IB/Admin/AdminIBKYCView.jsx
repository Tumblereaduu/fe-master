import React, { useEffect, useState } from "react";
import AdminLayout from "../../Admin/AdminLayout";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import { BACKEND_API_URL } from "../../../api/config";

const AdminIBKYCView = () => {
  const { id: userId } = useParams();
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState({ ib_kyc_id_1: false, ib_kyc_id_2: false, ib_kyc_id_3: false, ib_kyc_id_4: false, ib_kyc_id_5: false, ib_kyc_id_6: false, });
  const [rejectModel, setRejectModel] = useState({ open: false, photoKey: "", reason: "" });
  const [confirmApprove, setConfirmApprove] = useState({ open: false, photoKey: "" });

  const handleRejectClick = (photoKey) => {
    setRejectModel({ open: true, photoKey, reason: "" });
  }

  const submitReject = async () => {
    if (!rejectModel.reason.trim()) return toast.warning("Reason is Required!.");

    await handleStatusChange(rejectModel.photoKey, "rejected", rejectModel.reason);
    setRejectModel({ open: false, photoKey: "", reason: "" });
  }

  //  Update photo status (Approve / Reject)
  const handleStatusChange = async (photoKey, status, reason = null) => {
    try {
      setLoadingStatus((prev) => ({ ...prev, [photoKey]: true }));

      const response = await axios.patch(
        `${BACKEND_API_URL}/ib/kyc/admin/kyc/ib/${userId}/status`,
        { photokey: photoKey, status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData((prev) => ({
        ...prev,
        [`${photoKey}_status`]: status,
        ib_kyc_status: response.data.overallStatus,
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
          `${BACKEND_API_URL}/ib/kyc/admin/kyc/ib/${userId}`,
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
  }, [userId, token]);

  if (loading) return <p className="text-center mt-10">Loading user details...</p>;
  if (!userData) return <p className="text-center mt-10 text-red-500">No data found.</p>;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} pauseOnFocusLoss draggable />

      {/* Main Content */}
      <div className="flex-1 p-5">
        {/* Header */}
        <div className="text-center mb-20">
        </div>

        {/* User Info */}
        {/* Photo Verification */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white/90 mb-4 border-b border-white/20 pb-2">
            Photo Verification
          </h2>

          <div className="space-y-6">
            {["ib_kyc_id_1", "ib_kyc_id_2", "ib_kyc_id_3", "ib_kyc_id_4", "ib_kyc_id_5", "ib_kyc_id_6"].map((key, i) => {
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
                      )) : (
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

export default AdminIBKYCView;

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../Admin/AdminLayout";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../../api/config";
import { adminRoutes } from "../../../App";

const AdminIBDepositReply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAdminDeposit } = location.state || {};
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState({ open: false, reason: "" });

  // Fetch Transfer details
  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/ib/list/${id}`
        );
        setDeposit(data.data);
      } catch (error) {
        console.error("Failed to fetch IB Transfer", error);
        toast.error("Failed to fetch IB Transfer details");
      }
    };

    fetchDeposit();
  }, [id]);

  if (!deposit) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen text-white">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 text-center">
            Loading Transfer details...
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Approve deposit handler
  const handleApprove = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${BACKEND_API_URL}/ib/update/${deposit.ib_id}`,
        { deposit_status: "approved" }
      );

      toast.success(response.data.message || "IB Transfer completed");
      setDeposit({ ...deposit, deposit_status: "approved" });

      if (typeof setAdminDeposit === "function") {
        setAdminDeposit((prev) =>
          prev.map((item) =>
            item.ib_id === deposit.ib_id
              ? { ...item, deposit_status: "approved" }
              : item
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete IB Transfer");
    } finally {
      setLoading(false);
    }
  };

  // Reject deposit handler
  const handleRejectSubmit = async () => {
    if (!rejectModel.reason.trim()) {
      toast.warning("Please enter a reason before rejecting.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${BACKEND_API_URL}/ib/update/${deposit.ib_id}`,
        {
          deposit_status: "rejected",
          deposit_reject_reason: rejectModel.reason,
        }
      );

      toast.success("IB Transfer rejected successfully!");
      setDeposit({
        ...deposit,
        deposit_status: "rejected",
        deposit_reject_reason: rejectModel.reason,
      });

      if (typeof setAdminDeposit === "function") {
        setAdminDeposit((prev) =>
          prev.map((item) =>
            item.ib_id === deposit.ib_id
              ? { ...item, deposit_status: "rejected" }
              : item
          )
        );
      }

      setRejectModel({ open: false, reason: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject IB Transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Slide} />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn text-white">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <h2 className="text-2xl font-semibold text-white/90">
              IB Transfer Details
            </h2>
            <button
              onClick={() => navigate(`${adminRoutes}admin/ib/deposit`)}
              className="text-gray-300 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-white/80">
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    User Name
                  </td>
                  <td className="py-2">{deposit.username || "N/A"}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    User ID
                  </td>
                  <td className="py-2">{deposit.user_id || "N/A"}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    IB.Tr ID
                  </td>
                  <td className="py-2">{deposit.ib_id}</td>
                </tr>

                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Email
                  </td>
                  <td className="py-2">{deposit.email}</td>
                </tr>

                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Requested Amount(USD)
                  </td>
                  <td className="py-2">{deposit.enter_amount}</td>
                </tr>

                {/* <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Transfer Amount USD
                  </td>
                  <td className="py-2">{deposit.transfer_amount_usd}</td>
                </tr> */}
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    IB Transfer Status
                  </td>
                  <td className="py-2">{deposit.deposit_status}</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Actions */}
          {deposit.deposit_status === "pending" && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmApprove(true)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => setRejectModel({ open: true, reason: "" })}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          )}

          {/* Reject Popup */}
          {rejectModel.open && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50">
              <div className="bg-white rounded-xl mt-20 p-6 w-96 shadow-2xl animate-slideDown">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Enter Rejection Reason
                </h2>
                <textarea
                  className="w-full border border-blue-400 p-2 rounded mb-4 text-black outline-blue-400"
                  rows={4}
                  value={rejectModel.reason}
                  onChange={(e) =>
                    setRejectModel((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Type reason here..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setRejectModel({ open: false, reason: "" })}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {loading ? "Processing..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating background glows */}
        <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

        {confirmApprove && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Confirm Approval
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to approve this IB Transfer?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmApprove(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleApprove();
                    setConfirmApprove(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </AdminLayout>
  );
};

export default AdminIBDepositReply;

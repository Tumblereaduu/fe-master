import React, { useEffect, useState } from "react";
import { X, Pencil, Save, XCircle } from "lucide-react";
import AdminLayout from "../Admin/AdminLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API_URL } from "../../api/config";
import { adminRoutes } from "../../App";

// Helper to get current admin info from token
// Standardized Frontend Helper
const getAdminInfo = () => {
  try {
    // 1. Check 'admin' object (usually in AdminDeposit.jsx)
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      return { admin_id: parsed.id || null, admin_name: parsed.admin_name || parsed.name || null };
    }
    
    // 2. Check Token (for other pages)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      return { admin_id: payload.id || null, admin_name: payload.name || payload.admin_name || payload.username || null };
    }
  } catch (e) {
    console.log("Could not parse admin info", e);
  }
  return { admin_id: null, admin_name: null };
};

// ✅ NO new Date() — pure string parsing — displays exactly what DB has
const formatDateTimeUTC = (date) => {
  if (!date) return "N/A";
  let y, m, d, h, min, s;
  if (date.includes('T')) {
    const clean = date.replace('Z', '').replace(/\.\d{3}$/, '');
    const [datePart, timePart] = clean.split('T');
    [y, m, d] = datePart.split('-');
    [h, min, s] = (timePart + ':00').split(':');
  } else {
    const [datePart, timePart] = date.split(' ');
    [y, m, d] = datePart.split('-');
    [h, min, s] = (timePart || '00:00:00').split(':');
  }
  return `${d}/${m}/${y}, ${h}:${min}:${s}`;
};

// ✅ Current UTC as "YYYY-MM-DD HH:mm:ss" string — NO new Date().toISOString()
const getUTCNowString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
};

const WithdrawActionDetailsBlock = ({ status, adminName, actionTime, rejectReason }) => {
  const isRejected = status === "rejected";
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider border-b border-white/10 pb-2">Action Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-white/50 text-xs block mb-1">Action By</span>
          {adminName ? <span className="text-cyan-300 text-sm font-semibold">{adminName}</span> : <span className="text-gray-500 text-sm">—</span>}
        </div>
        <div>
          <span className="text-white/50 text-xs block mb-1">Action Time</span>
          {actionTime ? <span className="text-white/80 text-sm">{formatDateTimeUTC(actionTime)}</span> : <span className="text-gray-500 text-sm">—</span>}
        </div>
        {isRejected && rejectReason && (
          <div className="sm:col-span-2">
            <span className="text-white/50 text-xs block mb-1">Rejection Reason</span>
            <span className="text-red-400 text-sm">{rejectReason}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminReason = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAdminWithdraw } = location.state || {};
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [withdraw, setWithdraw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState({ open: false, reason: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmCancelEdit, setConfirmCancelEdit] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchWithdraw = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_API_URL}/withdrawal/${id}`);
        setWithdraw(data);
      } catch (error) {
        console.error("Failed to fetch withdraw:", error);
        toast.error("Failed to fetch withdrawal details");
      }
    };
    fetchWithdraw();
  }, [id]);

  const safeParseFloat = (val) => { const n = parseFloat(val); return isNaN(n) ? 0 : n; };
  const updateEditField = (field, value) => setEditData((prev) => ({ ...prev, [field]: value }));

  // ✅ NO new Date() — pure string split for datetime-local input — includes seconds
  const handleStartEdit = () => {
    const dateStr = withdraw.withdrawal_request_at;
    let formattedDate = "";
    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ');
      const [hours, minutes, seconds] = (timePart || '00:00:00').split(':');
      formattedDate = `${datePart}T${hours}:${minutes}:${seconds || '00'}`;
    }
    setEditData({
      username: withdraw.username || "",
      payment_method: withdraw.payment_method || "",
      requested_amount_usd: String(withdraw.requested_amount_usd ?? ""),
      transfer_amount_usd: String(withdraw.transfer_amount_usd ?? ""),
      fee_percentage: String(withdraw.fee_percentage ?? ""),
      fee: String(withdraw.fee ?? ""),
      payment_address_upi_id: withdraw.payment_address_upi_id || "",
      withdrawal_request_at: formattedDate,
      bank_account_holder_name: withdraw.bank_account_holder_name || "",
      bank_account_number: withdraw.bank_account_number || "",
      bank_ifsc_code: withdraw.bank_ifsc_code || "",
      bank_name: withdraw.bank_name || "",
      bank_branch_name: withdraw.bank_branch_name || "",
      country: withdraw.country || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => setConfirmCancelEdit(true);
  const handleConfirmCancelEdit = () => { setIsEditing(false); setEditData({}); setConfirmCancelEdit(false); };
  const handleSaveClick = () => setConfirmSave(true);

  if (!withdraw) return <p className="text-center mt-10 text-white">Loading withdraw details...</p>;

  const handleApprove = async () => {
    try {
      setLoading(true);
      const adminInfo = getAdminInfo();
      await axios.put(`${BACKEND_API_URL}/withdrawal/${id}/status`, {
        withdrawal_status: "completed",
        verified_by_admin_id: adminInfo.admin_id,
        verified_by_admin_name: adminInfo.admin_name
      });
      toast.success("Withdrawal completed");
      const utcNow = getUTCNowString();
      setWithdraw({ ...withdraw, withdrawal_status: "completed", verified_by_admin_name: adminInfo.admin_name, withdrawal_verified_at: utcNow });
      if (typeof setAdminWithdraw === "function") {
        setAdminWithdraw((prev) => prev.map((item) => item.withdrawal_id === withdraw.withdrawal_id ? { ...item, withdrawal_status: "completed", verified_by_admin_name: adminInfo.admin_name, withdrawal_verified_at: utcNow } : item));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete withdrawal");
    } finally { setLoading(false); }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModel.reason.trim()) { toast.warning("Please enter a reason before rejecting."); return; }
    try {
      setLoading(true);
      const adminInfo = getAdminInfo();
      await axios.put(`${BACKEND_API_URL}/withdrawal/${id}/status`, {
        withdrawal_status: "rejected",
        withdrawal_reject_reason: rejectModel.reason,
        verified_by_admin_id: adminInfo.admin_id,
        verified_by_admin_name: adminInfo.admin_name
      });
      toast.success("Withdrawal rejected successfully!");
      const utcNow = getUTCNowString();
      setWithdraw({ ...withdraw, withdrawal_status: "rejected", withdrawal_reject_reason: rejectModel.reason, verified_by_admin_name: adminInfo.admin_name, withdrawal_verified_at: utcNow });
      if (typeof setAdminWithdraw === "function") {
        setAdminWithdraw((prev) => prev.map((item) => item.withdrawal_id === withdraw.withdrawal_id ? { ...item, withdrawal_status: "rejected", verified_by_admin_name: adminInfo.admin_name, withdrawal_verified_at: utcNow } : item));
      }
      setRejectModel({ open: false, reason: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject withdrawal");
    } finally { setLoading(false); }
  };

  // ✅ NO new Date() — pure string conversion — preserves exact seconds admin typed
  const handleConfirmSave = async () => {
    try {
      setSaveLoading(true);
      const adminInfo = getAdminInfo();

      let withdrawalRequestAt = withdraw.withdrawal_request_at;
      if (editData.withdrawal_request_at) {
        const [datePart, timePart] = editData.withdrawal_request_at.split('T');
        const [hours, minutes, seconds] = timePart.split(':');
        withdrawalRequestAt = `${datePart} ${hours}:${minutes}:${seconds || '00'}`;
      }

      const payload = {
        withdrawal_status: withdraw.withdrawal_status,
        withdrawal_reject_reason: withdraw.withdrawal_reject_reason || null,
        verified_by_admin_id: withdraw.verified_by_admin_id || null,
        verified_by_admin_name: withdraw.verified_by_admin_name || null,
        username: editData.username,
        payment_method: editData.payment_method,
        requested_amount_usd: safeParseFloat(editData.requested_amount_usd),
        transfer_amount_usd: safeParseFloat(editData.transfer_amount_usd),
        fee_percentage: safeParseFloat(editData.fee_percentage),
        fee: safeParseFloat(editData.fee),
        payment_address_upi_id: editData.payment_address_upi_id,
        withdrawal_request_at: withdrawalRequestAt,
        bank_account_holder_name: editData.bank_account_holder_name,
        bank_account_number: editData.bank_account_number,
        bank_ifsc_code: editData.bank_ifsc_code,
        bank_name: editData.bank_name,
        bank_branch_name: editData.bank_branch_name,
        country: editData.country,
        edited_by_admin_id: adminInfo.admin_id,
        edited_by_admin_name: adminInfo.admin_name,
      };

      const response = await axios.put(`${BACKEND_API_URL}/withdrawal/${id}/status`, payload);
      toast.success(response.data.message || "Withdrawal updated successfully");
      setWithdraw({ ...withdraw, ...payload });
      setIsEditing(false);
      setEditData({});
      setConfirmSave(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update withdrawal");
    } finally { setSaveLoading(false); }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2500} transition={Slide} />

      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-6 relative z-10 max-w-full">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-4 md:px-6 lg:px-8 py-5 md:py-6 animate-fade-in text-white">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg md:text-2xl font-bold text-white">Withdraw Details</h2>
              {!isEditing ? (
                <button onClick={handleStartEdit} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 rounded-lg text-sm"><Pencil size={14} />Edit</button>
              ) : (
                <>
                  <button onClick={handleSaveClick} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 rounded-lg text-sm"><Save size={14} />Save</button>
                  <button onClick={handleCancelEdit} className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 rounded-lg text-sm"><XCircle size={14} />Cancel</button>
                </>
              )}
            </div>
            <button className="text-gray-300 hover:text-white transition text-xl" onClick={() => navigate(`${adminRoutes}withdraw`)}>X</button>
          </div>

          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs md:text-sm border-collapse text-white/80">
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">User Name</td>
                  <td className="py-2">{isEditing ? <input type="text" value={editData.username ?? ""} onChange={(e) => updateEditField("username", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[220px]" /> : <span className="text-sm">{withdraw.username || "N/A"}</span>}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">User ID</td>
                  <td className="py-2"><span className="text-sm">{withdraw.user_id || "N/A"}</span></td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Email</td>
                  <td className="py-2"><span className="text-sm">{withdraw.email || "N/A"}</span></td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Withdraw ID</td>
                  <td className="py-2">{withdraw.withdrawal_id}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Payment Type</td>
                  <td className="py-2">{isEditing ? (
                    <select value={editData.payment_method ?? ""} onChange={(e) => updateEditField("payment_method", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400">
                      <option value="upi" className="text-black">UPI</option>
                      <option value="usdt" className="text-black">USDT</option>
                      <option value="bank_transfer" className="text-black">Bank Transfer</option>
                    </select>
                  ) : <span className="capitalize">{withdraw.payment_method}</span>}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Requested Amount (USD)</td>
                  <td className="py-2">{isEditing ? <input type="number" step="any" value={editData.requested_amount_usd ?? ""} onChange={(e) => updateEditField("requested_amount_usd", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400" /> : <span>$ {withdraw.requested_amount_usd}</span>}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Transfer Amount (USD)</td>
                  <td className="py-2">{isEditing ? <input type="number" step="any" value={editData.transfer_amount_usd ?? ""} onChange={(e) => updateEditField("transfer_amount_usd", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400" /> : <span>$ {withdraw.transfer_amount_usd}</span>}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Fee</td>
                  <td className="py-2">{isEditing ? <input type="number" step="any" value={editData.fee ?? ""} onChange={(e) => updateEditField("fee", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400" /> : withdraw.fee}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Fee Percentage</td>
                  <td className="py-2">{isEditing ? <input type="number" step="any" value={editData.fee_percentage ?? ""} onChange={(e) => updateEditField("fee_percentage", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400" /> : `${withdraw.fee_percentage}%`}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">{withdraw.payment_method === "usdt" ? "USDT BEP20 Address" : withdraw.payment_method === "upi" ? "UPI Transaction ID" : "Transaction ID"}</td>
                  <td className="py-2">{isEditing ? <input type="text" value={editData.payment_address_upi_id ?? ""} onChange={(e) => updateEditField("payment_address_upi_id", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[350px]" /> : withdraw.payment_address_upi_id || "N/A"}</td>
                </tr>

                {/* ✅ Requested At — uses formatDateTimeUTC (no new Date) — step="1" shows seconds */}
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Requested At</td>
                  <td className="py-2">{isEditing ? (
                    <input type="datetime-local" step="1" value={editData.withdrawal_request_at ?? ""} onChange={(e) => updateEditField("withdrawal_request_at", e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400" />
                  ) : formatDateTimeUTC(withdraw.withdrawal_request_at)}</td>
                </tr>

                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Status</td>
                  <td className="py-2"><span className={`px-3 py-1 rounded text-xs font-medium ${withdraw.withdrawal_status === "completed" ? "bg-green-500/20 text-green-300" : withdraw.withdrawal_status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>{withdraw.withdrawal_status}</span></td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">QR / Payment Screenshot</td>
                  <td className="py-2">{withdraw.qr_payment_screenshot ? (
                    <div className="w-28 h-28 overflow-hidden rounded-lg border border-white/20"><img src={withdraw.qr_payment_screenshot} alt="QR" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => window.open(withdraw.qr_payment_screenshot, "_blank")} /></div>
                  ) : <span className="text-red-400">Not Uploaded</span>}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td colSpan="2" className="py-2"><WithdrawActionDetailsBlock status={withdraw.withdrawal_status} adminName={withdraw.verified_by_admin_name} actionTime={withdraw.withdrawal_verified_at} rejectReason={withdraw.withdrawal_reject_reason} /></td>
                </tr>

                {((isEditing ? editData.payment_method : withdraw.payment_method)?.toLowerCase() === "bank_transfer") && (
                  <>
                    <tr className="border-t border-white/20"><td colSpan="2" className="font-semibold text-white pt-4 pb-2">Bank Details</td></tr>
                    {[
                      { label: "Account Holder Name", key: "bank_account_holder_name" },
                      { label: "Account Number", key: "bank_account_number" },
                      { label: "IFSC Code", key: "bank_ifsc_code" },
                      { label: "Bank Name", key: "bank_name" },
                      { label: "Branch", key: "bank_branch_name" },
                      { label: "Country", key: "country" },
                    ].map(({ label, key }) => (
                      <tr key={key} className="border-b border-white/20">
                        <td className="font-medium py-2 pr-4 text-white/70">{label}</td>
                        <td className="py-2">{isEditing ? <input type="text" value={editData[key] ?? ""} onChange={(e) => updateEditField(key, e.target.value)} className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white" /> : withdraw[key]}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {withdraw.withdrawal_status === "pending" && !isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setConfirmApprove(true)} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{loading ? "Processing..." : "Approve"}</button>
              <button onClick={() => setRejectModel({ open: true, reason: "" })} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Reject</button>
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModel.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50">
            <div className="bg-white rounded-xl mt-20 p-6 w-96 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Enter Rejection Reason</h2>
              <textarea className="w-full border border-blue-400 p-2 rounded mb-4 text-black outline-blue-400" rows={4} value={rejectModel.reason} onChange={(e) => setRejectModel((prev) => ({ ...prev, reason: e.target.value }))} placeholder="Type reason here..." />
              <div className="flex justify-end gap-3">
                <button onClick={() => setRejectModel({ open: false, reason: "" })} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                <button onClick={handleRejectSubmit} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{loading ? "Processing..." : "Submit"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {confirmApprove && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Approval</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to approve this withdrawal of ${withdraw.transfer_amount_usd}?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmApprove(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                <button onClick={() => { handleApprove(); setConfirmApprove(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Save Modal */}
        {confirmSave && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Save Changes</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to save the modified withdrawal details?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmSave(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
                <button onClick={handleConfirmSave} className="px-4 py-2 bg-green-600 text-white rounded-lg">{saveLoading ? "Saving..." : "Confirm Save"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Edit Modal */}
        {confirmCancelEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Discard Changes?</h2>
              <p className="text-gray-700 mb-6">All unsaved changes will be lost.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmCancelEdit(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Go Back</button>
                <button onClick={handleConfirmCancelEdit} className="px-4 py-2 bg-red-600 text-white rounded-lg">Discard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReason;

import { X, Pencil, Save, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../Admin/AdminLayout";
import { Slide, ToastContainer, toast } from "react-toastify";
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

// Safe number parser - never returns NaN
const safeParseFloat = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// Helper component for Action Details section
const ActionDetailsBlock = ({ status, adminName, actionTime, rejectReason }) => {
  const isPending = !status || status === "pending";
  const isApproved = status === "completed";
  const isRejected = status === "rejected";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-2 space-y-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider border-b border-white/10 pb-2">
        Action Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Status */}
        {/* <div>
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
            <span className="text-gray-400 text-xs">{status}</span>
          )}
        </div> */}

        {/* Action By */}
        <div>
          <span className="text-white/50 text-xs block mb-1">Action By</span>
          {adminName ? (
            <span className="text-cyan-300 text-sm font-semibold">{adminName}</span>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </div>

        {/* Action Time — ✅ NO new Date() — uses formatDateTimeUTC */}
        <div>
          <span className="text-white/50 text-xs block mb-1">Action Time</span>
          {actionTime ? (
            <span className="text-white/80 text-sm">{formatDateTimeUTC(actionTime)}</span>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </div>

        {/* Rejection Reason (only if rejected) */}
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

const DepositReply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAdminDeposit } = location.state || {};
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectModel, setRejectModel] = useState({ open: false, reason: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmCancelEdit, setConfirmCancelEdit] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editData, setEditData] = useState({});


  // Fetch deposit details
  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_API_URL}/deposit/list/${id}`
        );
        setDeposit(data);
      } catch (error) {
        console.error("Failed to fetch deposit", error);
        toast.error("Failed to fetch deposit details");
      }
    };

    fetchDeposit();
  }, [id]);

  // Helper to update a single edit field
  const updateEditField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ NO new Date() — pure string split for datetime-local input — includes seconds
  const handleStartEdit = () => {
    const dateStr = deposit.deposit_request_at;
    let formattedDate = "";
    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ');
      const [hours, minutes, seconds] = (timePart || '00:00:00').split(':');
      formattedDate = `${datePart}T${hours}:${minutes}:${seconds || '00'}`;
    }

    setEditData({
      username: deposit.username || "",
      user_id: deposit.user_id || "",
      payment_method: deposit.payment_method || "",
      currency_name: deposit.currency_name || "",
      transaction_id: deposit.transaction_id || "",
      enter_amount: String(deposit.enter_amount ?? ""),
      requested_amount_usd: String(deposit.requested_amount_usd ?? ""),
      transfer_amount_usd: String(deposit.transfer_amount_usd ?? ""),
      fee_percentage: String(deposit.fee_percentage ?? ""),
      fee: String(deposit.fee ?? ""),
      deposit_request_at: formattedDate,
      bank_name: deposit.bank_name || "",
      bank_account_number: deposit.bank_account_number || "",
      bank_holder_name: deposit.bank_holder_name || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setConfirmCancelEdit(true);
  };

  const handleConfirmCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setConfirmCancelEdit(false);
  };

  const handleDismissCancel = () => {
    setConfirmCancelEdit(false);
  };

  // When user clicks Save button — show confirm first
  const handleSaveClick = () => {
    setConfirmSave(true);
  };

  const handleDismissSave = () => {
    setConfirmSave(false);
  };

  // ✅ NO new Date() — pure string conversion — preserves exact seconds admin typed
  const handleConfirmSave = async () => {
    try {
      setSaveLoading(true);
      const adminInfo = getAdminInfo();

      // Convert datetime-local back to "YYYY-MM-DD HH:mm:ss" string — NO new Date()
      let depositRequestAt = deposit.deposit_request_at;
      if (editData.deposit_request_at) {
        const [datePart, timePart] = editData.deposit_request_at.split('T');
        const [hours, minutes, seconds] = timePart.split(':');
        depositRequestAt = `${datePart} ${hours}:${minutes}:${seconds || '00'}`;
      }

      // Build payload DIRECTLY from editData state — these are the values user typed
      const payload = {
        // Required by backend — always send current status
        deposit_status: deposit.deposit_status,
        deposit_reject_reason: deposit.deposit_reject_reason || null,
        verified_by_admin_id: deposit.verified_by_admin_id || null,
        verified_by_admin_name: deposit.verified_by_admin_name || null,
        // Editable fields — directly from editData, converted to proper types
        username: editData.username || null,
        payment_method: editData.payment_method || null,
        currency_name: editData.currency_name || null,
        transaction_id: editData.transaction_id || null,
        enter_amount: editData.enter_amount !== "" && editData.enter_amount !== undefined ? safeParseFloat(editData.enter_amount) : null,
        requested_amount_usd: editData.requested_amount_usd !== "" && editData.requested_amount_usd !== undefined ? safeParseFloat(editData.requested_amount_usd) : null,
        transfer_amount_usd: editData.transfer_amount_usd !== "" && editData.transfer_amount_usd !== undefined ? safeParseFloat(editData.transfer_amount_usd) : null,
        fee_percentage: editData.fee_percentage !== "" && editData.fee_percentage !== undefined ? safeParseFloat(editData.fee_percentage) : null,
        fee: editData.fee !== "" && editData.fee !== undefined ? safeParseFloat(editData.fee) : null,
        deposit_request_at: depositRequestAt,
        bank_name: editData.bank_name || null,
        bank_account_number: editData.bank_account_number || null,
        bank_holder_name: editData.bank_holder_name || null,
        // Track who edited
        edited_by_admin_id: adminInfo.admin_id,
        edited_by_admin_name: adminInfo.admin_name
      };

      console.log("=== SAVE PAYLOAD BEING SENT ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("================================");

      const response = await axios.put(
        `${BACKEND_API_URL}/deposit/update/${deposit.deposit_id}`,
        payload
      );

      console.log("=== SAVE RESPONSE ===");
      console.log(response.data);
      console.log("=====================");

      toast.success(response.data.message || "Deposit details updated successfully");

      // Update local state DIRECTLY from editData — no fallback to old deposit values
      const newEnterAmount = editData.enter_amount !== "" && editData.enter_amount !== undefined ? safeParseFloat(editData.enter_amount) : deposit.enter_amount;
      const newRequestedUsd = editData.requested_amount_usd !== "" && editData.requested_amount_usd !== undefined ? safeParseFloat(editData.requested_amount_usd) : deposit.requested_amount_usd;
      const newTransferUsd = editData.transfer_amount_usd !== "" && editData.transfer_amount_usd !== undefined ? safeParseFloat(editData.transfer_amount_usd) : deposit.transfer_amount_usd;
      const newFeePct = editData.fee_percentage !== "" && editData.fee_percentage !== undefined ? safeParseFloat(editData.fee_percentage) : deposit.fee_percentage;
      const newFee = editData.fee !== "" && editData.fee !== undefined ? safeParseFloat(editData.fee) : deposit.fee;

      const updatedDeposit = {
        ...deposit,
        username: editData.username || deposit.username,
        payment_method: editData.payment_method || deposit.payment_method,
        currency_name: editData.currency_name || deposit.currency_name,
        transaction_id: editData.transaction_id || deposit.transaction_id,
        enter_amount: newEnterAmount,
        requested_amount_usd: newRequestedUsd,
        transfer_amount_usd: newTransferUsd,
        fee_percentage: newFeePct,
        fee: newFee,
        deposit_request_at: depositRequestAt,
        bank_name: editData.bank_name || deposit.bank_name,
        bank_account_number: editData.bank_account_number || deposit.bank_account_number,
        bank_holder_name: editData.bank_holder_name || deposit.bank_holder_name,
      };

      setDeposit(updatedDeposit);

      // Update parent list if function exists
      if (typeof setAdminDeposit === "function") {
        setAdminDeposit((prev) =>
          prev.map((item) =>
            item.deposit_id === deposit.deposit_id
              ? {
                  ...item,
                  username: updatedDeposit.username,
                  payment_method: updatedDeposit.payment_method,
                  currency_name: updatedDeposit.currency_name,
                  transaction_id: updatedDeposit.transaction_id,
                  enter_amount: updatedDeposit.enter_amount,
                  requested_amount_usd: updatedDeposit.requested_amount_usd,
                  transfer_amount_usd: updatedDeposit.transfer_amount_usd,
                  fee_percentage: updatedDeposit.fee_percentage,
                  fee: updatedDeposit.fee,
                  deposit_request_at: updatedDeposit.deposit_request_at,
                }
              : item
          )
        );
      }

      setIsEditing(false);
      setEditData({});
      setConfirmSave(false);
    } catch (error) {
      console.error("=== SAVE ERROR ===");
      console.error(error);
      console.error("==================");
      toast.error(error.response?.data?.message || "Failed to save deposit details");
    } finally {
      setSaveLoading(false);
    }
  };

  if (!deposit) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen text-white">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 text-center">
            Loading deposit details...
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ✅ Uses getUTCNowString() — NO new Date().toISOString()
  const handleApprove = async () => {
    try {
      setLoading(true);
      const adminInfo = getAdminInfo();
      const response = await axios.put(
        `${BACKEND_API_URL}/deposit/update/${deposit.deposit_id}`,
        { 
          deposit_status: "completed",
          verified_by_admin_id: adminInfo.admin_id,
          verified_by_admin_name: adminInfo.admin_name
        }
      );

      toast.success(response.data.message || "Deposit completed");
      const utcNow = getUTCNowString();
      setDeposit({ 
        ...deposit, 
        deposit_status: "completed",
        verified_by_admin_name: adminInfo.admin_name,
        deposit_verified_at: utcNow
      });

      if (typeof setAdminDeposit === "function") {
        setAdminDeposit((prev) =>
          prev.map((item) =>
            item.deposit_id === deposit.deposit_id
              ? { ...item, deposit_status: "completed", verified_by_admin_name: adminInfo.admin_name, deposit_verified_at: utcNow }
              : item
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete deposit");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Uses getUTCNowString() — NO new Date().toISOString()
  const handleRejectSubmit = async () => {
    if (!rejectModel.reason.trim()) {
      toast.warning("Please enter a reason before rejecting.");
      return;
    }

    try {
      setLoading(true);
      const adminInfo = getAdminInfo();
      await axios.put(
        `${BACKEND_API_URL}/deposit/update/${deposit.deposit_id}`,
        {
          deposit_status: "rejected",
          deposit_reject_reason: rejectModel.reason,
          verified_by_admin_id: adminInfo.admin_id,
          verified_by_admin_name: adminInfo.admin_name
        }
      );

      toast.success("Deposit rejected successfully!");
      const utcNow = getUTCNowString();
      setDeposit({
        ...deposit,
        deposit_status: "rejected",
        deposit_reject_reason: rejectModel.reason,
        verified_by_admin_name: adminInfo.admin_name,
        deposit_verified_at: utcNow
      });

      if (typeof setAdminDeposit === "function") {
        setAdminDeposit((prev) =>
          prev.map((item) =>
            item.deposit_id === deposit.deposit_id
              ? { ...item, deposit_status: "rejected", verified_by_admin_name: adminInfo.admin_name, deposit_verified_at: utcNow }
              : item
          )
        );
      }

      setRejectModel({ open: false, reason: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 relative z-10 max-w-full">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-3xl p-4 md:p-6 animate-fadeIn text-white">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg md:text-2xl font-semibold text-white/90">
                Deposit Details
              </h2>
              {/* Edit / Save / Cancel buttons in header */}
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/80 hover:bg-yellow-600 text-white text-xs md:text-sm font-medium rounded-lg transition"
                  title="Edit Details"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveClick}
                    disabled={saveLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600/80 hover:bg-green-600 text-white text-xs md:text-sm font-medium rounded-lg transition disabled:opacity-50"
                    title="Save Changes"
                  >
                    <Save size={13} />
                    {saveLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saveLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-600/80 hover:bg-gray-600 text-white text-xs md:text-sm font-medium rounded-lg transition disabled:opacity-50"
                    title="Cancel Edit"
                  >
                    <XCircle size={13} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`${adminRoutes}deposit`)}
              className="text-gray-300 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Editing indicator banner */}
          {isEditing && (
            <div className="mb-4 px-3 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-300 text-xs md:text-sm flex items-center gap-2">
              <Pencil size={14} className="animate-pulse" />
              <span className="font-medium">Editing Mode — Modify the fields below and click <strong>Save</strong> to persist changes.</span>
            </div>
          )}

          {/* Details Table */}
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs md:text-sm border-collapse text-white/80">
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    User Name
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.username ?? ""}
                        onChange={(e) => updateEditField("username", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">{deposit.username || "N/A"}</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    User ID
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.user_id ?? ""}
                        onChange={(e) => updateEditField("user_id", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">{deposit.user_id || "N/A"}</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Deposit ID
                  </td>
                  <td className="py-2">{deposit.deposit_id}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Payment Type
                  </td>
                  <td className="py-2 capitalize">
                    {isEditing ? (
                      <select
                        value={editData.payment_method ?? ""}
                        onChange={(e) => updateEditField("payment_method", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      >
                        <option value="upi" className="text-black">UPI</option>
                        <option value="usdt" className="text-black">USDT</option>
                        <option value="bitcoin" className="text-black">Bitcoin</option>
                        <option value="usdttrc20" className="text-black">USDT TRC20</option>
                        <option value="usdterc20" className="text-black">USDT ERC20</option>
                        <option value="bank transfer" className="text-black">Bank Transfer</option>
                      </select>
                    ) : (
                      deposit.payment_method
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Currency Name
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <select
                        value={editData.currency_name ?? ""}
                        onChange={(e) => updateEditField("currency_name", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      >
                        <option value="INR" className="text-black">INR</option>
                        <option value="USD" className="text-black">USD</option>
                      </select>
                    ) : (
                      deposit.currency_name
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Transaction ID
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.transaction_id ?? ""}
                        onChange={(e) => updateEditField("transaction_id", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">{deposit.transaction_id || "N/A"}</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Request Amount (
                    {(isEditing ? editData.payment_method : deposit.payment_method)?.toLowerCase() === "usdt"
                      ? "USD"
                      : "INR"}
                    )
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.enter_amount ?? ""}
                        onChange={(e) => updateEditField("enter_amount", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">
                        {(deposit.payment_method)?.toLowerCase() === "usdt" ? "$" : "₹"} {deposit.enter_amount}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Requested Amount (USD)
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.requested_amount_usd ?? ""}
                        onChange={(e) => updateEditField("requested_amount_usd", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">$ {deposit.requested_amount_usd}</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Transfer Amount (USD)
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.transfer_amount_usd ?? ""}
                        onChange={(e) => updateEditField("transfer_amount_usd", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">$ {deposit.transfer_amount_usd}</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Fee Percentage</td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.fee_percentage ?? ""}
                        onChange={(e) => updateEditField("fee_percentage", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">{deposit.fee_percentage} %</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Fee (INR)</td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.fee ?? ""}
                        onChange={(e) => updateEditField("fee", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">{deposit.fee}</span>
                    )}
                  </td>
                </tr>

                {/* ✅ Deposit Raised On — uses formatDateTimeUTC (no new Date) — step="1" shows seconds */}
                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">
                    Deposit Raised On
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        step="1"
                        value={editData.deposit_request_at ?? ""}
                        onChange={(e) => updateEditField("deposit_request_at", e.target.value)}
                        className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[250px]"
                      />
                    ) : (
                      <span className="text-sm">{formatDateTimeUTC(deposit.deposit_request_at)}</span>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Status</td>
                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        deposit.deposit_status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : deposit.deposit_status === "rejected"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {deposit.deposit_status}
                    </span>
                  </td>
                </tr>
                  <tr className="border-b border-white/20">
                  <td className="font-medium py-2 pr-4 text-white/70">Payment Screenshot</td>
                  <td className="py-2">
                    {deposit.payment_screenshot ? (
                      <div className="w-28 h-28 overflow-hidden rounded-lg border border-white/20">
                        <img
                          src={deposit.payment_screenshot}
                          alt="Payment Screenshot"
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                          onClick={() => window.open(deposit.payment_screenshot, "_blank")}
                        />
                      </div>
                    ) : (
                      <span className="text-red-400">Not Uploaded</span>
                    )}
                  </td>
                </tr>
              {/* UPDATED: Action Details - replaced simple row with full block */}
                <tr className="border-b border-white/20">
                  <td colSpan="2" className="py-2">
                    <ActionDetailsBlock
                      status={deposit.deposit_status}
                      adminName={deposit.verified_by_admin_name}
                      actionTime={deposit.deposit_verified_at}
                      rejectReason={deposit.deposit_reject_reason}
                    />
                  </td>
                </tr>

                {/* Bank Transfer Details */}
                {deposit.payment_method?.toLowerCase() === "bank transfer" && (
                  <>
                    <tr className="border-t border-white/20">
                      <td
                        colSpan="2"
                        className="font-semibold text-white pt-4 pb-2"
                      >
                        Bank Details
                      </td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="font-medium py-2 pr-4 text-white/70">
                        Bank Name
                      </td>
                      <td className="py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.bank_name ?? ""}
                            onChange={(e) => updateEditField("bank_name", e.target.value)}
                            className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                          />
                        ) : (
                          <span className="text-sm">{deposit.bank_name || "N/A"}</span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="font-medium py-2 pr-4 text-white/70">
                        Account Number
                      </td>
                      <td className="py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.bank_account_number ?? ""}
                            onChange={(e) => updateEditField("bank_account_number", e.target.value)}
                            className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                          />
                        ) : (
                          <span className="text-sm">{deposit.bank_account_number || "N/A"}</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 pr-4 text-white/70">
                        Account Holder Name
                      </td>
                      <td className="py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.bank_holder_name ?? ""}
                            onChange={(e) => updateEditField("bank_holder_name", e.target.value)}
                            className="bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400 w-full max-w-[200px]"
                          />
                        ) : (
                          <span className="text-sm">{deposit.bank_holder_name || "N/A"}</span>
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          {deposit.deposit_status === "pending" && !isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={()=> setConfirmApprove(true)}
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


        </div>
      </div>
                  {/* Reject Popup */}
          {rejectModel.open && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex justify-center items-center z-50">
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

        {/* Floating background glows */}
        {/* <div className="absolute top-20 right-40 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div> */}

{confirmApprove && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Confirm Approval
      </h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to approve this deposit?
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

{/* Confirm Save Popup */}
{confirmSave && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Confirm Save Changes
      </h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to save the modified deposit details?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleDismissSave}
          disabled={saveLoading}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSave}
          disabled={saveLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saveLoading ? "Saving..." : "Confirm Save"}
        </button>
      </div>
    </div>
  </div>
)}

{/* Confirm Cancel Edit Popup */}
{confirmCancelEdit && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Discard Changes?
      </h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to cancel? All unsaved changes will be lost.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleDismissCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Go Back
        </button>
        <button
          onClick={handleConfirmCancelEdit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Discard
        </button>
      </div>
    </div>
  </div>
)}


    </AdminLayout>
  );
};

export default DepositReply;

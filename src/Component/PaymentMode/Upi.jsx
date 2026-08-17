import React, { useRef, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BACKEND_API_URL } from "../../api/config";
import AdminLayout from "../Admin/AdminLayout";
import { Search, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

const UPI = () => {
  const [upiList, setUpiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    nickname: "",
    address: "",
    deposit_status: "inactive",
    withdrawal_status: "inactive",
    qr_code: null,
  });

  // Image preview modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ───────────────────────────────────────────────────
  // API FUNCTIONS
  // ───────────────────────────────────────────────────

  // Fetch all UPI records
  const fetchUPIs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_API_URL}/payment/admin/get`, {
        params: { payment_mode: "upi" },
      });
      if (response.data.success) {
        setUpiList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to load UPI accounts");
      }
    } catch (error) {
      console.error("Error fetching UPI accounts:", error);
      toast.error("Server error while fetching UPI accounts");
    } finally {
      setLoading(false);
    }
  };

  // Create/Update UPI
  const handleSave = async () => {
    // Validation
    if (!formData.address?.trim()) {
      toast.error("UPI ID is required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("payment_mode", "upi");
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("deposit_status", formData.deposit_status);
      formDataToSend.append("withdrawal_status", formData.withdrawal_status);

      if (formData.qr_code instanceof File) {
        formDataToSend.append("qr_code", formData.qr_code);
      }

      if (editingId) {
        // Update
        const response = await axios.put(
          `${BACKEND_API_URL}/payment/update/${editingId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.success) {
          toast.success("UPI Updated Successfully");
          fetchUPIs();
          handleCloseModal();
        } else {
          toast.error(response.data.message || "Failed to update UPI");
        }
      } else {
        // Create
        const response = await axios.post(
          `${BACKEND_API_URL}/payment/create`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.success) {
          toast.success("UPI Added Successfully");
          fetchUPIs();
          handleCloseModal();
        } else {
          toast.error(response.data.message || "Failed to add UPI");
        }
      }
    } catch (error) {
      console.error("Error saving UPI:", error);
      toast.error("Server error while saving UPI");
    }
  };

  // Delete UPI
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_API_URL}/payment/delete/${deleteId}`
      );
      if (response.data.success) {
        toast.success("UPI Deleted Successfully");
        fetchUPIs();
        setShowConfirm(false);
        setDeleteId(null);
      } else {
        toast.error(response.data.message || "Failed to delete UPI");
      }
    } catch (error) {
      console.error("Error deleting UPI:", error);
      toast.error("Server error while deleting UPI");
    }
  };

  // Activate UPI
  const handleActivate = async (id) => {
    try {
      await axios.put(
        `${BACKEND_API_URL}/payment/toggle-is-used/${id}`
      );

      toast.success("UPI Activated");

      fetchUPIs(); // Reload data

    } catch (err) {
      toast.error("Unable to activate");
    }
  };

  // ───────────────────────────────────────────────────
  // UI HANDLERS
  // ───────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, qr_code: file });
      setQrPreview(URL.createObjectURL(file));
      toast.success("QR code uploaded successfully!");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = (upi) => {
    setEditingId(upi.id);
    setFormData({
      nickname: upi.nickname || "",
      address: upi.address,
      deposit_status: upi.deposit_status,
      withdrawal_status: upi.withdrawal_status,
      qr_code: null,
    });
    setQrPreview(upi.qr_code || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setQrPreview(null);
    setFormData({
      nickname: "",
      address: "",
      deposit_status: "inactive",
      withdrawal_status: "inactive",
      qr_code: null,
    });
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // ───────────────────────────────────────────────────
  // SEARCH & FILTER
  // ───────────────────────────────────────────────────

  const filteredUPIs = upiList.filter((upi) =>
    upi.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upi.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUPIs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUPIs = filteredUPIs.slice(startIndex, endIndex);

  // ───────────────────────────────────────────────────
  // LIFECYCLE
  // ───────────────────────────────────────────────────

  useEffect(() => {
    fetchUPIs();
  }, []);

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white border-b pb-2 flex-1">
            UPI Payment Accounts
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            + Add UPI
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2">
            <Search size={18} className="text-white/50" />
            <input
              type="text"
              placeholder="Search by UPI ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-2 flex-1 bg-transparent text-white outline-none placeholder-white/50"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedUPIs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No UPI accounts found</p>
          </div>
        )}

        {/* Table */}
        {!loading && paginatedUPIs.length > 0 && (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="text-center px-4 py-3 text-white/80 font-semibold">
                    QR Code
                  </th>
                  <th className="text-left px-4 py-3 text-white/80 font-semibold">
                    Nickname
                  </th>
                  <th className="text-left px-4 py-3 text-white/80 font-semibold">
                    UPI ID
                  </th>
                  <th className="text-center px-4 py-3 text-white/80 font-semibold">
                    Deposit
                  </th>
                  <th className="text-center px-4 py-3 text-white/80 font-semibold">
                    Withdrawal
                  </th>
                  <th className="text-center px-4 py-3 text-white/80 font-semibold">
                    Active
                  </th>
                  <th className="text-center px-4 py-3 text-white/80 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUPIs.map((upi) => (
                  <tr
                    key={upi.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      {upi.qr_code && (
                        <button
                          onClick={() => {
                            setSelectedImage(upi.qr_code);
                            setShowImageModal(true);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors inline-block"
                        >
                          📷
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {upi.nickname ? upi.nickname : "-"}
                    </td>
                    <td className="px-4 py-3 text-white">{upi.address}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          upi.deposit_status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {upi.deposit_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          upi.withdrawal_status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {upi.withdrawal_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {upi.is_used === "active" ? (
                        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                          🟢 Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleActivate(upi.id)}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(upi)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(upi.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-white/20 rounded hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <span className="text-white/60">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-white/20 rounded hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <UPIModal
          formData={formData}
          setFormData={setFormData}
          qrPreview={qrPreview}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleUploadClick={handleUploadClick}
          handleSave={handleSave}
          handleCloseModal={handleCloseModal}
          editingId={editingId}
        />
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <ImageModal
          image={selectedImage}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          title="Delete UPI Account"
          message="Are you sure you want to delete this UPI account? This action cannot be undone."
        />
      )}
    </AdminLayout>
  );
};

export default UPI;


// ───────────────────────────────────────────────────
// MODAL COMPONENTS
// ───────────────────────────────────────────────────

const UPIModal = ({
  formData,
  setFormData,
  qrPreview,
  fileInputRef,
  handleFileChange,
  handleUploadClick,
  handleSave,
  handleCloseModal,
  editingId,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {editingId ? "Edit UPI Account" : "Add UPI Account"}
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="mb-6">
          <label className="block text-white/80 font-semibold mb-2">
            QR Code:
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 bg-white/10 flex items-center justify-center rounded-lg border border-white/20 overflow-hidden">
              {qrPreview ? (
                <img
                  src={qrPreview}
                  alt="QR Code Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white/50 text-sm text-center">No QR</span>
              )}
            </div>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
            >
              Upload QR
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="mb-6">
          <label className="block text-white/80 font-semibold mb-2">
            Nickname
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) =>
              setFormData({ ...formData, nickname: e.target.value })
            }
            placeholder="e.g., Personal UPI, Office Account, GPay, PhonePe"
            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white/80 font-semibold mb-2">
            UPI ID *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="e.g., yourname@upi"
            className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 placeholder-white/50"
          />
        </div>

        {/* Deposit & Withdrawal Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white/80 font-semibold mb-2">
              Deposit Status
            </label>
            <select
              value={formData.deposit_status}
              onChange={(e) =>
                setFormData({ ...formData, deposit_status: e.target.value })
              }
              className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
            >
              <option className="bg-gray-600" value="active">
                Active
              </option>
              <option className="bg-gray-600" value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-2">
              Withdrawal Status
            </label>
            <select
              value={formData.withdrawal_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  withdrawal_status: e.target.value,
                })
              }
              className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400"
            >
              <option className="bg-gray-600" value="active">
                Active
              </option>
              <option className="bg-gray-600" value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            {editingId ? "Update UPI" : "Add UPI"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative max-w-2xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={28} />
        </button>
        <img
          src={image}
          alt="QR Code"
          className="w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

const ConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

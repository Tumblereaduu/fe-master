import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterAdminById, updateMasterAdmin, getMasterClients } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { AlertCircle, ArrowLeft } from "lucide-react";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [formData, setFormData] = useState({
    admin_name: "",
    email_id: "",
    client_id: "",
    role: "admin",
    permission: "all",
    status: "active",
  });

  // Fetch admin and clients on mount
  useEffect(() => {
    fetchData();
  }, [adminId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [adminRes, clientsRes] = await Promise.all([
        getMasterAdminById(adminId),
        getMasterClients(),
      ]);

      if (adminRes.status === "success") {
        setFormData({
          admin_name: adminRes.data.admin_name || "",
          email_id: adminRes.data.email_id || "",
          client_id: adminRes.data.client_id || "",
          role: adminRes.data.role || "admin",
          permission: adminRes.data.permission || "all",
          status: adminRes.data.status || "active",
        });
      } else {
        setError(adminRes.message || "Failed to fetch admin");
        toast.error(adminRes.message || "Failed to fetch admin");
      }

      if (clientsRes.status === "success") {
        setClients(clientsRes.data || []);
      }
    } catch (err) {
      const errorMsg = err.message || "Error fetching data";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.admin_name.trim()) {
      toast.error("Admin name is required");
      return;
    }
    if (!formData.email_id.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.client_id) {
      toast.error("Client is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateMasterAdmin(adminId, formData);
      if (response.status === "success") {
        toast.success("Admin updated successfully");
        navigate(`/master/admins/${adminId}`);
      } else {
        const errorMsg = response.message || "Failed to update admin";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error updating admin";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error updating admin:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading admin details...</p>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/master/admins")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admins
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Edit Admin</h1>
          <p className="text-gray-400 text-sm">Update administrator information</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Name */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Admin Name *</label>
              <input
                type="text"
                name="admin_name"
                value={formData.admin_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Client *</label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingClients}
              >
                <option value="">
                  {loadingClients ? "Loading clients..." : "Select a client"}
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.company_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Permission */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Permission</label>
              <select
                name="permission"
                value={formData.permission}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="limited">Limited</option>
                <option value="read-only">Read Only</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {submitting ? "Updating..." : "Update Admin"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/master/admins")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MasterLayout>
  );
};

export default EditAdmin;

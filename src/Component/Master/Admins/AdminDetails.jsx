import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterAdminById } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { ArrowLeft, AlertCircle } from "lucide-react";
import AdminStatusBadge from "./components/AdminStatusBadge";

const AdminDetails = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmin();
  }, [adminId]);

  const fetchAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMasterAdminById(adminId);
      if (response.status === "success") {
        setAdmin(response.data);
      } else {
        const errorMsg = response.message || "Failed to fetch admin";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error fetching admin";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching admin:", err);
    } finally {
      setLoading(false);
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

  if (error || !admin) {
    return (
      <MasterLayout>
        <div className="w-full">
          <button
            onClick={() => navigate("/master/admins")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admins
          </button>
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error || "Admin not found"}</p>
              <button
                onClick={fetchAdmin}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/master/admins")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admins
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{admin.admin_name}</h1>
            <AdminStatusBadge status={admin.status} />
          </div>
          <p className="text-gray-400 text-sm">{admin.email_id}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Admin Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Admin ID</p>
                <p className="text-white font-medium">#{admin.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-medium">{admin.admin_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{admin.email_id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Client</p>
                <p className="text-white font-medium">{admin.client_name || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Access Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <p className="text-white font-medium capitalize">{admin.role || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Permission Level</p>
                <p className="text-white font-medium capitalize">{admin.permission || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-white font-medium">
                  {admin.created_at
                    ? new Date(admin.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Login</p>
                <p className="text-white font-medium">
                  {admin.last_login
                    ? new Date(admin.last_login).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/master/admins/${adminId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit Admin
          </button>
          <button
            onClick={() => navigate("/master/admins")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AdminDetails;

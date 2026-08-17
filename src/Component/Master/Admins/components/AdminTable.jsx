import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { updateMasterAdmin } from "../../../../services/masterApi";
import { toast } from "react-toastify";
import AdminStatusBadge from "./AdminStatusBadge";

const AdminTable = ({ admins, onRefresh }) => {
  const navigate = useNavigate();
  const [deactivatingId, setDeactivatingId] = useState(null);

  const handleDeactivate = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to deactivate "${adminName}"?`)) {
      setDeactivatingId(adminId);
      try {
        await updateMasterAdmin(adminId, { status: "inactive" });
        toast.success("Admin deactivated successfully");
        onRefresh();
      } catch (err) {
        toast.error(err.message || "Failed to deactivate admin");
        console.error("Error deactivating admin:", err);
      } finally {
        setDeactivatingId(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 border-b border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Admin ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Client</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Role</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Last Login</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-4 py-3 text-gray-300">#{admin.id}</td>
              <td className="px-4 py-3 text-gray-200 font-medium">{admin.admin_name || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">{admin.email_id || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">{admin.client_name || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs capitalize">{admin.role || "N/A"}</td>
              <td className="px-4 py-3">
                <AdminStatusBadge status={admin.status} />
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : "Never"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/master/admins/${admin.id}`)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/master/admins/${admin.id}/edit`)}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(admin.id, admin.admin_name)}
                    disabled={deactivatingId === admin.id}
                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Deactivate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { deactivateMasterClient } from "../../../../services/masterApi";
import { toast } from "react-toastify";
import ClientStatusBadge from "./ClientStatusBadge";

const ClientTable = ({ clients, onRefresh }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (clientId, clientName) => {
    if (window.confirm(`Are you sure you want to deactivate "${clientName}"?`)) {
      setDeletingId(clientId);
      try {
        await deactivateMasterClient(clientId);
        toast.success("Client deactivated successfully");
        onRefresh();
      } catch (err) {
        toast.error(err.message || "Failed to deactivate client");
        console.error("Error deactivating client:", err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 border-b border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Client ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Company</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Domain</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Plan</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Users</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-4 py-3 text-gray-300">#{client.id}</td>
              <td className="px-4 py-3 text-gray-200 font-medium">{client.admin_name || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300">{client.company_name || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">{client.email_id || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">{client.admin_domain || "N/A"}</td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">{client.plan || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300">{client.user_count || 0}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/master/clients/${client.id}`)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/master/clients/${client.id}/edit`)}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id, client.name)}
                    disabled={deletingId === client.id}
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

export default ClientTable;

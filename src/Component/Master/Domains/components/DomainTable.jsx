import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { updateMasterDomain } from "../../../../services/masterApi";
import { toast } from "react-toastify";
import DomainStatusBadge from "./DomainStatusBadge";

const DomainTable = ({ domains, onRefresh }) => {
  const navigate = useNavigate();
  const [deactivatingId, setDeactivatingId] = useState(null);

  const handleDeactivate = async (domainId, domainName) => {
    if (window.confirm(`Are you sure you want to deactivate "${domainName}"?`)) {
      setDeactivatingId(domainId);
      try {
        await updateMasterDomain(domainId, { status: "inactive" });
        toast.success("Domain deactivated successfully");
        onRefresh();
      } catch (err) {
        toast.error(err.message || "Failed to deactivate domain");
        console.error("Error deactivating domain:", err);
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
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Domain ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Domain Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Client</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">SSL Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Created</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Expiry</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {domains.map((domain) => (
            <tr key={domain.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-4 py-3 text-gray-300">#{domain.id}</td>
              <td className="px-4 py-3 text-gray-200 font-medium">{domain.domain || "N/A"}</td>
              <td className="px-4 py-3 text-gray-300 text-xs">{domain.client_name || "N/A"}</td>
              <td className="px-4 py-3">
                <DomainStatusBadge status={domain.status} />
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {domain.ssl_status ? (
                  <span className="text-green-300">{domain.ssl_status}</span>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {domain.created_at ? new Date(domain.created_at).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs">
                {domain.expiry_date ? new Date(domain.expiry_date).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/master/domains/${domain.id}`)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/master/domains/${domain.id}/edit`)}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(domain.id, domain.domain)}
                    disabled={deactivatingId === domain.id}
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

export default DomainTable;

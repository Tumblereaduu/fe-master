import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterClientById } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { ArrowLeft, AlertCircle } from "lucide-react";
import ClientStatusBadge from "./components/ClientStatusBadge";

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMasterClientById(clientId);
      if (response.status === "success") {
        setClient(response.data);
      } else {
        const errorMsg = response.message || "Failed to fetch client";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error fetching client";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching client:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading client details...</p>
        </div>
      </MasterLayout>
    );
  }

  if (error || !client) {
    return (
      <MasterLayout>
        <div className="w-full">
          <button
            onClick={() => navigate("/master/clients")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </button>
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error || "Client not found"}</p>
              <button
                onClick={fetchClient}
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
          onClick={() => navigate("/master/clients")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{client.name}</h1>
            <ClientStatusBadge status={client.status} />
          </div>
          <p className="text-gray-400 text-sm">{client.company_name}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Client ID</p>
                <p className="text-white font-medium">#{client.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Company Name</p>
                <p className="text-white font-medium">{client.company_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Plan</p>
                <p className="text-white font-medium capitalize">{client.plan || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Domain & Account Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Primary Domain</p>
                <p className="text-white font-medium">{client.primary_domain || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Admins</p>
                <p className="text-white font-medium">{client.admin_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-white font-medium">{client.user_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Created Date</p>
                <p className="text-white font-medium">
                  {client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/master/clients/${clientId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit Client
          </button>
          <button
            onClick={() => navigate("/master/clients")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default ClientDetails;

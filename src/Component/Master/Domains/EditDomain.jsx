import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterDomainById, updateMasterDomain, getMasterClients } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { AlertCircle, ArrowLeft } from "lucide-react";

const EditDomain = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [formData, setFormData] = useState({
    domain: "",
    client_id: "",
    status: "active",
  });

  // Fetch domain and clients on mount
  useEffect(() => {
    fetchData();
  }, [domainId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [domainRes, clientsRes] = await Promise.all([
        getMasterDomainById(domainId),
        getMasterClients(),
      ]);

      if (domainRes.status === "success") {
        setFormData({
          domain: domainRes.data.domain || "",
          client_id: domainRes.data.client_id || "",
          status: domainRes.data.status || "active",
        });
      } else {
        setError(domainRes.message || "Failed to fetch domain");
        toast.error(domainRes.message || "Failed to fetch domain");
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
    if (!formData.domain.trim()) {
      toast.error("Domain name is required");
      return;
    }
    if (!formData.client_id) {
      toast.error("Client is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateMasterDomain(domainId, formData);
      if (response.status === "success") {
        toast.success("Domain updated successfully");
        navigate(`/master/domains/${domainId}`);
      } else {
        const errorMsg = response.message || "Failed to update domain";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error updating domain";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error updating domain:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading domain details...</p>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/master/domains")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Domains
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Edit Domain</h1>
          <p className="text-gray-400 text-sm">Update domain information</p>
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
            {/* Domain Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-200 font-medium mb-2">Domain Name *</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g., example.com"
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
              {submitting ? "Updating..." : "Update Domain"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/master/domains")}
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

export default EditDomain;

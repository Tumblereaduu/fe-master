import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { createMasterDomain, getMasterClients } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { AlertCircle, ArrowLeft } from "lucide-react";

const CreateDomain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    domain: "",
    client_id: "",
    status: "active",
  });

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const response = await getMasterClients();
      if (response.status === "success") {
        setClients(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch clients");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching clients");
      console.error("Error fetching clients:", err);
    } finally {
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

    setLoading(true);
    try {
      const response = await createMasterDomain(formData);
      if (response.status === "success") {
        toast.success("Domain created successfully");
        navigate("/master/domains");
      } else {
        const errorMsg = response.message || "Failed to create domain";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error creating domain";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error creating domain:", err);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create New Domain</h1>
          <p className="text-gray-400 text-sm">Add a new domain to a client</p>
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
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Domain"}
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

export default CreateDomain;

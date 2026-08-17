import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterLayout from "../Layout/MasterLayout";
import { getMasterDomainById } from "../../../services/masterApi";
import { toast } from "react-toastify";
import { ArrowLeft, AlertCircle } from "lucide-react";
import DomainStatusBadge from "./components/DomainStatusBadge";

const DomainDetails = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDomain();
  }, [domainId]);

  const fetchDomain = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMasterDomainById(domainId);
      if (response.status === "success") {
        setDomain(response.data);
      } else {
        const errorMsg = response.message || "Failed to fetch domain";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "Error fetching domain";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching domain:", err);
    } finally {
      setLoading(false);
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

  if (error || !domain) {
    return (
      <MasterLayout>
        <div className="w-full">
          <button
            onClick={() => navigate("/master/domains")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Domains
          </button>
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error || "Domain not found"}</p>
              <button
                onClick={fetchDomain}
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
          onClick={() => navigate("/master/domains")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Domains
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{domain.domain}</h1>
            <DomainStatusBadge status={domain.status} />
          </div>
          <p className="text-gray-400 text-sm">Domain for {domain.client_name}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Domain Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Domain ID</p>
                <p className="text-white font-medium">#{domain.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Domain Name</p>
                <p className="text-white font-medium">{domain.domain}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Client</p>
                <p className="text-white font-medium">{domain.client_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <div className="mt-1">
                  <DomainStatusBadge status={domain.status} />
                </div>
              </div>
            </div>
          </div>

          {/* SSL & Dates */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">SSL & Dates</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">SSL Status</p>
                <p className="text-white font-medium">
                  {domain.ssl_status ? (
                    <span className="text-green-300">{domain.ssl_status}</span>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Created Date</p>
                <p className="text-white font-medium">
                  {domain.created_at
                    ? new Date(domain.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Expiry Date</p>
                <p className="text-white font-medium">
                  {domain.expiry_date
                    ? new Date(domain.expiry_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/master/domains/${domainId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit Domain
          </button>
          <button
            onClick={() => navigate("/master/domains")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default DomainDetails;

import React from "react";

const DomainStatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-900/30 text-green-300 border border-green-700";
      case "inactive":
        return "bg-gray-700/30 text-gray-300 border border-gray-600";
      case "suspended":
        return "bg-red-900/30 text-red-300 border border-red-700";
      case "pending":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-700";
      case "expired":
        return "bg-orange-900/30 text-orange-300 border border-orange-700";
      default:
        return "bg-gray-700/30 text-gray-300 border border-gray-600";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(status)}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

export default DomainStatusBadge;

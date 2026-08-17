import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Admin/AdminLayout";
import { BACKEND_API_URL } from "../../api/config";

const AdminAccountDelete = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showActionPopup, setShowActionPopup] = useState(false);

  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDeleteRequests();
  }, []);

  const fetchDeleteRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BACKEND_API_URL}/accountdelete/admin/account-delete-requests`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch account deletion requests."
        );
      }

      setRequests(data.data || []);
    } catch (error) {
      console.error("Fetch delete requests error:", error);
      setError(
        error.message || "Unable to fetch account deletion requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !searchValue ||
        request.name?.toLowerCase().includes(searchValue) ||
        request.email?.toLowerCase().includes(searchValue) ||
        request.contact_number?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        request.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const requestStats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(
        (request) => request.status?.toLowerCase() === "pending"
      ).length,
      approved: requests.filter(
        (request) => request.status?.toLowerCase() === "approved"
      ).length,
      rejected: requests.filter(
        (request) => request.status?.toLowerCase() === "rejected"
      ).length,
    };
  }, [requests]);

  const cards = [
    {
      title: "Total Requests",
      value: requestStats.total,
      color: "bg-blue-500",
    },
    {
      title: "Pending Requests",
      value: requestStats.pending,
      color: "bg-amber-500",
    },
    {
      title: "Approved Requests",
      value: requestStats.approved,
      color: "bg-emerald-500",
    },
    {
      title: "Rejected Requests",
      value: requestStats.rejected,
      color: "bg-red-500",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";

      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";

      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const openViewPopup = (request) => {
    setSelectedRequest(request);
    setActionType("");
    setAdminNote("");
    setError("");
  };

  const closeViewPopup = () => {
    setSelectedRequest(null);
    setActionType("");
    setAdminNote("");
    setError("");
  };

  const openActionConfirmation = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setAdminNote("");
    setError("");
    setShowActionPopup(true);
  };

  const closeActionPopup = () => {
    setShowActionPopup(false);
    setActionType("");
    setAdminNote("");
    setError("");
  };

  const handleRequestAction = async () => {
    if (!selectedRequest) return;

    if (actionType === "reject" && !adminNote.trim()) {
      setError("Please enter the rejection reason.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const newStatus =
        actionType === "approve" ? "approved" : "rejected";

      const response = await fetch(
        `${BACKEND_API_URL}/accountdelete/admin/account-delete-requests/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            admin_note: adminNote.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update the deletion request."
        );
      }

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: newStatus,
                admin_note: adminNote.trim(),
              }
            : request
        )
      );

      setSelectedRequest((previousRequest) =>
        previousRequest
          ? {
              ...previousRequest,
              status: newStatus,
              admin_note: adminNote.trim(),
            }
          : null
      );

      closeActionPopup();
    } catch (error) {
      console.error("Update delete request error:", error);
      setError(
        error.message || "Unable to update the account deletion request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-3 py-4 overflow-hidden transition-all duration-300 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Account Deletion Requests
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Review and manage account deletion requests submitted by users.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDeleteRequests}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} p-4 text-white transition-transform transform shadow-md rounded-2xl sm:p-5 md:p-6 hover:scale-105`}
            >
              <h2 className="text-sm font-semibold sm:text-base md:text-lg">
                {card.title}
              </h2>

              <p className="mt-2 text-2xl font-bold sm:text-3xl">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="my-4 border border-gray-700" />

        {/* Search and Filter */}
        <div className="p-4 mt-6 mb-6 border border-gray-700 bg-gray-900/80 rounded-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Search User
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or contact number"
                className="w-full px-4 py-3 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-600 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="w-full lg:w-64">
              <label
                htmlFor="statusFilter"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Request Status
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full px-4 py-3 text-sm text-white bg-gray-800 border border-gray-600 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {error && !showActionPopup && (
          <div className="p-4 mb-5 text-sm text-red-400 border border-red-500/30 rounded-xl bg-red-500/10">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden overflow-hidden border border-gray-700 shadow-lg bg-gray-900/80 rounded-2xl md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm text-left">
              <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                <tr>
                  <th className="px-5 py-4">Request ID</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Contact Number</th>
                  <th className="px-5 py-4">Reason</th>
                  <th className="px-5 py-4">Requested Date</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      Loading account deletion requests...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      No account deletion requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition-colors bg-gray-900 hover:bg-gray-800"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-300">
                        #{request.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-white">
                        {request.name || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-300">
                        {request.email || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-300 whitespace-nowrap">
                        {request.contact_number || "-"}
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p
                          className="text-gray-400 truncate"
                          title={request.reason}
                        >
                          {request.reason || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                        {formatDate(request.created_at)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold capitalize border rounded-full ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status || "pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openViewPopup(request)}
                            className="px-3 py-2 text-xs font-semibold text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10"
                          >
                            View
                          </button>

                          {request.status?.toLowerCase() === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  openActionConfirmation(request, "approve")
                                }
                                className="px-3 py-2 text-xs font-semibold text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openActionConfirmation(request, "reject")
                                }
                                className="px-3 py-2 text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="p-8 text-sm text-center text-gray-400 border border-gray-700 bg-gray-900/80 rounded-2xl">
              Loading account deletion requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-sm text-center text-gray-400 border border-gray-700 bg-gray-900/80 rounded-2xl">
              No account deletion requests found.
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="p-5 border border-gray-700 shadow-lg bg-gray-900/80 rounded-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {request.name || "-"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {request.email || "-"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold capitalize border rounded-full ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {request.status || "pending"}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <MobileDetail
                    label="Request ID"
                    value={`#${request.id}`}
                  />

                  <MobileDetail
                    label="Contact Number"
                    value={request.contact_number}
                  />

                  <MobileDetail
                    label="Reason"
                    value={request.reason}
                  />

                  <MobileDetail
                    label="Requested Date"
                    value={formatDate(request.created_at)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => openViewPopup(request)}
                    className="flex-1 px-3 py-2.5 text-xs font-semibold text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10"
                  >
                    View
                  </button>

                  {request.status?.toLowerCase() === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          openActionConfirmation(request, "approve")
                        }
                        className="flex-1 px-3 py-2.5 text-xs font-semibold text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openActionConfirmation(request, "reject")
                        }
                        className="flex-1 px-3 py-2.5 text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Details Popup */}
      {selectedRequest && !showActionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/70">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700 bg-gray-900 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Account Delete Request
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Request #{selectedRequest.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeViewPopup}
                className="flex items-center justify-center text-2xl text-gray-400 rounded-full w-9 h-9 hover:text-white hover:bg-gray-800"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              <DetailItem
                label="Name"
                value={selectedRequest.name}
              />

              <DetailItem
                label="Email Address"
                value={selectedRequest.email}
              />

              <DetailItem
                label="Contact Number"
                value={selectedRequest.contact_number}
              />

              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Reason
                </p>

                <p className="p-4 mt-2 text-sm leading-6 text-gray-300 border border-gray-700 rounded-xl bg-gray-800/80">
                  {selectedRequest.reason || "-"}
                </p>
              </div>

              <DetailItem
                label="Requested Date"
                value={formatDate(selectedRequest.created_at)}
              />

              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </p>

                <span
                  className={`inline-flex px-3 py-1 mt-2 text-xs font-semibold capitalize border rounded-full ${getStatusClass(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status || "pending"}
                </span>
              </div>

              {selectedRequest.admin_note && (
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Admin Note
                  </p>

                  <p className="p-4 mt-2 text-sm leading-6 text-gray-300 border border-gray-700 rounded-xl bg-gray-800/80">
                    {selectedRequest.admin_note}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 px-6 py-5 border-t border-gray-700 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeViewPopup}
                className="px-5 py-3 text-sm font-semibold text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800"
              >
                Close
              </button>

              {selectedRequest.status?.toLowerCase() === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      openActionConfirmation(selectedRequest, "reject")
                    }
                    className="px-5 py-3 text-sm font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openActionConfirmation(selectedRequest, "approve")
                    }
                    className="px-5 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve or Reject Popup */}
      {showActionPopup && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/70">
          <div className="w-full max-w-md p-6 border border-gray-700 bg-gray-900 shadow-2xl rounded-2xl">
            <div
              className={`flex items-center justify-center mx-auto text-2xl font-bold rounded-full w-14 h-14 ${
                actionType === "approve"
                  ? "text-green-400 bg-green-500/20"
                  : "text-red-400 bg-red-500/20"
              }`}
            >
              {actionType === "approve" ? "✓" : "!"}
            </div>

            <h3 className="mt-4 text-xl font-bold text-center text-white">
              {actionType === "approve"
                ? "Approve Delete Request"
                : "Reject Delete Request"}
            </h3>

            <p className="mt-3 text-sm leading-6 text-center text-gray-400">
              {actionType === "approve"
                ? `Are you sure you want to approve the account deletion request for ${selectedRequest.email}?`
                : `Are you sure you want to reject the account deletion request for ${selectedRequest.email}?`}
            </p>

            <div className="mt-5">
              <label
                htmlFor="adminNote"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Admin Note
                {actionType === "reject" && (
                  <span className="text-red-400"> *</span>
                )}
              </label>

              <textarea
                id="adminNote"
                value={adminNote}
                onChange={(event) => {
                  setAdminNote(event.target.value);
                  setError("");
                }}
                placeholder={
                  actionType === "approve"
                    ? "Enter an optional admin note"
                    : "Enter the rejection reason"
                }
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-600 rounded-lg outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <p className="mt-1 text-xs text-right text-gray-500">
                {adminNote.length}/500
              </p>
            </div>

            {error && (
              <p className="p-3 mt-3 text-sm text-red-400 border border-red-500/30 rounded-lg bg-red-500/10">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={actionLoading}
                onClick={closeActionPopup}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRequestAction}
                className={`flex-1 px-4 py-3 text-sm font-semibold text-white rounded-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading
                  ? "Updating..."
                  : actionType === "approve"
                  ? "Yes, Approve"
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-gray-200">
        {value || "-"}
      </p>
    </div>
  );
};

const MobileDetail = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className="mt-1 text-sm leading-6 text-gray-300">
        {value || "-"}
      </p>
    </div>
  );
};

export default AdminAccountDelete;
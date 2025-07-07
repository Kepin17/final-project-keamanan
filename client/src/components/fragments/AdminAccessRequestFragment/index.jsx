import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";
import { useRealtimeAccessRequests } from "../../../hooks/useRealtimeData";
import { toast } from "react-toastify";

const AdminAccessRequestFragment = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "history"
  const [error, setError] = useState("");
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [accessCode, setAccessCode] = useState("");
  const [duration, setDuration] = useState(60); // minutes
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "approved", "rejected"
  const [searchTerm, setSearchTerm] = useState("");

  // Use realtime data hook
  const { data: realtimeData, loading: isLoading, error: realtimeError, lastUpdated, isInitialLoad, refreshData, forceUpdate } = useRealtimeAccessRequests();

  useEffect(() => {
    if (realtimeData && realtimeData.length >= 0) {
      // Separate pending requests from approved/rejected (history)
      const pending = realtimeData.filter((req) => req.status === "pending");
      const history = realtimeData.filter((req) => req.status !== "pending");

      setAccessRequests(pending);
      setApprovalHistory(history);
      setError("");

      // Only show notification if it's not the initial load and data actually updated
      if (lastUpdated && !isInitialLoad) {
        toast.info("Access requests updated", { autoClose: 2000 });
      }
    }
  }, [realtimeData, lastUpdated, isInitialLoad]);

  useEffect(() => {
    if (realtimeError) {
      setError(realtimeError);
    }
  }, [realtimeError]);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setIsApprovalModalOpen(true);
    // Generate a random access code
    setAccessCode(Math.random().toString(36).substring(2, 8).toUpperCase());
  };

  const handleReject = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this access request?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        getUrlApiWithPath(`access-requests/${requestId}/reject`),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Force update to trigger notification on next data change
      forceUpdate();

      toast.success("Access request rejected successfully");
    } catch (err) {
      console.error("Error rejecting access request:", err);
      toast.error(err.response?.data?.message || "Failed to reject access request");
    }
  };

  const handleApprovalSubmit = async () => {
    if (!accessCode || !duration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        getUrlApiWithPath(`access-requests/${selectedRequest.id}/approve`),
        {
          access_code: accessCode,
          duration_minutes: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Force update to trigger notification on next data change
      forceUpdate();

      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      setAccessCode("");
      setDuration(60);

      // Show success message with email status
      const responseData = response.data;
      let message = `Access Code: ${accessCode}\nExpires: ${new Date(Date.now() + duration * 60000).toLocaleString()}`;

      if (responseData.email_sent) {
        toast.success(`Access approved! Email sent to: ${responseData.doctor_email}`, {
          autoClose: 5000,
        });
      } else {
        toast.warning(`Access approved but email failed. Please inform doctor manually: ${accessCode}`, {
          autoClose: 8000,
        });
        if (responseData.manual_notice) {
          console.log("Manual notice:", responseData.manual_notice);
        }
      }
    } catch (err) {
      console.error("Error approving access request:", err);
      toast.error(err.response?.data?.message || "Failed to approve access request");
    }
  };

  // Filter and search functions
  const filteredHistory = approvalHistory.filter((request) => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = searchTerm === "" || request.dokter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || request.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "approved":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case "rejected":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading access requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Access Requests Management</h2>
          <p className="text-sm text-gray-500 mt-1">Review and manage doctor access requests to patient data</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "pending" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Pending Requests ({accessRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "history" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Approval History ({approvalHistory.length})
            </button>
          </nav>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === "pending" && (
          <>
            {accessRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                <p className="text-gray-500">There are currently no pending access requests to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accessRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.dokter?.name || "Unknown Doctor"}</div>
                          <div className="text-sm text-gray-500">{request.dokter?.email || ""}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.patient?.name || "Unknown Patient"}</div>
                          <div className="text-sm text-gray-500">ID: {request.patient?.id || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.access_type === "edit" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>
                            {request.access_type === "edit" ? "Edit Access" : "View Only"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{request.reason || "No reason provided"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                          <br />
                          {new Date(request.created_at).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button onClick={() => handleApprove(request)} className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleReject(request.id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <>
            {/* Filter and Search Controls */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by doctor or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:w-48">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No History Found</h3>
                <p className="text-gray-500">{searchTerm || filterStatus !== "all" ? "No requests match your current filters." : "There are no completed access requests yet."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.dokter?.name || "Unknown Doctor"}</div>
                          <div className="text-sm text-gray-500">{request.dokter?.email || ""}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.patient?.name || "Unknown Patient"}</div>
                          <div className="text-sm text-gray-500">ID: {request.patient?.id || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.access_type === "edit" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>
                            {request.access_type === "edit" ? "Edit Access" : "View Only"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                          {request.status === "approved" && request.expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(request.expires_at) > new Date() ? "Active until" : "Expired"}: {new Date(request.expires_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.updated_at || request.created_at).toLocaleDateString()}
                          <br />
                          {new Date(request.updated_at || request.created_at).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {request.reason && (
                              <div className="mb-1">
                                <span className="font-medium">Reason:</span> {request.reason}
                              </div>
                            )}
                            {request.status === "approved" && request.access_code && <div className="text-xs text-gray-500">Access Code: {request.access_code}</div>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Approval Modal */}
      {isApprovalModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsApprovalModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">Approve Access Request</h1>
                  <p className="text-sm text-gray-500 mt-1">Set access code and duration</p>
                </div>
                <button onClick={() => setIsApprovalModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Request Details:</span>
                    <br />
                    Doctor: {selectedRequest?.dokter?.name}
                    <br />
                    Doctor Email: {selectedRequest?.dokter?.email}
                    <br />
                    Patient: {selectedRequest?.patient?.name}
                    <br />
                    Access Type: <span className="font-medium">{selectedRequest?.access_type === "edit" ? "Edit Access" : "View Only"}</span>
                    {selectedRequest?.reason && (
                      <>
                        <br />
                        Reason: {selectedRequest.reason}
                      </>
                    )}
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">The access code will be automatically sent to the doctor's email address when approved.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Access Code</label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter access code"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Access Duration (minutes)</label>
                  <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours</option>
                    <option value={1440}>24 hours</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsApprovalModalOpen(false)} className="w-full bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 py-2.5 rounded-lg font-medium">
                    Cancel
                  </button>
                  <button onClick={handleApprovalSubmit} className="w-full bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-all duration-200 py-2.5 rounded-lg font-medium">
                    Approve Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAccessRequestFragment;

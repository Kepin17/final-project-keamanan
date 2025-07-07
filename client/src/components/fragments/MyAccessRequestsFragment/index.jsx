import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";
import { useRealtimeMyAccessRequests } from "../../../hooks/useRealtimeData";
import { toast } from "react-toastify";

const MyAccessRequestsFragment = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [error, setError] = useState("");

  // Use realtime data hook
  const { data: realtimeData, loading: isLoading, error: realtimeError, lastUpdated, isInitialLoad, refreshData, forceUpdate } = useRealtimeMyAccessRequests();

  useEffect(() => {
    if (realtimeData && realtimeData.length >= 0) {
      setAccessRequests(realtimeData);
      setError("");

      // Only show notification if it's not the initial load and data actually updated
      if (lastUpdated && !isInitialLoad) {
        toast.info("Your access requests updated", { autoClose: 2000 });
      }
    }
  }, [realtimeData, lastUpdated, isInitialLoad]);

  useEffect(() => {
    if (realtimeError) {
      setError(realtimeError);
    }
  }, [realtimeError]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
      case "approved":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
      case "rejected":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      case "expired":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Expired</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getAccessTypeBadge = (accessType) => {
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${accessType === "edit" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>{accessType === "edit" ? "Edit Access" : "View Only"}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your access requests...</span>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">My Access Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Track the status of your patient data access requests</p>
          </div>
          <button onClick={refreshData} className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {accessRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Requests</h3>
          <p className="text-gray-500">You haven't made any access requests yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.patient?.name || "Unknown Patient"}</div>
                    <div className="text-sm text-gray-500">ID: {request.patient?.id || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getAccessTypeBadge(request.access_type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                    {request.status === "approved" && request.expires_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(request.expires_at) > new Date() ? "Expires" : "Expired"}: {new Date(request.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                    <br />
                    {new Date(request.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {request.reason && (
                        <div className="mb-1">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </div>
                      )}
                      {request.status === "approved" && request.access_code && <div className="text-xs text-green-600">Access code sent to your email</div>}
                      {request.status === "rejected" && <div className="text-xs text-red-600">Request was rejected by admin</div>}
                      {request.status === "pending" && <div className="text-xs text-yellow-600">Waiting for admin approval</div>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAccessRequestsFragment;

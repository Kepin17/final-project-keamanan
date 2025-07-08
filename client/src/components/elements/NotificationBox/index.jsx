import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaBell } from "react-icons/fa";
import Badge from "../Badge";

const NotificationBox = ({ notifications = [], itemsPerPage = 5, title = "Notifications" }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approved":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FaBell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case "approved":
        return (
          <Badge variant="success" size="sm">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="danger" size="sm">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" size="sm">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="info" size="sm">
            Info
          </Badge>
        );
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="card-base bg-white rounded-xl p-8 text-center">
        <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-responsive-lg font-medium text-gray-500 mb-2">No notifications</h3>
        <p className="text-responsive-sm text-gray-400">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="card-base bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-responsive-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaBell className="w-5 h-5 text-blue-500" />
            {title}
          </h3>
          <Badge variant="info" size="sm">
            {notifications.length} total
          </Badge>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {currentNotifications.map((notification, index) => (
          <div key={index} className="p-4 hover:bg-slate-50 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-responsive-sm text-gray-900 leading-relaxed">{notification.message}</p>
                  <div className="flex-shrink-0">{getNotificationBadge(notification.type)}</div>
                </div>
                <p className="mt-2 text-responsive-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBox;

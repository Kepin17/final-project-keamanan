import React, { useState } from "react";
import ApprovalCard from "../../elements/ApprovalCard";
import NotificationBox from "../../elements/NotificationBox";
import Input from "../../elements/Input";
import Button from "../../elements/Button";

const MedicalApprovalFragment = () => {
  // Sample data - replace with actual API data
  const [accessCode, setAccessCode] = useState("");
  const [approvalRequests] = useState([
    {
      doctor: "Dr. John Smith",
      patientName: "Alice Johnson",
      requestTime: "2 hours ago",
      status: "pending",
    },
    {
      doctor: "Dr. Emily Davis",
      patientName: "David Wilson",
      requestTime: "30 minutes ago",
      status: "pending",
    },
    {
      doctor: "Dr. Robert Lee",
      patientName: "Emma Thompson",
      requestTime: "1 hour ago",
      status: "pending",
    },
  ]);

  const [notifications] = useState([
    {
      type: "approved",
      message: "Access granted to Dr. Sarah Wilson for patient Bob Anderson",
      time: "3 hours ago",
    },
    {
      type: "rejected",
      message: "Access denied to Dr. Michael Brown for patient Carol Taylor",
      time: "5 hours ago",
    },
    {
      type: "pending",
      message: "New access request from Dr. John Smith for patient Alice Johnson",
      time: "2 hours ago",
    },
    {
      type: "approved",
      message: "Access granted to Dr. Emily Davis for patient Mark Wilson",
      time: "1 day ago",
    },
    {
      type: "approved",
      message: "Access granted to Dr. Robert Lee for patient Sarah Thompson",
      time: "1 day ago",
    },
    {
      type: "rejected",
      message: "Access denied to Dr. Lisa Chen for patient James Anderson",
      time: "2 days ago",
    },
    {
      type: "approved",
      message: "Access granted to Dr. William Brown for patient Emma Davis",
      time: "2 days ago",
    },
    {
      type: "rejected",
      message: "Access denied to Dr. Maria Garcia for patient John Smith",
      time: "3 days ago",
    },
  ]);

  const handleGenerateCode = () => {
    // Generate random access code - replace with actual API call
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setAccessCode(newCode);
  };

  const handleApprove = (doctor, patient) => {
    // Handle approval logic
    console.log(`Approved access for ${doctor} to patient ${patient}'s records`);
  };

  const handleReject = (doctor, patient) => {
    // Handle rejection logic
    console.log(`Rejected access for ${doctor} to patient ${patient}'s records`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Access Code Generator Section */}
      <div className="xl:col-span-2 space-y-8">
        {/* Approval Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Access Requests</h2>
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{approvalRequests.length} Pending</span>
          </div>
          <div className="space-y-4">
            {approvalRequests.map((request, index) => (
              <ApprovalCard key={index} {...request} onApprove={() => handleApprove(request.doctor, request.patientName)} onReject={() => handleReject(request.doctor, request.patientName)} />
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="xl:col-span-1">
        <div className="sticky top-8">
          <NotificationBox notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default MedicalApprovalFragment;

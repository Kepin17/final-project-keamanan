import React, { useState } from "react";
import ApprovalCard from "../../elements/ApprovalCard";
import NotificationBox from "../../elements/NotificationBox";
import Input from "../../elements/Input";
import Button from "../../elements/Button";
import OtpInput from "../../elements/OTPInput";
import FormInput from "../../elements/Input";

const MedicalApprovalFragment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [durationCode, setDurationCode] = useState("");
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
    setSelectedRequest({ doctor, patient });
    setIsModalOpen(true);
    setAccessCode(""); // Reset access code when opening modal
    setDurationCode(""); // Reset duration code when opening modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSubmitAccess = () => {
    if (!accessCode || !durationCode) {
      alert("Please fill in all required fields");
      return;
    }
    // Handle approval logic with access code
    console.log(`Approved access for ${selectedRequest.doctor} to patient ${selectedRequest.patient}'s records`);
    console.log(`Access Code: ${accessCode}, Duration: ${durationCode} days`);
    handleCloseModal();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative">
      {/* Modal and Backdrop */}
      {isModalOpen && (
        <>
          {/* Modal Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseModal} />

          {/* Approval Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">Grant Access</h1>
                  <p className="text-sm text-gray-500 mt-1">Generate access code for {selectedRequest?.doctor} to view patient records</p>
                </div>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Request Details:</span>
                    <br />
                    Doctor: {selectedRequest?.doctor}
                    <br />
                    Patient: {selectedRequest?.patient}
                  </p>
                </div>

                <div className="space-y-3">
                  <FormInput name="accessCode" inputType="text" inputPlaceholder="Access Code" isRequired={true} value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full">
                    Access Code
                  </FormInput>
                  <Button onClick={handleGenerateCode} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium shadow-sm shadow-blue-200">
                    Generate Code
                  </Button>
                </div>

                <FormInput name="durationCode" inputType="number" inputPlaceholder="Enter duration in days" isRequired={true} value={durationCode} onChange={(e) => setDurationCode(e.target.value)} className="w-full">
                  Duration Code / Day
                </FormInput>

                <Button onClick={handleSubmitAccess} className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white transition-all duration-200 py-2.5 rounded-lg font-medium shadow-sm shadow-green-200 mt-4">
                  Grant Access
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
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
        <div className=" top-8">
          <NotificationBox notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default MedicalApprovalFragment;

import React from "react";
import MedicalApprovalFragment from "../../components/fragments/MedicalApprovalFragment";

const MedicalApprovalPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Medical Records Access Approval</h1>
          <p className="text-sm text-gray-600 max-w-2xl">Manage access requests from doctors to view and edit patient medical records</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mt-3 sm:mt-0">
            <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">Active Requests Available</div>
          </div>
        </div>
      </div>

      <MedicalApprovalFragment />
    </div>
  );
};

export default MedicalApprovalPage;

import React from "react";
import AdminAccessRequestFragment from "../../components/fragments/AdminAccessRequestFragment";

const AdminAccessRequestPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-300">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Manage doctor access requests to patient data</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <AdminAccessRequestFragment />
        </div>
      </div>
    </div>
  );
};

export default AdminAccessRequestPage;

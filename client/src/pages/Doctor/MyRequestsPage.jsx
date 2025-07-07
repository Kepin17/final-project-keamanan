import React from "react";
import MyAccessRequestsFragment from "../../components/fragments/MyAccessRequestsFragment";

const MyRequestsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">My Access Requests</h1>
        <p className="mt-1 text-sm text-gray-500">View and track your patient data access requests</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <MyAccessRequestsFragment />
        </div>
      </div>
    </div>
  );
};

export default MyRequestsPage;

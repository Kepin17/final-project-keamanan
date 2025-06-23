import React from "react";
import DashboardLayouts from "../../components/layouts/DashboardLayouts";
import ActivityHistoryFragment from "../../components/fragments/ActivityHistoryFragment";

const ActivityHistoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">Track all activities and security events related to your account</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <ActivityHistoryFragment />
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryPage;

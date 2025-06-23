import React from "react";
import ActivityItem from "../../elements/ActivityItem";

const ActivityHistoryFragment = () => {
  // Sample data - replace with actual data from your API
  const activities = [
    {
      time: "5 min ago",
      action: "Login Attempt",
      description: "Successfully logged in from Chrome on Windows",
      status: "success",
    },
    {
      time: "1 hour ago",
      action: "Password Change",
      description: "Password was successfully updated",
      status: "success",
    },
    {
      time: "2 hours ago",
      action: "Failed Login",
      description: "Failed login attempt from unknown device",
      status: "failed",
    },
    {
      time: "1 day ago",
      action: "Account Setup",
      description: "Two-factor authentication was enabled",
      status: "success",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Activity History</h2>
        <p className="mt-1 text-sm text-gray-500">Recent account activities and security events</p>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <ActivityItem key={index} time={activity.time} action={activity.action} description={activity.description} status={activity.status} />
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All Activities</button>
      </div>
    </div>
  );
};

export default ActivityHistoryFragment;

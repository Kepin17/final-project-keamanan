import React from "react";
import SideBar from "../../fragments/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-wrapper w-full h-screen bg-slate-200 p-2 flex gap-5">
      <SideBar />
      <div className="content-wrapper w-full h-full bg-slate-900 rounded-md p-5">{children}</div>
    </div>
  );
};

export default DashboardLayout;

import React from "react";
import SideBar from "../../fragments/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-wrapper w-full min-h-screen bg-slate-100 flex">
      <div className="fixed inset-y-0 z-30 transition-all duration-300 lg:translate-x 2xl:translate-x-0">
        <SideBar />
      </div>
      <div className="flex-1 w-full lg:pl-64">
        <main className="relative h-full min-h-screen p-4 lg:p-8 transition-all duration-300 bg-slate-100">
          <div className="mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

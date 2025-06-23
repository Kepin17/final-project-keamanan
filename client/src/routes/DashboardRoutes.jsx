import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboards";
import ActivityHistoryPage from "../pages/Dashboards/ActivityHistoryPage";
import MedicalApprovalPage from "../pages/Dashboards/MedicalApprovalPage";
import StaffDataPage from "../pages/Dashboards/StaffDataPage";
import PatientDataPage from "../pages/Dashboards/PatientDataPage";
import DashboardLayout from "../components/layouts/DashboardLayouts";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="activity" element={<ActivityHistoryPage />} />
        <Route path="medical-approval" element={<MedicalApprovalPage />} />
        <Route path="staff" element={<StaffDataPage />} />
        <Route path="patients" element={<PatientDataPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;

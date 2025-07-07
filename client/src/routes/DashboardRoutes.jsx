import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboards";
import ActivityHistoryPage from "../pages/Dashboards/ActivityHistoryPage";
import MedicalApprovalPage from "../pages/Dashboards/MedicalApprovalPage";
import StaffDataPage from "../pages/Dashboards/StaffDataPage";
import PatientDataPage from "../pages/Dashboards/PatientDataPage";
import AdminAccessRequestPage from "../pages/Admin/AdminAccessRequestPage";
import MyRequestsPage from "../pages/Doctor/MyRequestsPage";
import RoleBasedDashboard from "../pages/Dashboards/RoleBasedDashboard";
import ProtectedRoute from "../components/elements/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayouts";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<RoleBasedDashboard />} />
        <Route path="activity" element={<ActivityHistoryPage />} />
        <Route path="medical-approval" element={<MedicalApprovalPage />} />
        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StaffDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={["dokter"]}>
              <PatientDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/access-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAccessRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-requests"
          element={
            <ProtectedRoute allowedRoles={["dokter"]}>
              <MyRequestsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;

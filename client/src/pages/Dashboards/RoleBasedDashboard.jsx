import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { getUrlApiWithPath } from "../../utils/url_api";

const RoleBasedDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(getUrlApiWithPath("profile"), {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setUserRole(response.data.role);
        } else {
          // Fallback to localStorage if no token
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUserRole(userData.role);
          }
        }
      } catch (error) {
        console.error("Failed to get user role:", error);
        // Fallback to localStorage if API fails
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUserRole(userData.role);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  // Redirect based on user role
  if (userRole === "admin") {
    return <Navigate to="/dashboard/staff" replace />;
  } else if (userRole === "dokter") {
    return <Navigate to="/dashboard/patients" replace />;
  }

  // If no role found, redirect to login
  return <Navigate to="/login" replace />;
};

export default RoleBasedDashboard;

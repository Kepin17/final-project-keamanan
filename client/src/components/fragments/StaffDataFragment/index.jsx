import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import Input from "../../elements/Input";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";
import { toast } from "react-toastify";

const StaffDataFragment = () => {
  // Department options
  const departmentOptions = [
    { value: "Emergency Department", label: "Emergency Department" },
    { value: "Cardiology", label: "Cardiology" },
    { value: "Internal Medicine", label: "Internal Medicine" },
    { value: "Pediatrics", label: "Pediatrics" },
    { value: "Obstetrics & Gynecology", label: "Obstetrics & Gynecology" },
    { value: "Surgery", label: "Surgery" },
    { value: "Orthopedics", label: "Orthopedics" },
    { value: "Radiology", label: "Radiology" },
    { value: "Laboratory", label: "Laboratory" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "Nursing", label: "Nursing" },
    { value: "Administration", label: "Administration" },
    { value: "IT Department", label: "IT Department" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Finance", label: "Finance" },
  ];

  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
    role: "dokter", // Default to 'dokter' as expected by backend
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchStaffData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(getUrlApiWithPath("users"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // API returns array directly
      const staffData = response.data || [];
      setStaffList(staffData);
      setFilteredStaff(staffData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch staff data";
      setError(errorMessage);
      toast.error(errorMessage);
      setStaffList([]);
      setFilteredStaff([]);

      // Handle unauthorized access
      if (err.response?.status === 403) {
        toast.error("You don't have permission to access staff data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleFilter = (role) => {
    setSelectedRole(role);
    if (!Array.isArray(staffList)) return;

    const filtered = staffList.filter(
      (staff) =>
        (role === "all" || staff?.role === role) &&
        (searchQuery === "" || staff?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || staff?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || staff?.department?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStaff(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!Array.isArray(staffList)) return;

    const filtered = staffList.filter(
      (staff) => (selectedRole === "all" || staff?.role === selectedRole) && (staff?.name?.toLowerCase().includes(query) || staff?.email?.toLowerCase().includes(query) || staff?.department?.toLowerCase().includes(query))
    );
    setFilteredStaff(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      department: "",
      role: "dokter", // Use 'dokter' as expected by backend
    });
    setCurrentStaff(null);
    setError("");
  };

  const handleAddStaff = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      department: staff.department || "",
      password: "",
      confirmPassword: "",
      role: staff.role,
      // Don't set password for editing
    });
    setError("");
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate confirm password for new staff
    if (!currentStaff && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (!currentStaff && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let response;
      if (currentStaff) {
        // Update existing staff
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role: formData.role,
        };

        // Only include password if it's provided and matches confirmation
        if (formData.password) {
          if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsSubmitting(false);
            return;
          }
          if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsSubmitting(false);
            return;
          }
          updateData.password = formData.password;
          updateData.password_confirmation = formData.confirmPassword;
        }

        response = await axios.put(getUrlApiWithPath(`users/${currentStaff.id}`), updateData, { headers });
        toast.success("Staff member updated successfully");
      } else {
        // Create new staff
        response = await axios.post(
          getUrlApiWithPath("users"),
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            phone: formData.phone,
            department: formData.department,
            role: formData.role,
          },
          { headers }
        );
        toast.success("Staff member created successfully");
      }

      await fetchStaffData(); // Refresh the list
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      let errorMessage = "An error occurred";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action";
      } else if (err.response?.status === 422) {
        errorMessage = "Please check your input data";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staff) => {
    if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(getUrlApiWithPath(`users/${staff.id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Staff member deleted successfully");
      await fetchStaffData(); // Refresh the list
    } catch (err) {
      let errorMessage = "Failed to delete staff member";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to delete staff members";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
            <p className="text-gray-600 mt-1">Manage and monitor your healthcare staff</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm lg:w-auto w-full justify-center" onClick={handleAddStaff}>
            <FaPlus className="text-sm" /> Add New Staff
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2.5 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleSearch({ target: { value: "" } });
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="lg:w-48">
            <select
              value={selectedRole}
              onChange={(e) => handleFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors duration-200"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="dokter">Doctor</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2 py-1">Quick filters:</span>
            {["Emergency Department", "Cardiology", "Surgery", "Pediatrics"].map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSearchQuery(dept);
                  handleSearch({ target: { value: dept } });
                }}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors duration-200"
              >
                {dept}
              </button>
            ))}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("all");
                handleFilter("all");
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Results Counter */}
        {!isLoading && !error && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredStaff.length} of {staffList.length} staff members
              {searchQuery && (
                <span className="ml-1">
                  for "<span className="font-medium text-blue-600">{searchQuery}</span>"
                </span>
              )}
              {selectedRole !== "all" && (
                <span className="ml-1">
                  · Role: <span className="font-medium text-blue-600 capitalize">{selectedRole}</span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 font-medium">Loading staff data...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the latest information</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-red-800 font-medium mb-1">Error Loading Data</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button onClick={fetchStaffData} className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredStaff.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{searchQuery || selectedRole !== "all" ? "No staff members found" : "No staff members yet"}</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedRole !== "all" ? "Try adjusting your search criteria or filters to find what you're looking for." : "Get started by adding your first staff member to begin managing your healthcare team."}
            </p>
            {searchQuery || selectedRole !== "all" ? (
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRole("all");
                    handleFilter("all");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg transition-colors duration-200 mr-3"
                >
                  Clear Filters
                </Button>
                <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200">
                  <FaPlus /> Add New Staff
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200">
                <FaPlus /> Add Your First Staff Member
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Staff Cards Grid */}
      {!isLoading && !error && filteredStaff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{staff.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditStaff(staff)} className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteStaff(staff)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {staff.specialization || staff.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    {staff.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {staff.phone}
                  </div>
                </div>

                <div className="pt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.role === "dokter" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {staff.role === "dokter" ? "Medical Staff" : "Administrative Staff"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">{currentStaff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full"
                  required={!currentStaff}
                  placeholder={currentStaff ? "Leave blank to keep current password" : "Enter password"}
                />
                {!currentStaff && <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full"
                  required={!currentStaff || formData.password}
                  placeholder={currentStaff ? "Confirm new password if changing" : "Confirm password"}
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="dokter">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded">
                  Cancel
                </Button>
                <Button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded" disabled={isSubmitting}>
                  {isSubmitting ? (currentStaff ? "Updating..." : "Adding...") : currentStaff ? "Update Staff" : "Add Staff"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDataFragment;

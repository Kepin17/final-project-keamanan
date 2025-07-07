import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import Input from "../../elements/Input";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";
import { toast } from "react-toastify";

const StaffDataFragment = () => {
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

    if (role === "all") {
      setFilteredStaff(staffList);
    } else {
      setFilteredStaff(staffList.filter((staff) => staff?.role === role));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!Array.isArray(staffList)) return;

    const filtered = staffList.filter((staff) => (selectedRole === "all" || staff?.role === selectedRole) && (staff?.name?.toLowerCase().includes(query) || staff?.email?.toLowerCase().includes(query)));
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

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let response;
      if (currentStaff) {
        // Update existing staff
        response = await axios.put(
          getUrlApiWithPath(`users/${currentStaff.id}`),
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
          },
          { headers }
        );
        toast.success("Staff member updated successfully");
      } else {
        // Create new staff
        response = await axios.post(
          getUrlApiWithPath("users"),
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
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
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input type="text" placeholder="Search staff..." value={searchQuery} onChange={handleSearch} className="pl-10 pr-4 py-2 w-full" />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select value={selectedRole} onChange={(e) => handleFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="dokter">Doctor</option>
          </select>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleAddStaff}>
            <FaPlus /> Add Staff
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading staff data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button onClick={fetchStaffData} className="mt-2 text-red-600 hover:text-red-800 text-sm underline">
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-500 mb-4">{searchQuery || selectedRole !== "all" ? "Try adjusting your search or filter." : "Get started by adding your first staff member."}</p>
          <Button onClick={handleAddStaff} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto">
            <FaPlus /> Add Staff
          </Button>
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
                <Input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <Input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full" required />
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

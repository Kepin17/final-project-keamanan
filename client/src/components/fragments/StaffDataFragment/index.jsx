import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import Input from "../../elements/Input";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

const StaffDataFragment = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Mock data - replace with actual API calls
  const mockStaffData = [
    { id: 1, name: "Dr. John Doe", role: "doctor", specialization: "Cardiology", email: "john@hospital.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", role: "admin", department: "Reception", email: "jane@hospital.com", phone: "123-456-7891" },
    { id: 3, name: "Dr. Sarah Wilson", role: "doctor", specialization: "Pediatrics", email: "sarah@hospital.com", phone: "123-456-7892" },
  ];

  useEffect(() => {
    // Replace with API call
    setStaffList(mockStaffData);
    setFilteredStaff(mockStaffData);
  }, []);

  const handleFilter = (role) => {
    setSelectedRole(role);
    if (role === "all") {
      setFilteredStaff(staffList);
    } else {
      setFilteredStaff(staffList.filter((staff) => staff.role === role));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = staffList.filter((staff) => (selectedRole === "all" || staff.role === selectedRole) && (staff.name.toLowerCase().includes(query) || staff.email.toLowerCase().includes(query)));
    setFilteredStaff(filtered);
  };

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      // Replace with API call
      const updatedList = staffList.filter((staff) => staff.id !== staffId);
      setStaffList(updatedList);
      setFilteredStaff(updatedList);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button className={`px-4 py-2 rounded ${selectedRole === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => handleFilter("all")}>
            All Staff
          </Button>
          <Button className={`px-4 py-2 rounded ${selectedRole === "doctor" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => handleFilter("doctor")}>
            Doctors
          </Button>
          <Button className={`px-4 py-2 rounded ${selectedRole === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => handleFilter("admin")}>
            Admins
          </Button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input type="text" placeholder="Search staff..." value={searchQuery} onChange={handleSearch} className="pl-10 pr-4 py-2 w-full" />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleAddStaff}>
            <FaPlus /> Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Cards Grid */}
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
                  <button onClick={() => handleDeleteStaff(staff.id)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors">
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.role === "doctor" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                  {staff.role === "doctor" ? "Medical Staff" : "Administrative Staff"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{currentStaff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Input type="text" defaultValue={currentStaff?.name} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{currentStaff?.role === "doctor" ? "Specialization" : "Department"}</label>
                <Input type="text" defaultValue={currentStaff?.specialization || currentStaff?.department} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" defaultValue={currentStaff?.email} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <Input type="tel" defaultValue={currentStaff?.phone} className="w-full" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </Button>
                <Button className="px-4 py-2 bg-blue-600 text-white rounded">{currentStaff ? "Update" : "Add"} Staff</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDataFragment;

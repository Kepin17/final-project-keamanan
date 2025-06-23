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

      {/* Staff List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization/Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{staff.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.specialization || staff.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEditStaff(staff)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

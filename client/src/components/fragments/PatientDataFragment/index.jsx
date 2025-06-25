import React, { useState } from "react";
import Button from "../../elements/Button";
import FormInput from "../../elements/Input";

const PatientDataFragment = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      contact: "+1234567890",
      address: "123 Main St, City",
      lastVisit: "2025-06-20",
      status: "Active",
      requestStatus: "approved",
      accessType: "view",
      accessCode: "ABC123",
      accessExpiry: "2025-07-25",
    },
    {
      id: 2,
      name: "Jane Smith",
      dateOfBirth: "1985-08-22",
      gender: "Female",
      contact: "+1987654321",
      address: "456 Oak Ave, Town",
      lastVisit: "2025-06-18",
      status: "Active",
      requestStatus: "approved",
      accessType: "edit",
      accessCode: "XYZ789",
      accessExpiry: "2025-07-20",
    },
    {
      id: 3,
      name: "Robert Johnson",
      dateOfBirth: "1992-03-10",
      gender: "Male",
      contact: "+1122334455",
      address: "789 Pine St, Village",
      lastVisit: "2025-06-15",
      status: "Active",
      requestStatus: "pending",
      accessType: "view",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    address: "",
  });
  const [accessRequests, setAccessRequests] = useState([]);
  const [selectedAccessType, setSelectedAccessType] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [medicalHistory, setMedicalHistory] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medications: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleCreatePatient = () => {
    // Add validation here
    const patientData = {
      ...newPatient,
      id: patients.length + 1,
      lastVisit: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setPatients([...patients, patientData]);
    setIsCreateModalOpen(false);
    setNewPatient({
      name: "",
      dateOfBirth: "",
      gender: "",
      contact: "",
      address: "",
    });
  };

  const handleRequestAccess = (patient) => {
    setSelectedPatient(patient);
    setIsRequestModalOpen(true);
    setSelectedAccessType("");
    setRequestReason("");
  };

  const getStatusBadge = (patient) => {
    switch (patient.requestStatus) {
      case "pending":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Request Pending</span>;
      case "approved":
        return (
          <div className="space-y-1">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Access Granted ({patient.accessType})</span>
            <div className="text-xs text-gray-500">
              Code: {patient.accessCode}
              <br />
              Expires: {patient.accessExpiry}
            </div>
          </div>
        );
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No Access</span>;
    }
  };

  const handleSubmitRequest = () => {
    if (!selectedAccessType) {
      alert("Please select an access type");
      return;
    }

    const newRequest = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      accessType: selectedAccessType,
      reason: requestReason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    setAccessRequests([...accessRequests, newRequest]);

    // Update the patient's status to show pending request
    const updatedPatients = patients.map((p) => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          requestStatus: "pending",
          accessType: selectedAccessType,
        };
      }
      return p;
    });
    setPatients(updatedPatients);

    setIsRequestModalOpen(false);
    setSelectedPatient(null);
    setSelectedAccessType("");
    setRequestReason("");
  };

  const handleAccessCodeSubmit = () => {
    if (!selectedPatient || !accessCodeInput) return;

    if (accessCodeInput === selectedPatient.accessCode) {
      setIsAccessCodeModalOpen(false);
      setIsMedicalHistoryModalOpen(true);
    } else {
      alert("Invalid access code");
    }
  };

  const handleMedicalHistorySubmit = () => {
    if (selectedPatient?.accessType !== "edit") {
      setIsMedicalHistoryModalOpen(false);
      return;
    }

    // Here you would typically save the medical history to your backend
    console.log("Medical history submitted:", medicalHistory);
    setIsMedicalHistoryModalOpen(false);
    setAccessCodeInput("");
    setMedicalHistory({
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medications: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleViewAccessDetails = (patient) => {
    setSelectedPatient(patient);
    setIsAccessCodeModalOpen(true);
  };

  const renderFormField = (label, value, onChange, placeholder, rows = 3) => {
    const isViewOnly = selectedPatient?.accessType === "view";

    if (isViewOnly) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-[80px]">{value || "No information available"}</div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={rows} placeholder={placeholder} />
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Patient List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Patient List</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and view patient records</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 px-4 py-2 rounded-lg font-medium">
            Add New Patient
          </Button>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.dateOfBirth}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{patient.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(patient)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {patient.requestStatus === "approved" ? (
                      <button className="text-green-600 hover:text-green-900" onClick={() => handleViewAccessDetails(patient)}>
                        Enter Access Code
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestAccess(patient)}
                        className={`text-blue-600 hover:text-blue-900 ${patient.requestStatus === "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={patient.requestStatus === "pending"}
                      >
                        {patient.requestStatus === "pending" ? "Request Pending" : "Request Access"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Patient Modal */}
      {isCreateModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsCreateModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">Add New Patient</h1>
                  <p className="text-sm text-gray-500 mt-1">Enter patient information</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <FormInput name="name" inputType="text" inputPlaceholder="Enter patient name" isRequired={true} value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}>
                  Full Name
                </FormInput>

                <FormInput name="dateOfBirth" inputType="date" isRequired={true} value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}>
                  Date of Birth
                </FormInput>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <FormInput name="contact" inputType="tel" inputPlaceholder="Enter contact number" isRequired={true} value={newPatient.contact} onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}>
                  Contact Number
                </FormInput>

                <FormInput name="address" inputType="text" inputPlaceholder="Enter address" isRequired={true} value={newPatient.address} onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}>
                  Address
                </FormInput>

                <Button onClick={handleCreatePatient} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium">
                  Create Patient
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Request Access Modal */}
      {isRequestModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsRequestModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">Request Access</h1>
                  <p className="text-sm text-gray-500 mt-1">Request permission to access patient data</p>
                </div>
                <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Patient Details:</span>
                    <br />
                    Name: {selectedPatient?.name}
                    <br />
                    Date of Birth: {selectedPatient?.dateOfBirth}
                    <br />
                    Contact: {selectedPatient?.contact}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Access Type</label>
                  <select value={selectedAccessType} onChange={(e) => setSelectedAccessType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select access type</option>
                    <option value="view">View Records</option>
                    <option value="edit">Edit Records</option>
                  </select>
                </div>

                <FormInput name="reason" inputType="text" inputPlaceholder="Enter additional notes (optional)" value={requestReason} onChange={(e) => setRequestReason(e.target.value)}>
                  Additional Notes
                </FormInput>

                <Button onClick={handleSubmitRequest} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium">
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Access Code Modal */}
      {isAccessCodeModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsAccessCodeModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">Enter Access Code</h1>
                  <p className="text-sm text-gray-500 mt-1">Enter your access code to view patient records</p>
                </div>
                <button onClick={() => setIsAccessCodeModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Patient Details:</span>
                    <br />
                    Name: {selectedPatient?.name}
                    <br />
                    Access Type: {selectedPatient?.accessType}
                  </p>
                </div>

                <FormInput name="accessCode" inputType="text" inputPlaceholder="Enter access code" isRequired={true} value={accessCodeInput} onChange={(e) => setAccessCodeInput(e.target.value)}>
                  Access Code
                </FormInput>

                <Button onClick={handleAccessCodeSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium">
                  Verify Access
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Medical History Modal */}
      {isMedicalHistoryModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMedicalHistoryModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="font-bold text-2xl text-gray-800">
                    Medical History
                    {selectedPatient?.accessType === "view" && <span className="ml-2 text-sm font-normal text-gray-500">(View Only)</span>}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Patient: {selectedPatient?.name}</p>
                </div>
                <button onClick={() => setIsMedicalHistoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date of Visit</label>
                  <input
                    type="date"
                    value={medicalHistory.date}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${selectedPatient?.accessType === "view" ? "bg-gray-50 border-gray-200 text-gray-700" : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"}`}
                    disabled={selectedPatient?.accessType === "view"}
                  />
                </div>

                {renderFormField("Diagnosis", medicalHistory.diagnosis, (e) => setMedicalHistory({ ...medicalHistory, diagnosis: e.target.value }), "Enter diagnosis details")}

                {renderFormField("Symptoms", medicalHistory.symptoms, (e) => setMedicalHistory({ ...medicalHistory, symptoms: e.target.value }), "Enter symptoms")}

                {renderFormField("Treatment Plan", medicalHistory.treatment, (e) => setMedicalHistory({ ...medicalHistory, treatment: e.target.value }), "Enter treatment details")}

                {renderFormField("Medications", medicalHistory.medications, (e) => setMedicalHistory({ ...medicalHistory, medications: e.target.value }), "Enter prescribed medications")}

                {renderFormField("Additional Notes", medicalHistory.notes, (e) => setMedicalHistory({ ...medicalHistory, notes: e.target.value }), "Enter any additional notes")}

                <div className="flex gap-4 pt-4">
                  {selectedPatient?.accessType === "view" ? (
                    <Button onClick={() => setIsMedicalHistoryModalOpen(false)} className="w-full bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 py-2.5 rounded-lg font-medium">
                      Close
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => setIsMedicalHistoryModalOpen(false)} className="w-full bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 py-2.5 rounded-lg font-medium">
                        Cancel
                      </Button>
                      <Button onClick={handleMedicalHistorySubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium">
                        Save Medical History
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDataFragment;

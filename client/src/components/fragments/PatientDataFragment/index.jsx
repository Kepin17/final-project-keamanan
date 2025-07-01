import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import FormInput from "../../elements/Input";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";

const PatientDataFragment = () => {
  const [patients, setPatients] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(getUrlApiWithPath("patients"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const formattedPatients = response.data.map((patient) => ({
          id: patient.id,
          name: patient.name,
          dateOfBirth: patient.birth_date,
          gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
          contact: patient.phone,
          address: patient.address,
          status: "Active",
          lastVisit: patient.latest_visit?.split("T")[0] || patient.created_at?.split("T")[0],
          requestStatus: patient.access_status || "none",
          accessType: patient.access_type || null,
          accessCode: patient.access_code || null,
          accessExpiry: patient.access_expiry || null,
        }));

        setPatients(formattedPatients);
        setFetchError("");
      } catch (err) {
        console.error("Error fetching patients:", err);
        setFetchError("Failed to load patients. Please try again later.");
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchPatients();
  }, []);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    birth_date: "",
    gender: "",
    phone: "",
    address: "",
    diagnosis: "",
    notes: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const requestBody = {
        name: newPatient.name,
        birth_date: newPatient.birth_date, // Already in YYYY-MM-DD format from the date input
        gender: newPatient.gender.toLowerCase(),
        phone: newPatient.phone,
        address: newPatient.address,
        diagnosis: newPatient.diagnosis,
        notes: newPatient.notes,
      };

      const response = await axios.post(getUrlApiWithPath("patients"), requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        // Add the new patient to the list
        const createdPatient = {
          id: response.data.id,
          name: newPatient.name,
          dateOfBirth: newPatient.birth_date,
          gender: newPatient.gender,
          contact: newPatient.phone,
          address: newPatient.address,
          status: "Active",
          lastVisit: new Date().toISOString().split("T")[0],
        };

        setPatients((prev) => [...prev, createdPatient]);
        setIsCreateModalOpen(false);
        setNewPatient({
          name: "",
          birth_date: "",
          gender: "",
          phone: "",
          address: "",
          diagnosis: "",
          notes: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create patient");
    } finally {
      setIsLoading(false);
    }
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

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.dateOfBirth}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{patient.status}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {patient.gender}
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
                    {patient.contact}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Last Visit: {patient.lastVisit}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>{getStatusBadge(patient)}</div>
                  <div className="pt-2">
                    {patient.requestStatus === "approved" ? (
                      <button onClick={() => handleViewAccessDetails(patient)} className="w-full text-center py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm">
                        Enter Access Code
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestAccess(patient)}
                        className={`w-full text-center py-2 ${
                          patient.requestStatus === "pending" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        } rounded-lg transition-colors font-medium text-sm`}
                        disabled={patient.requestStatus === "pending"}
                      >
                        {patient.requestStatus === "pending" ? "Request Pending" : "Request Access"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Patient Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl transform transition-all my-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
                <p className="mt-1 text-sm text-gray-500">Enter patient's information below</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleCreatePatient} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <FormInput
                  name="name"
                  type="text"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  name="birth_date"
                  type="date"
                  value={newPatient.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={newPatient.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <FormInput
                  name="phone"
                  type="number"
                  value={newPatient.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  pattern="[0-9]*"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <FormInput
                  name="address"
                  type="text"
                  value={newPatient.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={newPatient.diagnosis}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter initial diagnosis"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={newPatient.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter any additional notes"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex gap-4 pt-4 sticky bottom-0 bg-white">
                <Button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Patient"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
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

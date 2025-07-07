import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import FormInput from "../../elements/Input";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";
import { useRealtimePatients } from "../../../hooks/useRealtimeData";
import { toast } from "react-toastify";

const PatientDataFragment = () => {
  const [patients, setPatients] = useState([]);
  const [fetchError, setFetchError] = useState("");

  // Use realtime data hook
  const { data: realtimeData, loading: isLoadingList, error: realtimeError, lastUpdated, isInitialLoad, refreshData, forceUpdate } = useRealtimePatients();

  useEffect(() => {
    if (realtimeData && realtimeData.length >= 0) {
      const formattedPatients = realtimeData.map((patient) => ({
        id: patient.id,
        name: patient.name,
        dateOfBirth: patient.birth_date,
        gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : "Unknown",
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

      // Only show notification if it's not the initial load and data actually updated
      if (lastUpdated && !isInitialLoad) {
        toast.info("Patient records updated", { autoClose: 2000 });
      }
    }
  }, [realtimeData, lastUpdated, isInitialLoad]);

  useEffect(() => {
    if (realtimeError) {
      setFetchError(realtimeError);
    }
  }, [realtimeError]);

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
        // Force update to trigger notification on next data change
        forceUpdate();

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

  const handleSubmitRequest = async () => {
    if (!selectedAccessType) {
      toast.error("Please select an access type");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        getUrlApiWithPath("request-access"),
        {
          patient_id: selectedPatient.id,
          access_type: selectedAccessType,
          reason: requestReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
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

        // Refresh data to get latest state
        refreshData();

        // Show success message
        toast.success("Access request submitted successfully! Check your email for approval updates.", {
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error("Error requesting access:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit access request";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPatientData = async () => {
    setIsLoadingList(true);
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

  const getStatusBadge = (patient) => {
    switch (patient.requestStatus) {
      case "pending":
        return (
          <div className="space-y-1">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Request Pending</span>
            {patient.accessType && <div className="text-xs text-gray-500">Type: {patient.accessType === "view" ? "View Only" : "Edit Access"}</div>}
          </div>
        );
      case "approved":
        return (
          <div className="space-y-1">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Access Granted ({patient.accessType === "view" ? "View" : "Edit"})</span>
            <div className="text-xs text-gray-500">Expires: {patient.accessExpiry ? new Date(patient.accessExpiry).toLocaleDateString() : "N/A"}</div>
          </div>
        );
      case "rejected":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Access Denied</span>;
      case "expired":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">Access Expired</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No Access</span>;
    }
  };

  const handleAccessCodeSubmit = async () => {
    if (!selectedPatient || !accessCodeInput) {
      toast.error("Please enter the access code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        getUrlApiWithPath(`patients/${selectedPatient.id}/access`),
        {
          access_code: accessCodeInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        // Store the patient data with diagnosis
        setMedicalHistory({
          diagnosis: response.data.diagnosis || "",
          symptoms: response.data.symptoms || "",
          treatment: response.data.treatment || "",
          medications: response.data.medications || "",
          notes: response.data.notes || "",
          date: new Date().toISOString().split("T")[0],
        });

        setIsAccessCodeModalOpen(false);
        setIsMedicalHistoryModalOpen(true);
      }
    } catch (err) {
      console.error("Error accessing patient data:", err);
      const errorMessage = err.response?.data?.message || "Invalid access code or access expired";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAccessDetails = (patient) => {
    setSelectedPatient(patient);
    setIsAccessCodeModalOpen(true);
  };

  const handleMedicalHistorySubmit = async () => {
    if (selectedPatient?.accessType !== "edit") {
      setIsMedicalHistoryModalOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically save the medical history to your backend
      // For now, we'll just show a success message
      console.log("Medical history submitted:", medicalHistory);
      toast.success("Medical history updated successfully!");

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
    } catch (err) {
      console.error("Error saving medical history:", err);
      toast.error("Failed to save medical history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (label, value, onChange, placeholder, rows = 3) => {
    const canEdit = selectedPatient?.accessType === "edit";

    if (!canEdit) {
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
          <div className="flex gap-3">
            <button onClick={refreshPatientData} className="bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2" disabled={isLoadingList}>
              <svg className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoadingList ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 px-4 py-2 rounded-lg font-medium">
              Add New Patient
            </button>
          </div>
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
                      <button onClick={() => handleViewAccessDetails(patient)} className="w-full text-center py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Enter Access Code"}
                      </button>
                    ) : patient.requestStatus === "pending" ? (
                      <button className="w-full text-center py-2 bg-gray-50 text-gray-400 cursor-not-allowed rounded-lg font-medium text-sm" disabled>
                        Request Pending
                      </button>
                    ) : patient.requestStatus === "rejected" ? (
                      <button onClick={() => handleRequestAccess(patient)} className="w-full text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Request Again"}
                      </button>
                    ) : patient.requestStatus === "expired" ? (
                      <button onClick={() => handleRequestAccess(patient)} className="w-full text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Request New Access"}
                      </button>
                    ) : (
                      <button onClick={() => handleRequestAccess(patient)} className="w-full text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Request Access"}
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

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">You will receive an email with the access code once your request is approved by the admin.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Access Type</label>
                  <select value={selectedAccessType} onChange={(e) => setSelectedAccessType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select access type</option>
                    <option value="view">View Records Only</option>
                    <option value="edit">Edit Records</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedAccessType === "view" ? "You will only be able to view patient records" : selectedAccessType === "edit" ? "You will be able to view and edit patient records" : "Choose the type of access you need"}
                  </p>
                </div>

                <FormInput name="reason" inputType="text" inputPlaceholder="Enter reason for access (optional)" value={requestReason} onChange={(e) => setRequestReason(e.target.value)}>
                  Reason for Access
                </FormInput>

                <Button onClick={handleSubmitRequest} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Request"}
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
                    Date of Birth: {selectedPatient?.dateOfBirth}
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
                    <span className="ml-2 text-sm font-normal text-gray-500">({selectedPatient?.accessType === "edit" ? "Edit Mode" : "View Only"})</span>
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
                    className={`w-full px-3 py-2 rounded-lg ${selectedPatient?.accessType === "edit" ? "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50 border-gray-200 text-gray-700"}`}
                    disabled={selectedPatient?.accessType !== "edit"}
                  />
                </div>

                {renderFormField("Diagnosis", medicalHistory.diagnosis, (e) => setMedicalHistory({ ...medicalHistory, diagnosis: e.target.value }), "Enter diagnosis details")}

                {renderFormField("Symptoms", medicalHistory.symptoms, (e) => setMedicalHistory({ ...medicalHistory, symptoms: e.target.value }), "Enter symptoms")}

                {renderFormField("Treatment Plan", medicalHistory.treatment, (e) => setMedicalHistory({ ...medicalHistory, treatment: e.target.value }), "Enter treatment details")}

                {renderFormField("Medications", medicalHistory.medications, (e) => setMedicalHistory({ ...medicalHistory, medications: e.target.value }), "Enter prescribed medications")}

                {renderFormField("Additional Notes", medicalHistory.notes, (e) => setMedicalHistory({ ...medicalHistory, notes: e.target.value }), "Enter any additional notes")}

                <div className="flex gap-4 pt-4">
                  {selectedPatient?.accessType === "edit" ? (
                    <>
                      <Button onClick={() => setIsMedicalHistoryModalOpen(false)} className="w-full bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 py-2.5 rounded-lg font-medium">
                        Cancel
                      </Button>
                      <Button onClick={handleMedicalHistorySubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 py-2.5 rounded-lg font-medium" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsMedicalHistoryModalOpen(false)} className="w-full bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 py-2.5 rounded-lg font-medium">
                      Close
                    </Button>
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

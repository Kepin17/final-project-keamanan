import React from "react";
import PatientDataFragment from "../../components/fragments/PatientDataFragment";

const PatientDataPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-300">Patient Records</h1>
        <p className="mt-1 text-sm text-gray-400">View and manage patient information</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <PatientDataFragment />
        </div>
      </div>
    </div>
  );
};

export default PatientDataPage;

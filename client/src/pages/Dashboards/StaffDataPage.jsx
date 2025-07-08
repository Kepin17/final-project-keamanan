import React, { useState } from "react";
import StaffDataFragment from "../../components/fragments/StaffDataFragment";

const StaffDataPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-300">Staff Management</h1>
        <p className="mt-1 text-sm text-gray-400">Manage hospital staff, doctors, and administrators</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <StaffDataFragment />
        </div>
      </div>
    </div>
  );
};

export default StaffDataPage;

import React from "react";
import AuthLayout from "../../components/layouts/AuthLayouts";
import OTPFragment from "../../components/fragments/OtpFragment";

const OtpPage = () => {
  // OTP page doesn't need form submission as it's handled by OTPFragment
  const handleDummySubmit = () => {
    // This won't be called as OTPFragment handles its own logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <AuthLayout title={"otp"} selfRegist={false} onSubmit={handleDummySubmit} isLoading={false}>
        <OTPFragment />
      </AuthLayout>
    </div>
  );
};

export default OtpPage;

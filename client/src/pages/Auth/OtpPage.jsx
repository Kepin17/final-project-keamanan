import React from "react";
import AuthLayout from "../../components/layouts/AuthLayouts";
import OTPFragment from "../../components/fragments/OtpFragment";

const OtpPage = () => {
  // OTP page doesn't need form submission as it's handled by OTPFragment
  const handleDummySubmit = () => {
    // This won't be called as OTPFragment handles its own logic
  };

  return (
    <AuthLayout title={"otp"} selfRegist={false} onSubmit={handleDummySubmit} isLoading={false}>
      <OTPFragment />
    </AuthLayout>
  );
};

export default OtpPage;

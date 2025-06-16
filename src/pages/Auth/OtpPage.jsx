import React from "react";
import AuthLayout from "../../components/layouts/AuthLayouts";
import OTPFragment from "../../components/fragments/OtpFragment";

const OtpPage = () => {
  return (
    <AuthLayout title={"otp"} selfRegist={false}>
      <OTPFragment />
    </AuthLayout>
  );
};

export default OtpPage;

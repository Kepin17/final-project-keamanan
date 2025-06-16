import OtpInput from "../../elements/OTPInput";

const OTPFragment = () => {
  const handleOtpComplete = (otp) => {
    console.log("OTP entered:", otp);
    // Handle verification here
  };
  return (
    <>
      <div>
        <h2>Enter Verification Code</h2>
        <OtpInput length={6} onComplete={handleOtpComplete} />
        <p className="text-sm text-gray-500 mt-2">Please enter the verification code sent to your email.</p>
      </div>
    </>
  );
};

export default OTPFragment;

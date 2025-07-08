import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "../../elements/OTPInput";
import { useOtp } from "../../../hooks/useOtp";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const OTPFragment = () => {
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("login");
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth hook for login OTP verification
  const { verifyLoginOtp, resendLoginOtp, isLoading: authLoading } = useAuth();

  // Regular OTP hook for other purposes
  const { isLoading, isVerifying, isResending, otpSent, otpVerified, canResend, remainingCooldown, attemptsRemaining, sendOtp, verifyOtp, resendOtp, checkOtpStatus, formatRemainingTime } = useOtp(email, purpose);

  // Get email, purpose, and userInfo from location state or query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email") || location.state?.email || "";
    const purposeParam = searchParams.get("purpose") || location.state?.purpose || "login";
    const userInfoParam = location.state?.userInfo || null;

    setEmail(emailParam);
    setPurpose(purposeParam);
    setUserInfo(userInfoParam);

    // If no email provided, redirect back
    if (!emailParam) {
      toast.error("Email not provided. Please login again.");
      navigate("/login");
    }
  }, [location, navigate]);

  // Check OTP status on component mount for non-login purposes
  useEffect(() => {
    if (email && purpose !== "login") {
      checkOtpStatus();
    }
  }, [email, purpose, checkOtpStatus]);

  // Handle OTP input change
  const handleOtpChange = (value) => {
    setOtpCode(value);

    // Auto verify when 6 digits are entered
    if (value.length === 6) {
      handleVerifyOtp(value);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (code = otpCode) => {
    if (purpose === "login") {
      // Use auth hook for login verification
      await verifyLoginOtp(email, code);
      // useAuth hook handles success navigation and error messages
    } else {
      // Use regular OTP verification for other purposes
      const result = await verifyOtp(code);

      if (result.success) {
        // Redirect based on purpose
        setTimeout(() => {
          switch (purpose) {
            case "password_reset":
              navigate("/reset-password", { state: { email, otpVerified: true } });
              break;
            case "access_request":
              navigate("/dashboard");
              break;
            default:
              navigate("/dashboard");
          }
        }, 1000);
      }
    }
  };

  // Handle send initial OTP (for non-login purposes)
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    await sendOtp();
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (purpose === "login") {
      await resendLoginOtp(email);
    } else {
      await resendOtp();
    }
    setOtpCode(""); // Clear the input
  };

  // Get verification message based on purpose
  const getVerificationMessage = () => {
    switch (purpose) {
      case "login":
        return "Enter the verification code to complete your secure login";
      case "password_reset":
        return "Enter the verification code to reset your password";
      case "access_request":
        return "Enter the verification code to verify your access request";
      default:
        return "Enter the verification code sent to your email";
    }
  };

  // Get title based on purpose
  const getTitle = () => {
    switch (purpose) {
      case "login":
        return "Secure Login Verification";
      case "password_reset":
        return "Reset Password Verification";
      case "access_request":
        return "Access Request Verification";
      default:
        return "Email Verification";
    }
  };

  // Determine loading state
  const isLoadingState = purpose === "login" ? authLoading : isLoading;
  const isVerifyingState = purpose === "login" ? authLoading : isVerifying;
  const isResendingState = purpose === "login" ? authLoading : isResending;

  return (
    <div className="otp-container max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getTitle()}</h2>

        {userInfo && purpose === "login" && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Welcome back, <strong>{userInfo.name}</strong>
            </p>
            <p className="text-xs text-blue-600">Role: {userInfo.role}</p>
          </div>
        )}

        {!otpSent && purpose !== "login" && (
          <div className="mb-4">
            <p className="text-gray-600 mb-4">Enter your email to receive a verification code</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingState}
            />
            <button onClick={handleSendOtp} disabled={isLoadingState || !email} className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoadingState ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        )}

        {(otpSent || purpose === "login") && !otpVerified && (
          <>
            <p className="text-gray-600 mb-2">{getVerificationMessage()}</p>
            <p className="text-sm text-blue-600 mb-4">{purpose === "login" ? `Verification code sent to: ${email}` : `Code sent to: ${email}`}</p>
          </>
        )}

        {otpVerified && (
          <div className="text-green-600 mb-4">
            <p className="font-semibold">✓ Verification Successful!</p>
            <p className="text-sm">{purpose === "login" ? "Logging you in..." : "Redirecting..."}</p>
          </div>
        )}
      </div>

      {(otpSent || purpose === "login") && !otpVerified && (
        <div className="mb-6">
          <OtpInput length={6} onChange={handleOtpChange} disabled={isVerifyingState} />

          {isVerifyingState && (
            <div className="text-center mt-4">
              <p className="text-blue-600">Verifying...</p>
            </div>
          )}

          {attemptsRemaining < 3 && attemptsRemaining > 0 && (
            <div className="text-center mt-2">
              <p className="text-orange-600 text-sm">
                {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
              </p>
            </div>
          )}

          {attemptsRemaining === 0 && (
            <div className="text-center mt-2">
              <p className="text-red-600 text-sm">Too many failed attempts. Please request a new code.</p>
            </div>
          )}
        </div>
      )}

      {(otpSent || purpose === "login") && !otpVerified && (
        <div className="text-center">
          <div className="mb-4">
            <button onClick={handleResendOtp} disabled={(!canResend && purpose !== "login") || isResendingState} className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm">
              {isResendingState ? "Sending..." : canResend || purpose === "login" ? "Send New Code" : `Resend Code in ${formatRemainingTime()}`}
            </button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Didn't receive the code? Check your spam folder</p>
            <p>Code expires in 10 minutes</p>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={() => navigate("/login")} className="text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default OTPFragment;

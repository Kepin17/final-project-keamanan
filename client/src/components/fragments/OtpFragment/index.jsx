import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "../../elements/OTPInput";
import { useOtp } from "../../../hooks/useOtp";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import Button from "../../elements/Button";

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
    <div className="otp-container w-full max-w-lg mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-responsive-2xl font-bold text-slate-800 mb-3">{getTitle()}</h2>

        {/* User Info Card for Login */}
        {userInfo && purpose === "login" && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{userInfo.name?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
              <div className="text-left">
                <p className="text-responsive-md font-semibold text-blue-800">Welcome back, {userInfo.name}</p>
                <p className="text-responsive-xs text-blue-600 capitalize">{userInfo.role === "admin" ? "Administrator" : userInfo.role === "dokter" ? "Doctor" : userInfo.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Input for Non-Login */}
        {!otpSent && purpose !== "login" && (
          <div className="mb-6 animate-slide-up">
            <p className="text-slate-600 text-responsive-md mb-4">Enter your email to receive a verification code</p>
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-enhanced w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-responsive-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isLoadingState}
              />
              <Button onClick={handleSendOtp} disabled={isLoadingState || !email} variant="primary" size="lg" isFull loading={isLoadingState}>
                {isLoadingState ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {(otpSent || purpose === "login") && !otpVerified && (
          <div className="animate-slide-up">
            <p className="text-slate-600 text-responsive-md mb-2">{getVerificationMessage()}</p>
            <p className="text-responsive-sm text-blue-600 mb-4 font-medium">{purpose === "login" ? `Code sent to: ${email}` : `Verification code sent to: ${email}`}</p>
          </div>
        )}

        {/* Success Message */}
        {otpVerified && (
          <div className="text-center mb-6 animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
            <p className="text-green-600 font-semibold text-responsive-lg mb-1">Verification Successful!</p>
            <p className="text-responsive-sm text-green-500">{purpose === "login" ? "Logging you in..." : "Redirecting..."}</p>
          </div>
        )}
      </div>

      {/* OTP Input Section */}
      {(otpSent || purpose === "login") && !otpVerified && (
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <OtpInput length={6} onChange={handleOtpChange} disabled={isVerifyingState} />

          {/* Loading State */}
          {isVerifyingState && (
            <div className="text-center mt-4 animate-pulse">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-responsive-sm">Verifying...</span>
              </div>
            </div>
          )}

          {/* Attempt Warning */}
          {attemptsRemaining < 3 && attemptsRemaining > 0 && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-orange-600 text-responsive-sm">
                  ⚠️ {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                </span>
              </div>
            </div>
          )}

          {/* Max Attempts Reached */}
          {attemptsRemaining === 0 && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 text-responsive-sm">🚫 Too many failed attempts. Please request a new code.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      {(otpSent || purpose === "login") && !otpVerified && (
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {/* Resend Button */}
          <div>
            <Button onClick={handleResendOtp} disabled={(!canResend && purpose !== "login") || isResendingState} variant="outline" size="md" loading={isResendingState}>
              {canResend || purpose === "login" ? "Send New Code" : `Resend in ${formatRemainingTime()}`}
            </Button>
          </div>

          {/* Help Text */}
          <div className="space-y-2 text-responsive-xs text-slate-500">
            <p>Didn't receive the code? Check your spam folder</p>
            <p>Code expires in 10 minutes</p>
          </div>

          {/* Back to Login */}
          <div className="pt-4 border-t border-slate-200">
            <button onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-responsive-sm transition-colors focus-ring rounded-lg px-3 py-2">
              <span>←</span>
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPFragment;

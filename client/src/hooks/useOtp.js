import { useState, useCallback, useEffect } from "react";
import OTP_API from "../lib/otpApi";
import { toast } from "react-toastify";

export const useOtp = (email, purpose = "login") => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [remainingCooldown, setRemainingCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // Countdown timer for resend button
  useEffect(() => {
    let interval;
    if (remainingCooldown > 0) {
      interval = setInterval(() => {
        setRemainingCooldown((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setCanResend(true);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [remainingCooldown]);

  // Check OTP status
  const checkOtpStatus = useCallback(async () => {
    if (!email) return;

    try {
      const response = await OTP_API.checkOtpStatus(email, purpose);

      if (response.success) {
        setOtpSent(response.has_active_otp);
        setOtpVerified(response.is_verified);
        setCanResend(response.can_resend);
        setRemainingCooldown(response.remaining_cooldown || 0);
        setAttemptsRemaining(response.attempts_remaining || 0);
      }
    } catch (error) {
      console.error("Failed to check OTP status:", error);
    }
  }, [email, purpose]);

  // Send OTP
  const sendOtp = useCallback(async () => {
    if (!email) {
      toast.error("Please provide an email address");
      return { success: false, message: "Email is required" };
    }

    setIsLoading(true);
    try {
      const response = await OTP_API.sendOtp(email, purpose);

      if (response.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setCanResend(false);
        setRemainingCooldown(300); // 5 minutes in seconds
        setAttemptsRemaining(3);
        toast.success(response.message || "OTP sent successfully");
      }

      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to send OTP";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [email, purpose]);

  // Verify OTP
  const verifyOtp = useCallback(
    async (otpCode) => {
      if (!email || !otpCode) {
        toast.error("Please provide email and OTP code");
        return { success: false, message: "Email and OTP code are required" };
      }

      if (otpCode.length !== 6) {
        toast.error("OTP code must be 6 digits");
        return { success: false, message: "Invalid OTP length" };
      }

      setIsVerifying(true);
      try {
        const response = await OTP_API.verifyOtp(email, otpCode, purpose);

        if (response.success) {
          setOtpVerified(true);
          toast.success(response.message || "OTP verified successfully");
        } else {
          // Update attempts remaining if provided
          if (response.attempts_remaining !== undefined) {
            setAttemptsRemaining(response.attempts_remaining);
          }
          toast.error(response.message || "Invalid OTP code");
        }

        return response;
      } catch (error) {
        const errorMessage = error.message || "Failed to verify OTP";
        toast.error(errorMessage);

        // Update attempts remaining if provided in error response
        if (error.attempts_remaining !== undefined) {
          setAttemptsRemaining(error.attempts_remaining);
        }

        return { success: false, message: errorMessage };
      } finally {
        setIsVerifying(false);
      }
    },
    [email, purpose]
  );

  // Resend OTP
  const resendOtp = useCallback(async () => {
    if (!email) {
      toast.error("Please provide an email address");
      return { success: false, message: "Email is required" };
    }

    if (!canResend) {
      toast.warning(`Please wait ${remainingCooldown} seconds before resending`);
      return { success: false, message: "Cooldown period active" };
    }

    setIsResending(true);
    try {
      const response = await OTP_API.resendOtp(email, purpose);

      if (response.success) {
        setCanResend(false);
        setRemainingCooldown(300); // 5 minutes in seconds
        setAttemptsRemaining(3);
        toast.success(response.message || "New OTP sent successfully");
      }

      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to resend OTP";

      // Handle cooldown error specially
      if (error.remaining_seconds) {
        setRemainingCooldown(error.remaining_seconds);
        setCanResend(false);
      }

      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsResending(false);
    }
  }, [email, purpose, canResend, remainingCooldown]);

  // Reset OTP state
  const resetOtp = useCallback(() => {
    setOtpSent(false);
    setOtpVerified(false);
    setCanResend(false);
    setRemainingCooldown(0);
    setAttemptsRemaining(3);
  }, []);

  // Format remaining time for display
  const formatRemainingTime = useCallback(() => {
    if (remainingCooldown <= 0) return "";

    const minutes = Math.floor(remainingCooldown / 60);
    const seconds = remainingCooldown % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remainingCooldown]);

  return {
    // State
    isLoading,
    isVerifying,
    isResending,
    otpSent,
    otpVerified,
    remainingCooldown,
    canResend,
    attemptsRemaining,

    // Actions
    sendOtp,
    verifyOtp,
    resendOtp,
    resetOtp,
    checkOtpStatus,

    // Helpers
    formatRemainingTime,
  };
};

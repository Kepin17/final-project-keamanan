import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AUTH_API from "../lib/authApi";
import OTP_API from "../lib/otpApi";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Step 1: Login with email and password
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await AUTH_API.login(email, password);

      if (response.success && response.otp_required) {
        // OTP is required for this login
        setOtpRequired(true);
        setUserEmail(email);
        setUserInfo(response.user_info);
        toast.success(response.message || "Verification code sent to your email");

        return {
          success: true,
          otpRequired: true,
          email: email,
          message: response.message,
        };
      } else if (response.success) {
        // Direct login without OTP (shouldn't happen with our new flow)
        handleLoginSuccess(response);
        return { success: true, otpRequired: false };
      }

      return response;
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Step 2: Verify OTP and complete login
  const verifyLoginOtp = useCallback(async (email, otpCode) => {
    setIsLoading(true);
    try {
      const response = await AUTH_API.verifyLoginOtp(email, otpCode);

      if (response.success) {
        handleLoginSuccess(response);
        toast.success(response.message || "Login successful");
        return { success: true };
      } else {
        toast.error(response.message || "Invalid OTP code");
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || "OTP verification failed";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = useCallback(
    (response) => {
      // Store auth data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("role", response.role);

      // Reset OTP state
      setOtpRequired(false);
      setUserEmail("");
      setUserInfo(null);

      // Navigate to dashboard
      navigate("/dashboard");
    },
    [navigate]
  );

  // Resend OTP for login
  const resendLoginOtp = useCallback(async (email) => {
    try {
      const response = await OTP_API.resendOtp(email, "login");

      if (response.success) {
        toast.success(response.message || "New verification code sent");
        return { success: true };
      } else {
        toast.error(response.message || "Failed to resend code");
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to resend verification code";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AUTH_API.logout();

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Reset state
      setOtpRequired(false);
      setUserEmail("");
      setUserInfo(null);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      toast.info("Logged out");
      navigate("/login");
    }
  }, [navigate]);

  // Get current user
  const getCurrentUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    return !!(token && user);
  }, [getCurrentUser]);

  // Get user role
  const getUserRole = useCallback(() => {
    return localStorage.getItem("role") || "";
  }, []);

  return {
    // State
    isLoading,
    otpRequired,
    userEmail,
    userInfo,

    // Actions
    login,
    verifyLoginOtp,
    resendLoginOtp,
    logout,

    // Helpers
    getCurrentUser,
    isAuthenticated,
    getUserRole,
  };
};

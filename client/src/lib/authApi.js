import apiClient from "./apiClient";

const AUTH_API = {
  /**
   * Login with email and password (first step)
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post("login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify OTP for login completion (second step)
   */
  verifyLoginOtp: async (email, otpCode) => {
    try {
      const response = await apiClient.post("verify-login-otp", {
        email,
        otp_code: otpCode,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      const response = await apiClient.post("logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get("profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default AUTH_API;

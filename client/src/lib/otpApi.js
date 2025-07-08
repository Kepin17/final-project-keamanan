import apiClient from "./apiClient";

const OTP_API = {
  /**
   * Send OTP to email
   */
  sendOtp: async (email, purpose = "login") => {
    try {
      const response = await apiClient.post("otp/send", {
        email,
        purpose,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify OTP code
   */
  verifyOtp: async (email, otpCode, purpose = "login") => {
    try {
      const response = await apiClient.post("otp/verify", {
        email,
        otp_code: otpCode,
        purpose,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Resend OTP
   */
  resendOtp: async (email, purpose = "login") => {
    try {
      const response = await apiClient.post("otp/resend", {
        email,
        purpose,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check OTP status
   */
  checkOtpStatus: async (email, purpose = "login") => {
    try {
      const response = await apiClient.get("otp/status", {
        params: {
          email,
          purpose,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default OTP_API;

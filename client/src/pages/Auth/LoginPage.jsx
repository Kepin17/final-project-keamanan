import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayouts";
import LoginFragment from "../../components/fragments/LoginFragment";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [loginData, setLoginData] = useState(null);
  const { login, isLoading, otpRequired, userEmail, userInfo } = useAuth();
  const navigate = useNavigate();

  const handlerSubmit = async (formData) => {
    const result = await login(formData.email, formData.password);

    if (result.success && result.otpRequired) {
      // Store login data and redirect to OTP page
      setLoginData({
        email: formData.email,
        userInfo: userInfo,
      });

      // Navigate to OTP page with email and purpose
      navigate("/auth-otp", {
        state: {
          email: formData.email,
          purpose: "login",
          userInfo: userInfo,
        },
      });
    }
    // If login is successful without OTP, the useAuth hook will handle navigation
    // If login fails, the useAuth hook will show error toast
  };

  return (
    <AuthLayout title={"login"} selfRegist={false} onSubmit={handlerSubmit} isLoading={isLoading}>
      <LoginFragment isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;

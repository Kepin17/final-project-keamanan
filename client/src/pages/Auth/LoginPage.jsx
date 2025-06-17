import AuthLayout from "../../components/layouts/AuthLayouts";
import LoginFragment from "../../components/fragments/LoginFragment";

const LoginPage = () => {
  const handlerSubmit = (formData) => {
    try {
      localStorage.setItem("user", JSON.stringify(formData));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <AuthLayout title={"login"} selfRegist={false} onSubmit={handlerSubmit}>
      <LoginFragment />
    </AuthLayout>
  );
};

export default LoginPage;

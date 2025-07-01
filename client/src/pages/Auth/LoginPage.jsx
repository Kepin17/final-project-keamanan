import AuthLayout from "../../components/layouts/AuthLayouts";
import LoginFragment from "../../components/fragments/LoginFragment";
import axios from "axios";
import { getUrlApiWithPath } from "../../utils/url_api";

const LoginPage = () => {
  const handlerSubmit = (formData) => {
    axios.post(getUrlApiWithPath("login"), formData).then((res) => {
      if (res.data.message === "Login successful") {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } else {
        alert(res.data.message);
      }
    });
  };
  return (
    <AuthLayout title={"login"} selfRegist={false} onSubmit={handlerSubmit}>
      <LoginFragment />
    </AuthLayout>
  );
};

export default LoginPage;

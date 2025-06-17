import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Auth/LoginPage";
import Dashboard from "./pages/Dashboards";
import OtpPage from "./pages/Auth/OtpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-otp" element={<OtpPage />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;

import SideBar from "../../fragments/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

const DashboardLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const getToken = localStorage.getItem("token");
  if (!getToken) {
    window.location.href = "/login";
    return null;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-wrapper min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex relative">
      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 z-30 transition-all duration-300 ease-in-out
        ${isMobile ? "lg:translate-x-0" : "translate-x-0"}
      `}
      >
        <SideBar />
      </div>

      {/* Main Content Area */}
      <div
        className={`
        flex-1 w-full transition-all duration-300 ease-in-out
        ${isMobile ? "lg:pl-72" : "pl-72"}
      `}
      >
        <main className="relative min-h-screen">
          {/* Header Space for Mobile */}
          <div className="lg:hidden h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center px-4">
            <h1 className="text-lg font-semibold text-slate-700">MedInsight</h1>
          </div>

          {/* Content Container */}
          <div className="spacing-responsive-md animate-fade-in">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>

      {/* Enhanced Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 lg:mt-4"
        toastClassName="card-base shadow-lg"
        bodyClassName="text-sm"
        progressClassName="bg-gradient-to-r from-blue-500 to-blue-600"
      />
    </div>
  );
};

export default DashboardLayout;

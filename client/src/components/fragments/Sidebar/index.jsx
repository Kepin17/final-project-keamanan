import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import List from "../../elements/List";
import { FaHandHoldingMedical, FaHistory, FaHospitalUser, FaSignOutAlt } from "react-icons/fa";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Logo from "../../elements/Logo";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUrlApiWithPath } from "../../../utils/url_api";

const SideBar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem("token");

      await axios.post(
        getUrlApiWithPath("logout"),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // If the token is invalid or expired, still clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button onClick={toggleMobileMenu} className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 text-w`h`ite hover:bg-slate-700 transition-all">
        {isMobileMenuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black opacity-50 z-30" onClick={toggleMobileMenu} />}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static top-0 left-0 z-40
        w-[280px] min-h-screen bg-slate-900
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <nav className="h-full px-6 py-8 flex flex-col">
          {/* Logo section */}
          <div className="mb-8">
            <Logo>MedInsight</Logo>
          </div>

          {/* Main Navigation */}
          <div className="space-y-6 flex-grow">
            {/* Staff Management Section */}
            <div className="space-y-3">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Management</h3>
              <ul className="space-y-1">
                <List onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHospitalUser />} go="/staff">
                  Staff Data
                </List>
                <List onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHandHoldingMedical />} go="/medical-approval">
                  Medical Checkup Approval
                </List>
              </ul>
            </div>

            {/* Patient Records Section */}
            <div className="space-y-3">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Medical Records</h3>
              <ul className="space-y-1">
                <List go="/patients" onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHospitalUser />}>
                  Patient Data
                </List>
              </ul>
            </div>
          </div>

          {/* Footer with Logout */}
          <div className="pt-6 border-t border-slate-700">
            <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg transition-colors">
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
            <p className="mt-4 text-center text-gray-500 text-xs">&copy; {new Date().getFullYear()} MedInsight. All rights reserved.</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideBar;

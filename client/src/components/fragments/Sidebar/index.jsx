import { Link, useNavigate } from "react-router-dom";
import List from "../../elements/List";
import { FaHistory, FaHospitalUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
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
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get user info from localStorage or API
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(getUrlApiWithPath("profile"), {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setUserRole(response.data.role);
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        // Fallback to localStorage if API fails
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUserRole(userData.role);
          setUserName(userData.name);
        }
      }
    };

    getUserInfo();

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
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl focus-ring"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <RiCloseLine className="text-xl" /> : <RiMenu3Line className="text-xl" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fade-in" onClick={toggleMobileMenu} aria-hidden="true" />}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-40
          w-72 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl lg:shadow-xl
        `}
      >
        <nav className="h-full px-6 py-8 flex flex-col">
          {/* Logo section */}
          <div className="mb-8 animate-slide-up">
            <Logo>MedInsight</Logo>
          </div>

          {/* Main Navigation */}
          <div className="space-y-6 flex-grow animate-slide-up  " style={{ animationDelay: "0.1s" }}>
            {/* User Info Section */}
            <div className="card-base bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white font-bold text-lg">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                </div>
                <h3 className="text-blue-500 font-semibold text-responsive-md">{userName || "User"}</h3>
                <p className="text-gray-400 text-responsive-xs capitalize mt-1">{userRole === "admin" ? "Administrator" : userRole === "dokter" ? "Doctor" : "User"}</p>
              </div>
            </div>

            {/* Admin Navigation */}
            {userRole === "admin" && (
              <>
                {/* Staff Management Section */}
                <div className="space-y-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Management</h3>
                  <ul className="space-y-2">
                    <List onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHospitalUser />} go="/staff">
                      Staff Data
                    </List>
                  </ul>
                </div>

                {/* Administration Section */}
                <div className="space-y-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</h3>
                  <ul className="space-y-2">
                    <List onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaUserShield />} go="/admin/access-requests">
                      Access Requests
                    </List>
                  </ul>
                </div>
              </>
            )}

            {/* Doctor Navigation */}
            {userRole === "dokter" && (
              <>
                {/* Patient Records Section */}
                <div className="space-y-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient Medical Records</h3>
                  <ul className="space-y-2">
                    <List go="/patients" onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHospitalUser />}>
                      Patient Data
                    </List>
                  </ul>
                </div>

                {/* My Access Requests */}
                <div className="space-y-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">My Requests</h3>
                  <ul className="space-y-2">
                    <List onClick={() => isMobile && setIsMobileMenuOpen(false)} icon={<FaHistory />} go="/my-requests">
                      My Access Requests
                    </List>
                  </ul>
                </div>
              </>
            )}

            {/* Loading state */}
            {!userRole && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-400 text-responsive-sm">Loading...</span>
              </div>
            )}
          </div>

          {/* Footer with Logout */}
          <div className="pt-6 border-t border-slate-700 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-slate-800/50 rounded-xl transition-all duration-300 hover:text-white disabled:opacity-50 focus-ring">
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              <span className="text-responsive-sm">{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
            <p className="mt-4 text-center text-gray-500 text-xs">&copy; {new Date().getFullYear()} MedInsight. All rights reserved.</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideBar;

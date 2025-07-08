import React from "react";
import { FaHeartbeat } from "react-icons/fa";

const Logo = ({ variant = "default", size = "md" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-lg";
      case "md":
        return "text-responsive-2xl";
      case "lg":
        return "text-responsive-3xl";
      default:
        return "text-responsive-2xl";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "light":
        return "text-white";
      case "dark":
        return "text-slate-800";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-3 group">
      {/* Logo Icon */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <FaHeartbeat className="text-white text-lg animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Logo Text */}
      <h1 className={`font-bold ${getSizeClasses()} ${getVariantClasses()} transition-all duration-300`}>
        <span className="text-blue-600 hover:text-blue-700 transition-colors">Med</span>
        <span className="text-red-500 hover:text-red-600 transition-colors">Insight</span>
      </h1>
    </div>
  );
};

export default Logo;

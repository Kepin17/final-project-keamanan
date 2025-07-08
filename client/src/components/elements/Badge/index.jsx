import React from "react";

const Badge = ({ children, variant = "default", size = "md", rounded = true, className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "dark":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "light":
        return "bg-white text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "md":
        return "text-responsive-xs px-2.5 py-1.5";
      case "lg":
        return "text-responsive-sm px-3 py-2";
      default:
        return "text-responsive-xs px-2.5 py-1.5";
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium border
    transition-all duration-200 hover:scale-105
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${rounded ? "rounded-full" : "rounded-md"}
    ${className}
  `;

  return <span className={baseClasses}>{children}</span>;
};

export default Badge;

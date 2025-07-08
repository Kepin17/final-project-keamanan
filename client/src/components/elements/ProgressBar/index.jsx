import React from "react";

const ProgressBar = ({ progress = 0, variant = "primary", size = "md", animated = false, showLabel = false, label = "", className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      case "info":
        return "bg-cyan-500";
      default:
        return "bg-blue-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1";
      case "md":
        return "h-2";
      case "lg":
        return "h-3";
      default:
        return "h-2";
    }
  };

  const progressPercentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-responsive-xs text-gray-600">{label}</span>
          <span className="text-responsive-xs text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`
            ${getSizeClasses()} 
            ${getVariantClasses()} 
            rounded-full transition-all duration-300 ease-out
            ${animated ? "animate-pulse" : ""}
          `}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

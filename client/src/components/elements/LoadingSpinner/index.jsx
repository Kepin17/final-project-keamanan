import React from "react";

const LoadingSpinner = ({ size = "md", color = "blue", text = "", fullScreen = false, className = "" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4 border-2";
      case "md":
        return "h-8 w-8 border-2";
      case "lg":
        return "h-12 w-12 border-3";
      case "xl":
        return "h-16 w-16 border-4";
      default:
        return "h-8 w-8 border-2";
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "border-blue-600 border-t-transparent";
      case "green":
        return "border-green-600 border-t-transparent";
      case "red":
        return "border-red-600 border-t-transparent";
      case "yellow":
        return "border-yellow-600 border-t-transparent";
      case "gray":
        return "border-gray-600 border-t-transparent";
      case "white":
        return "border-white border-t-transparent";
      default:
        return "border-blue-600 border-t-transparent";
    }
  };

  const spinnerElement = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`
          animate-spin rounded-full
          ${getSizeClasses()}
          ${getColorClasses()}
        `}
      />
      {text && <p className={`text-responsive-sm text-gray-600 animate-pulse`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">{spinnerElement}</div>;
  }

  return spinnerElement;
};

export default LoadingSpinner;

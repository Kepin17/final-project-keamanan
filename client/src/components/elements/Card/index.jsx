import React from "react";

const Card = ({ children, title, subtitle, variant = "default", padding = "md", hover = false, shadow = true, className = "", headerActions }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
      case "success":
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
      case "warning":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200";
      case "danger":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
      case "glass":
        return "bg-white/70 backdrop-blur-sm border-white/20";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case "sm":
        return "p-4";
      case "md":
        return "p-6";
      case "lg":
        return "p-8";
      case "none":
        return "";
      default:
        return "p-6";
    }
  };

  const baseClasses = `
    card-base rounded-xl border transition-all duration-300
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${hover ? "card-hover cursor-pointer" : ""}
    ${shadow ? "shadow-md" : "shadow-none"}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {/* Header */}
      {(title || subtitle || headerActions) && (
        <div className={`flex items-start justify-between ${children ? "mb-4" : ""}`}>
          <div>
            {title && <h3 className="text-responsive-lg font-semibold text-slate-800 mb-1">{title}</h3>}
            {subtitle && <p className="text-responsive-sm text-slate-600">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
};

export default Card;

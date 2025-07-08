const Button = ({ isFull = false, variant = "primary", size = "md", className = "", onClick, disabled = false, loading = false, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "btn-primary text-white shadow-md hover:shadow-lg";
      case "secondary":
        return "btn-secondary border border-slate-300 hover:border-slate-400";
      case "success":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg";
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg";
      case "outline":
        return "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white";
      default:
        return "btn-primary text-white shadow-md hover:shadow-lg";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-sm";
      case "md":
        return "h-10 px-4 text-responsive-sm";
      case "lg":
        return "h-12 px-6 text-responsive-md";
      default:
        return "h-10 px-4 text-responsive-sm";
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    rounded-lg font-medium transition-all duration-300 
    focus-ring disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:transform-none
  `;

  const fullWidthClass = isFull ? "w-full" : "";

  return (
    <button
      className={`
        ${baseClasses} 
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${fullWidthClass} 
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>}
      {children}
    </button>
  );
};

export default Button;

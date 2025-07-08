import React from "react";

const Label = ({ htmlFor, children, required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="absolute left-3 -top-2.5 bg-white px-2 text-xs text-gray-600 font-medium
        transition-all duration-300 ease-in-out pointer-events-none
        peer-placeholder-shown:top-3 peer-placeholder-shown:left-4
        peer-placeholder-shown:text-responsive-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal
        peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs
        peer-focus:text-blue-600 peer-focus:font-semibold
        peer-focus:scale-95 z-10"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;

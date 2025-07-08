import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../Button";

const Modal = ({ isOpen, onClose, title, children, size = "md", showCloseButton = true, closeOnOverlayClick = true, actions }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-lg";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      case "full":
        return "max-w-full mx-4";
      default:
        return "max-w-lg";
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeOnOverlayClick ? onClose : undefined} aria-hidden="true" />

      {/* Modal Content */}
      <div
        className={`
        relative w-full ${getSizeClasses()} max-h-[90vh] mx-4
        bg-white rounded-2xl shadow-2xl
        animate-scale-in overflow-hidden
      `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-slate-50">
            {title && <h2 className="text-responsive-xl font-semibold text-slate-800">{title}</h2>}
            {showCloseButton && (
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors focus-ring" aria-label="Close modal">
                <FaTimes className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">{children}</div>

        {/* Footer Actions */}
        {actions && <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-slate-50">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;

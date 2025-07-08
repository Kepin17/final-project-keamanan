import { useEffect, useRef, useState } from "react";

const OtpInput = ({ length = 6, onChange = () => {}, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e, index) => {
    if (disabled) return;

    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Call onChange with complete OTP
    onChange(newOtp.join(""));

    // Move to next input if available
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled) return;

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedOtp = pastedData.replace(/\D/g, "").slice(0, length);

    if (pastedOtp.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedOtp[i] || "";
      }
      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus on the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  return (
    <div className="opt-input-wrapper w-full flex items-center justify-center mt-5 gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className={`w-12 h-12 border-2 rounded-md text-center text-lg font-semibold 
            ${disabled ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"} 
            transition-all duration-200`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          autoFocus={index === 0 && !disabled}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OtpInput;

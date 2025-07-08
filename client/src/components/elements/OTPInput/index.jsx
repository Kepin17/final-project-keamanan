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
    <div className="otp-input-wrapper w-full flex items-center justify-center mt-6 gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl text-center text-lg sm:text-xl font-bold
            transition-all duration-300 transform
            ${
              disabled
                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                : `border-gray-300 bg-white text-gray-800 
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:scale-110
                 hover:border-blue-400 hover:shadow-md`
            }
            ${otp[index] ? "border-blue-500 bg-blue-50 shadow-md scale-105" : ""}
          `}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index]}
          autoFocus={index === 0 && !disabled}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;

import Label from "./Label";
import Input from "./Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const FormInput = ({ name, inputType, inputPlaceholder, isRequired, children, value, onChange, error, helperText, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <div className="relative w-full">
        <Input name={name} inputType={showPassword ? "text" : inputType} inputPlaceholder={inputPlaceholder} isRequired={isRequired} value={value} onChange={onChange} error={error} disabled={disabled} />
        <Label htmlFor={name}>{children}</Label>

        {inputType === "password" && (
          <button type="button" className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 transition-colors focus-ring rounded p-1" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            {!showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600 animate-fade-in">{error}</p>}

      {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default FormInput;

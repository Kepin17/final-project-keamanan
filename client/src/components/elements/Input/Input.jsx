const Input = ({ inputType, inputPlaceholder, isRequired, name, value, onChange, error, disabled = false }) => {
  return (
    <input
      type={inputType}
      name={name}
      id={name}
      placeholder={inputPlaceholder}
      className={`
        input-enhanced peer h-12 w-full border-2 bg-white rounded-lg px-4 pt-4 pb-1 
        text-responsive-sm placeholder-transparent focus:outline-none 
        transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed
        ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"}
        focus:shadow-lg focus:ring-4
      `}
      required={isRequired}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete="off"
    />
  );
};

export default Input;

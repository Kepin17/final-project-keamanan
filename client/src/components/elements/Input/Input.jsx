const Input = ({ inputType, inputPlaceholder, isRequired, name, value, onChange }) => {
  return (
    <input
      type={inputType}
      name={name}
      id={name}
      placeholder={inputPlaceholder}
      className="peer h-12 w-full border bg-white border-gray-300 rounded-md px-3 pt-4 pb-1 text-sm placeholder-transparent focus:outline-none focus:border-blue-500"
      required={isRequired}
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export default Input;

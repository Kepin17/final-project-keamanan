const Button = ({ isFull, className = "w-full h-10 p-2 bg-blue-500 hover:bg-blue-400 rounded-md flex items-center justify-center gap-2 cursor-pointer", onClick, children }) => {
  return (
    <div className={isFull === true ? "w-full" : ""}>
      <button className={className} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Button;

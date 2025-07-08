import { Link } from "react-router-dom";

const List = ({ go = "#", icon, children, onClick, isActive = false }) => {
  return (
    <li className="list-none">
      <Link
        to={go}
        onClick={onClick}
        className={`
          flex items-center px-4 py-3 rounded-xl text-responsive-sm font-medium
          transition-all duration-300 group relative overflow-hidden
          ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-slate-800/50 hover:text-white"}
        `}
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        {/* Icon */}
        <span
          className={`
          text-lg transition-all duration-300 flex items-center justify-center w-6 h-6
          ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"}
        `}
        >
          {icon}
        </span>

        {/* Text */}
        <span className="ml-3 transition-all duration-300">{children}</span>

        {/* Active indicator */}
        {isActive && <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>}
      </Link>
    </li>
  );
};

export default List;

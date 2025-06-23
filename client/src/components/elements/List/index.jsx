import { Link } from "react-router-dom";

const List = ({ go = "#", icon, children, onClick }) => {
  return (
    <li className="list-none">
      <Link
        to={go}
        onClick={onClick}
        className="flex items-center px-4 py-2 text-gray-300 rounded-lg
          hover:bg-slate-800 hover:text-white transition-all duration-200
          group"
      >
        <span className="text-lg group-hover:text-red-500 transition-colors">{icon}</span>
        <span className="ml-3">{children}</span>
      </Link>
    </li>
  );
};

export default List;

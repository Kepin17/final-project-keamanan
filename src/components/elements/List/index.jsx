import { Link } from "react-router-dom";

const List = ({ go, icon, children }) => {
  return (
    <li
      className="w-full h-10 p-1.5 px-3 rounded-sm bg-gray-100 hover:bg-red-500 hover:text-white shadow-md font-semibold
    transition-all duration-300 ease-in-out
    "
    >
      <Link to={go} className="flex items-center gap-2">
        {icon}
        {children}
      </Link>
    </li>
  );
};

export default List;

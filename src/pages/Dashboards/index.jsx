import { Link } from "react-router-dom";
import Logo from "../../components/elements/Logo";
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  return (
    <nav className="sidebar w-[20rem] h-screen bg-slate-200 shadow-md shadow-slate-500 p-5">
      <Logo>MedInsight</Logo>
      <ul className="list-wrapper w-full mt-5">
        <li
          className="list-item mb-3 p-3 font-bold rounded-md bg-gray-200 text-black
         hover:bg-red-500 hover:text-white shadow-sm shadow-gray-500 cursor-pointer
         transition-all duration-300"
        >
          <Link className="flex items-center gap-2" to="/dashboard">
            <span>
              <MdDashboard />
            </span>
            Dashboard
          </Link>
        </li>

        <div className="nav-bar dropDown">
          <li
            className="list-item mb-3 p-3 font-bold rounded-md bg-gray-200 text-black
         hover:bg-red-500 hover:text-white shadow-sm shadow-gray-500 cursor-pointer
         transition-all duration-300"
          >
            <Link className="flex items-center gap-2" to="/dashboard/patients">
              Patients
            </Link>
          </li>
          <li
            className="list-item mb-3 p-3 font-bold rounded-md bg-gray-200 text-black
         hover:bg-red-500 hover:text-white shadow-sm shadow-gray-500 cursor-pointer
         transition-all duration-300"
          >
            <Link className="flex items-center gap-2" to="/dashboard/appointments">
              Appointments
            </Link>
          </li>
          <li
            className="list-item mb-3 p-3 font-bold rounded-md bg-gray-200 text-black
         hover:bg-red-500 hover:text-white shadow-sm shadow-gray-500 cursor-pointer
         transition-all duration-300"
          >
            <Link className="flex items-center gap-2" to="/dashboard/reports">
              Reports
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Dashboard;

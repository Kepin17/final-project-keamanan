import { Link } from "react-router-dom";
import Logo from "../../components/elements/Logo";
import { MdDashboard } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import List from "../../components/elements/List";
import { FaHospitalUser } from "react-icons/fa";

const Dashboard = () => {
  return (
    <nav className="sidebar w-[20rem] h-screen bg-slate-900 shadow-md shadow-slate-500 p-5">
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
      </ul>

      <div className="dropdown-nav relative">
        <button className="flex items-center gap-2 justify-center cursor-pointer font-bold" onClick={() => {}}>
          <span className="text-gray-300 font-semibold">Management Staff</span>
          <IoIosArrowForward id="dropdown-arrow" className="text-gray-300 h-5 w-5" />
        </button>
        <ul className="drop-down-items py-2 flex flex-col gap-5">
          <List icon={<FaHospitalUser />}>Staff Management</List>
          <List icon={<FaHospitalUser />}>Patient Management</List>
          <div className="dropdown w-full h-auto bg-white rounded-sm">
            <List icon={<FaHospitalUser />}>
              Activity Logs
              <IoIosArrowForward id="dropdown-arrow" className=" w-5 h-5" />
            </List>
            <li>jawa</li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Dashboard;

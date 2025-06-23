import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import List from "../../elements/List";
import { FaHandHoldingMedical, FaHistory, FaHospitalUser } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";
import { CiMedicalClipboard } from "react-icons/ci";
import Logo from "../../elements/Logo";

const SideBar = () => {
  return (
    <div className="sidebar-wrapper w-[25rem] h-auto flex flex-col justify-between items-start">
      <nav className="sidebar bg-slate-900 shadow-md shadow-slate-400 p-5 rounded-md">
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

        <div className="list-group mt-5">
          <h3 className="flex items-center gap-2 justify-start cursor-pointer font-bold" onClick={() => {}}>
            <span className="text-gray-300 font-semibold">Staff Management </span>
          </h3>
          <ul className="list-wrapper w-full mt-2 flex flex-col gap-2">
            <List icon={<FaHistory />}>Activity History</List>
            <List icon={<FaHospitalUser />}>Staff Data</List>
            <List icon={<CiMedicalClipboard />}>Patient Data</List>
            <List icon={<FaHandHoldingMedical />}>Medical Checkup Approval</List>
          </ul>
        </div>

        <div className="list-group mt-5">
          <h3 className="flex items-center gap-2 justify-start cursor-pointer font-bold" onClick={() => {}}>
            <span className="text-gray-300 font-semibold">Patient Medical Records</span>
          </h3>
          <ul className="list-wrapper w-full mt-2 flex flex-col gap-2">
            <List go="/dashboard/patient-data" icon={<FaHospitalUser />}>
              Patient Data
            </List>
            <List go="/dashboard/medical-records" icon={<TbReportMedical />}>
              Medical Records
            </List>
          </ul>
        </div>
        <footer>
          <p className="w-full h-32 text-center text-gray-200 text-sm mt-5  p-3 flex items-center justify-center rounded-sm bg-slate-900">&copy; {new Date().getFullYear()} MedInsight. All rights reserved.</p>
        </footer>
      </nav>
    </div>
  );
};

export default SideBar;

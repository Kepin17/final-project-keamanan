import DashboardLayout from "../../components/layouts/DashboardLayouts";
import Button from "../../components/elements/Button";
import { FaHospitalUser } from "react-icons/fa";
const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="status-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      
      </div>

      <div className="statistic-section w-full h-96 bg-slate-800 my-5 rounded-sm">{/* Konten statistik di sini */}</div>
   
    </DashboardLayout>
  );
};

export default Dashboard;

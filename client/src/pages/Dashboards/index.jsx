import Button from "../../components/elements/Button";
import StatusCard from "../../components/elements/StatusCard";
import { FaHospitalUser, FaUserMd, FaCalendarCheck, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  // Sample data - replace with actual data from your API
  const statsData = [
    {
      icon: <FaHospitalUser className="w-6 h-6" />,
      title: "Total Patients",
      value: "1,234",
      variant: "primary",
    },
    {
      icon: <FaUserMd className="w-6 h-6" />,
      title: "Active Doctors",
      value: "45",
      variant: "success",
    },
    {
      icon: <FaCalendarCheck className="w-6 h-6" />,
      title: "Today's Appointments",
      value: "28",
      variant: "warning",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Monthly Growth",
      value: "+12%",
      variant: "default",
    },
  ];

  return (
    <div className="dashboard-content space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="text-responsive-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-responsive-md text-slate-600">Welcome back! Here's what's happening with your medical insights today.</p>
      </div>

      {/* Status Cards Grid */}
      <div className="status-wrapper grid-responsive">
        {statsData.map((stat, index) => (
          <StatusCard key={index} icon={stat.icon} totalValue={stat.value} variant={stat.variant}>
            {stat.title}
          </StatusCard>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="statistics-section grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart Area */}
        <div className="chart-area card-base bg-white rounded-xl p-6 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-responsive-xl font-semibold text-slate-800">Patient Activity Overview</h2>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <div className="w-full h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 text-responsive-md">Chart visualization will be implemented here</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions card-base bg-white rounded-xl p-6">
          <h3 className="text-responsive-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button isFull variant="primary">
              Add New Patient
            </Button>
            <Button isFull variant="secondary">
              Schedule Appointment
            </Button>
            <Button isFull variant="outline">
              View Reports
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity card-base bg-white rounded-xl p-6">
          <h3 className="text-responsive-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="activity-item flex items-center p-3 bg-slate-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-responsive-sm font-medium text-slate-700">New patient registered</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item flex items-center p-3 bg-slate-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-responsive-sm font-medium text-slate-700">Appointment completed</p>
                <p className="text-xs text-slate-500">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item flex items-center p-3 bg-slate-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-responsive-sm font-medium text-slate-700">Access request pending</p>
                <p className="text-xs text-slate-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

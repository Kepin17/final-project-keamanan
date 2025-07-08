import StatusCardTitle from "./StatusCardTitle";
import Value from "./Value";

const StatusCard = ({ icon, children, totalValue, variant = "default" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-br from-blue-500 to-blue-600 text-white";
      case "success":
        return "bg-gradient-to-br from-green-500 to-green-600 text-white";
      case "warning":
        return "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white";
      case "danger":
        return "bg-gradient-to-br from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-br from-slate-800 to-slate-900 text-white";
    }
  };

  return (
    <div
      className={`
      status-card card-base card-hover w-full h-32 rounded-xl flex flex-col justify-between p-6 
      transition-all duration-300 hover:scale-105 animate-fade-in
      ${getVariantClasses()}
    `}
    >
      <div className="head-title flex items-center gap-3 text-responsive-lg font-semibold opacity-90">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">{icon}</div>
        <StatusCardTitle>{children}</StatusCardTitle>
      </div>
      <div className="total font-bold text-responsive-2xl">
        <Value>{totalValue}</Value>
      </div>
    </div>
  );
};

export default StatusCard;

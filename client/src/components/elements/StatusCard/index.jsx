import StatusCardTitle from "./StatusCardTitle";
import Value from "./Value";

const StatusCard = ({ icon, children, totalValue }) => {
  return (
    <div className="status-card bg-slate-800 w-full h-28 rounded-sm flex flex-col justify-center p-4">
      <div className="head-title flex items-center gap-3 text-xl font-bold text-slate-500">
        {icon}
        <StatusCardTitle>{children}</StatusCardTitle>
      </div>
      <div className="total font-semibold text-xl text-green-200">
        <Value>{totalValue}</Value>
      </div>
    </div>
  );
};

export default StatusCard;

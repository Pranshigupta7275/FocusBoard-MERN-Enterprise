interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard = ({ title, value }: StatsCardProps) => (
  // 1. Removed min-w-[180px] and replaced with w-full so the grid controls the sizing perfectly.
  // 2. Added flex-1 to distribute inner spacing dynamically.
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between w-full min-h-[120px]">
    
    {/* Changed truncate to break-words or left it clean. Truncate cuts text off with "..." 
        if it gets too long, preventing it from wrapping and overlapping. */}
    <p className="text-sm font-medium text-slate-500 truncate select-none">
      {title}
    </p>
    
    <p className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">
      {value}
    </p>
    
  </div>
);

export default StatsCard;
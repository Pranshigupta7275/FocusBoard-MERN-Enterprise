import { type JSX, memo } from 'react';

interface TaskStatsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const TaskStats = ({ total, pending, inProgress, completed }: TaskStatsProps): JSX.Element => {
  const stats = [
    { label: 'Total Tasks', value: total, subtext: 'All your tasks', accent: 'bg-slate-900' },
    { label: 'Pending', value: pending, subtext: 'Waiting to start', accent: 'bg-amber-500' },
    { label: 'In Progress', value: inProgress, subtext: 'Currently active', accent: 'bg-blue-500' },
    { label: 'Completed', value: completed, subtext: 'Successfully finished', accent: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${stat.accent} mb-3`} />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {stat.label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {stat.value}
          </p>
          <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
};

export default memo(TaskStats);

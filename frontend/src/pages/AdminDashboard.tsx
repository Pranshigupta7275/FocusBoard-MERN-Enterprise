import { useGetDashboardStatsQuery } from '../slices/apiSlice';
import StatsCard from '../components/admin/StatsCard';

const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) return <div className="p-8 text-slate-600">Loading System Stats...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading stats. Check database connection.</div>;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">System Overview</h1>
      
      {/* THE CRITICAL CHANGE: Changed grid from forced columns to a responsive layout.
        - grid-cols-1: On mobile/tablet widths (like your 768px view), stack cards in 1 column.
        - sm:grid-cols-2: On small desktop screens, show 2 columns.
        - lg:grid-cols-4: On large screens, expand cleanly to a full 4-column row.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={data?.stats?.totalUsers || 0} />
        <StatsCard title="Total Tasks" value={data?.stats?.totalTasks || 0} />
        <StatsCard title="Completed Tasks" value={data?.stats?.completedTasks || 0} />
        <StatsCard title="Pending Tasks" value={data?.stats?.pendingTasks || 0} />
      </div>
    </div>
  );
};

export default AdminDashboard;
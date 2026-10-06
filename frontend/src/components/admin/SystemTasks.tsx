import { type JSX } from 'react';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useGetUsersQuery,
  useAssignTaskMutation,
  type Task, 
  type User 
} from '../../slices/apiSlice'; 
import { toast } from 'react-toastify';

const SystemTasks = (): JSX.Element => {
  // 1. Initialize all API Hooks
  const { data: response, isLoading, isError } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [assignTask] = useAssignTaskMutation(); 
  
  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery();

  // 2. Safely cast and extract arrays to eliminate 'any' types
  const responseObj = response as { data?: Task[], tasks?: Task[] } | undefined;
  const tasks: Task[] = responseObj?.data || responseObj?.tasks || (Array.isArray(response) ? response : []);

  const usersObj = usersResponse as { data?: User[], users?: User[] } | undefined;
  const existingUsers: User[] = usersObj?.data || usersObj?.users || (Array.isArray(usersResponse) ? usersResponse : []);

  // 3. Mock Data Generator
  const handleGenerateData = async () => {
    if (!existingUsers || existingUsers.length === 0) {
      toast.error("No existing database users found! Register a user profile first.");
      return;
    }

    const targetUserId = existingUsers[0]._id;

    // Type matches the Partial<Task> payload required by the backend
    const dummyTasks: Partial<Task>[] = [
      { title: "Sync Analytics Data Pipeline", assignedTo: targetUserId, status: "pending", isCompleted: false },
      { title: "Purge Expired Auth Tokens", assignedTo: targetUserId, status: "pending", isCompleted: false },
      { title: "Weekly S3 Bucket Backup", assignedTo: targetUserId, status: "pending", isCompleted: false },
      { title: "Database Index Optimization", assignedTo: targetUserId, status: "completed", isCompleted: true },
    ];

    try {
      for (const task of dummyTasks) {
        await createTask(task).unwrap();
      }
      toast.success("Mock tasks assigned and generated successfully!");
    } catch (error) {
      console.error("Failed to map and create database tasks:", error);
      toast.error("Failed to generate data rows. Check server terminal logs.");
    }
  };

  // 4. Loading & Error States
  if (isLoading || usersLoading) return <div className="p-8 text-slate-600 font-medium">Loading Task Metrics...</div>;
  if (isError) return <div className="p-8 text-red-500 font-medium">Error loading global system task pipeline.</div>;

  // 5. Main UI Render
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor job distribution processing status logs across the workflow.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto">
          {tasks.length === 0 && (
            <button 
              onClick={handleGenerateData}
              disabled={isCreating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Generating...' : '+ Generate Test Data'}
            </button>
          )}
          <div className="bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-xl text-sm border border-emerald-100">
            Active Engine Pipeline
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Execution Status</th>
              <th className="px-6 py-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
            {tasks.map((task: Task) => (
              <tr key={task._id} className="hover:bg-slate-50/70 transition-colors">
                
                {/* Task Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-slate-900 font-semibold">{task.title || 'Untitled Task'}</span>
                </td>
                
                {/* Interactive Assignment Dropdown */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  <select
                    aria-label={`Assign task: ${task.title}`}
                    title="Assign task to user"
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 cursor-pointer shadow-sm"
                    value={
                      task.assignedTo && typeof task.assignedTo === 'object' && '_id' in task.assignedTo
                        ? task.assignedTo._id
                        : (typeof task.assignedTo === 'string' ? task.assignedTo : "")
                    }
                    onChange={async (e) => {
                      try {
                        await assignTask({ id: task._id, userId: e.target.value }).unwrap();
                        toast.success("Task reassigned successfully!");
                      } catch (error) {
                        toast.error("Failed to reassign task");
                        console.error(error);
                      }
                    }}
                  >
                    <option value="">Unassigned</option>
                    {existingUsers.map((u: User) => (
                      <option key={u._id} value={u._id}>
                        {u.name || u.username}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    task.isCompleted || task.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {task.isCompleted || task.status === 'completed' ? 'Completed' : 'Pending Processing'}
                  </span>
                </td>
                
                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Just now'}
                </td>
                
              </tr>
            ))}
            
            {/* Empty State */}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No scheduled system worker records found in queue. Click "+ Generate Test Data" above.
                </td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemTasks;
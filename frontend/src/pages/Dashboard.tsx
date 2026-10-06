import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation,
  useGetUserProfileQuery,
  type Task
} from "../slices/apiSlice";

// --- STRICT INTERFACES ---
// Replaces the 'any' in your Redux useSelector
interface RootAuthState {
  auth: {
    userInfo: { token: string } | null;
  };
}

// Safely types API errors without using 'any'
interface ApiError {
  data?: {
    message?: string;
  };
}

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 1. Strictly typed auth state
  const { userInfo } = useSelector((state: RootAuthState) => state.auth);

  // 2. Profile data is safely typed by RTK Query
  const { data: profileData } = useGetUserProfileQuery(undefined, { skip: !userInfo });
  const user = profileData?.user;

  // 3. Fetch tasks with proper type inference
  const { data: response, isLoading: isTasksLoading, refetch } = useGetTasksQuery(undefined, { skip: !userInfo });
  
  // 4. Defensive Data Extraction (Strict Type-Safe)
  // Safely handles cases where backend wraps the array in an object (e.g., { tasks: [...] })
  const extractTasks = (): Task[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    
    const wrappedResponse = response as unknown as { data?: Task[], tasks?: Task[] };
    return wrappedResponse.data || wrappedResponse.tasks || [];
  };
  
  const tasks: Task[] = extractTasks();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      // Strictly matches Partial<Task> from apiSlice
      await createTask({ title: newTaskTitle, status: 'pending' }).unwrap();
      setNewTaskTitle('');
      toast.success('Task created successfully');
      refetch();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, currentStatus?: string | boolean) => {
    const isCurrentlyCompleted = currentStatus === true || currentStatus === 'completed';
    const nextStatus = isCurrentlyCompleted ? 'pending' : 'completed';

    try {
      // Strictly matches Partial<Task>
      await updateTask({ id, data: { status: nextStatus, completed: !isCurrentlyCompleted } }).unwrap();
      refetch();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
      toast.success("Task deleted");
      refetch();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Failed to delete task");
    }
  };

  // 5. Accurate Filter Mapping using strictly typed 'Task'
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t: Task) => t.isCompleted || t.completed === true || t.status === 'completed').length,
    pending: tasks.filter((t: Task) => !(t.isCompleted || t.completed === true || t.status === 'completed')).length
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
        <p className="mb-4">You are not logged in.</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            {/* Cleaned up Optional Chaining (No more nasty 'as any' casts!) */}
            <p className="text-slate-500 mt-1">
              Welcome back, {user?.username || user?.name || 'User'}
            </p>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Admin Panel
            </button>
          )}
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'text-indigo-600' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' }
          ].map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Form and Task Item List Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <form onSubmit={handleCreateTask} className="flex gap-4 mb-8">
            <input
              aria-label="Task Title"
              className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isCreating}
            />
            <button 
              type="submit" 
              disabled={isCreating}
              className={`px-6 py-3 font-semibold rounded-xl text-white transition ${isCreating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isCreating ? 'Adding...' : 'Add Task'}
            </button>
          </form>

          {isTasksLoading ? (
            <div className="text-center py-10 text-slate-400">Loading your tasks...</div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task: Task) => {
                const isTaskDone = task.isCompleted || task.completed === true || task.status === 'completed';
                return (
                  <li key={task._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        aria-label={`Mark task titled ${task.title} as ${isTaskDone ? 'incomplete' : 'complete'}`}
                        checked={isTaskDone}
                        onChange={() => handleUpdateTask(task._id, task.status || task.completed)}
                        className="w-5 h-5 accent-indigo-600"
                      />
                      <span className={isTaskDone ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {task.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
              {tasks.length === 0 && (
                <li className="text-center py-8 text-slate-400 list-none">
                  No active tasks found. Type a title above to begin tracking workflows!
                </li>
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
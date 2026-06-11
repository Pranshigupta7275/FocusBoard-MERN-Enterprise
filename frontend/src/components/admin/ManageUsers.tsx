import { type JSX } from 'react';
import { useGetUsersQuery } from '../../slices/apiSlice'; // Adjust based on your exact apiSlice query name

const ManageUsers = (): JSX.Element => {
  // Fetching users dynamically from your RTK Query endpoint
  const { data: response, isLoading, isError } = useGetUsersQuery();

  // Safely extract users array regardless of response structure wrapper
  const responseObj = response as any;
  const users = responseObj?.data || responseObj?.users || (Array.isArray(response) ? response : []);

  const handleToggleAdmin = (userId: string, currentStatus: boolean) => {
    // Placeholder for your toggle status mutation
    console.log(`Toggling admin permissions for user ID: ${userId}, Next Status: ${!currentStatus}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user account permanently?")) {
      console.log(`Deleting user ID: ${userId}`);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-600 font-medium">Loading User Records...</div>;
  if (isError) return <div className="p-8 text-red-500 font-medium">Error loading users. Check server connection.</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Users</h1>
          <p className="text-sm text-slate-500 mt-1">Review, monitor, and configure system user access profiles.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm border border-indigo-100 self-start md:self-auto">
          Total Registers: {users.length}
        </div>
      </div>

      {/* Responsive Table View Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Access Level</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
            {users.map((user: any) => (
              <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-900 font-semibold">{user.name || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.isAdmin || user.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {user.isAdmin || user.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1.5 rounded-lg border border-transparent text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No registered users found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
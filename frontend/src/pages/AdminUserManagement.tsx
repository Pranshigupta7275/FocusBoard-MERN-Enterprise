import { useGetAllUsersQuery, useToggleUserStatusMutation } from '../slices/apiSlice';
import type { User } from '../slices/apiSlice'; 
import AdminLayout from '../components/admin/AdminLayout';

const AdminUserManagement = () => {
  const { data, isLoading } = useGetAllUsersQuery();
  const [toggleStatus] = useToggleUserStatusMutation();

 
  const handleToggle = async (userId: string) => {
    if (window.confirm("Are you sure you want to change this user's status?")) {
      await toggleStatus(userId);
    }
  };

  if (isLoading) return <AdminLayout><div>Loading Users...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Name</th>
              <th className="p-4 font-semibold text-slate-600">Email</th>
              <th className="p-4 font-semibold text-slate-600">Role</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* FIX: Explicitly typed 'user' using your User interface */}
            {data?.users?.map((user: User) => (
              <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 uppercase text-sm font-medium text-slate-500">{user.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggle(user._id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Toggle Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
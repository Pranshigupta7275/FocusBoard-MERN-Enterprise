import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/apiSlice';
import { toast } from 'react-toastify';
import { type RootState } from '../../store'; // ADDED: Imports the missing RootState

const AdminHeader = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [logoutUser] = useLogoutMutation();

  // Extract real user details safely matching your data pipeline structure
  const user = userInfo?.user || userInfo;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      localStorage.removeItem('token');
      toast.info('Logged out successfully');
      navigate('/login');
    } catch {
      // FIXED: Merged the stray brackets. 
      // If the API call fails, we still show an error and force the local state to clear.
      toast.error("Logout failed");
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 select-none">
      <div>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
          Role: <strong className="text-indigo-600 capitalize">{user?.role || 'Admin'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold text-slate-700">
          {user?.name || 'Administrator'}
        </span>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
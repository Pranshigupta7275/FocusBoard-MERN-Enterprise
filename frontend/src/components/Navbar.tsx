import { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { toast } from 'react-toastify';
import { type RootState } from '../store';
import { 
  useGetUserProfileQuery, 
  useLogoutMutation,
  type User 
} from "../slices/apiSlice"; 
import '../css/Navbar.css';

const Navbar = (): JSX.Element => {
  const navigate = useNavigate();

  // 1. Get immediate auth state from Redux
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // 2. Fetch profile data ONLY if the user is logged in
  const { data: profileResponse } = useGetUserProfileQuery(undefined, { skip: !userInfo });
  
 
  const resObj = profileResponse as { user?: User } | undefined;
  const apiUser = resObj?.user || (profileResponse as User | undefined);

  const stateObj = userInfo as { user?: User } | null;
  const reduxUser = stateObj?.user || (userInfo as User | null);

  // The final 'user' is now strictly typed as a pure User object or null/undefined
  const user: User | null | undefined = apiUser || reduxUser;

  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      localStorage.removeItem('token');
      toast.info('Logged out successfully');
      navigate('/login');
    } catch {
      
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>FocusBoard</h1>
      </div>
      
      <div className="nav-content">
        {user ? (
          <div className="nav-menu authenticated">
            <div className="user-info">
              {/* FIXED 1: user is now strictly a User object, so .name works safely */}
              <span>Welcome, {user.name || user.username || 'User'}</span>
            </div>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              
              {/* FIXED 2: Removed 'isAdmin' and rely strictly on the 'role' property from your interface */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-indigo-600 font-semibold">
                  Admin Panel
                </Link>
              )}
              
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
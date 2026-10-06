import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  
  console.log("Checking Admin Permissions for:", userInfo);

  // This line handles both flat data structures and nested 'user' structures safely
  const isAdmin = 
    userInfo?.isAdmin === true || 
    userInfo?.user?.isAdmin === true || 
    userInfo?.role === 'admin' || 
    userInfo?.user?.role === 'admin';

  return userInfo && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
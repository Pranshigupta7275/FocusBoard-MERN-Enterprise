import { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Passwordless from './pages/Passwordless';
import AdminDashboard from './pages/AdminDashboard';

import ManageUsers from './components/admin/ManageUsers';
import SystemTasks from './components/admin/SystemTasks';

// A clean wrapper that includes the top navbar for regular user paths
const MainLayoutWithNavbar = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/passwordless" element={<Passwordless />} /> 
      
      {/* Protected User Routes */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  </>
);

function App(): JSX.Element {
  return (
    <Router>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      
      <Routes>
        {/* All Regular & Public Pages get the Top Navbar */}
        <Route path="/*" element={<MainLayoutWithNavbar />} />

        {/* Protected Admin Routes: Completely independent of the Top Navbar */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            {/* The core admin dashboard view */}
            <Route index element={<AdminDashboard />} /> 
            
            
            <Route path="users" element={<ManageUsers />} />
            <Route path="tasks" element={<SystemTasks />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
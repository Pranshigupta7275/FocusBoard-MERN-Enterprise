import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader'; // Import our clean admin header

const AdminLayout = () => {
  return (
    <div className="flex w-screen min-h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. Left Sidebar Anchor */}
      <div className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
        <Sidebar />
      </div>
      
      {/* 2. Right Workspace Content Splitter */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
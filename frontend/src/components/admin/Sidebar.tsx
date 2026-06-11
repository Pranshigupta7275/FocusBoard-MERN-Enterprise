import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navLinkStyles = ({ isActive }: { isActive: boolean }) => 
    `flex items-center w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white' 
    }`;

  return (
    <div className="flex flex-col h-full py-6 w-full">
      
      {/* Sidebar Header */}
      <div className="mb-8 px-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Admin Controls
        </h2>
      </div>

      {/* FIXED: Changed <nav> to <div> so it completely ignores Navbar.css.
        Added px-4 and gap-2 to make the buttons sit perfectly tight together.
      */}
      <div className="flex-1 flex flex-col w-full px-4 gap-2">
        
        <NavLink to="/admin" end className={navLinkStyles}>
          Overview
        </NavLink>
        
        <NavLink to="/admin/users" className={navLinkStyles}>
          Manage Users
        </NavLink>
        
        <NavLink to="/admin/tasks" className={navLinkStyles}>
          System Tasks
        </NavLink>
        
      </div>
    </div>
  );
};

export default Sidebar;
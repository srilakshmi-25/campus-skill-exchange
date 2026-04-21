import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarCheck, Settings,
  LogOut, ShieldCheck, ChevronsLeft
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Users',     icon: Users,           to: '/admin/users' },
  { label: 'Sessions',  icon: CalendarCheck,   to: '/admin/sessions' },
  { label: 'Settings',  icon: Settings,        to: '/admin/settings' },
];

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-admin-bg font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-admin-sidebar flex flex-col border-r border-admin-border flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-admin-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-admin-accent flex items-center justify-center">
            <ShieldCheck className="text-white" size={18} />
          </div>
          <div>
            <p className="text-admin-text font-bold text-sm leading-none">SkillExchange</p>
            <p className="text-admin-muted text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-admin-accent text-white shadow-lg shadow-indigo-500/20'
                    : 'text-admin-muted hover:bg-white/5 hover:text-admin-text'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-admin-muted hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

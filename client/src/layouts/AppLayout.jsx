import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  PieChart,
  Search,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const AppLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    // Global Home
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['student', 'admin'] },
    
    // Student Links
    { name: 'Find Matches', icon: Sparkles, path: '/matches', roles: ['student'] },
    { name: 'My Sessions', icon: BookOpen, path: '/sessions', roles: ['student'] },
    { name: 'Analytics', icon: PieChart, path: '/analytics', roles: ['student'] },
    
    // Mentor Links (Behavioral)
    { name: 'Teaching Hub', icon: Calendar, path: '/mentor/teach', behaviorRole: 'mentor' },
    
    // Admin Links
    { name: 'User Management', icon: Users, path: '/admin/users', roles: ['admin'] },
    { name: 'System Settings', icon: Settings, path: '/admin/settings', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (item.roles && item.roles.includes(user.role)) return true;
    if (item.behaviorRole === 'mentor' && user.isMentor) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black/95 text-slate-900 dark:text-slate-100 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight">Campus<span className="text-indigo-600">Skill</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SaaS Edition</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
            {filteredMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <Badge variant={user.role === 'admin' ? 'danger' : (user.isMentor ? 'mentor' : 'primary')} className="mt-0.5">
                  {user.role === 'admin' ? 'SYSTEM ADMIN' : (user.isMentor ? 'MENTOR' : 'STUDENT')}
                </Badge>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all font-semibold text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative group">
              <button onClick={() => navigate('/notifications')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
            </div>
            
            <ThemeToggle />
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            
            <div 
              className="hidden sm:flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              onClick={() => navigate('/profile')}
            >
              <span className="text-sm font-bold pl-2">{user.name.split(' ')[0]}</span>
              <Avatar src={user.avatar} name={user.name} size="sm" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

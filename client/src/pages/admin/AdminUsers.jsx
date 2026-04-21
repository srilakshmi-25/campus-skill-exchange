import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminAPI';
import toast from 'react-hot-toast';
import { Trash2, ShieldBan, ShieldOff, Search, MoreVertical, Mail } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = () => {
    adminAPI.getUsers()
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to fetch users'); setLoading(false); });
  };
  
  useEffect(fetchUsers, []);

  const handleBlock = async (id, currentStatus) => {
    try {
      const { data } = await adminAPI.blockUser(id);
      toast.success(`User ${data.status === 'blocked' ? 'blocked' : 'unblocked'}!`);
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleBan = async (id) => {
    if (!window.confirm('Permanently ban this user?')) return;
    try {
      await adminAPI.banUser(id);
      toast.success('User permanently banned');
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their sessions?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic">Platform Guardians</h1>
          <p className="text-slate-500 font-medium font-mono">USER_MANAGEMENT_LEVEL_01</p>
        </div>
        <div className="w-full sm:w-72">
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="h-10 text-xs"
          />
        </div>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full border-r border-white dark:border-slate-900 ${user.trustScore > 7 ? 'bg-emerald-500' : (user.trustScore > 4 ? 'bg-amber-500' : 'bg-rose-500')}`} 
                          style={{ width: `${(user.trustScore || 0) * 10}%` }} 
                        />
                      </div>
                      <span className="text-xs font-black">{user.trustScore?.toFixed(1) || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : (user.status === 'blocked' ? 'warning' : 'danger')}>
                      {user.status || 'active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.skillsToTeach?.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/50 rounded font-bold text-slate-500 uppercase tracking-tighter">{s}</span>
                      ))}
                      {user.skillsToTeach?.length > 2 && <span className="text-[10px] text-slate-400 font-bold">+{user.skillsToTeach.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                         onClick={() => handleBlock(user._id, user.status)}
                         title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                       >
                         <ShieldOff size={16} />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                         onClick={() => handleBan(user._id)}
                         title="Ban User"
                       >
                         <ShieldBan size={16} />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/40"
                         onClick={() => handleDelete(user._id)}
                         title="Delete Account"
                       >
                         <Trash2 size={16} />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <p className="font-bold">No users found matching your search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;

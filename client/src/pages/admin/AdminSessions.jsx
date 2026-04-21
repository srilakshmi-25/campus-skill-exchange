import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/adminAPI';
import toast from 'react-hot-toast';
import { CheckCircle2, Trash2 } from 'lucide-react';

const statusColors = {
  PENDING:   'bg-amber-500/20 text-amber-400',
  ACCEPTED:  'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  REJECTED:  'bg-red-500/20 text-red-400',
};

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    setLoading(true);
    adminAPI.getSessions(filter)
      .then(r => { setSessions(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load sessions'); setLoading(false); });
  };
  useEffect(fetchSessions, [filter]);

  const handleForceComplete = async (id) => {
    try {
      await adminAPI.forceCompleteSession(id);
      toast.success('Session marked as completed!');
      fetchSessions();
    } catch { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this session?')) return;
    try {
      await adminAPI.deleteSession(id);
      toast.success('Session cancelled');
      fetchSessions();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-admin-text">Session Management</h1>
          <p className="text-admin-muted mt-1">Monitor, force-complete, or cancel active sessions.</p>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-admin-sidebar border border-admin-border text-admin-text text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-admin-accent"
        >
          <option value="">All Sessions</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-admin-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border">
                {['Skill', 'Teacher', 'Learner', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-admin-muted font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {sessions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-admin-muted">No sessions found.</td></tr>
              ) : sessions.map(s => (
                <tr key={s._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-admin-text font-medium">{s.skill}</td>
                  <td className="px-6 py-4 text-admin-muted">{s.teacherId?.name || '—'}</td>
                  <td className="px-6 py-4 text-admin-muted">{s.learnerId?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[s.status] || ''}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-admin-muted text-xs">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {s.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleForceComplete(s._id)}
                          title="Force complete"
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(s._id)}
                        title="Cancel session"
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSessions;

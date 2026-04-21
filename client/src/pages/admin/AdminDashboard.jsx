import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/adminAPI';
import { Users, CalendarCheck, Star, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-admin-card border border-admin-border rounded-2xl p-6 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-admin-muted text-sm font-medium">{label}</p>
      <p className="text-admin-text text-3xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then(r => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-admin-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const chartData = (data.topSkillsToTeach || []).map(s => ({ name: s._id, count: s.count }));

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-admin-text">Dashboard Overview</h1>
        <p className="text-admin-muted mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard label="Total Students" value={data.totalUsers} icon={Users} color="bg-indigo-500" />
        <StatCard label="Active Users" value={data.activeUsers} icon={Activity} color="bg-emerald-500" />
        <StatCard label="Active Sessions" value={data.activeSessions} icon={CalendarCheck} color="bg-amber-500" />
        <StatCard label="Avg Rating" value={`${data.avgRating} ★`} icon={Star} color="bg-purple-500" />
      </div>

      {/* Chart */}
      <div className="bg-admin-card border border-admin-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-admin-accent" />
          <h2 className="text-admin-text text-xl font-semibold">Top Skills Being Taught</h2>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                cursor={{ fill: 'rgba(99,102,241,0.1)' }}
              />
              <Bar dataKey="count" radius={[8,8,0,0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-admin-muted text-center py-16">No skill data yet. Students need to add skills first.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { adminAPI } from '../services/adminAPI';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  Plus,
  Shield
} from 'lucide-react';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import LineGraph from '../components/graphs/LineGraph';
import BarGraph from '../components/graphs/BarGraph';
import PieChartGraph from '../components/graphs/PieChartGraph';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    recentActivity: [],
    analytics: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user.role === 'admin') {
          const { data: analytics } = await adminAPI.getAnalytics();
          setData(prev => ({ ...prev, analytics }));
        } else {
          // For regular users/mentors, we just use the user object stats
          // But we could fetch their learning/teaching session history here
          const { data: sessions } = await api.get('/session/my');
          setData(prev => ({ ...prev, recentActivity: sessions.slice(0, 5) }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  const renderStudentHome = () => (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 space-y-4 max-w-xl">
          <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">WELCOME BACK</Badge>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">Ready to Master a New Skill Today?</h2>
          <p className="text-indigo-100 text-lg font-medium opacity-90">You have 3 complementary matches waiting for you in your campus cluster.</p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="secondary" onClick={() => window.location.href='/matches'}>
              View My Matches <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">Explore Skills</Button>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 aspect-square bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Sessions Completed" 
          value={user.stats?.completedSessions || 0} 
          icon={BookOpen} 
          color="indigo" 
          trend="+2 this week"
        />
        <StatsCard 
          title="Trust Score" 
          value={user.trustScore?.toFixed(1) || 0} 
          icon={Award} 
          color="emerald" 
          trend="Top 5% in Campus"
        />
        <StatsCard 
          title="Average Rating" 
          value={user.rating?.toFixed(1) || 0} 
          icon={Star} 
          color="amber" 
          trend="12 total reviews"
        />
        <StatsCard 
          title="Active Requests" 
          value={2} 
          icon={Clock} 
          color="slate" 
          trend="Awaiting response"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Learning Progress" subtitle="Skill mastery over time" className="lg:col-span-2">
          {/* Mock data for visualization since learning progress isn't a DB collection yet */}
          <LineGraph 
            data={[
              { month: 'Jan', value: 20 },
              { month: 'Feb', value: 35 },
              { month: 'Mar', value: 50 },
              { month: 'Apr', value: 65 },
              { month: 'May', value: 80 }
            ]} 
            xKey="month" 
            yKey="value"
            name="Skill Accuracy %"
          />
        </Card>
        
        <Card title="Recent Activity" subtitle="Your latest collaborations" padding={false}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.recentActivity.map((session, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate max-w-[120px]">{session.skill}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{session.status}</p>
                  </div>
                </div>
                <Badge variant={session.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {session.status}
                </Badge>
              </div>
            ))}
            {data.recentActivity.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <p>No recent activity. Start learning!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAdminHome = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">System Overview</h1>
          <p className="text-slate-500 font-medium">Real-time health and growth metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">Export Report</Button>
          <Button size="sm"><Plus size={18} className="mr-2" /> New Announcement</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={data.analytics?.totalUsers} 
          icon={Users} 
          color="indigo" 
        />
        <StatsCard 
          title="Active Sessions" 
          value={data.analytics?.activeSessions} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <StatsCard 
          title="Avg Trust Score" 
          value={data.analytics?.avgRating} 
          icon={Award} 
          color="amber" 
        />
        <StatsCard 
          title="Platform Uptime" 
          value="99.9%" 
          icon={Shield} 
          color="slate" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="User Growth" subtitle="New signups per month">
          <LineGraph 
            data={data.analytics?.monthlyGrowth} 
            xKey="month" 
            yKey="count" 
            color="#ec4899"
            name="New Users"
          />
        </Card>
        <Card title="Skill Popularity" subtitle="Most taught skills on campus">
          <BarGraph 
            data={data.analytics?.topSkillsToTeach} 
            xKey="_id" 
            yKey="count" 
            name="Skill Count"
          />
        </Card>
        <Card title="Session Distribution" subtitle="Status breakdown of all sessions">
          <PieChartGraph 
            data={data.analytics?.sessionTrends} 
            nameKey="status" 
            valueKey="count" 
          />
        </Card>
        <Card title="Engagement Funnel" subtitle="System efficiency metrics">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span>Match Acceptance Rate</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span>Session Completion Rate</span>
                <span>82%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[82%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span>Rating Submission Rate</span>
                <span>94%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[94%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return user.role === 'admin' ? renderAdminHome() : renderStudentHome();
};

export default Dashboard;

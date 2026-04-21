import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../services/adminAPI';
import api from '../services/api';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import LineGraph from '../components/graphs/LineGraph';
import BarGraph from '../components/graphs/BarGraph';
import PieChartGraph from '../components/graphs/PieChartGraph';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'admin') {
          const { data: analytics } = await adminAPI.getAnalytics();
          setData(analytics);
        } else {
          // For students, we simulate some learning metrics based on their profile and sessions
          // In a real app, this would be a specific analytics endpoint
          const { data: sessions } = await api.get('/session/my');
          setData({
            totalSessions: sessions.length,
            completedSessions: sessions.filter(s => s.status === 'COMPLETED').length,
            skillDistribution: [
              { name: 'Technical', value: 45 },
              { name: 'Soft Skills', value: 30 },
              { name: 'Academic', value: 25 }
            ],
            learningCurve: [
              { day: 'Mon', hours: 1 },
              { day: 'Tue', hours: 2 },
              { day: 'Wed', hours: 1.5 },
              { day: 'Thu', hours: 3 },
              { day: 'Fri', hours: 2.5 }
            ]
          });
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Performance Analytics</h1>
          <p className="text-slate-500 font-medium">Deep dive into your {user.role === 'admin' ? 'platform' : 'learning'} metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Filter size={16} className="mr-2" /> Filter</Button>
          <Button variant="secondary" size="sm"><Download size={16} className="mr-2" /> Export</Button>
        </div>
      </div>

      {user.role === 'admin' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="User Growth Over Time" subtitle="Signup velocity by month">
            <LineGraph data={data.monthlyGrowth} xKey="month" yKey="count" name="Signups" color="#6366f1" />
          </Card>
          <Card title="Session Activity" subtitle="Distribution by lifecycle status">
            <PieChartGraph data={data.sessionTrends} nameKey="status" valueKey="count" />
          </Card>
          <Card title="Marketplace Demand" subtitle="Top 5 searched and taught skills" className="lg:col-span-2">
            <BarGraph data={data.topSkillsToTeach} xKey="_id" yKey="count" name="Demand Score" />
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Learning Intensity" subtitle="Collaboration hours per day this week">
            <LineGraph data={data.learningCurve} xKey="day" yKey="hours" name="Hours Spent" color="#10b981" />
          </Card>
          <Card title="Skill Portfolio" subtitle="Proportional distribution of your skills">
            <PieChartGraph data={data.skillDistribution} nameKey="name" valueKey="value" />
          </Card>
          <Card title="Session Efficiency" subtitle="Completion rate analysis" className="lg:col-span-2">
            <div className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-indigo-500 border-r-transparent animate-spin duration-[3000ms]">
                <span className="text-2xl font-black animate-none">{Math.round((data.completedSessions / (data.totalSessions || 1)) * 100)}%</span>
              </div>
              <h3 className="text-xl font-bold">Session Completion Rate</h3>
              <p className="max-w-md mx-auto text-slate-500">You are more reliable than 85% of other students on campus. Keep building your Trust Score!</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;

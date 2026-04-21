import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Star, 
  Trash2, 
  ExternalLink,
  MailOpen
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to update all notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'session': return <Clock size={18} />;
      case 'rating': return <Star size={18} />;
      case 'match': return <Bell size={18} />;
      default: return <Bell size={18} />;
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Notifications</h1>
          <p className="text-slate-500 font-medium">Stay updated with your campus activity</p>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllRead}>
          <MailOpen size={18} className="mr-2" /> Mark All as Read
        </Button>
      </div>

      <Card padding={false}>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((n) => (
            <div 
              key={n._id} 
              className={`p-6 flex items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
            >
              <Avatar src={n.sender?.avatar} name={n.sender?.name} size="md" />
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant={n.type === 'session' ? 'primary' : 'secondary'} className="mb-1 uppercase tracking-wider text-[10px]">
                    {n.type} ALERT
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  {n.link && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[11px]"
                      onClick={() => navigate(n.link)}
                    >
                      View Details <ExternalLink size={12} className="ml-1.5" />
                    </Button>
                  )}
                  {!n.isRead && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 text-[11px]"
                      onClick={() => markAsRead(n._id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Bell size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold">All caught up!</h3>
                <p className="text-sm text-slate-500">No new notifications at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;

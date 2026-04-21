import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Shield, Award, Edit3, Save, Plus, Trash2, Clock, MapPin, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    skillsToTeach: '',
    skillsToLearn: '',
    availability: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        skillsToTeach: user.skillsToTeach?.join(', ') || '',
        skillsToLearn: user.skillsToLearn?.join(', ') || '',
        availability: user.availability || []
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teachArr = formData.skillsToTeach.split(',').map(s => s.trim()).filter(Boolean);
      const learnArr = formData.skillsToLearn.split(',').map(s => s.trim()).filter(Boolean);
      
      const { data } = await api.put('/users/profile', { 
        ...formData, 
        skillsToTeach: teachArr, 
        skillsToLearn: learnArr 
      });
      
      setUser(data);
      toast.success('Profile updated successfully! ✨');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { day: 'Monday', startTime: '09:00', endTime: '10:00' }]
    }));
  };

  const removeAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const updateAvailability = (index, field, value) => {
    const newAvail = [...formData.availability];
    newAvail[index][field] = value;
    setFormData(prev => ({ ...prev, availability: newAvail }));
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative group">
          <Avatar src={formData.avatar || user.avatar} name={user.name} size="xl" />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
            <Edit3 className="text-white" size={24} />
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            {user.isMentor && <Badge variant="mentor" className="animate-pulse">CERTIFIED MENTOR</Badge>}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <Mail size={16} /> {user.email}
          </p>
          <div className="flex gap-4 mt-4">
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Trust Score</p>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{user.trustScore?.toFixed(1) || 0}</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Avg Rating</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{user.rating?.toFixed(1) || 0}</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} loading={loading} className="w-full md:w-auto">
          <Save size={18} className="mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Basic Information" subtitle="Tell the campus a bit about yourself">
            <div className="grid grid-cols-1 gap-6">
              <Input 
                label="Full Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                icon={User}
              />
              <Input 
                label="Avatar URL" 
                placeholder="https://images.unsplash.com/..."
                value={formData.avatar} 
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                icon={Edit3}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">About Me</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 min-h-[120px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Share your learning journey..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card title="Skills Management" subtitle="What can you offer and what do you need?">
            <div className="space-y-6">
              <Input 
                label="Skills I Can Teach" 
                placeholder="React, Python, Calculus (comma separated)"
                value={formData.skillsToTeach} 
                onChange={(e) => setFormData({...formData, skillsToTeach: e.target.value})}
                icon={Award}
              />
              <Input 
                label="Skills I Want to Learn" 
                placeholder="UI Design, Spanish, Marketing (comma separated)"
                value={formData.skillsToLearn} 
                onChange={(e) => setFormData({...formData, skillsToLearn: e.target.value})}
                icon={BookOpen}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Availability */}
        <Card title="Availability" subtitle="When are you free to collaborate?">
          <div className="space-y-4">
            {formData.availability.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 group">
                <div className="flex-1 space-y-2">
                  <select 
                    value={slot.day} 
                    onChange={(e) => updateAvailability(index, 'day', e.target.value)}
                    className="w-full bg-transparent text-xs font-bold border-none outline-none focus:ring-0 text-indigo-600 cursor-pointer"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      value={slot.startTime} 
                      onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      className="bg-white dark:bg-slate-900 text-[10px] p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none" 
                    />
                    <span className="text-slate-400">-</span>
                    <input 
                      type="time" 
                      value={slot.endTime} 
                      onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      className="bg-white dark:bg-slate-900 text-[10px] p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none" 
                    />
                  </div>
                </div>
                <button 
                  onClick={() => removeAvailability(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={addAvailability}>
              <Plus size={14} className="mr-1.5" /> Add Time Slot
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

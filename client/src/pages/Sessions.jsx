import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Play, 
  Star,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const Sessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, session: null, rating: 5, feedback: '' });

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/session/my');
      setSessions(data);
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateStatus = async (sessionId, status) => {
    try {
      // In a real app, you might want to show a loading state per session item
      await api.put('/session/update', { sessionId, status });
      toast.success(`Session ${status.toLowerCase()}!`);
      fetchSessions();
    } catch (err) {
      toast.error('Failed to update session');
    }
  };

  const handleRating = async (e) => {
    e.preventDefault();
    const { session, rating, feedback } = ratingModal;
    try {
      const toUserId = session.teacherId._id === user._id ? session.learnerId._id : session.teacherId._id;
      await api.post('/rating', { sessionId: session._id, toUserId, rating, feedback });
      toast.success('Rating submitted! Thank you feedback. 🙏');
      setRatingModal({ isOpen: false, session: null, rating: 5, feedback: '' });
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING': return { variant: 'warning', icon: Clock };
      case 'ACCEPTED': return { variant: 'primary', icon: CheckCircle2 };
      case 'ONGOING': return { variant: 'secondary', icon: Play };
      case 'COMPLETED': return { variant: 'success', icon: CheckCircle2 };
      case 'REJECTED': return { variant: 'danger', icon: XCircle };
      default: return { variant: 'secondary', icon: Clock };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">My Sessions</h1>
          <p className="text-slate-500 font-medium">Manage your learning and teaching history</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-1">
          <button className="px-4 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-lg">All</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600">Active</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => {
          const isTeacher = session.teacherId._id === user._id;
          const partner = isTeacher ? session.learnerId : session.teacherId;
          const config = getStatusConfig(session.status);
          
          return (
            <div key={session._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center gap-6 group transition-all hover:border-indigo-200 dark:hover:border-indigo-900/40">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-2xl ${config.variant === 'primary' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform`}>
                  <config.icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{session.skill}</h3>
                    <Badge variant={config.variant} className="text-[10px] py-0">{session.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Avatar src={partner.avatar} name={partner.name} size="xs" />
                    <span>With <span className="font-bold text-slate-700 dark:text-slate-300">{partner.name}</span></span>
                    <span className="text-[10px]">•</span>
                    <span>{isTeacher ? 'You are Teaching' : 'You are Learning'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto md:ml-0">
                {session.status === 'PENDING' && !isTeacher && (
                  <Badge variant="secondary">Waiting for confirmation</Badge>
                )}
                {session.status === 'PENDING' && isTeacher && (
                  <>
                    <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(session._id, 'REJECTED')}>Reject</Button>
                    <Button size="sm" onClick={() => handleUpdateStatus(session._id, 'ACCEPTED')}>Accept</Button>
                  </>
                )}
                {session.status === 'ACCEPTED' && (
                  <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(session._id, 'ONGOING')}>
                    <Play size={14} className="mr-1.5" /> Start Session
                  </Button>
                )}
                {session.status === 'ONGOING' && (
                  <Button variant="success" size="sm" onClick={() => handleUpdateStatus(session._id, 'COMPLETED')}>
                    <CheckCircle2 size={14} className="mr-1.5" /> Mark Completed
                  </Button>
                )}
                {session.status === 'COMPLETED' && (
                  <Button variant="secondary" size="sm" onClick={() => setRatingModal({ isOpen: true, session, rating: 5, feedback: '' })}>
                    <Star size={14} className="mr-1.5 text-amber-500 fill-amber-500" /> Rate Experience
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="p-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">No sessions yet</h3>
              <p className="text-slate-500">Find a match to start your first skill exchange!</p>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <Modal 
        isOpen={ratingModal.isOpen} 
        onClose={() => setRatingModal({ ...ratingModal, isOpen: false })}
        title="Leave Feedback"
      >
        <form onSubmit={handleRating} className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">How was your session?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setRatingModal({ ...ratingModal, rating: s })}
                  className={`p-2 transition-all ${ratingModal.rating >= s ? 'text-amber-500 scale-125' : 'text-slate-200 dark:text-slate-700'}`}
                >
                  <Star size={32} fill={ratingModal.rating >= s ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Comments (Optional)</label>
            <textarea 
              className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 min-h-[100px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              placeholder="What did you learn? How was the mentor?"
              value={ratingModal.feedback}
              onChange={(e) => setRatingModal({ ...ratingModal, feedback: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Rating <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sessions;

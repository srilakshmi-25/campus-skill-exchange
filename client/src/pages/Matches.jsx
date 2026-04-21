import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, ArrowRight, User, Award, BookOpen, Clock, Zap, Users, ChevronRight, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/match/suggestions');
        setMatches(data);
      } catch (err) {
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleRequest = async (partnerId, skill, role) => {
    setRequestLoading(true);
    try {
      await api.post('/session/request', { partnerId, skill, role });
      toast.success('Session request sent! 🚀');
      setSelectedMatch(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Sparkles className="text-indigo-500" /> Smart Matches
          </h1>
          <p className="text-slate-500 font-medium">Based on your shared skills and learning goals</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
           <Button variant="ghost" size="sm" className="rounded-none border-r border-slate-100 dark:border-slate-800 px-4">All</Button>
           <Button variant="ghost" size="sm" className="rounded-none border-r border-slate-100 dark:border-slate-800 px-4">Recommended</Button>
           <Button variant="ghost" size="sm" className="rounded-none px-4 text-indigo-600">Perfect Mutual</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.user._id} className="group relative bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:translate-y--1 flex flex-col h-full overflow-hidden">
            {/* Top Score Ribbon */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-bl-2xl z-10 shadow-lg">
              {match.score}% MATCH
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div className="flex gap-4">
                <Avatar src={match.user.avatar} name={match.user.name} size="lg" />
                <div className="flex-1">
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 leading-tight mb-1">{match.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-[10px] px-1.5 py-0">TRUST: {match.user.trustScore?.toFixed(1) || 0}</Badge>
                    <div className="flex items-center text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-bold ml-1">{match.user.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Zap size={10} className="text-amber-500" /> Can Teach You
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchDetails.canTeachMe.map(s => (
                      <Badge key={s} variant="primary" className="rounded-lg">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <BookOpen size={10} className="text-indigo-500" /> Wants to Learn
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchDetails.canLearnFromMe.map(s => (
                      <Badge key={s} variant="secondary" className="rounded-lg">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => setSelectedMatch(match)}
              >
                Send Request <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="col-span-full p-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">No matches found yet</h3>
              <p className="text-slate-500">Try adding more skills to your profile to improve your visibility.</p>
            </div>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal 
        isOpen={!!selectedMatch} 
        onClose={() => setSelectedMatch(null)}
        title="Propose a Collaboration"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
              <Avatar src={selectedMatch.user.avatar} name={selectedMatch.user.name} size="md" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{selectedMatch.user.name}</p>
                <p className="text-xs text-slate-500 italic line-clamp-1">{selectedMatch.user.bio || 'No bio available'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select a topic</h4>
              <div className="grid grid-cols-1 gap-3">
                {selectedMatch.matchDetails.canTeachMe.map(s => (
                  <button 
                    key={s}
                    onClick={() => handleRequest(selectedMatch.user._id, s, 'learner')}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">Learn {s}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Request {selectedMatch.user.name.split(' ')[0]} as your mentor</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                  </button>
                ))}
                
                {selectedMatch.matchDetails.canLearnFromMe.map(s => (
                  <button 
                    key={s}
                    onClick={() => handleRequest(selectedMatch.user._id, s, 'teacher')}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">Teach {s}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Offer your expertise to {selectedMatch.user.name.split(' ')[0]}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Matches;

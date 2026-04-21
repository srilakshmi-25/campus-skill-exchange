import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminAPI';
import toast from 'react-hot-toast';
import { Save, RefreshCw, Settings, Shield, Zap, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const ToggleRow = ({ label, description, icon: Icon, checked, onChange }) => (
  <div className="flex items-start justify-between py-6 first:pt-0 last:pb-0 border-b border-slate-100 dark:border-slate-800 last:border-0 group">
    <div className="flex gap-4">
      <div className={`p-2.5 rounded-xl transition-colors ${checked ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-800/50'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</h4>
        <p className="text-xs text-slate-500 font-medium max-w-sm mt-0.5">{description}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-1 focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    isRegistrationEnabled: true,
    areSessionsEnabled: true,
    isAIEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminAPI.getSettings()
      .then(r => { setSettings(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load settings'); setLoading(false); });
  }, []);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('System parameters updated! ⚙️');
    } catch {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader size="xl" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">System Controls</h1>
          <p className="text-slate-500 font-medium font-mono uppercase tracking-tighter text-xs">ROOT_LAYER_ACCESS</p>
        </div>
        <Button onClick={handleSave} loading={saving} className="px-8 shadow-indigo-500/20">
          {!saving && <Save size={18} className="mr-2" />} {saving ? 'Applying...' : 'Save Configuration'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Core Features" subtitle="Toggle essential platform functionalities">
            <ToggleRow 
              label="Student Onboarding" 
              description="Allow new users to create accounts and join the campus skill ecosystem."
              icon={Globe}
              checked={settings.isRegistrationEnabled}
              onChange={() => toggle('isRegistrationEnabled')}
            />
            <ToggleRow 
              label="Session Marketplace" 
              description="Enable Peer-to-Peer skill sharing, session requests, and completion cycles."
              icon={Zap}
              checked={settings.areSessionsEnabled}
              onChange={() => toggle('areSessionsEnabled')}
            />
          </Card>

          <Card title="Intelligence Layer" subtitle="Configure AI and automation settings">
             <ToggleRow 
              label="Deep Learning Roadmaps" 
              description="Unlock GPT-4 powered learning paths for students based on their goals."
              icon={Shield}
              checked={settings.isAIEnabled}
              onChange={() => toggle('isAIEnabled')}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Quick Info" padding={false}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Version</span>
                <Badge variant="secondary">v2.0.4 SAAS</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Engine</span>
                <span className="font-mono text-indigo-500">Node-Express/Mongo</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  Changes here take effect immediately across all client instances. Please exercise caution when disabling core features.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

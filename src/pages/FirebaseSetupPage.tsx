import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Key, Globe, Box, MessageSquare, Hash, Save, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { saveFirebaseConfig, initFirebase, isFirebaseConfigured, getFirebaseConfig } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

interface FormData {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export default function FirebaseSetupPage() {
  const navigate = useNavigate();
  const existing = getFirebaseConfig();
  const [form, setForm] = useState<FormData>({
    apiKey: existing?.apiKey || '',
    authDomain: existing?.authDomain || '',
    projectId: existing?.projectId || '',
    storageBucket: existing?.storageBucket || '',
    messagingSenderId: existing?.messagingSenderId || '',
    appId: existing?.appId || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fields: { key: keyof FormData; label: string; icon: any; placeholder: string }[] = [
    { key: 'apiKey', label: 'API Key', icon: Key, placeholder: 'AIzaSy...' },
    { key: 'authDomain', label: 'Auth Domain', icon: Globe, placeholder: 'your-project.firebaseapp.com' },
    { key: 'projectId', label: 'Project ID', icon: Database, placeholder: 'your-project-id' },
    { key: 'storageBucket', label: 'Storage Bucket', icon: Box, placeholder: 'your-project.appspot.com' },
    { key: 'messagingSenderId', label: 'Messaging Sender ID', icon: MessageSquare, placeholder: '123456789' },
    { key: 'appId', label: 'App ID', icon: Hash, placeholder: '1:123456789:web:abc123' },
  ];

  const allFilled = fields.every(f => form[f.key].trim() !== '');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      saveFirebaseConfig(form);
      const ok = initFirebase(form);
      if (!ok) {
        setError('Failed to initialize Firebase. Check your credentials.');
        return;
      }
      setSuccess('Firebase connected successfully!');
      setTimeout(() => navigate('/'), 800);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Clear all Firebase credentials?')) return;
    localStorage.removeItem('bgmi_firebase_config');
    setForm({ apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' });
    setSuccess('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center border border-[#00F0FF]/30"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 240, 255, 0.2)',
                '0 0 40px rgba(0, 240, 255, 0.4)',
                '0 0 20px rgba(0, 240, 255, 0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Database className="w-8 h-8 text-[#00F0FF]" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white font-gaming">Firebase Setup</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Connect your existing Firebase project</p>
          {isFirebaseConfigured() && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px] text-green-400">Already configured</span>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </motion.div>
        )}

        <div className="space-y-3">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <label className="text-[10px] text-[#94A3B8] mb-1 block uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full pl-10 pr-4 py-3 input-gaming rounded-xl text-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            onClick={handleSave}
            disabled={!allFilled || saving}
            className="flex-1 py-3 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Connecting...' : 'Save & Connect'}
          </motion.button>

          <motion.button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl bg-[#111827]/60 text-[#94A3B8] border border-[#00F0FF]/10 text-sm flex items-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>

        <p className="text-[10px] text-[#64748B] text-center mt-4">
          Find these values in your Firebase Project Settings {'>'} General {'>'} Your apps {'>'} SDK setup and configuration
        </p>
      </motion.div>
    </div>
  );
}

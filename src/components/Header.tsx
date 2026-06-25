import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'Friends', path: '/friends' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Clan', path: '/clan' },
  { label: 'Squad', path: '/squad' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 px-4 pt-3"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <motion.button
            className="w-10 h-10 glass-card flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-5 h-5 text-[#00F0FF]" />
          </motion.button>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Shield className="w-5 h-5 text-[#00F0FF]" />
            <span className="text-sm font-bold font-gaming text-[#00F0FF]">BGMI VAULT</span>
          </motion.div>

          {isAdmin ? (
            <motion.button
              className="w-10 h-10 glass-card flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 text-[#94A3B8]" />
            </motion.button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-72"
              style={{ background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center border border-[#00F0FF]/30">
                      <Shield className="w-5 h-5 text-[#00F0FF]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white font-gaming">BGMI VAULT</h2>
                      <p className="text-[10px] text-[#94A3B8]">Friends Companion</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5 text-[#94A3B8]" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#00F0FF]/10 to-transparent border border-[#00F0FF]/20 text-[#00F0FF]'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => handleNavigate(item.path)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00F0FF]"
                            layoutId="sidebarActive"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {isAdmin && (
                  <motion.button
                    className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => handleNavigate('/admin')}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-sm font-medium">Admin Panel</span>
                  </motion.button>
                )}

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#00F0FF]/20 to-transparent mb-4" />
                  <p className="text-[10px] text-[#64748B] text-center">BGMI Friends Vault v1.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

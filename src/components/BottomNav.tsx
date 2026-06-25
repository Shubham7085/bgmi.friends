import { motion } from 'framer-motion';
import { Home, Users, Trophy, Image, Settings, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Users, label: 'Friends', path: '/friends' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Image, label: 'Gallery', path: '/gallery' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const allItems = isAdmin
    ? [...navItems, { icon: Settings, label: 'Admin', path: '/admin' }]
    : [...navItems, { icon: LogIn, label: 'Login', path: '/login' }];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 pt-1"
      style={{
        background: 'linear-gradient(to top, rgba(7, 11, 20, 0.95) 0%, rgba(7, 11, 20, 0.8) 60%, transparent 100%)',
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="max-w-lg mx-auto">
        <div className="glass-card flex items-center justify-around py-2 px-1">
          {allItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(184, 41, 221, 0.1))',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 ${isActive ? 'text-[#00F0FF]' : 'text-[#64748B]'}`}
                />
                <span
                  className={`text-[10px] relative z-10 font-medium ${isActive ? 'text-[#00F0FF]' : 'text-[#64748B]'}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#00F0FF]"
                    layoutId="activeDot"
                    style={{ boxShadow: '0 0 6px #00F0FF' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

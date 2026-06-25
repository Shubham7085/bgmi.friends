import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Award, Target, Crosshair, Gamepad2, ChevronRight, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery } from '../data/firebaseService';
import { getSettings } from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  { label: 'All Friends', icon: UsersIcon, path: '/friends', color: '#00F0FF' },
  { label: 'Top 10', icon: TrophyIcon, path: '/leaderboard', color: '#FFD700' },
  { label: 'Squad', icon: ShieldIcon, path: '/squad', color: '#B829DD' },
  { label: 'Clan', icon: FlagIcon, path: '/clan', color: '#00E5FF' },
  { label: 'Gallery', icon: ImageIcon, path: '/gallery', color: '#FF6B6B' },
  { label: 'Statistics', icon: BarChartIcon, path: '/statistics', color: '#4ECDC4' },
];

function UsersIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function TrophyIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.8 7 21h10c0-1.2-.85-2.25-1.97-2.79-.5-.23-.97-.66-.97-1.21v-2.34"/><path d="M8 8h8v6a4 4 0 0 1-8 0V8z"/></svg>; }
function ShieldIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function FlagIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>; }
function ImageIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>; }
function BarChartIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>; }

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [, setGallery] = useState<GalleryImage[]>([]);
  const [, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [p, s, f, g, st] = await Promise.all([
          getProfile(),
          getSocialLinks(),
          getFriends(),
          getGallery(),
          getSettings(),
        ]);
        setProfile(p);
        setSocial(s);
        setFriends(f);
        setGallery(g);
        setSettings(st);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    totalFriends: friends.length,
    totalSynergy: friends.reduce((sum, f) => sum + (f.synergy || 0), 0),
    highestSynergy: friends.length > 0 ? Math.max(...friends.map(f => f.synergy || 0)) : 0,
    avgSynergy: friends.length > 0 ? Math.round(friends.reduce((sum, f) => sum + (f.synergy || 0), 0) / friends.length) : 0,
    totalMemories: friends.reduce((sum, f) => sum + (f.memories?.length || 0), 0),
    collectionAvg: friends.length > 0 ? Math.round(friends.reduce((sum, f) => sum + (f.collectionLevel || 0), 0) / friends.length) : 0,
  };

  // Stats computed above

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile?.heroBackground ? `url(${profile.heroBackground})` : 'linear-gradient(135deg, #0D1321, #070B14)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/30 via-[#070B14]/60 to-[#070B14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/50 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-6">
          <motion.div
            className="flex items-end gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                {profile?.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center">
                    <Crosshair className="w-8 h-8 text-[#00F0FF]/50" />
                  </div>
                )}
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#070B14]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div className="flex-1 pb-1">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-white font-gaming"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {profile?.ign || 'Your IGN'}
              </motion.h1>
              <motion.p
                className="text-sm text-[#94A3B8] mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {profile?.realName || 'Your Name'}
              </motion.p>
              <motion.div
                className="flex items-center gap-3 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-xs bg-[#00F0FF]/10 text-[#00F0FF] px-2 py-0.5 rounded-md border border-[#00F0FF]/20">
                  ID: {profile?.bgmiId || '---'}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <MapPin className="w-3 h-3" />
                  {profile?.country || 'Country'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <motion.section
        className="px-5 -mt-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Friends', value: stats.totalFriends, icon: UsersIcon, color: '#00F0FF' },
            { label: 'Total Synergy', value: stats.totalSynergy, icon: Heart, color: '#FF6B6B' },
            { label: 'Avg Synergy', value: stats.avgSynergy, icon: Award, color: '#FFD700' },
            { label: 'Collection Avg', value: stats.collectionAvg, icon: Target, color: '#B829DD' },
            { label: 'Memories', value: stats.totalMemories, icon: ImageIcon, color: '#4ECDC4' },
            { label: 'Highest', value: stats.highestSynergy, icon: TrophyIcon, color: '#00E5FF' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <GlassCard className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{stat.label}</span>
                </div>
                <AnimatedCounter
                  end={stat.value}
                  className="text-xl font-bold font-gaming"
                  suffix=""
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Profile Details */}
      <motion.section
        className="px-5 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-4">
          <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Profile Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Collection Level', value: profile?.collectionLevel || 0, icon: Target },
              { label: 'Account Level', value: profile?.accountLevel || 0, icon: Award },
              { label: 'Popularity', value: profile?.popularity || 0, icon: Heart },
              { label: 'Likes', value: profile?.likes || 0, icon: Heart },
              { label: 'Current Tier', value: profile?.currentTier || '-', icon: TrophyIcon },
              { label: 'Highest Tier', value: profile?.highestTier || '-', icon: TrophyIcon },
              { label: 'Favorite Weapon', value: profile?.favoriteWeapon || '-', icon: Crosshair },
              { label: 'Favorite Map', value: profile?.favoriteMap || '-', icon: MapPin },
              { label: 'Favorite Mode', value: profile?.favoriteMode || '-', icon: Gamepad2 },
              { label: 'Playing Since', value: profile?.playingSince || '-', icon: Calendar },
              { label: 'State', value: profile?.state || '-', icon: MapPin },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <item.icon className="w-3.5 h-3.5 text-[#00F0FF]/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#64748B]">{item.label}</p>
                  <p className="text-xs font-medium text-[#E2E8F0]">{typeof item.value === 'number' ? item.value : item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* About Me */}
      {profile?.aboutMe && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-2 font-gaming">About Me</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{profile.aboutMe}</p>
          </GlassCard>
        </motion.section>
      )}

      {/* Social Links */}
      {social && (social.instagram || social.youtube || social.facebook || social.discord) && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Connect</h3>
            <div className="flex gap-3">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#E4405F]/10 to-[#F77737]/10 border border-[#E4405F]/20 text-[#E4405F]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-xs font-medium">Instagram</span>
                  </motion.div>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000]/10 to-[#CC0000]/10 border border-[#FF0000]/20 text-[#FF0000]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Youtube className="w-4 h-4" />
                    <span className="text-xs font-medium">YouTube</span>
                  </motion.div>
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#1877F2]/10 to-[#0D5CB6]/10 border border-[#1877F2]/20 text-[#1877F2]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-xs font-medium">Facebook</span>
                  </motion.div>
                </a>
              )}
              {social.discord && (
                <a href={social.discord} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2]/10 to-[#4752C4]/10 border border-[#5865F2]/20 text-[#5865F2]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Discord</span>
                  </motion.div>
                </a>
              )}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Quick Actions */}
      <motion.section
        className="px-5 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              <GlassCard
                className="p-4 cursor-pointer group"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${action.color}15`, border: `1px solid ${action.color}30` }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#00F0FF] transition-colors" />
                </div>
                <p className="text-sm font-medium text-[#E2E8F0]">{action.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Friends */}
      {friends.length > 0 && (
        <motion.section
          className="px-5 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Featured Friends</h3>
            <button onClick={() => navigate('/friends')} className="text-[10px] text-[#94A3B8] hover:text-[#00F0FF]">
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {friends.slice(0, 5).map((friend) => (
              <motion.div
                key={friend.id}
                className="flex-shrink-0 w-20 cursor-pointer"
                onClick={() => navigate(`/friend/${friend.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/20 mb-2">
                  {friend.profilePhoto ? (
                    <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-center text-[#E2E8F0] truncate">{friend.ign}</p>
                <p className="text-[9px] text-center text-[#00F0FF]">{friend.synergy} SYN</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

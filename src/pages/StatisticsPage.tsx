import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, Users, Heart, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../data/firebaseService';
import type { Friend } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { fadeInUp, staggerContainer } from '../utils/animations';

export default function StatisticsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFriends() {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFriends();
  }, []);

  const stats = {
    totalFriends: friends.length,
    totalSynergy: friends.reduce((sum, f) => sum + (f.synergy || 0), 0),
    highestSynergy: friends.length > 0 ? Math.max(...friends.map(f => f.synergy || 0)) : 0,
    avgSynergy: friends.length > 0 ? Math.round(friends.reduce((sum, f) => sum + (f.synergy || 0), 0) / friends.length) : 0,
    collectionAvg: friends.length > 0 ? Math.round(friends.reduce((sum, f) => sum + (f.collectionLevel || 0), 0) / friends.length) : 0,
    totalMemories: friends.reduce((sum, f) => sum + (f.memories?.length || 0), 0),
    totalGallery: friends.reduce((sum, f) => sum + (f.gallery?.length || 0), 0),
  };

  const highestSynergyFriend = friends.reduce((max, f) => (f.synergy > (max?.synergy || 0) ? f : max), friends[0]);
  const oldestFriend = friends.length > 0 ? friends.reduce((old, f) => new Date(f.friendSince) < new Date(old.friendSince) ? f : old, friends[0]) : null;
  const newestFriend = friends.length > 0 ? friends.reduce((newest, f) => new Date(f.friendSince) > new Date(newest.friendSince) ? f : newest, friends[0]) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-16 px-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button onClick={() => navigate('/')} className="w-10 h-10 glass-card flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#00F0FF]" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white font-gaming">Statistics</h1>
          <p className="text-xs text-[#94A3B8]">Your vault analytics</p>
        </div>
      </motion.div>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="w-12 h-12 text-[#64748B]/50 mb-3" />
          <p className="text-sm text-[#94A3B8]">No data yet. Add friends to see stats.</p>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#00F0FF]" />
                  <span className="text-[10px] text-[#94A3B8] uppercase">Total Friends</span>
                </div>
                <AnimatedCounter end={stats.totalFriends} className="text-2xl font-bold text-[#00F0FF] font-gaming" />
              </GlassCard>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#FF6B6B]" />
                  <span className="text-[10px] text-[#94A3B8] uppercase">Total Synergy</span>
                </div>
                <AnimatedCounter end={stats.totalSynergy} className="text-2xl font-bold text-[#FF6B6B] font-gaming" />
              </GlassCard>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[10px] text-[#94A3B8] uppercase">Avg Synergy</span>
                </div>
                <AnimatedCounter end={stats.avgSynergy} className="text-2xl font-bold text-[#FFD700] font-gaming" />
              </GlassCard>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#B829DD]" />
                  <span className="text-[10px] text-[#94A3B8] uppercase">Collection Avg</span>
                </div>
                <AnimatedCounter end={stats.collectionAvg} className="text-2xl font-bold text-[#B829DD] font-gaming" />
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Special Friends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Special Mentions</h3>
            <div className="space-y-3">
              {highestSynergyFriend && (
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#94A3B8]">Highest Synergy</p>
                      <p className="text-sm font-bold text-white">{highestSynergyFriend.ign}</p>
                    </div>
                    <span className="text-lg font-bold text-[#FFD700] font-gaming">{highestSynergyFriend.synergy}</span>
                  </div>
                </GlassCard>
              )}

              {oldestFriend && (
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#00F0FF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#94A3B8]">Oldest Friend</p>
                      <p className="text-sm font-bold text-white">{oldestFriend.ign}</p>
                    </div>
                    <span className="text-xs text-[#00F0FF]">{oldestFriend.friendSince}</span>
                  </div>
                </GlassCard>
              )}

              {newestFriend && (
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B829DD]/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#B829DD]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#94A3B8]">Newest Friend</p>
                      <p className="text-sm font-bold text-white">{newestFriend.ign}</p>
                    </div>
                    <span className="text-xs text-[#B829DD]">{newestFriend.friendSince}</span>
                  </div>
                </GlassCard>
              )}
            </div>
          </motion.div>

          {/* Weapon & Map Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Friend Preferences</h3>
            <GlassCard className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#94A3B8] mb-2">Favorite Weapons</p>
                  <div className="space-y-1">
                    {Object.entries(
                      friends.reduce((acc, f) => {
                        if (f.favoriteWeapon) acc[f.favoriteWeapon] = (acc[f.favoriteWeapon] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([weapon, count]) => (
                        <div key={weapon} className="flex items-center justify-between">
                          <span className="text-xs text-white">{weapon}</span>
                          <span className="text-[10px] text-[#00F0FF]">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8] mb-2">Favorite Maps</p>
                  <div className="space-y-1">
                    {Object.entries(
                      friends.reduce((acc, f) => {
                        if (f.favoriteMap) acc[f.favoriteMap] = (acc[f.favoriteMap] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([map, count]) => (
                        <div key={map} className="flex items-center justify-between">
                          <span className="text-xs text-white">{map}</span>
                          <span className="text-[10px] text-[#00F0FF]">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </div>
  );
}

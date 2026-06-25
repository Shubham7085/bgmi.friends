import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Crosshair, MapPin, Gamepad2, Award, Heart, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFriends } from '../data/firebaseService';
import type { Friend } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

function calculateFriendshipDuration(friendSince: string) {
  const start = new Date(friendSince);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  return { years, months, days, totalDays: diffDays };
}

export default function FriendProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFriend() {
      try {
        const friends = await getFriends();
        const found = friends.find((f) => f.id === id);
        setFriend(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFriend();
  }, [id]);

  const friendshipDuration = useMemo(() => {
    if (!friend?.friendSince) return null;
    return calculateFriendshipDuration(friend.friendSince);
  }, [friend]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-lg text-[#94A3B8] mb-4">Friend not found</p>
        <button onClick={() => navigate('/friends')} className="btn-primary px-4 py-2 rounded-xl text-sm">
          Back to Friends
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <section className="relative h-[280px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: friend.coverBanner ? `url(${friend.coverBanner})` : 'linear-gradient(135deg, #0D1321, #070B14)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/20 via-[#070B14]/50 to-[#070B14]" />

        <div className="relative z-10 px-5 pt-4">
          <motion.button
            onClick={() => navigate('/friends')}
            className="w-10 h-10 glass-card flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-[#00F0FF]" />
          </motion.button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              {friend.profilePhoto ? (
                <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                </div>
              )}
            </div>
            {friend.isOnline && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070B14]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <motion.div
            className="text-center mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-xl font-bold text-white font-gaming">{friend.ign}</h1>
            <p className="text-sm text-[#94A3B8]">{friend.realName}</p>
            <span className="text-xs bg-[#00F0FF]/10 text-[#00F0FF] px-2 py-0.5 rounded-md mt-1 inline-block">
              ID: {friend.bgmiId}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Friendship Counter */}
      {friendshipDuration && (
        <motion.section
          className="px-5 -mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <h3 className="text-sm font-bold text-[#FFD700] font-gaming">Friendship Duration</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10">
                <p className="text-xl font-bold text-[#FFD700] font-gaming">{friendshipDuration.years}</p>
                <p className="text-[10px] text-[#94A3B8]">Years</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10">
                <p className="text-xl font-bold text-[#FFD700] font-gaming">{friendshipDuration.months}</p>
                <p className="text-[10px] text-[#94A3B8]">Months</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10">
                <p className="text-xl font-bold text-[#FFD700] font-gaming">{friendshipDuration.days}</p>
                <p className="text-[10px] text-[#94A3B8]">Days</p>
              </div>
            </div>
            <p className="text-center text-[10px] text-[#64748B] mt-2">
              {friendshipDuration.totalDays} days total
            </p>
          </GlassCard>
        </motion.section>
      )}

      {/* Stats */}
      <motion.section
        className="px-5 mt-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 gap-3">
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="text-[10px] text-[#94A3B8]">Synergy</span>
              </div>
              <p className="text-lg font-bold text-[#FF6B6B] font-gaming">{friend.synergy}</p>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-[10px] text-[#94A3B8]">Collection</span>
              </div>
              <p className="text-lg font-bold text-[#FFD700] font-gaming">Lv.{friend.collectionLevel}</p>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[10px] text-[#94A3B8]">Friend Since</span>
              </div>
              <p className="text-sm font-medium text-[#00F0FF]">{friend.friendSince}</p>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3.5 h-3.5 text-[#B829DD]" />
                <span className="text-[10px] text-[#94A3B8]">Account Level</span>
              </div>
              <p className="text-lg font-bold text-[#B829DD] font-gaming">{friend.accountLevel || '-'}</p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.section>

      {/* Favorites */}
      <motion.section
        className="px-5 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-4">
          <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Favorites</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B]">Weapon</p>
                <p className="text-sm font-medium text-white">{friend.favoriteWeapon || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B]">Map</p>
                <p className="text-sm font-medium text-white">{friend.favoriteMap || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#B829DD]/10 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-[#B829DD]" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B]">Mode</p>
                <p className="text-sm font-medium text-white">{friend.favoriteMode || '-'}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* Notes */}
      {friend.notes && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-2 font-gaming">Notes</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{friend.notes}</p>
          </GlassCard>
        </motion.section>
      )}

      {/* Gallery */}
      {friend.gallery && friend.gallery.length > 0 && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Gallery ({friend.gallery.length}/10)</h3>
            <div className="grid grid-cols-3 gap-2">
              {friend.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-[#00F0FF]/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={img} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Achievements */}
      {friend.achievements && friend.achievements.length > 0 && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {friend.achievements.map((achievement, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-[#FFD700]/10 text-[#FFD700] text-xs border border-[#FFD700]/20"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Memories */}
      {friend.memories && friend.memories.length > 0 && (
        <motion.section
          className="px-5 mt-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Memories</h3>
            <div className="space-y-3">
              {friend.memories.map((memory) => (
                <div key={memory.id} className="p-3 rounded-xl bg-[#070B14]/60 border border-[#00F0FF]/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{memory.title}</p>
                    <span className="text-[10px] text-[#64748B]">{memory.date}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{memory.description}</p>
                  {memory.image && (
                    <img src={memory.image} alt={memory.title} className="mt-2 rounded-lg w-full h-32 object-cover" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}
    </div>
  );
}

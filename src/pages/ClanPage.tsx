import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getClan } from '../data/firebaseService';
import type { ClanData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

export default function ClanPage() {
  const [clan, setClan] = useState<ClanData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadClan() {
      try {
        const data = await getClan();
        setClan(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadClan();
  }, []);

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
          <h1 className="text-xl font-bold text-white font-gaming">Clan</h1>
          <p className="text-xs text-[#94A3B8]">Your BGMI clan</p>
        </div>
      </motion.div>

      {!clan?.name ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Shield className="w-12 h-12 text-[#64748B]/50 mb-3" />
          <p className="text-sm text-[#94A3B8]">No clan set up yet</p>
        </div>
      ) : (
        <>
          {/* Clan Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[200px] rounded-2xl overflow-hidden mb-6"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: clan.logo ? `url(${clan.logo})` : 'linear-gradient(135deg, #0D1321, #070B14)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/50 to-transparent" />
            <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/40 mb-2">
                {clan.logo ? (
                  <img src={clan.logo} alt={clan.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-[#00F0FF]/50" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white font-gaming">{clan.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-xs text-[#94A3B8]">{clan.members} members</span>
              </div>
            </div>
          </motion.section>

          {/* Description */}
          {clan.description && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <GlassCard className="p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] mb-2 font-gaming">About</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{clan.description}</p>
              </GlassCard>
            </motion.section>
          )}

          {/* Gallery */}
          {clan.gallery && clan.gallery.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Clan Gallery</h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {clan.gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="aspect-square rounded-xl overflow-hidden border border-[#00F0FF]/10"
                  >
                    <img src={img} alt={`Clan ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}

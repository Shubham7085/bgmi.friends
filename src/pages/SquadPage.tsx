import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Crown, Target, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSquad } from '../data/firebaseService';
import type { SquadData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

const roleIcons: Record<string, any> = {
  Leader: Crown,
  IGL: Target,
  Fragger: Shield,
  Support: Users,
};

const roleColors: Record<string, string> = {
  Leader: '#FFD700',
  IGL: '#00F0FF',
  Fragger: '#FF6B6B',
  Support: '#4ECDC4',
};

export default function SquadPage() {
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSquad() {
      try {
        const data = await getSquad();
        setSquad(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSquad();
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
          <h1 className="text-xl font-bold text-white font-gaming">Favorite Squad</h1>
          <p className="text-xs text-[#94A3B8]">{squad?.name || 'Your squad'}</p>
        </div>
      </motion.div>

      {!squad?.members || squad.members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-12 h-12 text-[#64748B]/50 mb-3" />
          <p className="text-sm text-[#94A3B8]">No squad set up yet</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {squad.members.map((member) => {
            const RoleIcon = roleIcons[member.role] || Users;
            const roleColor = roleColors[member.role] || '#00F0FF';

            return (
              <motion.div key={member.id} variants={fadeInUp}>
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#00F0FF]/20">
                        {member.profilePhoto ? (
                          <img src={member.profilePhoto} alt={member.ign} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-[#00F0FF]/50">{member.ign[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{member.ign}</h3>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-md border"
                          style={{
                            color: roleColor,
                            borderColor: `${roleColor}40`,
                            background: `${roleColor}10`,
                          }}
                        >
                          {member.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">{member.name}</p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${roleColor}15` }}
                    >
                      <RoleIcon className="w-4 h-4" style={{ color: roleColor }} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

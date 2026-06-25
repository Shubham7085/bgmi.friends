import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Swords } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #070B14 0%, #0D1321 50%, #070B14 100%)' }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(184, 41, 221, 0.08) 0%, transparent 70%)' }}
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Logo Section */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Icon */}
            <motion.div
              className="relative mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(184, 41, 221, 0.2))',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(184, 41, 221, 0.2)',
                      '0 0 40px rgba(0, 240, 255, 0.5), 0 0 60px rgba(184, 41, 221, 0.3)',
                      '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(184, 41, 221, 0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Shield className="w-12 h-12 text-[#00F0FF] relative z-10" />
                <Swords className="w-6 h-6 text-[#FFD700] absolute -bottom-1 -right-1" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-5xl font-bold tracking-wider text-center font-gaming"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #B829DD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
              }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(0, 240, 255, 0.3)',
                  '0 0 40px rgba(0, 240, 255, 0.6)',
                  '0 0 20px rgba(0, 240, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              BGMI FRIENDS VAULT
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-3 text-sm md:text-base text-[#94A3B8] tracking-[0.3em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Every Friend Has A Story
            </motion.p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="relative z-10 mt-12 w-72 md:w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex justify-between mb-2 text-xs text-[#94A3B8] font-gaming">
              <span>LOADING</span>
              <span className="text-[#00F0FF]">{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="h-1.5 bg-[#111827] rounded-full overflow-hidden border border-[rgba(0,240,255,0.1)]">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: 'linear-gradient(90deg, #00F0FF, #B829DD)',
                  width: `${Math.min(progress, 100)}%`,
                }}
              >
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00F0FF]"
                  style={{ boxShadow: '0 0 10px #00F0FF, 0 0 20px #00F0FF' }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[#64748B]">
              <span>INITIALIZING</span>
              <span>CONNECTING</span>
              <span>READY</span>
            </div>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#00F0FF]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#00F0FF]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

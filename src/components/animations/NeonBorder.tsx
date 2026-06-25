import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export default function NeonBorder({ children, className = '', color = '#00F0FF' }: NeonBorderProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-30 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${color}40, transparent, ${color}20)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', className = '' }: AnimatedCounterProps) {
  const { count, ref } = useCountUp(end, duration);

  return (
    <div ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

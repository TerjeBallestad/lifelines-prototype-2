import { motion, useSpring, useTransform } from 'motion/react';

interface OverskuddMeterProps {
  value: number; // 0-100
}

/**
 * OverskuddMeter displays an animated progress bar for overskudd
 *
 * Uses motion/react spring animation for smooth transitions.
 * Spring config: stiffness 100, damping 30 (smooth but responsive)
 */
export function OverskuddMeter({ value }: OverskuddMeterProps) {
  // Spring-animated value for smooth transitions
  const springValue = useSpring(value, { stiffness: 100, damping: 30 });
  const width = useTransform(springValue, (v) => `${Math.max(0, Math.min(100, v))}%`);

  // Determine color based on value (red < 33, yellow < 66, green >= 66)
  const getBarColor = (v: number): string => {
    if (v < 33) return 'bg-error';
    if (v < 66) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-4 bg-base-300 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getBarColor(value)} rounded-full`}
          style={{ width }}
        />
      </div>
      <span className="font-mono text-sm w-12 text-right">
        {Math.round(value)}%
      </span>
    </div>
  );
}

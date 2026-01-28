import clsx from 'clsx';
import { motion, useMotionValue, animate } from 'motion/react';
import { useEffect } from 'react';

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  critical?: boolean;
  onComplete: () => void;
}

/**
 * Animated floating number that rises and fades
 * Uses motion values to avoid React re-renders during animation
 */
export function FloatingNumber({
  value,
  x,
  y,
  critical,
  onComplete,
}: FloatingNumberProps) {
  const opacity = useMotionValue(1);
  const posY = useMotionValue(-50);

  useEffect(() => {
    // Animate upward 100px over 1 second
    const yControls = animate(posY, -100, {
      duration: 1,
      ease: 'easeOut',
    });

    // Fade out starting at 0.5s
    const opacityControls = animate(opacity, 0, {
      duration: 0.5,
      delay: 0.5,
      ease: 'easeIn',
    });

    // Cleanup after animation
    const timer = setTimeout(onComplete, 1000);

    return () => {
      yControls.stop();
      opacityControls.stop();
      clearTimeout(timer);
    };
  }, [opacity, posY, onComplete]);

  const isPositive = value >= 0;
  const displayValue = isPositive ? `+${value}` : `${value}`;

  const colorClass = critical
    ? 'floating-number-critical'
    : isPositive
      ? 'floating-number-positive'
      : 'floating-number-negative';

  return (
    <motion.div
      className={clsx('floating-number absolute z-10', colorClass)}
      style={{
        left: x,
        top: y,
        y: posY,
        opacity,
      }}
    >
      {displayValue}
      {critical && ' \u2605'}
    </motion.div>
  );
}

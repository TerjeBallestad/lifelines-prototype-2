import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import type { ActivityScore, MTGColor } from '../types/game';

interface ThoughtBubbleProps {
  scores: ActivityScore[];
  duration: number; // ms - how long to show deliberation
  onComplete?: () => void;
}

/**
 * MTG color to CSS color mapping
 * Uses oklch for perceptually uniform colors
 */
const MTG_COLOR_MAP: Record<MTGColor, string> = {
  white: 'oklch(0.95 0.02 90)', // warm off-white
  blue: 'oklch(0.7 0.15 240)', // calm blue
  black: 'oklch(0.3 0.05 300)', // dark purple-gray
  red: 'oklch(0.7 0.2 25)', // warm red
  green: 'oklch(0.7 0.15 145)', // natural green
};

/**
 * Get the primary color from an activity's color affinities
 * Returns the color with the highest affinity value
 */
function getPrimaryColor(
  colorAffinities: Partial<Record<MTGColor, number>>
): MTGColor | null {
  const entries = Object.entries(colorAffinities) as [MTGColor, number][];
  if (entries.length === 0) return null;

  return entries.reduce((max, [color, value]) =>
    value > (colorAffinities[max] ?? 0) ? color : max
  , entries[0][0]);
}

/**
 * ThoughtBubble visualizes a character's decision process
 *
 * Shows competing activity options (top 3 from pendingScores).
 * After 80% of duration, highlights the winner with color pulse.
 * Elling's bubble lingers longer due to Blue = analysis personality.
 *
 * Visual design:
 * - Comic-style bubble positioned above character
 * - Activity icons/initials for top 3 candidates
 * - Winner gets subtle background color from activity's MTG color
 * - Smooth enter/exit animations via motion
 */
export function ThoughtBubble({
  scores,
  duration,
  onComplete,
}: ThoughtBubbleProps) {
  const [showWinner, setShowWinner] = useState(false);

  // Trigger winner highlight at 80% of duration
  useEffect(() => {
    const winnerTimer = setTimeout(() => {
      setShowWinner(true);
    }, duration * 0.8);

    return () => clearTimeout(winnerTimer);
  }, [duration]);

  // Call onComplete when duration elapses
  useEffect(() => {
    if (!onComplete) return;

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(completeTimer);
  }, [duration, onComplete]);

  // Take top 3 scores (already sorted by utility)
  const topScores = scores.slice(0, 3);

  if (topScores.length === 0) return null;

  return (
    <motion.div
      className="absolute -top-20 left-1/2 z-20"
      initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%' }}
      exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Bubble container */}
      <div className="bg-base-100 rounded-2xl shadow-lg px-3 py-2 min-w-20">
        {/* Activity options */}
        <div className="flex items-center justify-center gap-2">
          {topScores.map((score, index) => {
            const isWinner = index === 0 && showWinner;
            const primaryColor = getPrimaryColor(score.activity.colorAffinities);
            const bgColor = isWinner && primaryColor
              ? MTG_COLOR_MAP[primaryColor]
              : undefined;

            return (
              <motion.div
                key={score.activity.id}
                className="relative flex items-center justify-center rounded-lg px-2 py-1"
                style={{
                  backgroundColor: bgColor,
                }}
                animate={
                  isWinner
                    ? {
                        scale: [1, 1.15, 1.1],
                      }
                    : {}
                }
                transition={
                  isWinner
                    ? {
                        duration: 0.3,
                        ease: 'easeOut',
                      }
                    : {}
                }
              >
                {/* Activity icon or first letter */}
                <span
                  className="text-lg"
                  title={score.activity.name}
                >
                  {score.activity.icon || score.activity.name.charAt(0)}
                </span>

                {/* Faded appearance for non-winners once winner is shown */}
                {showWinner && index > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-base-100/60 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bubble tail pointing down */}
      <div className="flex justify-center">
        <div
          className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
          style={{ borderTopColor: 'oklch(var(--b1))' }}
        />
      </div>
    </motion.div>
  );
}

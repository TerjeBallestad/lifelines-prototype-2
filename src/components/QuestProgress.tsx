import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, useSpring, useTransform } from 'motion/react';
import clsx from 'clsx';

interface QuestProgressProps {
  progress: number; // 0-1
  current?: number; // Current value (e.g., 47)
  target?: number; // Target value (e.g., 100)
  compact?: boolean;
}

/**
 * Spring-animated progress bar for quest tracking
 * Shows progress bar with optional number overlay (e.g., "47/100")
 * Visual emphasis at 80%+ progress (glow effect)
 */
export const QuestProgress = observer(function QuestProgress({
  progress,
  current,
  target,
  compact = false,
}: QuestProgressProps) {
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  // Update spring when progress changes
  useEffect(() => {
    springProgress.set(progress);
  }, [progress, springProgress]);

  const widthPercent = useTransform(
    springProgress,
    (v) => `${Math.min(100, v * 100)}%`
  );

  const isNearComplete = progress >= 0.8;
  const isComplete = progress >= 1;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-base-300 h-1.5 flex-1 overflow-hidden rounded-full">
          <motion.div
            className={clsx(
              'h-full transition-colors',
              isComplete
                ? 'bg-success'
                : isNearComplete
                  ? 'bg-warning'
                  : 'bg-primary'
            )}
            style={{ width: widthPercent }}
          />
        </div>
        <span className="min-w-[3ch] text-right text-xs font-medium">
          {Math.floor(progress * 100)}%
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Progress bar */}
      <div className="bg-base-300 relative h-3 overflow-hidden rounded-full">
        <motion.div
          className={clsx(
            'h-full transition-all',
            isComplete
              ? 'bg-success'
              : isNearComplete
                ? 'from-warning to-success shadow-warning/30 bg-gradient-to-r shadow-lg'
                : 'from-primary to-secondary bg-gradient-to-r',
            isNearComplete && !isComplete && 'animate-pulse'
          )}
          style={{ width: widthPercent }}
        />

        {/* Number overlay */}
        {current !== undefined && target !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={clsx(
                'text-xs font-bold',
                progress > 0.5 ? 'text-base-100' : 'text-base-content/70'
              )}
            >
              {current}/{target}
            </span>
          </div>
        )}
      </div>

      {/* Percentage below for non-compact */}
      {(current === undefined || target === undefined) && (
        <div className="text-base-content/70 text-right text-xs">
          {Math.floor(progress * 100)}%
        </div>
      )}
    </div>
  );
});

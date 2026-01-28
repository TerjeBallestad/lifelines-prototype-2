import { observer } from 'mobx-react-lite';
import { motion, useSpring, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import type { Character } from '../stores/CharacterStore';
import { ThoughtBubble } from './ThoughtBubble';
import { RefusalMessage } from './RefusalMessage';
import clsx from 'clsx';

interface CharacterSpriteProps {
  character: Character;
  onClick: () => void;
  isSelected?: boolean;
}

/**
 * CharacterSprite is a position-animated representation of a character in the game world
 *
 * Features:
 * - Spring-animated position for smooth movement
 * - ThoughtBubble integration when character is deciding
 * - Tired visual state for low overskudd (< 40)
 * - Activity indicator when performing
 * - Clickable for selection with ring highlight
 *
 * Uses observer() for reactive updates when character state changes.
 */
export const CharacterSprite = observer(function CharacterSprite({
  character,
  onClick,
  isSelected = false,
}: CharacterSpriteProps) {
  const overskudd = character.overskudd;
  const isTired = overskudd < 40;
  const isDeciding = character.state === 'deciding';
  const isPerforming = character.state === 'performing';
  const isWalking = character.state === 'walking';

  // Spring-animated position for smooth movement
  const springX = useSpring(character.position.x, { stiffness: 50, damping: 20 });
  const springY = useSpring(character.position.y, { stiffness: 50, damping: 20 });

  // Update spring targets when position changes
  useEffect(() => {
    springX.set(character.position.x);
    springY.set(character.position.y);
  }, [character.position.x, character.position.y, springX, springY]);

  // Determine overskudd indicator color
  const getIndicatorColor = (): string => {
    if (overskudd < 33) return 'bg-error';
    if (overskudd < 66) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <motion.div
      className="absolute z-10"
      style={{ x: springX, y: springY }}
    >
      {/* ThoughtBubble when deciding, Activity progress when performing */}
      <AnimatePresence>
        {isDeciding && character.pendingScores.length > 0 && (
          <ThoughtBubble
            scores={character.pendingScores}
            duration={character.decisionDuration}
          />
        )}
        {isPerforming && character.currentActivity && (
          <motion.div
            className="absolute -top-16 left-1/2 z-20"
            initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Activity bubble container */}
            <div className="bg-base-100 rounded-2xl shadow-lg px-4 py-2 min-w-24">
              {/* Activity icon and name */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">
                  {character.currentActivity.icon || character.currentActivity.name.charAt(0)}
                </span>
                <span className="text-xs text-base-content/70">
                  {character.currentActivity.name}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-base-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.activityProgress * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
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
        )}
      </AnimatePresence>

      {/* Refusal message when player forces reluctant activity */}
      <RefusalMessage character={character} />

      {/* Character card */}
      <button
        onClick={onClick}
        className={clsx(
          'card bg-base-100 min-w-24 cursor-pointer p-3 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg',
          { 'ring-primary ring-offset-base-200 ring-2 ring-offset-2': isSelected },
          { 'opacity-70': isTired }
        )}
      >
        {/* Character avatar placeholder */}
        <div className="avatar placeholder mb-2">
          <div className={clsx(
            'bg-neutral text-neutral-content flex w-12 items-center justify-center rounded-full',
            { 'animate-pulse': isWalking }
          )}>
            <span className="text-lg">{character.name.charAt(0)}</span>
          </div>
        </div>

        {/* Character name */}
        <p className="text-center text-sm font-medium">{character.name}</p>

        {/* Overskudd indicator */}
        <div className="mt-1 flex items-center justify-center gap-1">
          <div className={`h-2 w-2 rounded-full ${getIndicatorColor()}`} />
          <span className="text-base-content/70 text-xs">
            {Math.round(overskudd)}%
          </span>
        </div>
      </button>
    </motion.div>
  );
});

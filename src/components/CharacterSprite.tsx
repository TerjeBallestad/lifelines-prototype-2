import { observer } from 'mobx-react-lite';
import { motion, useSpring, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import type { Character } from '../stores/CharacterStore';
import { ThoughtBubble } from './ThoughtBubble';
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
      {/* ThoughtBubble when deciding */}
      <AnimatePresence>
        {isDeciding && character.pendingScores.length > 0 && (
          <ThoughtBubble
            scores={character.pendingScores}
            duration={character.decisionDuration}
          />
        )}
      </AnimatePresence>

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

        {/* Activity indicator when performing */}
        {isPerforming && character.currentActivity && (
          <div className="mt-2 text-center">
            <span className="text-xs text-base-content/60">
              {character.currentActivity.icon || character.currentActivity.name.charAt(0)}
            </span>
            {/* Progress bar */}
            <div className="mt-1 h-1 w-full bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${character.activityProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </button>
    </motion.div>
  );
});

import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import type { Character } from '../stores/CharacterStore';

interface RefusalMessageProps {
  character: Character;
}

/**
 * Displays personality-flavored refusal message above character
 *
 * Shows when a character is reluctant or refusing an activity
 * assigned by the player. Messages are personality-flavored:
 * - Blue characters express introspective reluctance
 * - White characters express pragmatic acceptance
 *
 * Auto-clears after 3 seconds (controlled by Character class).
 */
export const RefusalMessage = observer(function RefusalMessage({ character }: RefusalMessageProps) {
  if (!character.refusalMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-30"
      >
        <div className="bg-base-100 rounded-lg px-3 py-2 shadow-lg border border-base-300">
          <span className="mr-2">{character.refusalIcon}</span>
          <span className="text-sm italic">{character.refusalMessage}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

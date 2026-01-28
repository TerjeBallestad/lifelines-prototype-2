import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/RootStore';
import type { SkillCategory } from '../types/game';

// Character celebration messages based on personality
const CELEBRATION_MESSAGES: Record<string, Record<SkillCategory, string[]>> = {
  elling: {
    Practical: ["I... I did it?", "Maybe I'm not so useless..."],
    Creative: ["The patterns are clearer now.", "I understand more."],
    Social: ["That wasn't so bad...", "People aren't all terrible."],
    Technical: ["Fascinating mechanism.", "I see how it works now."],
  },
  mother: {
    Practical: ["Practice makes perfect!", "Getting better every day."],
    Creative: ["How delightful!", "The mind stays sharp."],
    Social: ["Connection is important.", "We all need each other."],
    Technical: ["These old hands still work!", "Learning new tricks."],
  },
};

/**
 * Full-screen celebration overlay when character levels up
 * Pauses game while displayed, resumes when user dismisses
 */
export const LevelUpCelebration = observer(function LevelUpCelebration() {
  const { skillStore, characterStore, timeStore } = useGameStore();
  const levelUp = skillStore.anyPendingLevelUp;

  // Pause game when level-up modal appears
  useEffect(() => {
    if (levelUp) {
      timeStore.pause();
    }
  }, [levelUp, timeStore]);

  if (!levelUp) return null;

  const character = characterStore.getCharacter(levelUp.characterId);
  if (!character) return null;

  const messages = CELEBRATION_MESSAGES[levelUp.characterId]?.[levelUp.skill] ?? ["Level up!"];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => {
          skillStore.clearLevelUp(levelUp.characterId, levelUp.skill);
          timeStore.resume();
        }}
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          className="bg-base-100 rounded-2xl p-8 shadow-2xl text-center max-w-sm"
        >
          {/* Character avatar placeholder */}
          <div className="text-6xl mb-4">
            {character.colors.primary.color === 'blue' ? '📘' : '🤍'}
          </div>

          {/* Level up banner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-pixel text-2xl text-primary mb-2"
          >
            LEVEL UP!
          </motion.div>

          {/* Skill info */}
          <div className="text-lg font-bold mb-2">
            {character.name}'s {levelUp.skill}
          </div>
          <div className="text-3xl font-pixel text-secondary mb-4">
            Lv. {levelUp.newLevel}
          </div>

          {/* Character message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="italic text-base-content/80"
          >
            "{message}"
          </motion.div>

          {/* Tap to dismiss hint */}
          <div className="text-xs opacity-50 mt-4">
            Game paused - tap anywhere to continue
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

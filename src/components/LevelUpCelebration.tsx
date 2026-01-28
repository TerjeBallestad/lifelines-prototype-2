import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/RootStore';
import type { SkillCategory, MTGColor } from '../types/game';

// Character celebration messages based on MTG color personality
const CELEBRATION_MESSAGES: Record<MTGColor, Record<SkillCategory, string[]>> = {
  blue: {
    // Blue: Analytical, introverted, contemplative, self-doubting but insightful
    Practical: ["I... I did it?", "Maybe I'm not so useless..."],
    Creative: ["The patterns are clearer now.", "I understand more."],
    Social: ["That wasn't so bad...", "People aren't all terrible."],
    Technical: ["Fascinating mechanism.", "I see how it works now."],
  },
  white: {
    // White: Orderly, community-focused, encouraging
    Practical: ["Practice makes perfect!", "Getting better every day."],
    Creative: ["How delightful!", "The mind stays sharp."],
    Social: ["Connection is important.", "We all need each other."],
    Technical: ["These old hands still work!", "Learning new tricks."],
  },
  red: {
    // Red: Impulsive, passionate, excited, spontaneous
    Practical: ["Yes! I knew I could do it!", "That felt amazing!"],
    Creative: ["The passion flows through me!", "Pure inspiration!"],
    Social: ["What a rush!", "That was exhilarating!"],
    Technical: ["Ha! I figured it out!", "Nothing can stop me now!"],
  },
  green: {
    // Green: Natural, growth-focused, accepting, patient
    Practical: ["Everything in its time.", "Growth happens naturally."],
    Creative: ["Life finds a way.", "Beauty in simplicity."],
    Social: ["We're all connected.", "Part of something bigger."],
    Technical: ["Working with nature.", "Harmony achieved."],
  },
  black: {
    // Black: Ambitious, self-focused, proud, determined
    Practical: ["Another step toward greatness.", "Power through progress."],
    Creative: ["My vision takes shape.", "Excellence demands sacrifice."],
    Social: ["Useful connections made.", "They'll remember this."],
    Technical: ["Knowledge is power.", "One more secret uncovered."],
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

  const primaryColor = character.colors.primary.color;
  const messages = CELEBRATION_MESSAGES[primaryColor]?.[levelUp.skill] ?? ["Level up!"];
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

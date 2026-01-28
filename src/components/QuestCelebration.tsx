import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';

// Celebration messages based on quest type
const QUEST_MESSAGES: Record<string, string[]> = {
  'morning-routine': [
    'A good start to the day!',
    'The basics are covered.',
    'Ready for what comes next.',
  ],
  'creative-output': [
    'Ideas are flowing!',
    'Creativity unlocked.',
    'The mind is sharp.',
  ],
  'stay-connected': [
    'Connection established!',
    'The phone is a lifeline.',
    'Practice makes progress.',
  ],
};

/**
 * Full-screen celebration modal when quest completes
 * Pauses game while displayed, advances quest on dismiss
 */
export const QuestCelebration = observer(function QuestCelebration() {
  const { questStore, timeStore } = useGameStore();
  const completedQuest = questStore.pendingCompletion;

  // Pause game when celebration appears
  useEffect(() => {
    if (completedQuest) {
      timeStore.pause();
    }
  }, [completedQuest, timeStore]);

  if (!completedQuest) return null;

  const messages = QUEST_MESSAGES[completedQuest.id] ?? ['Quest complete!'];
  const message = messages[Math.floor(Math.random() * messages.length)];

  const handleDismiss = () => {
    questStore.advanceQuest();
    // Don't resume yet - let QuestIntroduction handle that
    // (or if no more quests, resume immediately)
    if (questStore.allQuestsComplete) {
      timeStore.resume();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          className="bg-base-100 max-w-sm rounded-2xl p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="mb-4 inline-block text-6xl"
          >
            <Trophy className="h-16 w-16 text-warning" />
          </motion.div>

          {/* Quest complete banner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-pixel text-success mb-2 text-2xl"
          >
            QUEST COMPLETE!
          </motion.div>

          {/* Quest title */}
          <div className="mb-4 text-lg font-bold">{completedQuest.title}</div>

          {/* Flavor message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base-content/80 mb-4 italic"
          >
            "{message}"
          </motion.div>

          {/* Quest progress indicator */}
          <div className="text-base-content/60 mb-4 text-sm">
            Quest {questStore.currentQuestIndex + 1} of {questStore.totalQuests}
          </div>

          {/* Dismiss button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="btn btn-primary btn-wide"
            onClick={handleDismiss}
          >
            {questStore.currentQuestIndex < questStore.totalQuests - 1
              ? 'Next Quest'
              : 'Continue Playing'}
          </motion.button>

          {/* Tap hint */}
          <div className="mt-4 text-xs opacity-50">
            Game paused - click anywhere to continue
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

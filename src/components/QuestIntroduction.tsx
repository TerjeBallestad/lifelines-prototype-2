import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';

/**
 * Brief popup introducing the next quest after celebration dismissed
 * Auto-dismisses after a few seconds, doesn't pause game
 *
 * Also shows introduction for the first quest on initial load or after game reset.
 */
export const QuestIntroduction = observer(function QuestIntroduction() {
  const { questStore, timeStore } = useGameStore();
  const [showIntro, setShowIntro] = useState(false);
  const previousQuestIndex = useRef(questStore.currentQuestIndex);
  const hasShownFirst = useRef(false);

  const quest = questStore.currentQuest;

  // Detect when quest index advances (after celebration dismissed) or first quest on load
  useEffect(() => {
    const currentIndex = questStore.currentQuestIndex;

    // Detect game reset: if currentIndex goes back to 0, reset our tracking
    if (currentIndex === 0 && previousQuestIndex.current > 0) {
      hasShownFirst.current = false;
    }

    // Show intro for first quest on initial load or after reset
    if (currentIndex === 0 && !hasShownFirst.current && quest) {
      // Small delay to let game UI render first
      const firstQuestTimer = setTimeout(() => {
        setShowIntro(true);
        hasShownFirst.current = true;

        // Auto-dismiss after 3 seconds
        const dismissTimer = setTimeout(() => {
          setShowIntro(false);
        }, 3000);

        return () => clearTimeout(dismissTimer);
      }, 500);

      previousQuestIndex.current = currentIndex;
      return () => clearTimeout(firstQuestTimer);
    }

    // If quest advanced and we have a new quest, show intro
    if (currentIndex > previousQuestIndex.current && quest) {
      setShowIntro(true);
      // Resume game when intro shows
      timeStore.resume();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);

      previousQuestIndex.current = currentIndex;
      return () => clearTimeout(timer);
    }

    previousQuestIndex.current = currentIndex;
  }, [questStore.currentQuestIndex, quest, timeStore]);

  // Manual dismiss
  const handleDismiss = () => {
    setShowIntro(false);
  };

  if (!showIntro || !quest) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed top-4 left-1/2 z-40 -translate-x-1/2"
        onClick={handleDismiss}
      >
        <div className="bg-base-200 border-primary/30 flex cursor-pointer items-center gap-4 rounded-lg border-2 px-6 py-4 shadow-xl">
          {/* Icon */}
          <div className="bg-primary/20 rounded-full p-2">
            <Target className="text-primary h-6 w-6" />
          </div>

          {/* Content */}
          <div>
            <div className="text-primary text-xs font-medium uppercase tracking-wide">
              New Quest
            </div>
            <div className="text-lg font-bold">{quest.title}</div>
            <div className="text-base-content/70 text-sm">{quest.description}</div>
          </div>

          {/* Progress indicator */}
          <div className="text-base-content/50 ml-4 text-xs">
            {questStore.currentQuestIndex + 1}/{questStore.totalQuests}
          </div>
        </div>

        {/* Auto-dismiss progress indicator */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 3, ease: 'linear' }}
          className="bg-primary mt-1 h-0.5 rounded-full"
        />
      </motion.div>
    </AnimatePresence>
  );
});

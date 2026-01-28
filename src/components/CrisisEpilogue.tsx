import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Skull, RotateCcw, Home } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';
import { EPILOGUE_TEXT } from '../data/crisis';

/**
 * Epilogue screen shown after crisis resolves
 * Displays outcome-appropriate text and offers restart/menu options
 */
export const CrisisEpilogue = observer(function CrisisEpilogue() {
  const store = useGameStore();
  const { crisisStore } = store;

  // Only show when crisis is resolved with an outcome
  if (crisisStore.crisisState !== 'resolved' || !crisisStore.outcome) {
    return null;
  }

  const outcome = crisisStore.outcome;
  const epilogue = EPILOGUE_TEXT[outcome];
  const isSaved = outcome === 'saved';

  const handleRestart = () => {
    store.resetGame();
  };

  const handleMenu = () => {
    // For now, just reload the page as there's no menu system
    window.location.reload();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-base-100 p-8 shadow-2xl"
        >
          {/* Outcome icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mb-6 text-center"
          >
            {isSaved ? (
              <Heart className={`mx-auto h-20 w-20 text-success`} />
            ) : (
              <Skull className={`mx-auto h-20 w-20 text-error`} />
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`mb-6 text-center text-3xl font-bold ${
              isSaved ? 'text-success' : 'text-error'
            }`}
          >
            {epilogue.title}
          </motion.h2>

          {/* Epilogue paragraphs */}
          <div className="mb-8 space-y-4">
            {epilogue.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.3 }}
                className="text-base-content/80 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 + epilogue.paragraphs.length * 0.3 + 0.5 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <button
              className="btn btn-primary flex-1 gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="h-5 w-5" />
              Try Again
            </button>
            <button
              className="btn btn-outline flex-1 gap-2"
              onClick={handleMenu}
            >
              <Home className="h-5 w-5" />
              Return to Menu
            </button>
          </motion.div>

          {/* Hint for players who lost */}
          {!isSaved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + epilogue.paragraphs.length * 0.3 + 1 }}
              className="mt-6 text-center text-sm text-base-content/50"
            >
              Tip: Train Elling's Social skill to improve phone call success.
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

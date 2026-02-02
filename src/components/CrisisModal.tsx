import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Heart } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';
import { CrisisActionButton } from './CrisisActionButton';
import type { CrisisAction, CrisisActionResult } from '../types/game';

/**
 * Full-screen crisis modal that appears when Mother collapses
 * Shows urgent situation, available actions, and skill check results
 */
export const CrisisModal = observer(function CrisisModal() {
  const { crisisStore, characterStore } = useGameStore();
  const [showingResult, setShowingResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<CrisisActionResult | null>(
    null
  );

  const elling = characterStore.getCharacter('elling');
  const inShadow = elling?.inShadowState ?? false;

  // Only show during active crisis
  if (crisisStore.crisisState !== 'active') return null;

  const handleActionSelect = (action: CrisisAction) => {
    const result = crisisStore.attemptAction(action.id);
    if (result) {
      setCurrentResult(result);
      setShowingResult(true);

      // Auto-clear result after showing
      setTimeout(() => {
        setShowingResult(false);
        setCurrentResult(null);
        crisisStore.clearLastActionResult();
      }, 2500);
    }
  };

  const handleGiveUp = () => {
    crisisStore.giveUp();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      >
        {/* Urgent red pulse background effect */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-error/20 absolute inset-0"
        />

        {/* Main content */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-base-100 relative z-10 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 shadow-2xl"
        >
          {/* Header with alert */}
          <div className="mb-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="mb-2 inline-block"
            >
              <AlertTriangle className="text-error h-12 w-12" />
            </motion.div>
            <h2 className="text-error text-2xl font-bold">CRISIS!</h2>
            <p className="text-base-content/80 mt-1 text-sm">
              Mother has collapsed. She's not responding.
            </p>
          </div>

          {/* Attempts remaining - urgent indicator */}
          <div className="mb-4 flex justify-center gap-2">
            {Array.from({ length: crisisStore.maxAttempts }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={
                  i >= crisisStore.attemptsRemaining
                    ? { scale: [1, 0.8], opacity: 0.3 }
                    : {}
                }
                className={`h-3 w-8 rounded-full ${
                  i < crisisStore.attemptsRemaining ? 'bg-error' : 'bg-base-300'
                }`}
              />
            ))}
          </div>
          <div className="text-error/80 mb-4 text-center text-xs">
            {crisisStore.attemptsRemaining} attempt
            {crisisStore.attemptsRemaining !== 1 ? 's' : ''} remaining
          </div>

          {/* Shadow state warning */}
          {inShadow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-warning/20 mb-4 rounded-lg p-3 text-center text-sm"
            >
              <span className="text-warning font-medium">
                Elling is paralyzed with anxiety. Actions are harder.
              </span>
            </motion.div>
          )}

          {/* Hope bonus indicator */}
          {crisisStore.hopeBonus > 0 && (
            <div className="text-info mb-4 flex items-center justify-center gap-2 text-sm">
              <Heart className="h-4 w-4" />
              <span>+{crisisStore.hopeBonus}% hope bonus for phone call</span>
            </div>
          )}

          {/* Action result overlay */}
          <AnimatePresence>
            {showingResult && currentResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`mb-4 rounded-xl p-4 text-center ${
                  currentResult.succeeded
                    ? 'bg-success/20 text-success'
                    : 'bg-error/20 text-error'
                }`}
              >
                <div className="text-4xl">
                  {currentResult.succeeded ? '✓' : '✗'}
                </div>
                <div className="mt-1 text-lg font-bold">
                  {currentResult.succeeded ? 'Success!' : 'Failed...'}
                </div>
                <div className="text-sm opacity-80">
                  Rolled {Math.floor(currentResult.roll)} vs{' '}
                  {currentResult.chance}%
                </div>
                {!currentResult.succeeded && (
                  <div className="mt-1 text-xs">
                    Try again (chance reduced by 15%)
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions list */}
          <div className="space-y-3">
            {crisisStore.actions.map((action) => (
              <CrisisActionButton
                key={action.id}
                action={action}
                onSelect={handleActionSelect}
                disabled={showingResult}
              />
            ))}
          </div>

          {/* Give up option */}
          <div className="mt-6 text-center">
            <button
              className="btn btn-ghost btn-sm text-base-content/50"
              onClick={handleGiveUp}
              disabled={showingResult}
            >
              I can't do this...
            </button>
          </div>

          {/* Instructions */}
          <div className="text-base-content/50 mt-4 text-center text-xs">
            Call emergency services to save Mother. Other actions give hope
            bonus.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

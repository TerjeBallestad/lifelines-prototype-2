import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { TimeDisplay } from './TimeDisplay';
import { CharacterSprite } from './CharacterSprite';
import { CharacterPanel } from './CharacterPanel';
import { ResourceBar } from './ResourceBar';
import { FloatingNumberPool } from './FloatingNumberPool';
import { LevelUpCelebration } from './LevelUpCelebration';
import { QuestCelebration } from './QuestCelebration';
import { QuestIntroduction } from './QuestIntroduction';
import { QuestPanel } from './QuestPanel';
import { ActivityModal } from './ActivityModal';
import { CrisisModal } from './CrisisModal';
import { CrisisEpilogue } from './CrisisEpilogue';

/**
 * Activity location markers for visual hints in the game world
 * Subtle emojis at low opacity to indicate where activities happen
 */
const LOCATION_MARKERS = [
  { x: 100, y: 150, icon: '📖', title: 'Desk' },
  { x: 200, y: 100, icon: '🪟', title: 'Window' },
  { x: 300, y: 200, icon: '🍳', title: 'Kitchen' },
  { x: 200, y: 180, icon: '📺', title: 'Living' },
  { x: 180, y: 220, icon: '😌', title: 'Rest' },
] as const;

/**
 * Main Game component that runs the game loop and renders game UI
 *
 * - Integrates useGameLoop hook for fixed-timestep updates
 * - Connects to RootStore.tick() for state advancement
 * - Renders spatial game world where characters move to activity locations
 * - TimeDisplay at top, spatial world in middle, CharacterPanel at bottom
 */
export const Game = observer(function Game() {
  const store = useGameStore();
  const { timeStore, characterStore, interactionStore } = store;
  const [debugOpen, setDebugOpen] = useState(false);

  // Memoize tick handler to prevent useGameLoop effect from re-running
  const handleTick = useCallback(
    (deltaMs: number) => {
      store.tick(deltaMs);
    },
    [store]
  );

  // Run game loop when not paused
  useGameLoop(handleTick, {
    paused: timeStore.isPaused,
    targetFps: 60,
  });

  // Detect quest completion and trigger celebration
  useEffect(() => {
    if (store.questStore.isQuestComplete) {
      store.questStore.completeCurrentQuest();
    }
  }, [store.questStore.isQuestComplete, store]);

  // Crisis detection - warning phase
  useEffect(() => {
    if (store.crisisStore.shouldStartWarning) {
      store.crisisStore.startWarning();
    }
  }, [store.crisisStore.shouldStartWarning, store]);

  // Crisis detection - active phase (Mother collapses)
  useEffect(() => {
    if (store.crisisStore.shouldTrigger) {
      store.crisisStore.triggerCrisis();
    }
  }, [store.crisisStore.shouldTrigger, store]);

  return (
    <div className="bg-base-100 min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header with time display */}
        <header className="mb-6">
          <h1 className="mb-4 text-2xl font-bold">Before the Fall</h1>
          <TimeDisplay />
          <div className="mt-4">
            <ResourceBar />
          </div>
        </header>

        {/* Main game area with sidebar */}
        <div className="mb-6 flex gap-4">
          {/* Left sidebar - Character panels */}
          <aside className="w-56 flex-shrink-0 space-y-3">
            {characterStore.allCharacters.map((character) => (
              <CharacterPanel
                key={character.id}
                character={character}
                onClick={() => interactionStore.openActivityModal(character.id)}
              />
            ))}
          </aside>

          {/* Spatial game world - apartment view */}
          <main className="card bg-base-200 flex-1 shadow-xl">
            <div className="card-body">
              <h3 className="text-base-content/70 mb-4 text-sm font-medium">
                Apartment
              </h3>

              {/* Spatial game world - relative container for absolute positioned children */}
              <div className="bg-base-300 relative h-80 w-full overflow-hidden rounded-lg">
                {/* Activity location markers (subtle background hints) */}
                {LOCATION_MARKERS.map((marker) => (
                  <div
                    key={marker.title}
                    className="pointer-events-none absolute min-h-5 min-w-5 text-xl opacity-20 select-none"
                    style={{ left: marker.x - 10, top: marker.y - 10 }}
                    title={marker.title}
                  >
                    {marker.icon}
                  </div>
                ))}

                {/* Characters with absolute positioning via CharacterSprite */}
                {characterStore.allCharacters.map((character) => (
                  <CharacterSprite
                    key={character.id}
                    character={character}
                    isSelected={
                      interactionStore.selectedCharacterId === character.id
                    }
                    onClick={() =>
                      interactionStore.openActivityModal(character.id)
                    }
                  />
                ))}

                {/* Floating numbers overlay */}
                <FloatingNumberPool />
              </div>
            </div>
          </main>
        </div>

        {/* Debug panel for testing - collapsible by default */}
        <div className="card bg-base-200 mt-6 shadow-xl">
          <div className="card-body py-3">
            <button
              className="flex w-full cursor-pointer items-center justify-between"
              onClick={() => setDebugOpen(!debugOpen)}
            >
              <h3 className="text-base-content/70 text-sm font-medium">
                Debug Controls
              </h3>
              {debugOpen ? (
                <ChevronUp className="text-base-content/50 h-4 w-4" />
              ) : (
                <ChevronDown className="text-base-content/50 h-4 w-4" />
              )}
            </button>
            <AnimatePresence>
              {debugOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-4">
                    {characterStore.allCharacters.map((character) => (
                      <div
                        key={character.id}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm font-medium">
                          {character.name}:
                        </span>
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => character.drainNeeds()}
                        >
                          Drain Needs
                        </button>
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => character.restoreNeeds()}
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-base-content/50 mt-2 text-xs">
                    Use "Drain Needs" to test low overskudd comfort behaviors
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Level up celebration overlay */}
      <LevelUpCelebration />

      {/* Quest completion celebration */}
      <QuestCelebration />

      {/* Quest introduction popup */}
      <QuestIntroduction />

      {/* Activity assignment modal */}
      <ActivityModal />

      {/* Quest panel (right side) */}
      <QuestPanel />

      {/* Crisis modal */}
      <CrisisModal />

      {/* Crisis epilogue (ending screen) */}
      <CrisisEpilogue />
    </div>
  );
});

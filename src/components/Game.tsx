import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { TimeDisplay } from './TimeDisplay';

/**
 * Main Game component that runs the game loop and renders game UI
 *
 * - Integrates useGameLoop hook for fixed-timestep updates
 * - Connects to RootStore.tick() for state advancement
 * - Renders TimeDisplay and game world area
 */
export const Game = observer(function Game() {
  const store = useGameStore();
  const { timeStore } = store;

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

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with time display */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Before the Fall</h1>
          <TimeDisplay />
        </header>

        {/* Game world area - placeholder for future content */}
        <main className="card bg-base-200 shadow-xl">
          <div className="card-body min-h-96 flex items-center justify-center">
            <p className="text-base-content/50 text-lg">Game World Area</p>
          </div>
        </main>
      </div>
    </div>
  );
});

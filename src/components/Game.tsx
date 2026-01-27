import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { TimeDisplay } from './TimeDisplay';
import { CharacterSprite } from './CharacterSprite';
import { CharacterPanel } from './CharacterPanel';

/**
 * Main Game component that runs the game loop and renders game UI
 *
 * - Integrates useGameLoop hook for fixed-timestep updates
 * - Connects to RootStore.tick() for state advancement
 * - Renders TimeDisplay and game world area
 */
export const Game = observer(function Game() {
  const store = useGameStore();
  const { timeStore, characterStore, interactionStore } = store;

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

        {/* Game world area with characters */}
        <main className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body min-h-64">
            <h3 className="text-sm font-medium text-base-content/70 mb-4">Game World</h3>
            <div className="relative flex gap-8 justify-center items-start py-4">
              {characterStore.allCharacters.map((character) => (
                <CharacterSprite
                  key={character.id}
                  character={character}
                  isSelected={interactionStore.selectedCharacterId === character.id}
                  onClick={() => interactionStore.selectCharacter(character.id)}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Character info panel */}
        <CharacterPanel />
      </div>
    </div>
  );
});

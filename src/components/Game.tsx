import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { TimeDisplay } from './TimeDisplay';
import { CharacterSprite } from './CharacterSprite';
import { CharacterPanel } from './CharacterPanel';

/**
 * Activity location markers for visual hints in the game world
 * Subtle emojis at low opacity to indicate where activities happen
 */
const LOCATION_MARKERS = [
  { x: 100, y: 150, icon: '~', title: 'Desk' },
  { x: 200, y: 100, icon: '~', title: 'Window' },
  { x: 300, y: 200, icon: '~', title: 'Kitchen' },
  { x: 200, y: 180, icon: '~', title: 'Living' },
  { x: 180, y: 220, icon: '~', title: 'Rest' },
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

        {/* Spatial game world - apartment view */}
        <main className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="text-sm font-medium text-base-content/70 mb-4">Apartment</h3>

            {/* Spatial game world - relative container for absolute positioned children */}
            <div className="relative h-80 w-full bg-base-300 rounded-lg overflow-hidden">
              {/* Activity location markers (subtle background hints) */}
              {LOCATION_MARKERS.map((marker) => (
                <div
                  key={marker.title}
                  className="absolute text-xl opacity-20 select-none pointer-events-none"
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

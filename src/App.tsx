import { observer } from 'mobx-react-lite';
import { rootStore, RootStoreProvider, useGameStore } from './stores/RootStore';
import { MTG_COLORS } from './data/colors';

// Log store state for verification
console.log('RootStore initialized');
console.log('TimeStore:', {
  day: rootStore.timeStore.day,
  hour: rootStore.timeStore.hour,
  minute: rootStore.timeStore.minute,
  isPaused: rootStore.timeStore.isPaused,
  timeOfDay: rootStore.timeStore.timeOfDay,
  formattedTime: rootStore.timeStore.formattedTime,
});
console.log('CharacterStore - Characters:');
for (const char of rootStore.characterStore.allCharacters) {
  console.log(`  ${char.name}:`, {
    colors: char.colors,
    needs: char.needs,
    overskudd: char.overskudd,
  });
}
console.log('MTG Colors:', MTG_COLORS);

const GameContent = observer(function GameContent() {
  const { timeStore, characterStore } = useGameStore();

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl max-w-md w-full">
        <div className="card-body">
          <h1 className="card-title text-3xl">Before the Fall</h1>
          <p className="text-base-content/70">A life simulation game about two people in a small apartment.</p>

          <div className="divider">Time</div>
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Day {timeStore.day}</div>
              <div className="stat-value">{timeStore.formattedTime}</div>
              <div className="stat-desc capitalize">{timeStore.timeOfDay}</div>
            </div>
          </div>

          <div className="divider">Characters</div>
          <div className="space-y-4">
            {characterStore.allCharacters.map((char) => (
              <div key={char.id} className="card bg-base-300">
                <div className="card-body p-4">
                  <h3 className="font-bold">{char.name}</h3>
                  <div className="text-sm">
                    <span className={`badge ${MTG_COLORS[char.colors.primary.color].bg} ${MTG_COLORS[char.colors.primary.color].text} mr-1`}>
                      {MTG_COLORS[char.colors.primary.color].label} {char.colors.primary.intensity.toFixed(1)}
                    </span>
                    {char.colors.secondary && (
                      <span className={`badge ${MTG_COLORS[char.colors.secondary.color].bg} ${MTG_COLORS[char.colors.secondary.color].text}`}>
                        {MTG_COLORS[char.colors.secondary.color].label} {char.colors.secondary.intensity.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-base-content/70 mt-2">
                    Overskudd: {char.overskudd.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

function App() {
  return (
    <RootStoreProvider value={rootStore}>
      <GameContent />
    </RootStoreProvider>
  );
}

export default App;

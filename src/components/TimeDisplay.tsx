import { observer } from 'mobx-react-lite';
import { Play, Pause } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';

/**
 * TimeDisplay component shows day counter, clock, and pause/play controls
 *
 * Uses MobX observer for reactive updates as time advances.
 * Styled with DaisyUI stats component.
 */
export const TimeDisplay = observer(function TimeDisplay() {
  const { timeStore } = useGameStore();

  return (
    <div className="flex items-center gap-4">
      <div className="stats bg-base-200 shadow">
        <div className="stat w-24 px-4 py-2">
          <div className="stat-title text-xs">Day</div>
          <div className="stat-value text-lg">{timeStore.day} of 10</div>
        </div>

        <div className="stat w-24 px-4 py-2">
          <div className="stat-title text-xs">Time</div>
          <div className="stat-value text-lg">{timeStore.formattedTime}</div>
          <div className="stat-desc capitalize">{timeStore.timeOfDay}</div>
        </div>
      </div>

      <button
        className="btn btn-circle btn-primary"
        onClick={timeStore.togglePause}
        aria-label={timeStore.isPaused ? 'Resume game' : 'Pause game'}
      >
        {timeStore.isPaused ? (
          <Play className="h-5 w-5" />
        ) : (
          <Pause className="h-5 w-5" />
        )}
      </button>
    </div>
  );
});

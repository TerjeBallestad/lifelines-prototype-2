import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import type { ResourceType } from '../types/game';
import { useState, useEffect, useRef } from 'react';

// Resource display configuration
const RESOURCE_CONFIG: Record<
  ResourceType,
  { icon: string; label: string; color: string }
> = {
  creativity: { icon: '\u2728', label: 'Creativity', color: 'text-purple-400' },
  food: { icon: '\uD83C\uDF72', label: 'Food', color: 'text-orange-400' },
  cleanliness: { icon: '\uD83E\uDDFC', label: 'Clean', color: 'text-cyan-400' },
  comfort: {
    icon: '\uD83D\uDECB\uFE0F',
    label: 'Comfort',
    color: 'text-green-400',
  },
  connection: {
    icon: '\uD83D\uDCAC',
    label: 'Connection',
    color: 'text-pink-400',
  },
  progress: {
    icon: '\uD83D\uDCC8',
    label: 'Progress',
    color: 'text-yellow-400',
  },
};

interface ResourceCounterProps {
  type: ResourceType;
  value: number;
}

const ResourceCounter = observer(function ResourceCounter({
  type,
  value,
}: ResourceCounterProps) {
  const config = RESOURCE_CONFIG[type];
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValueRef = useRef(value);

  // Trigger pulse animation when value increases
  useEffect(() => {
    if (value > prevValueRef.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value]);

  return (
    <div
      className={`bg-base-300 flex items-center gap-1 rounded px-2 py-1 ${isPulsing ? 'resource-pulse' : ''}`}
    >
      <span className="text-lg">{config.icon}</span>
      <span className={`font-pixel text-xs ${config.color}`}>{value}</span>
    </div>
  );
});

/**
 * Resource bar showing all global resource counts
 * Displays at top of game screen
 */
export const ResourceBar = observer(function ResourceBar() {
  const { resourceStore } = useGameStore();

  const resourceTypes: ResourceType[] = [
    'creativity',
    'food',
    'cleanliness',
    'comfort',
    'connection',
    'progress',
  ];

  return (
    <div className="bg-base-200 flex flex-wrap gap-2 rounded-lg p-2">
      {resourceTypes.map((type) => (
        <ResourceCounter
          key={type}
          type={type}
          value={resourceStore.getResource(type)}
        />
      ))}
    </div>
  );
});

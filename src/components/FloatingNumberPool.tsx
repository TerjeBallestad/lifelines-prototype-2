import { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { FloatingNumber } from './FloatingNumber';
import { useGameStore } from '../stores/RootStore';
import type { ResourceType } from '../types/game';

interface FloatingNumberData {
  id: string;
  value: number;
  x: number;
  y: number;
  critical: boolean;
  resource: ResourceType;
}

/**
 * Manages a pool of floating numbers to prevent DOM accumulation
 * Watches character lastActivityResult and spawns numbers accordingly
 */
export const FloatingNumberPool = observer(function FloatingNumberPool() {
  const { characterStore } = useGameStore();
  const [numbers, setNumbers] = useState<FloatingNumberData[]>([]);

  const spawnNumber = useCallback((
    value: number,
    x: number,
    y: number,
    resource: ResourceType,
    critical: boolean = false
  ) => {
    const id = crypto.randomUUID();
    setNumbers(prev => [...prev, { id, value, x, y, resource, critical }]);
  }, []);

  const removeNumber = useCallback((id: string) => {
    setNumbers(prev => prev.filter(n => n.id !== id));
  }, []);

  // Watch all characters for activity completion
  useEffect(() => {
    const disposers = characterStore.allCharacters.map(character =>
      reaction(
        () => character.lastActivityResult,
        (result) => {
          if (!result) return;

          // Spawn floating numbers for each output
          result.outputs.forEach((output, index) => {
            // Stagger slightly for multiple outputs
            setTimeout(() => {
              spawnNumber(
                output.amount,
                character.position.x + 20,
                character.position.y - 20 - (index * 25),
                output.resource,
                result.critical
              );
            }, index * 100);
          });

          // Clear the result after spawning numbers
          setTimeout(() => character.clearLastActivityResult(), 200);
        }
      )
    );

    return () => disposers.forEach(d => d());
  }, [characterStore.allCharacters, spawnNumber]);

  return (
    <>
      {numbers.map(num => (
        <FloatingNumber
          key={num.id}
          value={num.value}
          x={num.x}
          y={num.y}
          critical={num.critical}
          onComplete={() => removeNumber(num.id)}
        />
      ))}
    </>
  );
});

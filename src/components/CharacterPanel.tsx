import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'motion/react';
import { useGameStore } from '../stores/RootStore';
import { ColorBadge } from './ColorBadge';
import { OverskuddMeter } from './OverskuddMeter';
import { SkillProgress } from './SkillProgress';
import type { SkillCategory } from '../types/game';

/**
 * CharacterPanel displays full character information when selected
 *
 * Shows MTG colors, overskudd meter, individual needs, and current activity.
 * Uses AnimatePresence for enter/exit animations.
 * CRITICAL: Uses observer() for MobX reactivity.
 */
export const CharacterPanel = observer(function CharacterPanel() {
  const { interactionStore, skillStore } = useGameStore();
  const character = interactionStore.selectedCharacter;

  return (
    <AnimatePresence>
      {character && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            {/* Header with name and close button */}
            <div className="flex justify-between items-start">
              <h2 className="card-title text-xl">{character.name}</h2>
              <button
                onClick={() => interactionStore.clearSelection()}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close panel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* MTG Colors */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-base-content/70">Colors:</span>
              <ColorBadge
                color={character.colors.primary.color}
                intensity={character.colors.primary.intensity}
              />
              {character.colors.secondary && (
                <ColorBadge
                  color={character.colors.secondary.color}
                  intensity={character.colors.secondary.intensity}
                />
              )}
            </div>

            {/* Overskudd Meter */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Overskudd</label>
              <OverskuddMeter value={character.overskudd} />
            </div>

            {/* Individual Needs */}
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Needs</label>

              {/* Energy */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-base-content/70">Energy</span>
                <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-info rounded-full transition-all duration-300"
                    style={{ width: `${character.needs.energy}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right font-mono">
                  {Math.round(character.needs.energy)}
                </span>
              </div>

              {/* Social */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-base-content/70">Social</span>
                <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${character.needs.social}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right font-mono">
                  {Math.round(character.needs.social)}
                </span>
              </div>

              {/* Purpose */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-base-content/70">Purpose</span>
                <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${character.needs.purpose}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right font-mono">
                  {Math.round(character.needs.purpose)}
                </span>
              </div>
            </div>

            {/* Current Activity */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <span className="text-sm text-base-content/70">Activity: </span>
              <span className="text-sm font-medium">
                {character.currentActivity?.name ?? 'Idle'}
              </span>
            </div>

            {/* Skills Section */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <h4 className="text-sm font-medium text-base-content/70 mb-2">Skills</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['Practical', 'Creative', 'Social', 'Technical'] as const).map(category => {
                  const skill = skillStore.getSkill(character.id, category as SkillCategory);
                  return skill ? (
                    <SkillProgress key={category} skill={skill} compact />
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

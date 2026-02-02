import { observer } from 'mobx-react-lite';
import { motion } from 'motion/react';
import type { CrisisAction } from '../types/game';
import { useGameStore } from '../stores/RootStore';

interface CrisisActionButtonProps {
  action: CrisisAction;
  onSelect: (action: CrisisAction) => void;
  disabled?: boolean;
}

/**
 * Button for a crisis action showing skill level and success chance
 * Displays retry count if action has been attempted before
 */
export const CrisisActionButton = observer(function CrisisActionButton({
  action,
  onSelect,
  disabled = false,
}: CrisisActionButtonProps) {
  const { crisisStore, skillStore } = useGameStore();

  const skill = skillStore.getSkill('elling', action.skillCategory);
  const skillLevel = skill?.level ?? 1;
  const successChance = crisisStore.getActionSuccessChance(action.id);
  const attempts = crisisStore.actionAttempts.get(action.id) ?? 0;

  // Color-code success chance
  const chanceColor =
    successChance >= 60
      ? 'text-success'
      : successChance >= 40
        ? 'text-warning'
        : 'text-error';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`flex h-auto min-h-[4rem] w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
        disabled
          ? 'border-base-300 cursor-not-allowed opacity-50'
          : 'border-error/50 hover:border-error hover:bg-error/10 cursor-pointer'
      }`}
      onClick={() => !disabled && onSelect(action)}
      disabled={disabled}
    >
      {/* Icon */}
      <span className="shrink-0 text-2xl">{action.icon}</span>

      {/* Action info */}
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{action.name}</div>
        <div className="truncate text-xs opacity-70">{action.description}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
          <span className="badge badge-xs badge-ghost">
            {action.skillCategory} Lv.{skillLevel}
          </span>
          {attempts > 0 && (
            <span className="badge badge-xs badge-warning">#{attempts}</span>
          )}
          {action.givesHopeBonus && (
            <span className="badge badge-xs badge-info">+Hope</span>
          )}
        </div>
      </div>

      {/* Success chance */}
      <div className="shrink-0 text-right">
        <div className={`text-xl font-bold ${chanceColor}`}>
          {successChance}%
        </div>
      </div>
    </motion.button>
  );
});

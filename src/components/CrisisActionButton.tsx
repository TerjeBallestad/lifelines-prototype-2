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
      className={`btn btn-lg w-full justify-start gap-4 ${
        disabled ? 'btn-disabled opacity-50' : 'btn-outline btn-error'
      }`}
      onClick={() => !disabled && onSelect(action)}
      disabled={disabled}
    >
      {/* Icon */}
      <span className="text-3xl">{action.icon}</span>

      {/* Action info */}
      <div className="flex-1 text-left">
        <div className="font-bold">{action.name}</div>
        <div className="text-sm opacity-70">{action.description}</div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="badge badge-sm badge-ghost">
            {action.skillCategory} Lv.{skillLevel}
          </span>
          {attempts > 0 && (
            <span className="badge badge-sm badge-warning">
              Retry #{attempts}
            </span>
          )}
          {action.givesHopeBonus && (
            <span className="badge badge-sm badge-info">+Hope</span>
          )}
        </div>
      </div>

      {/* Success chance */}
      <div className="text-right">
        <div className={`text-2xl font-bold ${chanceColor}`}>
          {successChance}%
        </div>
        <div className="text-xs opacity-60">success</div>
      </div>
    </motion.button>
  );
});

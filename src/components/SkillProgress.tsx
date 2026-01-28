import { observer } from 'mobx-react-lite';
import { motion, useSpring, useTransform } from 'motion/react';
import type { CharacterSkill } from '../stores/SkillStore';
import type { SkillCategory } from '../types/game';

// Skill category icons
const SKILL_ICONS: Record<SkillCategory, string> = {
  Practical: '🔧',
  Creative: '🎨',
  Social: '💬',
  Technical: '⚙️',
};

interface SkillProgressProps {
  skill: CharacterSkill;
  compact?: boolean;
}

/**
 * Displays skill level and XP progress bar
 * Uses spring animation for smooth progress bar updates
 */
export const SkillProgress = observer(function SkillProgress({
  skill,
  compact = false,
}: SkillProgressProps) {
  const springProgress = useSpring(skill.levelProgress, {
    stiffness: 100,
    damping: 20,
  });
  const widthPercent = useTransform(springProgress, v => `${v * 100}%`);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span>{SKILL_ICONS[skill.category]}</span>
        <span className="text-xs font-medium">Lv.{skill.level}</span>
        <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: widthPercent }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SKILL_ICONS[skill.category]}</span>
          <span className="font-medium">{skill.category}</span>
        </div>
        <div className="text-right">
          <span className="font-bold text-lg">Lv.{skill.level}</span>
          {skill.level < 5 && (
            <span className="text-xs opacity-70 ml-2">
              {Math.floor(skill.xp)} XP
            </span>
          )}
        </div>
      </div>

      {/* XP Progress bar */}
      {skill.level < 5 && (
        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: widthPercent }}
          />
        </div>
      )}

      {skill.level >= 5 && (
        <div className="text-center text-xs text-success font-medium">
          MASTERED
        </div>
      )}
    </div>
  );
});

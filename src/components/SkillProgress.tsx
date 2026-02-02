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
  const widthPercent = useTransform(springProgress, (v) => `${v * 100}%`);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span>{SKILL_ICONS[skill.category]}</span>
        <span className="text-xs font-medium">Lv.{skill.level}</span>
        <div className="bg-base-300 h-1.5 flex-1 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full"
            style={{ width: widthPercent }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-lg p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SKILL_ICONS[skill.category]}</span>
          <span className="font-medium">{skill.category}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold">Lv.{skill.level}</span>
          {skill.level < 5 && (
            <span className="ml-2 text-xs opacity-70">
              {Math.floor(skill.xp)} XP
            </span>
          )}
        </div>
      </div>

      {/* XP Progress bar */}
      {skill.level < 5 && (
        <div className="bg-base-300 h-2 overflow-hidden rounded-full">
          <motion.div
            className="from-primary to-secondary h-full bg-gradient-to-r"
            style={{ width: widthPercent }}
          />
        </div>
      )}

      {skill.level >= 5 && (
        <div className="text-success text-center text-xs font-medium">
          MASTERED
        </div>
      )}
    </div>
  );
});

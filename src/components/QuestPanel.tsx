import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Target, CheckCircle } from 'lucide-react';
import { useGameStore } from '../stores/RootStore';
import { QuestProgress } from './QuestProgress';

/**
 * Collapsible quest panel on right side of screen
 *
 * Collapsed: icon + mini progress bar + percentage
 * Expanded: full quest title, description, and detailed progress
 */
export const QuestPanel = observer(function QuestPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { questStore, resourceStore, skillStore } = useGameStore();

  const quest = questStore.currentQuest;
  const progress = questStore.currentQuestProgress;

  // Calculate current/target values for display
  const getProgressValues = (): { current: number; target: number } | null => {
    if (!quest) return null;

    switch (quest.type) {
      case 'resource':
        if (!quest.resourceType || !quest.targetAmount) return null;
        return {
          current: Math.floor(resourceStore.getResource(quest.resourceType)),
          target: quest.targetAmount,
        };
      case 'skill':
        if (!quest.characterId || !quest.skillCategory || !quest.targetLevel)
          return null;
        const skill = skillStore.getSkill(
          quest.characterId,
          quest.skillCategory
        );
        if (!skill) return null;
        return {
          current: skill.level,
          target: quest.targetLevel,
        };
      case 'composite':
        // For composite, just show percentage
        return null;
      default:
        return null;
    }
  };

  const progressValues = getProgressValues();

  // All quests complete state
  if (questStore.allQuestsComplete) {
    return (
      <div className="fixed top-1/2 right-4 z-40 -translate-y-1/2">
        <div className="bg-base-200 rounded-lg p-3 shadow-lg">
          <div className="text-success flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">All quests complete!</span>
          </div>
        </div>
      </div>
    );
  }

  // No active quest
  if (!quest) return null;

  return (
    <div className="fixed top-1/2 right-4 z-40 -translate-y-1/2">
      <motion.div
        animate={{ width: isExpanded ? 288 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-base-200 overflow-hidden rounded-lg shadow-lg"
      >
        {isExpanded ? (
          // Expanded view
          <div className="p-4" style={{ width: 288 }}>
            {/* Header with collapse button */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                <span className="text-base-content/60 text-xs tracking-wide uppercase">
                  Quest {questStore.currentQuestIndex + 1}/
                  {questStore.totalQuests}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="btn btn-circle btn-ghost btn-xs"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quest title and description */}
            <h3 className="mb-1 text-lg font-bold">{quest.title}</h3>
            <p className="text-base-content/70 mb-4 text-sm">
              {quest.description}
            </p>

            {/* Progress bar */}
            <QuestProgress
              progress={progress}
              current={progressValues?.current}
              target={progressValues?.target}
            />
          </div>
        ) : (
          // Collapsed view
          <div
            className="flex cursor-pointer flex-col items-center gap-2 p-3"
            style={{ width: 64 }}
            onClick={() => setIsExpanded(true)}
          >
            {/* Quest icon */}
            <Target className="text-primary h-6 w-6" />

            {/* Mini progress */}
            <div className="w-full">
              <QuestProgress progress={progress} compact />
            </div>

            {/* Expand hint */}
            <ChevronLeft className="text-base-content/40 h-4 w-4" />
          </div>
        )}
      </motion.div>
    </div>
  );
});

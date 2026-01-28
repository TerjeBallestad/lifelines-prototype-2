import { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import { getRegularActivities } from '../data/activities';
import { calculateSuccessChance } from '../systems/SkillSystem';
import type { Activity } from '../types/game';

// Attitude face icons
const ATTITUDE_ICONS = {
  eager: '😊',
  neutral: '😐',
  reluctant: '😟',
  refusing: '😣',
} as const;

/**
 * Full-screen modal for assigning activities to characters
 *
 * Shows when player clicks on a character. Displays all available
 * activities with:
 * - Success chance based on skill level vs difficulty
 * - Character attitude toward each activity (eager/neutral/reluctant/refusing)
 * - Resource outputs and skill category
 *
 * Player can force any activity except when character is busy
 * (walking or performing). Forcing reluctant activities shows
 * personality-flavored refusal messages.
 */
export const ActivityModal = observer(function ActivityModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { interactionStore, characterStore, skillStore } = useGameStore();

  const isOpen = interactionStore.activityModalOpen;
  const characterId = interactionStore.assigningCharacterId;
  const character = characterId ? characterStore.getCharacter(characterId) : null;

  // Open/close modal based on state
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  // Handle dialog close (ESC key or backdrop click)
  const handleClose = () => {
    interactionStore.closeActivityModal();
  };

  // Handle activity selection
  const handleSelectActivity = (activity: Activity) => {
    interactionStore.forceAssignActivity(activity.id);
  };

  if (!character) return null;

  const activities = getRegularActivities();

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={handleClose}
    >
      <div className="modal-box max-w-2xl">
        <h3 className="text-lg font-bold mb-4">
          Assign Activity to {character.name}
        </h3>

        {/* Character status summary */}
        <div className="mb-4 p-3 bg-base-200 rounded-lg">
          <div className="flex gap-4 text-sm">
            <span>Overskudd: <strong>{Math.round(character.overskudd)}</strong></span>
            <span>State: <strong>{character.state}</strong></span>
          </div>
        </div>

        {/* Activity list */}
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {activities.map(activity => {
            const attitude = character.getAttitudeToward(activity);
            const skillLevel = activity.skillCategory
              ? (skillStore.getSkill(character.id, activity.skillCategory)?.level ?? 1)
              : 1;
            const successChance = calculateSuccessChance(
              skillLevel,
              activity.difficulty ?? 1
            );

            const isDisabled = attitude === 'refusing' && (
              character.state === 'walking' || character.state === 'performing'
            );

            return (
              <button
                key={activity.id}
                className={`btn btn-outline justify-start h-auto py-3 ${
                  attitude === 'eager' ? 'btn-success' :
                  attitude === 'reluctant' ? 'btn-warning' :
                  attitude === 'refusing' ? 'btn-error' : ''
                }`}
                onClick={() => handleSelectActivity(activity)}
                disabled={isDisabled}
              >
                <div className="flex items-center w-full gap-3">
                  {/* Activity icon */}
                  <span className="text-2xl">{activity.icon}</span>

                  {/* Activity info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-xs opacity-70">
                      {activity.skillCategory && (
                        <span className="mr-2">
                          {activity.skillCategory} (Lv.{skillLevel})
                        </span>
                      )}
                      {activity.outputs?.map(o => (
                        <span key={o.resource} className="mr-2">
                          +{o.baseAmount} {o.resource}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Success chance */}
                  <div className="text-right">
                    <div className="text-sm font-medium">{successChance}%</div>
                    <div className="text-xs opacity-70">success</div>
                  </div>

                  {/* Attitude face */}
                  <div className="text-2xl" title={attitude}>
                    {ATTITUDE_ICONS[attitude]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Warning if character is reluctant/refusing */}
        {character.overskudd < 40 && (
          <div className="alert alert-warning mt-4">
            <span>
              {character.name} is low on energy. Forcing activities may cause frustration.
            </span>
          </div>
        )}

        {/* Modal actions */}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleClose}>Cancel</button>
          </form>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
});

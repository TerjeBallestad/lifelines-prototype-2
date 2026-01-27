import { observer } from 'mobx-react-lite';
import type { Character } from '../stores/CharacterStore';
import clsx from 'clsx';

interface CharacterSpriteProps {
  character: Character;
  onClick: () => void;
  isSelected?: boolean;
}

/**
 * CharacterSprite is a clickable representation of a character in the game world
 *
 * Displays character name and a small overskudd indicator.
 * Uses observer() for reactive updates when character state changes.
 */
export const CharacterSprite = observer(function CharacterSprite({
  character,
  onClick,
  isSelected = false,
}: CharacterSpriteProps) {
  const overskudd = character.overskudd;

  // Determine overskudd indicator color
  const getIndicatorColor = (): string => {
    if (overskudd < 33) return 'bg-error';
    if (overskudd < 66) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'card bg-base-100 min-w-24 cursor-pointer p-3 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg',
        { 'ring-primary ring-offset-base-200 ring-2 ring-offset-2': isSelected }
      )}
    >
      {/* Character avatar placeholder */}
      <div className="avatar placeholder mb-2">
        <div className="bg-neutral text-neutral-content flex w-12 items-center justify-center rounded-full">
          <span className="text-lg">{character.name.charAt(0)}</span>
        </div>
      </div>

      {/* Character name */}
      <p className="text-center text-sm font-medium">{character.name}</p>

      {/* Overskudd indicator */}
      <div className="mt-1 flex items-center justify-center gap-1">
        <div className={`h-2 w-2 rounded-full ${getIndicatorColor()}`} />
        <span className="text-base-content/70 text-xs">
          {Math.round(overskudd)}%
        </span>
      </div>
    </button>
  );
});

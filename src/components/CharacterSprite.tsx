import { observer } from 'mobx-react-lite';
import type { Character } from '../stores/CharacterStore';

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
      className={`
        card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200
        cursor-pointer p-3 min-w-24
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''}
        hover:scale-105
      `}
    >
      {/* Character avatar placeholder */}
      <div className="avatar placeholder mb-2">
        <div className="bg-neutral text-neutral-content rounded-full w-12">
          <span className="text-lg">{character.name.charAt(0)}</span>
        </div>
      </div>

      {/* Character name */}
      <p className="font-medium text-sm text-center">{character.name}</p>

      {/* Overskudd indicator */}
      <div className="flex items-center justify-center gap-1 mt-1">
        <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
        <span className="text-xs text-base-content/70">{Math.round(overskudd)}%</span>
      </div>
    </button>
  );
});

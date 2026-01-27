import type { MTGColor } from '../types/game';
import { MTG_COLORS } from '../data/colors';

interface ColorBadgeProps {
  color: MTGColor;
  intensity: number;
}

/**
 * ColorBadge displays an MTG color with its intensity as a badge
 *
 * Shows the color letter (W/U/B/R/G) and intensity value (e.g., "U 1.0")
 * Uses appropriate background/text colors from MTG_COLORS
 */
export function ColorBadge({ color, intensity }: ColorBadgeProps) {
  const config = MTG_COLORS[color];

  return (
    <span
      className={`badge ${config.bg} ${config.text} px-2 py-1 font-mono text-sm`}
    >
      {config.label} {intensity.toFixed(1)}
    </span>
  );
}

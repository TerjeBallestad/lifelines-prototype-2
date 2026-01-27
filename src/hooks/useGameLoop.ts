import { useEffect, useRef } from 'react';

/**
 * Fixed-timestep game loop hook using requestAnimationFrame
 *
 * Implements accumulator pattern for deterministic simulation:
 * - Accumulates real time between frames
 * - Calls onTick with fixed intervals
 * - maxFrameTime prevents "spiral of death" after tab unfocus
 *
 * @param onTick - Callback called with fixed deltaMs (1000/targetFps)
 * @param options - Configuration options
 */
export function useGameLoop(
  onTick: (deltaMs: number) => void,
  options: {
    targetFps?: number;
    paused?: boolean;
    maxFrameTime?: number;
  } = {}
) {
  const { targetFps = 60, paused = false, maxFrameTime = 250 } = options;
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const tickInterval = 1000 / targetFps;

  useEffect(() => {
    if (paused) return;

    let animationId: number;

    const loop = (currentTime: number) => {
      // Clamp deltaMs to prevent spiral of death (e.g., after tab unfocus)
      const deltaMs = Math.min(currentTime - lastTimeRef.current, maxFrameTime);
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaMs;

      // Process fixed timesteps
      while (accumulatorRef.current >= tickInterval) {
        onTick(tickInterval);
        accumulatorRef.current -= tickInterval;
      }

      animationId = requestAnimationFrame(loop);
    };

    // Initialize timing
    lastTimeRef.current = performance.now();
    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [onTick, targetFps, paused, maxFrameTime, tickInterval]);
}

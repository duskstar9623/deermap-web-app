/**
 * Deterministic pseudo-random number generator based on sine hashing.
 * Returns a value in [0, 1) for any given seed.
 */
export function seededRandom(s: number): number {
  const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

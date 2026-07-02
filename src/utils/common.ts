/**
 * Deterministic pseudo-random number generator based on sine hashing.
 * @param s The seed value.
 * @returns A pseudo-random number between 0 and 1.
 */
export function seededRandom(s: number): number {
  const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Checks if a value is neither null nor undefined.
 * @param value The value to check.
 * @returns True if the value is valid, false otherwise.
 */
export function isValidValue(value: unknown): boolean {
  return value !== null && value !== undefined;
}

/**
 * Checks if the code is running in a browser environment.
 * @returns True if running in a browser, false otherwise.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

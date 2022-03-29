/** set index to value */
const decor = (v: number, i: number) => [v, i];
/** leave only index */
const undecor = (a: number[]) => a[1];

export const argsort = (arr: number[]) => arr.map(decor).sort().map(undecor);

/**
 * Returns an array of size 'size' filled with ascending numbers from starting with 'startAt'
 *
 * @param size the size of the generated array
 * @param startAt the starting index
 * @returns array filled with ascending numbers
 */
export function range(size: number, startAt: number = 0): number[] {
  const r = [...Array(size).keys()];
  if (startAt) return r.map((i) => i + startAt);
  return r;
}

/**
 * Checks if the absolute diff between a and b is smaller than maxDiff
 *
 * @param a first value
 * @param b second value
 * @param maxDiff maximum Difference (inclusive). Defaults to 1e-5
 */
export function close(a: number, b: number, maxDiff = 1e-5): boolean {
  return Math.abs(a - b) <= maxDiff;
}

/**
 * Checks if every value in array a is close to the value in array b
 *
 * @param a first array
 * @param b second array
 * @param maxDiff maximum Difference. Defaults to 1e-5
 */
export function allClose(a: number[], b: number[], maxDiff = 1e-5): boolean {
  if (a.length !== b.length) throw new Error("a and b must have the same length");
  for (let index = 0; index < a.length; index++) {
    if (!close(a[index], b[index], maxDiff)) return false;
  }
  return true;
}

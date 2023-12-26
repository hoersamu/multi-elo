import { range } from "./utils";

export const sumReducer = (previousValue: number, currentValue: number) =>
  previousValue + currentValue;

export type ScoreFunction = (n: number) => number[];

/**
 * With the linear score function the "points" awarded scale linearly from first place
 * through last place. For example, improving from 2nd to 1st place has the same sized
 * benefit as improving from 5th to 4th place.
 *
 * @param n number of players
 * @returns array of the points to assign to each place (summing to 1)
 */
const linearScoreFunction = (n: number): number[] => {
  return range(n, 1).map((p) => (n - p) / ((n * (n - 1)) / 2));
};

/**
 * With an exponential score function with base > 1, more points are awarded to the top
 * finishers and the point distribution is flatter at the bottom. For example, improving
 * from 2nd to 1st place is more valuable than improving from 5th place to 4th place. A
 * larger base value means the scores will be more weighted towards the top finishers.
 *
 * @param n number of players
 * @param base base for the exponential score function (> 1)
 * @returns array of the points to assign to each place (summing to 1)
 */
const exponentialScoreFunction = (n: number, base: number): number[] => {
  if (base < 1) {
    throw new Error("Base must be >= 1");
  }

  const out: number[] = range(n, 1).map((p) => Math.pow(base, n - p) - 1);
  // eslint-disable-next-line unicorn/no-array-reduce
  const sum = out.reduce((accumulator, element) =>
    sumReducer(accumulator, element),
  );

  return out.map((p) => p / sum);
};

export const createExponentialScoreFuntion = (base: number): ScoreFunction => {
  return base === 1
    ? linearScoreFunction
    : (n: number) => exponentialScoreFunction(n, base);
};

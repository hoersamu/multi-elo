import { createExponentialScoreFuntion, ScoreFunction, sumReducer } from "./score-functions";
import { argsort, close, range } from "./utils";

export type MultiEloConfig = {
  logBase?: number;
  d?: number;
  k?: number;
  s?: number;
  verbose?: boolean;
};

export class MultiElo {
  private static instance: MultiElo = null;
  private scoreFunction: ScoreFunction;
  private console: Console | { log: () => void };
  private config: MultiEloConfig = {
    logBase: 10,
    d: 400,
    k: 32,
    s: 1,
    verbose: false,
  };

  constructor(config: MultiEloConfig = {}) {
    Object.assign(this.config, config);
    this.scoreFunction = createExponentialScoreFuntion(this.config.s);
    this.console = this.config.verbose ? console : { log: (): void => null };
  }

  /**
   * Update ratings based on results. Takes an array of ratings before the matchup and returns an array with
   * the updated ratings. Provided array should be ordered by the actual results (first place finisher's
   * initial rating first, second place next, and so on).
   *
   * Example usage:
   * >>> elo.getNewRatings([1200, 1000])
   * [1207.68809835,  992.31190165]
   * >>> elo.getNewRatings([1200, 1000, 1100, 900])
   * [1212.01868209, 1012.15595083, 1087.84404917,  887.98131791]
   *
   * @param initialRatings array of ratings (float values) in order of actual results
   * @param resultOrder array where each value indicates the place the player in the same index of
   *                    initialRatings finished in. Lower is better. Identify ties by entering the same value for players
   *                    that tied. For example, [1, 2, 3] indicates that the first listed player won, the second listed player
   *                    finished 2nd, and the third listed player finished 3rd. [1, 2, 2] would indicate that the second
   *                    and third players tied for 2nd place. Defaults to [1,2,3...]
   * @returns array of updated ratings in same order as input
   */
  getNewRatings(initialRatings: number[], resultOrder?: number[]) {
    const n = initialRatings.length;
    resultOrder = resultOrder || range(n, 1);
    const actualScores = this.getActualScores(n, resultOrder);
    const expectedScores = this.getExpectedScores(initialRatings);
    const scaleFactor = this.config.k * (n - 1);
    this.console.log("scaleFactor: " + scaleFactor);

    return initialRatings.map((m, i) => m + scaleFactor * (actualScores[i] - expectedScores[i]));
  }

  /**
   * Return the score to be awarded to the players based on the results.
   *
   * @param n number of players in the matchup
   * @param resultOrder list indicating order of finish. See getNewRatings docstring for more info
   * @return array of length n of scores to be assigned to firstplace, second place, and so on
   */
  private getActualScores(n: number, resultOrder: number[]): number[] {
    // calculate actual scores according to score function, then sort in order of finish
    resultOrder = resultOrder || range(n, 1);
    let scores = this.scoreFunction(n);
    scores = argsort(argsort(resultOrder)).map((i) => scores[i]);

    // if there are ties, average the scores of all tied players
    const distinctResults = new Set(resultOrder);
    if (distinctResults.size !== n) {
      for (const place of Object.keys(distinctResults)) {
        const idx = resultOrder.reduce((accumulator, value, index) => {
          if (value === +place) accumulator.push(index);
          return accumulator;
        }, []);

        const mean = idx.map((i) => scores[i]).reduce(sumReducer) / idx.length;
        idx.forEach((i) => (scores[i] = mean));
      }
    }

    this.console.log(resultOrder);
    this.console.log("Calculated actual scores: ", scores);
    this.validateActualScores(scores, resultOrder);
    return scores;
  }

  /**
   * Helper function for getActualScores. Runs multiple checks to validate the plausiblity of the new scores
   *
   * @param scores list of all player scores
   * @param resultOrder list indicating order of finish. See getNewRatings docstring for more info
   */
  private validateActualScores(scores: number[], resultOrder: number[]) {
    const scoreSum = scores.reduce(sumReducer);
    if (!close(1, scoreSum)) {
      throw new Error("Scoring function does not return scores summing to 1");
    }

    if (Math.min(...scores) !== 0) {
      // tie for last place means minimum score doesn't have to be zero,
      // so only raise error if there isn't a tie for last
      const lastPlace = Math.max(...resultOrder);
      if (resultOrder.filter((f) => f === lastPlace).length === 1) {
        throw new Error("Scoring function does not return minimum value of 0");
      }
    }

    // TODO: implement check to make sure scores are monotonically decreasing
  }

  /**
   * Get the expected scores for all players given their ratings before the matchup.
   *
   * @param initialRatings array of ratings for each player in a matchup
   * @returns array of expected scores for all players
   */
  getExpectedScores(ratings: number[]): number[] {
    this.console.log("Calculating expected scores for: ", ratings);

    // get all pairwise differences
    const diffMx = ratings.map((m) => ratings.map((mn) => mn - m));
    this.console.log("DiffMx: ", diffMx);

    // get individual contributions to expected score using logistic function
    const logisticMx = diffMx.map((m, i) =>
      m.map((mn, j) => (i === j ? 0 : 1 / (1 + Math.pow(this.config.logBase, mn / this.config.d)))),
    );
    this.console.log("LogisticMx: ", logisticMx);

    const n = ratings.length;
    // number of individual head-to-head matchups between n players
    const denom = (n * (n - 1)) / 2;
    const expectedScores = logisticMx.map((m) => m.reduce(sumReducer) / denom);

    // this should be guaranteed, but check to make sure
    if (!close(1, expectedScores.reduce(sumReducer))) {
      throw new Error("Expected Scores do not sum to 1");
    }

    this.console.log("Calculated expected scores: ", expectedScores);

    return expectedScores;
  }

  static getNewRatings(oldRatings: number[], resultOrder?: number[]) {
    this.getInstance().getNewRatings(oldRatings, resultOrder);
  }

  private static getInstance() {
    if (!this.instance) this.instance = new MultiElo();
    return this.instance;
  }
}

export function getNewRatings(oldRatings: number[], resultOrder?: number[]) {
  return MultiElo.getNewRatings(oldRatings, resultOrder);
}

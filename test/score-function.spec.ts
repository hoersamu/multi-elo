import { describe, it, expect } from "vitest";
import { createExponentialScoreFuntion } from "../src/score-functions";

describe("exponentialScoreFunction", () => {
  it("should throw error", () => {
    const scoreFunction = createExponentialScoreFuntion(0);

    expect(() => scoreFunction(1)).toThrowError("Base must be >= 1");
  });
});

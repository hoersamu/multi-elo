import { expect, it, describe } from "vitest";
import { allClose, close, range } from "../src/utils";

describe("utils", () => {
  describe.each`
    size  | startAt
    ${5}  | ${0}
    ${10} | ${2}
    ${3}  | ${99}
    ${5}  | ${-5}
  `("range", ({ size, startAt }: { size: number; startAt: number }) => {
    it("should return correct ranges", () => {
      const calculatedRange = range(size, startAt);
      expect(calculatedRange.length).toEqual(size);
      for (let i = 0; i < size; i++) {
        expect(calculatedRange[i]).toEqual(startAt + i);
      }
    });
  });

  describe.each`
    a       | b           | maxDiff | expectedResult
    ${1}    | ${1}        | ${0}    | ${true}
    ${1}    | ${2}        | ${0}    | ${false}
    ${1}    | ${1 + 1e-6} | ${1e-5} | ${true}
    ${1000} | ${1016}     | ${1e-5} | ${false}
  `(
    "close",
    ({
      a,
      b,
      maxDiff,
      expectedResult,
    }: {
      a: number;
      b: number;
      maxDiff: number;
      expectedResult: boolean;
    }) => {
      it("should validate max difference correctly", () => {
        expect(close(a, b, maxDiff)).toEqual(expectedResult);
      });
    },
  );

  describe.each`
    a                                                     | b                                                     | maxDiff | expected
    ${[1000, 1000]}                                       | ${[1000, 1000]}                                       | ${1e-5} | ${true}
    ${[1191.688_098_347_265_4, 1008.311_901_652_734_6]}   | ${[1191.688_098_347_265_4, 1008.311_901_652_734_6]}   | ${1e-5} | ${true}
    ${[1207.064_792_84, 989.333_333_33, 803.601_873_83]}  | ${[1207.064_792_84, 989.333_333_33, 803.601_873_83]}  | ${1e-5} | ${true}
    ${[1196.398_126_17, 1010.666_666_67, 792.935_207_16]} | ${[1196.398_126_17, 1010.666_666_67, 792.935_207_16]} | ${1e-5} | ${true}
    ${[1185.731_459_5, 1000, 814.268_540_5]}              | ${[1185.731_459_5, 1000, 814.268_540_5]}              | ${1e-5} | ${true}
    ${[1000, 1000]}                                       | ${[1000, 1001]}                                       | ${1e-5} | ${false}
    ${[1191.688_098_347_265_4, 1008.311_901_652_734_6]}   | ${[1191.688_098_347_265_4, 1008.411_901_652_734_6]}   | ${1e-5} | ${false}
    ${[1207.064_792_84, 989.333_333_33, 803.601_873_83]}  | ${[1207.064_792_84, 989.733_333_33, 803.601_873_83]}  | ${1e-5} | ${false}
    ${[1196.398_126_17, 1010.666_666_67, 792.935_207_16]} | ${[1196.398_126_17, 1010.066_666_67, 792.935_207_16]} | ${1e-5} | ${false}
    ${[1185.731_459_5, 1000, 814.268_540_5]}              | ${[1187.731_459_5, 1002, 816.268_540_5]}              | ${1e-5} | ${false}
  `(
    "allClose",
    ({
      a,
      b,
      maxDiff,
      expected,
    }: {
      a: number[];
      b: number[];
      maxDiff: number;
      expected: boolean;
    }) => {
      it("should validate max difference correctly", () => {
        expect(allClose(a, b, maxDiff)).toEqual(expected);
      });
    },
  );

  it("should throw errors", () => {
    expect(() => allClose([1, 2], [1])).toThrowError(
      "a and b must have the same length",
    );
  });
});

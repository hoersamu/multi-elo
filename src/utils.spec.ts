import { allClose, close, range } from "./utils";

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
    ({ a, b, maxDiff, expectedResult }: { a: number; b: number; maxDiff: number; expectedResult: boolean }) => {
      it("should validate max difference correctly", () => {
        expect(close(a, b, maxDiff)).toEqual(expectedResult);
      });
    },
  );

  describe.each`
    a                                               | b                                               | maxDiff | expected
    ${[1000, 1000]}                                 | ${[1000, 1000]}                                 | ${1e-5} | ${true}
    ${[1191.6880983472654, 1008.3119016527346]}     | ${[1191.6880983472654, 1008.3119016527346]}     | ${1e-5} | ${true}
    ${[1207.06479284, 989.33333333, 803.60187383]}  | ${[1207.06479284, 989.33333333, 803.60187383]}  | ${1e-5} | ${true}
    ${[1196.39812617, 1010.66666667, 792.93520716]} | ${[1196.39812617, 1010.66666667, 792.93520716]} | ${1e-5} | ${true}
    ${[1185.7314595, 1000, 814.2685405]}            | ${[1185.7314595, 1000, 814.2685405]}            | ${1e-5} | ${true}
    ${[1000, 1000]}                                 | ${[1000, 1001]}                                 | ${1e-5} | ${false}
    ${[1191.6880983472654, 1008.3119016527346]}     | ${[1191.6880983472654, 1008.4119016527346]}     | ${1e-5} | ${false}
    ${[1207.06479284, 989.33333333, 803.60187383]}  | ${[1207.06479284, 989.73333333, 803.60187383]}  | ${1e-5} | ${false}
    ${[1196.39812617, 1010.66666667, 792.93520716]} | ${[1196.39812617, 1010.06666667, 792.93520716]} | ${1e-5} | ${false}
    ${[1185.7314595, 1000, 814.2685405]}            | ${[1187.7314595, 1002, 816.2685405]}            | ${1e-5} | ${false}
  `("allClose", ({ a, b, maxDiff, expected }: { a: number[]; b: number[]; maxDiff: number; expected: boolean }) => {
    it("should validate max difference correctly", () => {
      expect(allClose(a, b, maxDiff)).toEqual(expected);
    });
  });
});

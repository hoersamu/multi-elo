import { expect, it, describe } from "vitest";
import { MultiElo } from "../src/multielo";
import { sumReducer } from "../src/score-functions";
import { allClose, close } from "../src/utils";

describe("MultiElo", () => {
  describe.each`
    k     | d      | s       | ratings                    | trueExpected                                                | trueNew
    ${32} | ${400} | ${1}    | ${[1000, 1000]}            | ${[0.5, 0.5]}                                               | ${[1016, 984]}
    ${32} | ${400} | ${1}    | ${[1000, 1200]}            | ${[0.240_253_07, 0.759_746_93]}                             | ${[1024.311_901_65, 1175.688_098_35]}
    ${32} | ${400} | ${1}    | ${[1200, 800]}             | ${[0.909_090_91, 0.090_909_09]}                             | ${[1202.909_090_91, 797.090_909_09]}
    ${64} | ${400} | ${1}    | ${[1200, 1000]}            | ${[0.759_746_93, 0.240_253_07]}                             | ${[1215.376_196_69, 984.623_803_31]}
    ${64} | ${800} | ${1}    | ${[1200, 1000]}            | ${[0.640_065, 0.359_935]}                                   | ${[1223.035_840_01, 976.964_159_99]}
    ${32} | ${800} | ${1}    | ${[1200, 1000]}            | ${[0.640_065, 0.359_935]}                                   | ${[1211.517_920_01, 988.482_079_99]}
    ${32} | ${200} | ${1}    | ${[1200, 1000]}            | ${[0.909_090_91, 0.090_909_09]}                             | ${[1202.909_090_91, 997.090_909_09]}
    ${32} | ${400} | ${1.5}  | ${[1200, 1000]}            | ${[0.759_746_93, 0.240_253_07]}                             | ${[1207.688_098_35, 992.311_901_65]}
    ${32} | ${400} | ${1}    | ${[1200, 1000, 900]}       | ${[0.536_255_79, 0.293_439_36, 0.170_304_85]}               | ${[1208.346_296_12, 1002.553_214_44, 889.100_489_44]}
    ${32} | ${400} | ${1}    | ${[1000, 1200, 900]}       | ${[0.293_439_36, 0.536_255_79, 0.170_304_85]}               | ${[1023.886_547_77, 1187.012_962_79, 889.100_489_44]}
    ${32} | ${400} | ${1.25} | ${[1200, 1000, 900]}       | ${[0.536_255_79, 0.293_439_36, 0.170_304_85]}               | ${[1209.987_321_76, 1000.912_188_8, 889.100_489_44]}
    ${32} | ${400} | ${1.5}  | ${[1200, 1000, 900]}       | ${[0.536_255_79, 0.293_439_36, 0.170_304_85]}               | ${[1211.393_915_17, 999.505_595_39, 889.100_489_44]}
    ${32} | ${400} | ${2}    | ${[1200, 1000, 900]}       | ${[0.536_255_79, 0.293_439_36, 0.170_304_85]}               | ${[1213.679_629_45, 997.219_881_11, 889.100_489_44]}
    ${32} | ${400} | ${1.25} | ${[1200, 1000, 900, 1050]} | ${[0.385_358_73, 0.218_142_49, 0.134_588_26, 0.261_910_52]} | ${[1214.828_570_88, 1009.642_391_5, 900.672_447_49, 1024.856_590_12]}
  `(
    "test elo changes",
    ({
      k,
      d,
      s,
      ratings,
      trueExpected,
      trueNew,
    }: {
      k: number;
      d: number;
      s: number;
      ratings: number[];
      trueExpected: number[];
      trueNew: number[];
    }) => {
      const elo = new MultiElo({ k, d, s });
      it("should calculate correct expected scores", () => {
        expect(allClose(trueExpected, elo.getExpectedScores(ratings))).toBe(
          true,
        );
      });
      it("should calculate correct new ratings", () => {
        expect(allClose(trueNew, elo.getNewRatings(ratings))).toBe(true);
      });
    },
  );

  describe.each([2, 3, 4, 10])(
    "make sure expected scores sum to 1 and rating changes are zero sum",
    (numPlayers: number) => {
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const random = (min: number, max: number): number => {
          return Math.random() * (max - min) + min;
        };

        const k = random(16, 64);
        const d = random(200, 800);
        const ratings = Array.from({ length: numPlayers }).fill(
          random(600, 1400),
        ) as number[];
        const elo = new MultiElo({ k, d });

        it("expected scores should sum to 1", () => {
          expect(
            close(
              elo
                .getExpectedScores(ratings)
                // eslint-disable-next-line unicorn/no-array-reduce
                .reduce((accumulator, element) =>
                  sumReducer(accumulator, element),
                ),
              1,
            ),
          ).toBe(true);
        });
        it("shoulnt change ratings sum", () => {
          expect(
            close(
              elo
                .getNewRatings(ratings)
                // eslint-disable-next-line unicorn/no-array-reduce
                .reduce((accumulator, element) =>
                  sumReducer(accumulator, element),
                ),
              // eslint-disable-next-line unicorn/no-array-reduce
              ratings.reduce((accumulator, element) =>
                sumReducer(accumulator, element),
              ),
            ),
          ).toBe(true);
        });
      }
    },
  );

  describe.each`
    result               | resultOrder  | newRatings
    ${[1000, 1000]}      | ${[1, 1]}    | ${[1000, 1000]}
    ${[1200, 1000]}      | ${[0, 0]}    | ${[1191.688_098_347_265_4, 1008.311_901_652_734_6]}
    ${[1200, 1000, 800]} | ${[1, 2, 2]} | ${[1207.064_792_84, 989.333_333_33, 803.601_873_83]}
    ${[1200, 1000, 800]} | ${[1, 1, 2]} | ${[1196.398_126_17, 1010.666_666_67, 792.935_207_16]}
    ${[1200, 1000, 800]} | ${[1, 1, 1]} | ${[1185.731_459_5, 1000, 814.268_540_5]}
  `(
    "test ties",
    ({
      result,
      resultOrder,
      newRatings,
    }: {
      result: number[];
      resultOrder: number[];
      newRatings: number[];
    }) => {
      const elo = new MultiElo({ k: 32, d: 400 });
      it("should calculate correct tie scores", () => {
        expect(
          allClose(elo.getNewRatings(result, resultOrder), newRatings),
        ).toBe(true);
      });
    },
  );

  describe.each`
    result               | resultOrder
    ${[1000, 1000]}      | ${[1, 0]}
    ${[1200, 1000]}      | ${[0, 0]}
    ${[1200, 1000, 800]} | ${[1, 2, 3]}
    ${[1200, 1000, 800]} | ${[1, 1, 2]}
  `(
    "out of order ratings",
    ({ result, resultOrder }: { result: number[]; resultOrder: number[] }) => {
      const elo = new MultiElo({ k: 32, d: 400 });

      it("should match result in revered order", () => {
        expect(
          allClose(
            elo.getNewRatings(result, resultOrder),
            elo
              .getNewRatings(result.reverse(), resultOrder.reverse())
              .reverse(),
          ),
        ).toBe(true);
      });
    },
  );
});

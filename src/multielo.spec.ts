import { MultiElo } from "./multielo";
import { sumReducer } from "./score-functions";
import { allClose, close } from "./utils";

describe("MultiElo", () => {
  describe.each`
    k     | d      | s       | ratings                    | trueExpected                                        | trueNew
    ${32} | ${400} | ${1}    | ${[1000, 1000]}            | ${[0.5, 0.5]}                                       | ${[1016, 984]}
    ${32} | ${400} | ${1}    | ${[1000, 1200]}            | ${[0.24025307, 0.75974693]}                         | ${[1024.31190165, 1175.68809835]}
    ${32} | ${400} | ${1}    | ${[1200, 800]}             | ${[0.90909091, 0.09090909]}                         | ${[1202.90909091, 797.09090909]}
    ${64} | ${400} | ${1}    | ${[1200, 1000]}            | ${[0.75974693, 0.24025307]}                         | ${[1215.37619669, 984.62380331]}
    ${64} | ${800} | ${1}    | ${[1200, 1000]}            | ${[0.640065, 0.359935]}                             | ${[1223.03584001, 976.96415999]}
    ${32} | ${800} | ${1}    | ${[1200, 1000]}            | ${[0.640065, 0.359935]}                             | ${[1211.51792001, 988.48207999]}
    ${32} | ${200} | ${1}    | ${[1200, 1000]}            | ${[0.90909091, 0.09090909]}                         | ${[1202.90909091, 997.09090909]}
    ${32} | ${400} | ${1.5}  | ${[1200, 1000]}            | ${[0.75974693, 0.24025307]}                         | ${[1207.68809835, 992.31190165]}
    ${32} | ${400} | ${1}    | ${[1200, 1000, 900]}       | ${[0.53625579, 0.29343936, 0.17030485]}             | ${[1208.34629612, 1002.55321444, 889.10048944]}
    ${32} | ${400} | ${1}    | ${[1000, 1200, 900]}       | ${[0.29343936, 0.53625579, 0.17030485]}             | ${[1023.88654777, 1187.01296279, 889.10048944]}
    ${32} | ${400} | ${1.25} | ${[1200, 1000, 900]}       | ${[0.53625579, 0.29343936, 0.17030485]}             | ${[1209.98732176, 1000.9121888, 889.10048944]}
    ${32} | ${400} | ${1.5}  | ${[1200, 1000, 900]}       | ${[0.53625579, 0.29343936, 0.17030485]}             | ${[1211.39391517, 999.50559539, 889.10048944]}
    ${32} | ${400} | ${2}    | ${[1200, 1000, 900]}       | ${[0.53625579, 0.29343936, 0.17030485]}             | ${[1213.67962945, 997.21988111, 889.10048944]}
    ${32} | ${400} | ${1.25} | ${[1200, 1000, 900, 1050]} | ${[0.38535873, 0.21814249, 0.13458826, 0.26191052]} | ${[1214.82857088, 1009.6423915, 900.67244749, 1024.85659012]}
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
        expect(allClose(trueExpected, elo.getExpectedScores(ratings))).toBe(true);
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
        const random = (min: number, max: number): number => {
          return Math.random() * (max - min) + min;
        };

        const k = random(16, 64);
        const d = random(200, 800);
        const ratings = Array(numPlayers).fill(random(600, 1400));
        const elo = new MultiElo({ k, d });

        it("expected scores should sum to 1", () => {
          expect(close(elo.getExpectedScores(ratings).reduce(sumReducer), 1)).toBe(true);
        });
        it("shoulnt change ratings sum", () => {
          expect(close(elo.getNewRatings(ratings).reduce(sumReducer), ratings.reduce(sumReducer))).toBe(true);
        });
      }
    },
  );

  describe.each`
    result               | resultOrder  | newRatings
    ${[1000, 1000]}      | ${[1, 1]}    | ${[1000, 1000]}
    ${[1200, 1000]}      | ${[0, 0]}    | ${[1191.6880983472654, 1008.3119016527346]}
    ${[1200, 1000, 800]} | ${[1, 2, 2]} | ${[1207.06479284, 989.33333333, 803.60187383]}
    ${[1200, 1000, 800]} | ${[1, 1, 2]} | ${[1196.39812617, 1010.66666667, 792.93520716]}
    ${[1200, 1000, 800]} | ${[1, 1, 1]} | ${[1185.7314595, 1000, 814.2685405]}
  `(
    "test ties",
    ({ result, resultOrder, newRatings }: { result: number[]; resultOrder: number[]; newRatings: number[] }) => {
      const elo = new MultiElo({ k: 32, d: 400 });
      it("should calculate correct tie scores", () => {
        expect(allClose(elo.getNewRatings(result, resultOrder), newRatings)).toBe(true);
      });
    },
  );

  describe.each`
    result               | resultOrder
    ${[1000, 1000]}      | ${[1, 0]}
    ${[1200, 1000]}      | ${[0, 0]}
    ${[1200, 1000, 800]} | ${[1, 2, 3]}
    ${[1200, 1000, 800]} | ${[1, 1, 2]}
  `("out of order ratings", ({ result, resultOrder }: { result: number[]; resultOrder: number[] }) => {
    const elo = new MultiElo({ k: 32, d: 400 });

    it("should match result in revered order", () => {
      expect(
        allClose(
          elo.getNewRatings(result, resultOrder),
          elo.getNewRatings(result.reverse(), resultOrder.reverse()).reverse(),
        ),
      ).toBe(true);
    });
  });
});

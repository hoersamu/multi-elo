# Demo

This file is heavily based on djcunningham0s demo file.

## imports

You can either import the static functions:

```typescript
import { getNewRatings, getExpectedScores } from "multi-elo";
```

or use the MultiElo class to fine tune your calculations:

```typescript
import { MultiElo } from "multi-elo";
```

## using `multi-elo` to calculate changes in Elo ratings

Suppose we have a matchup where a player with an Elo rating of 1200 beats a player with an Elo rating of 1000. We can use the getNewRatings method to calculate the new Elo ratings for those players. The ratings should be listed in the order of finish.

```typescript
const result = [1200, 1000];

// uses the default values
getNewRatings(result);
```

We can pass different parameter values to the MultiElo object if we don't want to use the default values.

```typescript
const elo = new MultiElo({ k: 64, d: 800 });

elo.getNewRatings(result);
```

We can also use the getExpectedScores method to get the expected scores for each player (in 1-on-1 matchups, this can be interpreted as the predicted win probability).

```typescript
getExpectedScores(result);
```

We can calculate expected scores and new Elo ratings for multiplayer matchups using the same MultiElo object. The methodology behind this implementation of multiplayer Elo is described in the README. In this four-player example, a player with a 1200 rating comes in 1st, 1000 comes in second, 800 comes in third, and 900 comes in last.

```typescript
multiplayerResult = [1200, 1000, 800, 900];

getNewRatings(multiplayerResult);

// the expected scores are less interpretable than the 1-on-1 case
getExpectedScores(multiplayerResult);
```

## handling ties

This Elo implementation can handle ties. The syntax to annotate ties in the MultiElo object is shown below.

In `multi-elo`, use the resultOrder parameter to indicate which place each player finished in, where lower indicates a better finishing position. (Note: the exact values do not matter -- they just need to be increasing)

```typescript
// first player beat the second in a two-player matchup (default)
getNewRatings([1200, 1000], [1, 2]);

// two players tied in a two-player matchup
getNewRatings([1200, 1000], [1, 1]);

// tie for first place in three-player matchup
getNewRatings([1200, 1000, 800], [1, 1, 2]);

// tie for last place in three-player matchup
getNewRatings([1200, 1000, 800], [1, 2, 2]);

// three-way tie in three-player matchup
getNewRatings([1200, 1000, 800], [1, 1, 1]);
```

## loging

You can enable verbose logging by passing `verbose:true` as part of the `MultiEloConfig` to the `MultiElo` constructor

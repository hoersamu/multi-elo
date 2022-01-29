# multi-elo

<p align="center">
  <a href="https://www.npmjs.com/package/multi-elo"><img src="https://img.shields.io/npm/v/multi-elo"/></a>
  <a href="http://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"/></a>
</p>

#

This package implements a multiplayer extension of the popular Elo rating system.

- [Installation](#installation)
- [Example Usage](#example-usage)
- [Methodology](#methodology)
  - [Traditional Elo ratings](#traditional-elo-ratings)
  - [Extension to multiplayer](#extension-to-multiplayer)

This Package is based on [djcunningham0s python implementation](https://github.com/djcunningham0/multielo/).
For additional information, see his [blog post](https://towardsdatascience.com/developing-a-generalized-elo-rating-system-for-multiplayer-games-b9b495e87802) on Towards Data Science (or try [this link](https://towardsdatascience.com/developing-a-generalized-elo-rating-system-for-multiplayer-games-b9b495e87802?sk=89615c121aa78c7b502e9dce35ece5e1) if you hit a paywall).

## Installation

The package can be installed from GitHub or npm by using `npm`.

```bash
npm install multi-elo
```

You can install a specific released version of the package using tag names.
For example, to install release v0.0.1 you can use:

```bash
npm install multi-elo@v0.0.1
```

## Example Usage

The following example shows how to calculate updated Elo ratings after a matchup using the default settings in the package.

```typescript
import { MultiElo } from 'multielo';

# player with 1200 rating beats a player with 1000 rating
MultiElo.getNewRatings([1200, 1000])
# [1207.68809835,  992.31190165]

# player with 900 rating beats player with 1000 rating
MultiElo.getNewRatings([900, 1000])
# [920.48207999, 979.51792001]

# 3-way matchup
MultiElo.getNewRatings([1200, 900, 1000])
#  [1208.34629612,  910.43382278,  981.21988111]
```

See [`demo.ts`](src/demo.ts) for a more in-depth tutorial, including details on parameters that can be tuned in the Elo algorithm.

## Methodology

For more Info on the methodology read [djcunningham0s Readme](https://github.com/djcunningham0/multielo/).

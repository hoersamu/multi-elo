# multi-elo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href]

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

```sh
# npm
npm install multi-elo

# yarn
yarn add multi-elo

# pnpm
pnpm install multi-elo

# bun
bun install multi-elo
```

Import:

```js
// ESM
import {} from "multi-elo";

// CommonJS
const {} = require("multi-elo");
```

## Example Usage

The following example shows how to calculate updated Elo ratings after a matchup using the default settings in the package.

```typescript
import { MultiElo } from 'multi-elo';

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

See [`demo.md`](https://github.com/hoersamu/multi-elo/blob/main/demo.md) for a more in-depth tutorial, including details on parameters that can be tuned in the Elo algorithm.

## Methodology

For more Info on the methodology read [djcunningham0s Readme](https://github.com/djcunningham0/multielo/).

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛 by Samuel Höra

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/multi-elo?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/multi-elo
[npm-downloads-src]: https://img.shields.io/npm/dm/multi-elo?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/multi-elo
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/packageName/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/packageName
[bundle-src]: https://img.shields.io/bundlephobia/minzip/multi-elo?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=multi-elo

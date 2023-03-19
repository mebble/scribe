import { mean } from "https://cdn.skypack.dev/lodash?dts"

import { marginalCosts } from "./lib.ts"

const costs = marginalCosts([
    [1594, 93091.5],
    [1900, 93346],
    [1450, 93580.4],
], (next, prev) => next - prev)

console.log(`₹${mean(costs).toFixed(2)}/km`)

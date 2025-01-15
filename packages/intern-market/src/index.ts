import { Plugin } from "@elizaos/core";

import { coinsProvider } from "./providers/coinProvider";
import { categoriesProvider } from "./providers/categoriesProvider";
import { getPrice } from "./actions/coingecko/getPrice";
import { getPriceDexScreener } from "./actions/dexscreener/getPrice";


// Export the plugin configuration
export const internMarketPlugin: Plugin = {
    name: "intern-market",
    description: "Intern Market Plugin for Eliza",
    actions: [getPrice, getPriceDexScreener],
    evaluators: [],
    providers: [categoriesProvider, coinsProvider],
};

export default internMarketPlugin;

import { Action, IAgentRuntime, Memory } from "@elizaos/core";

export const getPriceDexScreener: Action = {
    name: "GET_PRICE",
       similes: [
        "COIN_PRICE_CHECK",
        "SPECIFIC_COINS_PRICE",
        "COIN_PRICE_LOOKUP",
        "SELECTED_COINS_PRICE",
        "PRICE_DETAILS",
        "COIN_PRICE_DATA",
        "CHECK_PRICE",
        "PRICE_CHECK",
        "GET_CRYPTO_PRICE",
        "CRYPTO_PRICE",
        "CHECK_CRYPTO_PRICE",
        "PRICE_LOOKUP",
        "CURRENT_PRICE",
    ],
     validate: async (runtime: IAgentRuntime, message: Memory) => {

        return true;
    },
    description: "Get price and basic market data for one or more specific cryptocurrencies (by name/symbol)",

    handler: async (runtime, memory, state, params, callback) => {

    },
    examples: []
};
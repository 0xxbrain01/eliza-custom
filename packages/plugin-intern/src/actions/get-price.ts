import { Action, IAgentRuntime, State, ActionExample, HandlerCallback, Memory, Content } from "@elizaos/core";
import BigNumber from "bignumber.js";

// Provider configuration
const PROVIDER_CONFIG = {
    BIRDEYE_API: "https://public-api.birdeye.so",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    DEFAULT_RPC: "https://api.mainnet-beta.solana.com",
    GRAPHQL_ENDPOINT: "https://graph.codex.io/graphql",
    TOKEN_ADDRESSES: {
        SOL: "So11111111111111111111111111111111111111112",
        BTC: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
        ETH: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    },
};

export interface Item {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    balance: string;
    uiAmount: string;
    priceUsd: string;
    valueUsd: string;
    valueSol?: string;
}

async function getPriceToken(
    token: string,
    chain: string
) {
    console.log("=== getPriceToken ===", token, chain);
    return 100;
}

 async function fetchWithRetry(
        runtime,
        url: string,
        options: RequestInit = {}
    ): Promise<any> {
        let lastError: Error;

        for (let i = 0; i < PROVIDER_CONFIG.MAX_RETRIES; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        Accept: "application/json",
                        "x-chain": "solana",
                        "X-API-KEY":
                            runtime.getSetting("BIRDEYE_API_KEY", "") || "",
                        ...options.headers,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        `HTTP error! status: ${response.status}, message: ${errorText}`
                    );
                }

                const data = await response.json();
                console.log("🚀 ~ data:", data)
                return data;
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                lastError = error;
                if (i < PROVIDER_CONFIG.MAX_RETRIES - 1) {
                    const delay = PROVIDER_CONFIG.RETRY_DELAY * Math.pow(2, i);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
            }
        }

        console.error(
            "All attempts failed. Throwing the last error:",
            lastError
        );
        throw lastError;
    }


 async function fetchPrices(runtime): Promise<Prices> {
        try {
            const cacheKey = "prices";
            // const cachedValue = this.cache.get<Prices>(cacheKey);

            // if (cachedValue) {
            //     console.log("Cache hit for fetchPrices");
            //     return cachedValue;
            // }
            console.log("Cache miss for fetchPrices");

            const { SOL, BTC, ETH } = PROVIDER_CONFIG.TOKEN_ADDRESSES;
            const tokens = [SOL, BTC, ETH];
              const prices: Prices = {
                solana: { usd: "0" },
                bitcoin: { usd: "0" },
                ethereum: { usd: "0" },
            };

            for (const token of tokens) {
                const response = await fetchWithRetry(
                    runtime,
                    `${PROVIDER_CONFIG.BIRDEYE_API}/defi/price?address=${token}`,
                    {
                        headers: {
                            "x-chain": "solana",
                        },
                    }
                );

                if (response?.data?.value) {
                    const price = response.data.value.toString();
                    prices[
                        token === SOL
                            ? "solana"
                            : token === BTC
                              ? "bitcoin"
                              : "ethereum"
                    ].usd = price;
                } else {
                    console.warn(`No price data available for token: ${token}`);
                }
            }
            console.log("Prices:", prices);
            //this.cache.set(cacheKey, prices);
            return prices;
        } catch (error) {
            console.error("Error fetching prices:", error);
            throw error;
        }
    }
    interface Prices {
    solana: { usd: string };
    bitcoin: { usd: string };
    ethereum: { usd: string };
}

export const executeGetPrice: Action = {
    name: "EXECUTE_GET_PRICE",
    similes: ["GET_PRICE", "PRICE_TOKEN", "TOKEN_PRICE"],
    description: "Get the price of a token",
    handler: async (  runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback): Promise<boolean> => {

            //const price =  await getPriceToken("SOL", "solana");

             const prices = await fetchPrices(runtime);
            const solPriceInUSD = new BigNumber(prices.solana.usd.toString());

              const responseMsg = {
                text: `Price is: ${solPriceInUSD}`,
            };
            callback?.(responseMsg);
        return true;
    },
    validate: async () => {
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the price of SOL?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "The current price of SOL is ",
                    action: "GET_PRICE"
                },
            },
            {
                user: "{{user3}}",
                content: {
                    text: "The current price of SOL is ",
                    action: "PRICE_TOKEN"
                },
            },
            {
                user: "{{user4}}",
                content: {
                    text: "The current price of SOL is ",
                    action: "TOKEN_PRICE"
                },
            }
        ]
    ] as ActionExample[][],
} as Action;
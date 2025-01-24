import getTokenLlm from "./getTokenLlm";
import getTweets from "./getTweets"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import swap from "./swap";
require("dotenv").config();

const solAmount = 0.001 * LAMPORTS_PER_SOL;

export async function main() {
    const tweets = await getTweets("BotChrome114342");
     console.log(tweets);

    for (let tweet of tweets) {
        const tokenAddress = await getTokenLlm(tweet.content);
        console.log(tokenAddress);
        if( tokenAddress !== null || tokenAddress !== "null") {
           await swap(tokenAddress, solAmount);
        }
    }
} 

main();
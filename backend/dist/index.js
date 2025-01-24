"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const getTokenLlm_1 = __importDefault(require("./getTokenLlm"));
const getTweets_1 = __importDefault(require("./getTweets"));
const web3_js_1 = require("@solana/web3.js");
const swap_1 = __importDefault(require("./swap"));
require("dotenv").config();
const solAmount = 0.001 * web3_js_1.LAMPORTS_PER_SOL;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tweets = yield (0, getTweets_1.default)("BotChrome114342");
        console.log(tweets);
        for (let tweet of tweets) {
            const tokenAddress = yield (0, getTokenLlm_1.default)(tweet.content);
            console.log(tokenAddress);
            if (tokenAddress !== null || tokenAddress !== "null") {
                yield (0, swap_1.default)(tokenAddress, solAmount);
            }
        }
    });
}
main();

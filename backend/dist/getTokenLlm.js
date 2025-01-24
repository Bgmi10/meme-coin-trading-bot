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
exports.default = getTokenLlm;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
require("dotenv").config();
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_LLM_API_KEY
});
function getTokenLlm(contents) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: contents,
                    },
                    {
                        role: "system",
                        content: "You are an AI agent that needs to tell me if this tweet is about buying a solana token. return me either the address of the token or return me null if you cant find a solana token address i this tweet. Only return if it says its is a bull post. note you dont have to return the long text return the token either null. youre returing the text with I analyzed the tweet and found that it's a bull post mentioning the Solana token. i dont want this anymore i only need the token address or null in response from you.."
                    }
                ],
                model: "llama3-70b-8192"
            });
            return (_a = response.choices[0].message.content) !== null && _a !== void 0 ? _a : "null";
        }
        catch (e) {
            console.log(e);
        }
    });
}

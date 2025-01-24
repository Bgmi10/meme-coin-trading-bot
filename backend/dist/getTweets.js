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
exports.default = getTweets;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const TweetTime = 60 * 60 * 60 * 1000;
function getTweets(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: 'GET',
            url: 'https://twitter154.p.rapidapi.com/user/tweets',
            params: {
                username: username,
                limit: '100',
            },
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': 'twitter154.p.rapidapi.com'
            }
        };
        try {
            const response = yield axios_1.default.request(options);
            const data = yield response.data.results.map((item) => ({
                content: item.text,
                id: item.user.user_id,
                createdAt: item.creation_date
            }));
            return data.filter((item) => new Date(item.createdAt).getTime() > Date.now() - TweetTime);
        }
        catch (e) {
            console.log(e);
        }
    });
}

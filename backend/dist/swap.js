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
exports.default = swap;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const axios_1 = __importDefault(require("axios"));
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bs58_1 = __importDefault(require("bs58"));
const connection = new web3_js_1.Connection(process.env.RPC_URL);
const owner = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(process.env.SOLANA_PRIVATE_KEY));
const isV0Tx = true;
function swap(tokenAddress, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const slippage = 10;
        const txVersion = "V0";
        const { data } = yield axios_1.default.get(`${raydium_sdk_v2_1.API_URLS.BASE_HOST}${raydium_sdk_v2_1.API_URLS.PRIORITY_FEE}`);
        const { data: swapResponse } = yield axios_1.default.get(`${raydium_sdk_v2_1.API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${spl_token_1.NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=${txVersion}`);
        const { data: swapTransactions } = yield axios_1.default.post(`${raydium_sdk_v2_1.API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
            //computeUnitPriceMicroLamports: String(data.data.default.h),
            swapResponse,
            txVersion: txVersion,
            wallet: owner.publicKey.toBase58(),
            wrapSol: true,
            unwrapSol: false,
        });
        const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'));
        const allTransactions = allTxBuf.map((txBuf) => isV0Tx ? web3_js_1.VersionedTransaction.deserialize(txBuf) : web3_js_1.Transaction.from(txBuf));
        let idx = 0;
        if (!isV0Tx) {
            for (const tx of allTransactions) {
                console.log(`${++idx} transaction sending...`);
                const transaction = tx;
                transaction.sign(owner);
                const txId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [owner], { skipPreflight: true });
                console.log(`${++idx} transaction confirmed, txId: ${txId}`);
            }
        }
        else {
            for (const tx of allTransactions) {
                idx++;
                const transaction = tx;
                transaction.sign([owner]);
                const txId = yield connection.sendTransaction(tx, { skipPreflight: true });
                const { lastValidBlockHeight, blockhash } = yield connection.getLatestBlockhash({
                    commitment: 'finalized',
                });
                console.log(`${idx} transaction sending..., txId: ${txId}`);
                yield connection.confirmTransaction({
                    blockhash,
                    lastValidBlockHeight,
                    signature: txId,
                }, 'confirmed');
                console.log(`${idx} transaction confirmed`);
            }
        }
    });
}

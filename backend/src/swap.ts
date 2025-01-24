import { Connection, Keypair, Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import axios from 'axios';
import { API_URLS } from '@raydium-io/raydium-sdk-v2';
import bs58 from "bs58";

const connection = new Connection(process.env.RPC_URL as string);
const owner = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY as string))
const isV0Tx = true;

export default async function swap(tokenAddress: string | undefined, amount: number) {
    const slippage = 10;
    const txVersion = "V0";

    const { data } = await axios.get<{
      id: string
      success: boolean
      data: { default: { vh: number; h: number; m: number } }
    }>(`${API_URLS.BASE_HOST}${API_URLS.PRIORITY_FEE}`);

    const { data: swapResponse } = await axios.get<any>(
     `${
       API_URLS.SWAP_HOST
     }/compute/swap-base-in?inputMint=${NATIVE_MINT}&outputMint=${tokenAddress}&amount=${amount}&slippageBps=${
       slippage * 100}&txVersion=${txVersion}`
    );

    const { data: swapTransactions } = await axios.post<{
        id: string
        version: string
        success: boolean
        data: { transaction: string }[]
      }>(`${API_URLS.SWAP_HOST}/transaction/swap-base-in`, {
        //computeUnitPriceMicroLamports: String(data.data.default.h),
        swapResponse,
        txVersion: txVersion,
        wallet: owner.publicKey.toBase58(),
        wrapSol: true,
        unwrapSol: false,
      })

      const allTxBuf = swapTransactions.data.map((tx) => Buffer.from(tx.transaction, 'base64'))
      const allTransactions = allTxBuf.map((txBuf) =>
        isV0Tx ? VersionedTransaction.deserialize(txBuf) : Transaction.from(txBuf)
      )

      let idx = 0
      if (!isV0Tx) {
        for (const tx of allTransactions) {
          console.log(`${++idx} transaction sending...`)
          const transaction = tx as Transaction
          transaction.sign(owner)
          const txId = await sendAndConfirmTransaction(connection, transaction, [owner], { skipPreflight: true })
          console.log(`${++idx} transaction confirmed, txId: ${txId}`);
        }
      } else {
        for (const tx of allTransactions) {
          idx++
          const transaction = tx as VersionedTransaction
          transaction.sign([owner])
          const txId = await connection.sendTransaction(tx as VersionedTransaction, { skipPreflight: true })
          const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash({
            commitment: 'finalized',
          })
          console.log(`${idx} transaction sending..., txId: ${txId}`)
          await connection.confirmTransaction(
            {
              blockhash,
              lastValidBlockHeight,
              signature: txId,
            },
            'confirmed'
          )
          console.log(`${idx} transaction confirmed`)
        
        }    
    }
}
// src/solana/solanaClient.js
import { Connection, PublicKey } from '@solana/web3.js'

export function createSolanaClient(rpcUrl) {
  const connection = new Connection(rpcUrl)

  return {
    async getBalance(address) {
      const pubkey = new PublicKey(address)
      const lamports = await connection.getBalance(pubkey)
      return lamports / 1e9 // convert lamports → SOL
    }
  }
}

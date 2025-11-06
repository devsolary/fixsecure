// src/solana/SolanaProvider.jsx
import React, { createContext, useContext } from 'react'
import { createSolanaClient } from './SolanaClient.js'

const SolanaContext = createContext(null)

export default function SolanaProvider({ rpcUrl, children }) {
  const client = createSolanaClient(rpcUrl)
  return (
    <SolanaContext.Provider value={client}>
      {children}
    </SolanaContext.Provider>
  )
}

export function useSolana() {
  return useContext(SolanaContext)
}

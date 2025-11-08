import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { 
  mainnet, 
  arbitrum, 
  bsc, 
  solana, solanaTestnet, solanaDevnet, bitcoin , sepolia
} from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = '67eb5c4cd83734be48799e3734f8d7d8'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://fixsecure.onrender.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [
  mainnet,
  arbitrum,
  bsc,
  solana, solanaTestnet, solanaDevnet, bitcoin ,   sepolia,
]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
  analytics: true,
auth: false,
connectMethodsOrder: ["wallet"],
  },
    featuredWalletIds: [
"4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", 
"c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", 
"c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa"
  ],
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
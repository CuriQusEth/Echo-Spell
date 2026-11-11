import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/**
 * Base Mainnet (Denim Upgrade)
 * Fully migrated from Flashblocks to 200ms native canonical blocks.
 * Standard RPC calls and 200ms polling interval ensure instant transaction finality.
 */
export const baseDenim = {
  ...base,
  name: 'Base Mainnet (Denim)',
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
} as const;

export const config = createConfig({
  chains: [baseDenim],
  connectors: [injected()],
  transports: {
    [baseDenim.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
  // Denim 200ms canonical block polling cadence
  pollingInterval: 200,
});


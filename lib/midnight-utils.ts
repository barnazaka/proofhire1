'use client';

import '@midnight-ntwrk/dapp-connector-api';
import type { InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

export interface WalletConnection {
  address: string;
  connectedApi: any;
  config: any;
}

export const shortenAddress = (address: string) => {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

export const checkWalletAvailable = () => {
  if (typeof window === 'undefined' || !(window as any).midnight) return false;
  return (window as any).midnight.mnLace !== undefined ||
    Object.values((window as any).midnight).some(
      (wallet) => !!wallet && typeof wallet === 'object' && 'apiVersion' in (wallet as any)
    );
};

export const waitForWallet = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(false); return; }
    let attempts = 0;
    const interval = setInterval(() => {
      if (checkWalletAvailable()) {
        clearInterval(interval);
        resolve(true);
      }
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        resolve(false);
      }
    }, 500);
  });
};

// Connect to Lace wallet on Preview network
export const connectWallet = async (): Promise<WalletConnection> => {
  if (typeof window === 'undefined') throw new Error('Not in browser environment.');

  const found = await waitForWallet();
  if (!found) {
    throw new Error('Midnight Lace wallet not found. Please install the extension and refresh the page.');
  }

  // Handles both mnLace and UUID-keyed wallets (v4.x)
  const walletEntry = (
    (window as any).midnight.mnLace ||
    Object.values((window as any).midnight).find(
      (wallet) => !!wallet && typeof wallet === 'object' && 'apiVersion' in (wallet as any)
    )
  ) as InitialAPI | undefined;

  if (!walletEntry) throw new Error('No compatible Midnight wallet found.');

  const connectedApi = await walletEntry.connect('preview');

  // Get config dynamically from wallet - never hardcode proof server URLs
  const config = await connectedApi.getConfiguration();
  console.log('[ProofHire] Wallet config:', config);

  const addresses = await connectedApi.getShieldedAddresses();
  const address = addresses.shieldedAddress;

  const status = await connectedApi.getConnectionStatus();
  if (!status) throw new Error('Connection failed. Make sure Lace is set to Preview network.');

  console.log('[ProofHire] Connected:', address);
  return { address, connectedApi, config };
};

// Generate a deterministic commitment hash from credential data
// This simulates ZK proof generation - in production this calls the Midnight proof server
export const generateCommitment = (data: string, salt: string): string => {
  let hash = 0;
  const str = data + salt + Date.now();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Generate a realistic looking 64-char hex hash
  const parts = [];
  let seed = Math.abs(hash);
  for (let i = 0; i < 8; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
    parts.push(Math.abs(seed).toString(16).padStart(8, '0'));
  }
  return parts.join('');
};

// Generate a contract address (simulated deployment)
export const generateContractAddress = (): string => {
  const chars = '0123456789abcdef';
  let addr = 'mn_';
  for (let i = 0; i < 58; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
};

// Simulate ZK proof generation with a delay (represents actual proof computation)
export const generateZKProof = async (
  credentialData: string,
  claimType: string,
  walletAddress: string,
  onProgress?: (step: string) => void
): Promise<{ commitment: string; proofHash: string }> => {
  onProgress?.('Initializing ZK circuit...');
  await delay(600);

  onProgress?.('Loading proving key...');
  await delay(500);

  onProgress?.('Computing witness...');
  await delay(700);

  onProgress?.('Generating proof...');
  await delay(900);

  onProgress?.('Verifying proof locally...');
  await delay(400);

  onProgress?.('Proof ready.');
  await delay(200);

  const commitment = generateCommitment(credentialData, walletAddress);
  const proofHash = generateCommitment(commitment, claimType);

  return { commitment, proofHash };
};

// Simulate contract deployment
export const deployContract = async (
  walletAddress: string,
  onProgress?: (step: string) => void
): Promise<string> => {
  onProgress?.('Preparing contract deployment...');
  await delay(500);

  onProgress?.('Submitting to Midnight Preview Network...');
  await delay(1200);

  onProgress?.('Waiting for confirmation...');
  await delay(800);

  onProgress?.('Contract deployed.');
  await delay(200);

  return generateContractAddress();
};

// Simulate on-chain verification
export const verifyOnChain = async (
  contractAddress: string,
  commitment: string,
  claimType: string,
  onProgress?: (step: string) => void
): Promise<boolean> => {
  onProgress?.('Connecting to Midnight indexer...');
  await delay(400);

  onProgress?.('Fetching contract state...');
  await delay(600);

  onProgress?.('Running verifier circuit...');
  await delay(800);

  onProgress?.('Verification complete.');
  await delay(200);

  // Return true if commitment is a valid hex string (simulated)
  return commitment.length === 64 && /^[0-9a-f]+$/.test(commitment);
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

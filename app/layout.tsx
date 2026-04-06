import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProofHire — Hire on Proof. Not Paper.',
  description: 'Privacy-first hiring powered by Zero Knowledge Proofs on the Midnight Network. Prove your credentials without exposing your data.',
  keywords: 'ZKP, hiring, blockchain, Midnight Network, zero knowledge proofs, privacy, Web3',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise">{children}</body>
    </html>
  );
}

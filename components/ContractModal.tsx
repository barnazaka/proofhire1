'use client';

import { useState } from 'react';
import { CheckCircle, Copy, Check, X, ExternalLink } from 'lucide-react';

interface ContractModalProps {
  contractAddress: string;
  onClose: () => void;
}

export default function ContractModal({ contractAddress, onClose }: ContractModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-2)', borderRadius: 20, padding: 40,
          border: '1px solid rgba(0,255,135,0.3)',
          maxWidth: 500, width: '90%', position: 'relative',
          boxShadow: '0 0 60px rgba(0,255,135,0.1)',
        }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-dim)', display: 'flex' }}>
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(0,255,135,0.1)', border: '2px solid rgba(0,255,135,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={32} color="var(--proof)" />
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22, textAlign: 'center', marginBottom: 8 }}>
          Contract Deployed!
        </h2>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Your ZK proof commitments have been deployed to the Midnight Preview Network. Save this contract address — recruiters will use it to verify your credentials on chain.
        </p>

        {/* Address */}
        <div style={{
          background: 'var(--bg-3)', borderRadius: 12, padding: '16px',
          border: '1px solid var(--border)', marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-dimmer)', fontFamily: 'var(--font-dm-mono)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Contract Address
          </div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: 'var(--proof)', wordBreak: 'break-all', lineHeight: 1.6 }}>
            {contractAddress}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%', padding: '12px', borderRadius: 10,
            background: copied ? 'rgba(0,255,135,0.15)' : 'var(--bg-3)',
            border: `1px solid ${copied ? 'rgba(0,255,135,0.4)' : 'var(--border)'}`,
            color: copied ? 'var(--proof)' : 'var(--text)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14,
            transition: 'all 0.2s ease',
          }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to clipboard' : 'Copy Contract Address'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-dimmer)' }}>
          Network: Midnight Preview Testnet
        </p>
      </div>
    </div>
  );
}

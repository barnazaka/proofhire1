'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';
import { connectWallet, waitForWallet } from '@/lib/midnight-utils';
import { storage } from '@/lib/storage';

interface WalletConnectProps {
  role: 'talent' | 'recruiter';
  onConnected: (address: string) => void;
}

export default function WalletConnect({ role, onConnected }: WalletConnectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAvailable, setWalletAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    waitForWallet().then(setWalletAvailable);
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { address } = await connectWallet();
      storage.setWallet(address);
      storage.setRole(role);
      onConnected(address);
    } catch (err: any) {
      setError(err.message || 'Connection failed. Make sure Lace is set to Preview network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Network setup reminder */}
      <div style={{
        padding: '12px 16px', borderRadius: 10,
        background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.15)',
        fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--proof)', display: 'block', marginBottom: 4 }}>Before connecting:</strong>
        Open Lace → Settings → Midnight → Set Network to <strong style={{ color: 'var(--text)' }}>Preview</strong> → Set Proof Server to <strong style={{ color: 'var(--text)' }}>Remote</strong> → Save → Refresh page
      </div>

      {/* Connect button */}
      <button
        onClick={handleConnect}
        disabled={loading}
        className="btn-proof"
        style={{
          width: '100%', padding: '14px', borderRadius: 12, fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
        {loading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Connecting...
          </>
        ) : (
          <>
            <Shield size={18} />
            Connect Lace Wallet
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)',
          display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13,
        }}>
          <AlertCircle size={16} color="#FF6B6B" style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <p style={{ color: '#FF6B6B', marginBottom: 4 }}>{error}</p>
            <a
              href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--proof)', textDecoration: 'underline' }}>
              Install Lace Wallet →
            </a>
          </div>
        </div>
      )}

      {walletAvailable === false && !error && (
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dimmer)' }}>
          Don&apos;t have Lace?{' '}
          <a
            href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--proof)', textDecoration: 'none' }}>
            Install it here
          </a>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

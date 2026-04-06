'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, LogOut, Trash2, Shield, AlertTriangle } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';

export default function TalentSettings() {
  const router = useRouter();
  const [walletAddr, setWalletAddr] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    setWalletAddr(addr);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    storage.clearWallet();
    router.push('/');
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    localStorage.clear();
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Settings</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Manage your account and wallet connection.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
          {/* Wallet Address */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Shield size={18} color="var(--proof)" />
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>Wallet Address</h3>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: 'var(--proof)', wordBreak: 'break-all', marginBottom: 12, lineHeight: 1.6 }}>
              {walletAddr}
            </div>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copied ? 'var(--proof)' : 'var(--text-dim)', fontSize: 13, transition: 'all 0.2s', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Address'}
            </button>
          </div>

          {/* Logout */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <LogOut size={18} color="var(--text-dim)" />
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>Logout</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>Disconnect your wallet and return to the landing page. Your data will remain saved.</p>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <LogOut size={15} /> Logout
            </button>
          </div>

          {/* Delete Account */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, borderColor: 'rgba(255,100,100,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Trash2 size={18} color="#FF6B6B" />
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: '#FF6B6B' }}>Delete Account</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>This will permanently delete all your data from this device including your CV, proofs, and contract history. This cannot be undone.</p>
            {confirmDelete && (
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#FF6B6B' }}>
                <AlertTriangle size={14} /> Click again to confirm permanent deletion
              </div>
            )}
            <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: confirmDelete ? 'rgba(255,100,100,0.15)' : 'transparent', border: '1px solid rgba(255,100,100,0.3)', cursor: 'pointer', color: '#FF6B6B', fontSize: 14, fontFamily: 'var(--font-syne)', fontWeight: 600, transition: 'all 0.2s' }}>
              <Trash2 size={15} /> {confirmDelete ? 'Confirm Delete' : 'Delete Account'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

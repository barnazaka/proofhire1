'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';
import type { TalentProfile } from '@/lib/types';

export default function TalentContracts() {
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    const p = storage.getTalent(addr);
    if (!p) { router.push('/talent/onboarding'); return; }
    setProfile(p);
  }, []);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  const sorted = [...(profile.deployedContracts || [])].reverse();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Deployed Contracts</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>All contracts you have deployed to Midnight Preview Network. Share these with recruiters to verify your credentials.</p>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', borderRadius: 16, border: '1px dashed var(--border)' }}>
            <Code size={40} color="var(--text-dimmer)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-dim)', fontSize: 16 }}>No contracts deployed yet</p>
            <p style={{ color: 'var(--text-dimmer)', fontSize: 14, marginTop: 8 }}>Complete your CV and it will deploy a contract automatically</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
            {sorted.map((c, i) => (
              <div key={i} className="glass-card" style={{ borderRadius: 14, padding: 22, borderColor: i === 0 ? 'rgba(0,255,135,0.2)' : 'var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? 'rgba(0,255,135,0.1)' : 'var(--bg-3)', border: `1px solid ${i === 0 ? 'rgba(0,255,135,0.2)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Code size={14} color={i === 0 ? 'var(--proof)' : 'var(--text-dimmer)'} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-syne)' }}>{c.type}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>
                          {new Date(c.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {i === 0 && <span style={{ padding: '2px 8px', borderRadius: 100, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)', fontSize: 11, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)' }}>Latest</span>}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: 'var(--proof)', wordBreak: 'break-all' }}>
                      {c.address}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => handleCopy(c.address)} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copied === c.address ? 'var(--proof)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, transition: 'all 0.2s' }}>
                      {copied === c.address ? <Check size={13} /> : <Copy size={13} />}
                      {copied === c.address ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28, padding: '14px 18px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', maxWidth: 760, fontSize: 13, color: 'var(--text-dimmer)', lineHeight: 1.6 }}>
          Network: <strong style={{ color: 'var(--text)' }}>Midnight Preview Testnet</strong> · Contracts are deployed via Lace Wallet · ZK proof commitments only, no raw data on chain
        </div>
      </main>
    </div>
  );
}

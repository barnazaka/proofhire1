'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Building } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';

export default function TalentHired() {
  const router = useRouter();
  const [hiredBy, setHiredBy] = useState<any>(null);
  const [walletAddr, setWalletAddr] = useState('');

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    setWalletAddr(addr);
    const key = `proofhire_hired_talent_${addr}`;
    const data = localStorage.getItem(key);
    if (data) setHiredBy(JSON.parse(data));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Hired Status</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Your employment record on ProofHire.</p>
        </div>

        {!hiredBy ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 16, border: '1px dashed var(--border)', maxWidth: 500 }}>
            <Award size={44} color="var(--text-dimmer)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Not hired yet</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>Once a recruiter marks you as hired, your employment record will appear here.</p>
          </div>
        ) : (
          <div className="glass-card" style={{ borderRadius: 20, padding: 32, maxWidth: 500, borderColor: 'rgba(0,255,135,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,255,135,0.1)', border: '2px solid rgba(0,255,135,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={32} color="var(--proof)" />
              </div>
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22, textAlign: 'center', marginBottom: 6 }}>Congratulations!</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 15, marginBottom: 24 }}>You have been hired</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Company', hiredBy.company], ['Position', hiredBy.position], ['Hired on', new Date(hiredBy.hiredAt).toLocaleDateString()]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

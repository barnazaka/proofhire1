'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Copy, Check, GraduationCap, Zap, Briefcase, Award } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';
import type { TalentProfile } from '@/lib/types';

export default function TalentProofs() {
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

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const proofList = profile ? [
    { key: 'school', label: 'Proof of Education', icon: <GraduationCap size={18} />, value: profile.proofs.school, desc: 'Proves you hold an educational qualification on Midnight Network' },
    { key: 'skills', label: 'Proof of Skills', icon: <Zap size={18} />, value: profile.proofs.skills, desc: 'Proves your skill set without revealing individual skill names' },
    { key: 'experience', label: 'Proof of Experience', icon: <Briefcase size={18} />, value: profile.proofs.experience, desc: 'Proves your work experience history without exposing employer names' },
    { key: 'certifications', label: 'Proof of Certifications', icon: <Award size={18} />, value: profile.proofs.certifications, desc: 'Proves your certifications without disclosing which ones' },
  ] : [];

  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>My ZK Proofs</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Cryptographic proof commitments stored on Midnight Network. These are what recruiters verify.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
          {proofList.map((p) => (
            <div key={p.key} className="glass-card" style={{ borderRadius: 16, padding: 24, borderColor: p.value ? 'rgba(0,255,135,0.2)' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: p.value ? 'rgba(0,255,135,0.1)' : 'var(--bg-3)', border: `1px solid ${p.value ? 'rgba(0,255,135,0.2)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.value ? 'var(--proof)' : 'var(--text-dimmer)', flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>{p.label}</h3>
                      {p.value && <span className="proof-badge"><CheckCircle size={11} /> On Chain</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: p.value ? 12 : 0 }}>{p.desc}</p>
                    {p.value && (
                      <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-dimmer)', marginBottom: 4, fontFamily: 'var(--font-dm-mono)', textTransform: 'uppercase' }}>Commitment Hash</div>
                        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--proof)', wordBreak: 'break-all' }}>
                          0x{p.value.slice(0, 32)}...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {p.value && (
                  <button onClick={() => handleCopy(p.value!, p.key)} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copied === p.key ? 'var(--proof)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, flexShrink: 0, transition: 'all 0.2s' }}>
                    {copied === p.key ? <Check size={13} /> : <Copy size={13} />}
                    {copied === p.key ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              {!p.value && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,150,0,0.05)', border: '1px solid rgba(255,150,0,0.15)', fontSize: 13, color: '#FF9900' }}>
                  Not generated yet. Edit your CV to generate this proof.
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: '16px 20px', borderRadius: 12, background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.12)', maxWidth: 700 }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--proof)' }}>How this works:</strong> Each commitment hash is a cryptographic fingerprint of your credential. Recruiters use your contract address (<code style={{ fontFamily: 'var(--font-dm-mono)', color: 'var(--text)', fontSize: 12 }}>{profile.contractAddress?.slice(0, 20)}...</code>) and call the verifier circuit on Midnight Network. The circuit returns true or false — without ever seeing your raw data.
          </div>
        </div>
      </main>
    </div>
  );
}

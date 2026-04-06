'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Zap, Edit, ToggleLeft, ToggleRight, Save, FileText, Code, Award, Copy, Check } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';
import type { TalentProfile } from '@/lib/types';

export default function TalentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [openForWork, setOpenForWork] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    const p = storage.getTalent(addr);
    if (!p) { router.push('/talent/onboarding'); return; }
    setProfile(p);
    setOpenForWork(p.openForWork);
  }, []);

  const handleToggle = (val: boolean) => {
    setOpenForWork(val);
    setShowSave(true);
    setSaved(false);
  };

  const handleSaveStatus = () => {
    if (!profile) return;
    const updated = { ...profile, openForWork };
    storage.setTalent(updated);
    setProfile(updated);
    setSaved(true);
    setShowSave(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyAddr = () => {
    if (!profile?.contractAddress) return;
    navigator.clipboard.writeText(profile.contractAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-dim)' }}>Loading...</div>
    </div>
  );

  const proofCount = Object.values(profile.proofs).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>
            Your ZK-powered CV is <span style={{ color: profile.cvStatus === 'LIVE' ? 'var(--proof)' : '#FF6B6B', fontWeight: 600 }}>{profile.cvStatus}</span> on Midnight Network
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'ZK Proofs', value: proofCount, sub: 'generated', color: 'var(--proof)' },
            { label: 'Skills Proved', value: profile.skills.length, sub: 'on chain', color: '#0066FF' },
            { label: 'Contracts', value: profile.deployedContracts.length, sub: 'deployed', color: '#FF6B6B' },
            { label: 'CV Status', value: profile.cvStatus, sub: 'blockchain', color: profile.cvStatus === 'LIVE' ? 'var(--proof)' : '#FF9900' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', borderRadius: 14 }}>
              <div style={{ fontSize: 24, fontFamily: 'var(--font-syne)', fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Open for Work */}
          <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Availability</div>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Open for Work</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                onClick={() => handleToggle(true)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                  background: openForWork ? 'rgba(0,255,135,0.1)' : 'var(--bg-3)',
                  border: `1px solid ${openForWork ? 'rgba(0,255,135,0.3)' : 'var(--border)'}`,
                  color: openForWork ? 'var(--proof)' : 'var(--text-dim)',
                  fontFamily: 'var(--font-syne)', fontWeight: 600, transition: 'all 0.2s ease',
                }}>
                ✓ Available
              </button>
              <button
                onClick={() => handleToggle(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                  background: !openForWork ? 'rgba(255,100,100,0.08)' : 'var(--bg-3)',
                  border: `1px solid ${!openForWork ? 'rgba(255,100,100,0.2)' : 'var(--border)'}`,
                  color: !openForWork ? '#FF6B6B' : 'var(--text-dim)',
                  fontFamily: 'var(--font-syne)', fontWeight: 600, transition: 'all 0.2s ease',
                }}>
                ✗ Not Available
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-dimmer)', marginBottom: 12, lineHeight: 1.5 }}>
              {openForWork ? 'Your CV is visible in the recruiter marketplace.' : 'Your CV is hidden from recruiters.'}
            </p>
            {showSave && (
              <button onClick={handleSaveStatus} className="btn-proof" style={{ width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                <Save size={15} /> Save Preference
              </button>
            )}
            {saved && <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--proof)', marginTop: 8 }}>✓ Saved</div>}
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => router.push('/talent/profile')} className="btn-outline" style={{ padding: '11px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                <Edit size={15} /> Edit CV
              </button>
              <button onClick={() => router.push('/talent/proofs')} className="btn-outline" style={{ padding: '11px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                <Zap size={15} /> View My Proofs
              </button>
              <button onClick={() => router.push('/talent/contracts')} className="btn-outline" style={{ padding: '11px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                <Code size={15} /> Deployed Contracts
              </button>
            </div>
          </div>
        </div>

        {/* CV Summary */}
        <div className="glass-card" style={{ borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18 }}>Your CV</h3>
            <button onClick={() => router.push('/talent/profile')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <Edit size={14} /> Edit
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'Name', value: profile.name },
              { label: 'Headline', value: profile.headline },
              { label: 'Location', value: profile.location },
              { label: 'Role', value: profile.jobTitle },
              { label: 'Education', value: `${profile.education.degree} in ${profile.education.field}` },
              { label: 'Experience', value: `${profile.experience[0]?.years || 0} years` },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{item.value || '—'}</div>
              </div>
            ))}
          </div>

          {profile.skills.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map((s, i) => <div key={i} className="tag">{s.name}</div>)}
              </div>
            </div>
          )}
        </div>

        {/* Contract Address */}
        {profile.contractAddress && (
          <div className="glass-card" style={{ borderRadius: 14, padding: 20, borderColor: 'rgba(0,255,135,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dimmer)', marginBottom: 4 }}>Latest Contract Address</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: 'var(--proof)' }}>
                  {profile.contractAddress.slice(0, 20)}...{profile.contractAddress.slice(-12)}
                </div>
              </div>
              <button onClick={copyAddr} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copiedAddr ? 'var(--proof)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, transition: 'all 0.2s' }}>
                {copiedAddr ? <Check size={14} /> : <Copy size={14} />} {copiedAddr ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

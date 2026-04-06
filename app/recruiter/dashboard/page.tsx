'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, Award, ArrowRight } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { storage } from '@/lib/storage';
import type { RecruiterProfile } from '@/lib/types';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [marketCount, setMarketCount] = useState(0);

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
    setMarketCount(storage.getMarketplace().length);
  }, []);

  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Welcome, {profile.name.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{profile.company} · {profile.jobTitle}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Available Talent', value: marketCount, sub: 'in marketplace', color: 'var(--proof)', action: () => router.push('/recruiter/marketplace') },
            { label: 'Saved Candidates', value: profile.savedCandidates.length, sub: 'shortlisted', color: '#0066FF', action: () => router.push('/recruiter/candidates') },
            { label: 'Hired Talent', value: profile.hiredTalent.length, sub: 'total hired', color: '#FF6B6B', action: () => router.push('/recruiter/hired') },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', borderRadius: 14, cursor: 'pointer' }} onClick={s.action}>
              <div style={{ fontSize: 28, fontFamily: 'var(--font-syne)', fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700 }}>
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => router.push('/recruiter/marketplace')}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Users size={22} color="var(--proof)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Browse Talent</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              {marketCount} talent{marketCount !== 1 ? 's' : ''} currently open for work. Filter by role, skills, and education.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--proof)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              View Marketplace <ArrowRight size={14} />
            </div>
          </div>

          <div className="glass-card" style={{ borderRadius: 16, padding: 24, cursor: 'pointer' }} onClick={() => router.push('/recruiter/candidates')}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <UserCheck size={22} color="#0066FF" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Saved Candidates</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              {profile.savedCandidates.length} candidate{profile.savedCandidates.length !== 1 ? 's' : ''} shortlisted. Send interview links and manage hiring.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0066FF', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              View Candidates <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

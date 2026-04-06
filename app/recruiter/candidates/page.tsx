'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Calendar, CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { storage } from '@/lib/storage';
import type { RecruiterProfile, SavedCandidate } from '@/lib/types';

export default function RecruiterCandidates() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [calendlyModal, setCalendlyModal] = useState<SavedCandidate | null>(null);
  const [calendlyLink, setCalendlyLink] = useState('');

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
  }, []);

  const handleMarkHired = (candidate: SavedCandidate) => {
    if (!profile) return;
    const updated = {
      ...profile,
      savedCandidates: profile.savedCandidates.map(c =>
        c.walletAddress === candidate.walletAddress ? { ...c, status: 'hired' as const } : c
      ),
      hiredTalent: [...profile.hiredTalent, {
        walletAddress: candidate.walletAddress, name: candidate.name,
        position: candidate.jobTitle, hiredAt: new Date().toISOString(),
      }],
    };
    storage.setRecruiter(updated as RecruiterProfile);
    // Also update talent hired status
    localStorage.setItem(`proofhire_hired_talent_${candidate.walletAddress}`, JSON.stringify({
      company: profile.company, position: candidate.jobTitle, hiredAt: new Date().toISOString(),
    }));
    setProfile(updated as RecruiterProfile);
  };

  const handleReject = (candidate: SavedCandidate) => {
    if (!profile) return;
    const updated = { ...profile, savedCandidates: profile.savedCandidates.filter(c => c.walletAddress !== candidate.walletAddress) };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
  };

  const handleSendInterview = () => {
    if (!calendlyModal || !calendlyLink || !profile) return;
    storage.addInterview(calendlyModal.walletAddress, {
      recruiterWallet: profile.walletAddress, companyName: profile.company,
      companyMission: profile.mission, position: calendlyModal.jobTitle,
      calendlyLink, sentAt: new Date().toISOString(), status: 'pending',
    });
    const updated = {
      ...profile,
      savedCandidates: profile.savedCandidates.map(c =>
        c.walletAddress === calendlyModal.walletAddress ? { ...c, interviewLinkSent: true } : c
      ),
    };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
    setCalendlyModal(null);
    setCalendlyLink('');
  };

  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Saved Candidates</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Shortlisted talent. Send interview links and manage your pipeline.</p>
        </div>

        {profile.savedCandidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 16, border: '1px dashed var(--border)', maxWidth: 500 }}>
            <UserCheck size={44} color="var(--text-dimmer)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No candidates saved yet</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>Browse the talent marketplace and save candidates you want to hire.</p>
            <button onClick={() => router.push('/recruiter/marketplace')} className="btn-proof" style={{ marginTop: 24, padding: '11px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
            {profile.savedCandidates.map((c) => (
              <div key={c.walletAddress} className="glass-card" style={{ borderRadius: 14, padding: 22, borderColor: c.status === 'hired' ? 'rgba(0,255,135,0.2)' : 'var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>{c.name}</h3>
                      <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--font-dm-mono)', background: c.status === 'hired' ? 'rgba(0,255,135,0.1)' : c.status === 'rejected' ? 'rgba(255,100,100,0.1)' : 'rgba(255,150,0,0.1)', color: c.status === 'hired' ? 'var(--proof)' : c.status === 'rejected' ? '#FF6B6B' : '#FF9900', border: `1px solid ${c.status === 'hired' ? 'rgba(0,255,135,0.2)' : c.status === 'rejected' ? 'rgba(255,100,100,0.2)' : 'rgba(255,150,0,0.2)'}` }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>{c.jobTitle}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmer)', fontFamily: 'var(--font-dm-mono)' }}>{c.walletAddress?.slice(0, 16)}...</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmer)', marginTop: 4 }}>Saved {new Date(c.savedAt).toLocaleDateString()}</div>
                  </div>

                  {c.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => setCalendlyModal(c)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', cursor: 'pointer', color: 'var(--proof)', fontSize: 13, fontFamily: 'var(--font-syne)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} /> {c.interviewLinkSent ? 'Resend Link' : 'Send Interview Link'}
                      </button>
                      {c.interviewLinkSent && (
                        <>
                          <button onClick={() => handleMarkHired(c)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)', cursor: 'pointer', color: 'var(--proof)', fontSize: 13, fontFamily: 'var(--font-syne)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={13} /> Hire
                          </button>
                          <button onClick={() => handleReject(c)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', cursor: 'pointer', color: '#FF6B6B', fontSize: 13, fontFamily: 'var(--font-syne)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {c.status === 'hired' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--proof)' }}>
                      <CheckCircle size={14} /> Hired
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {calendlyModal && (
        <div className="modal-overlay">
          <div style={{ background: 'var(--bg-2)', borderRadius: 20, padding: 36, maxWidth: 440, width: '90%', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Send Interview Link</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 20 }}>To: <strong>{calendlyModal.name}</strong></p>
            <input placeholder="Your Calendly or meeting link" value={calendlyLink} onChange={e => setCalendlyLink(e.target.value)} style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 14px', borderRadius: 10, fontSize: 14, outline: 'none', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setCalendlyModal(null); setCalendlyLink(''); }} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-dim)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSendInterview} disabled={!calendlyLink} className="btn-proof" style={{ flex: 1, padding: '11px', borderRadius: 10, cursor: calendlyLink ? 'pointer' : 'not-allowed', opacity: !calendlyLink ? 0.5 : 1, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

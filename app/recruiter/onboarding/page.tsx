'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight } from 'lucide-react';
import { storage } from '@/lib/storage';
import type { RecruiterProfile } from '@/lib/types';

const INPUT = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 14px', borderRadius: 10, fontFamily: 'var(--font-dm-sans)', fontSize: 14, outline: 'none' };

export default function RecruiterOnboarding() {
  const router = useRouter();
  const [walletAddr, setWalletAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', jobTitle: '', company: '', mission: '', objectives: '' });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    setWalletAddr(addr);
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.company) return;
    setLoading(true);
    const profile: RecruiterProfile = {
      walletAddress: walletAddr,
      name: form.name, jobTitle: form.jobTitle, company: form.company,
      mission: form.mission, objectives: form.objectives,
      savedCandidates: [], hiredTalent: [], teamMembers: [], calendlyLink: '',
    };
    storage.setRecruiter(profile);
    router.push('/recruiter/dashboard');
  };

  const canSubmit = form.name && form.company;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--proof)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20 }}>
            ProofHire <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 14 }}>/ Recruiter Setup</span>
          </span>
        </div>

        <div className="glass-card" style={{ borderRadius: 20, padding: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 26, marginBottom: 8, letterSpacing: '-0.02em' }}>Tell us about your company</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>This info will be shown to talents when you reach out to hire them.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Your Full Name *" value={form.name} onChange={e => update('name', e.target.value)} style={INPUT} />
              <input placeholder="Your Role (e.g. HR Manager)" value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} style={INPUT} />
            </div>
            <input placeholder="Company Name *" value={form.company} onChange={e => update('company', e.target.value)} style={INPUT} />
            <textarea placeholder="Company Mission Statement" value={form.mission} onChange={e => update('mission', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical' }} />
            <textarea placeholder="Company Objectives" value={form.objectives} onChange={e => update('objectives', e.target.value)} rows={3} style={{ ...INPUT, resize: 'vertical' }} />

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="btn-proof"
              style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 16, cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: !canSubmit ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 700, marginTop: 8 }}>
              Enter Dashboard <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Building, ExternalLink, Calendar, Clock } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';
import type { InterviewRequest } from '@/lib/types';

export default function TalentInterviews() {
  const router = useRouter();
  const [requests, setRequests] = useState<InterviewRequest[]>([]);
  const [walletAddr, setWalletAddr] = useState('');

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    setWalletAddr(addr);
    setRequests(storage.getInterviews(addr));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Interview Requests</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Companies that want to hire you will appear here.</p>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 16, border: '1px dashed var(--border)', maxWidth: 600 }}>
            <Mail size={44} color="var(--text-dimmer)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No interview requests yet</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
              Make sure your CV is live and Open for Work is turned on. Recruiters will send you interview links once they verify your proofs.
            </p>
            <button onClick={() => router.push('/talent/dashboard')} className="btn-proof" style={{ marginTop: 24, padding: '11px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              Check Dashboard
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
            {requests.map((r, i) => (
              <div key={i} className="glass-card" style={{ borderRadius: 16, padding: 24, borderColor: 'rgba(0,255,135,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building size={20} color="var(--proof)" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{r.companyName}</h3>
                      <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Hiring for: <strong style={{ color: 'var(--text)' }}>{r.position}</strong></div>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 100, fontSize: 12, fontFamily: 'var(--font-dm-mono)',
                    background: r.status === 'pending' ? 'rgba(255,150,0,0.1)' : 'rgba(0,255,135,0.1)',
                    border: `1px solid ${r.status === 'pending' ? 'rgba(255,150,0,0.25)' : 'rgba(0,255,135,0.25)'}`,
                    color: r.status === 'pending' ? '#FF9900' : 'var(--proof)',
                  }}>
                    {r.status}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{r.companyMission}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--text-dimmer)' }}>
                  <Clock size={13} />
                  Sent {new Date(r.sentAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {r.calendlyLink && (
                  <a href={r.calendlyLink} target="_blank" rel="noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10,
                      background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)',
                      color: 'var(--proof)', textDecoration: 'none', fontSize: 14,
                      fontFamily: 'var(--font-syne)', fontWeight: 600,
                    }}>
                    <Calendar size={15} /> Schedule Interview <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

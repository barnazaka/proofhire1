'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Briefcase } from 'lucide-react';
import WalletConnect from '@/components/WalletConnect';
import { storage } from '@/lib/storage';

export default function RecruiterAuth() {
  const router = useRouter();

  useEffect(() => {
    const addr = storage.getWallet();
    const role = storage.getRole();
    if (addr && role === 'recruiter') {
      const profile = storage.getRecruiter(addr);
      router.push(profile ? '/recruiter/dashboard' : '/recruiter/onboarding');
    }
  }, []);

  const handleConnected = (address: string) => {
    const profile = storage.getRecruiter(address);
    router.push(profile ? '/recruiter/dashboard' : '/recruiter/onboarding');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div className="grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      <div style={{
        position: 'absolute', top: '30%', right: '30%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(0,102,255,0.05) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        <button
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-dim)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32, padding: 0 }}>
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="glass-card" style={{ borderRadius: 20, padding: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #00FF87, #00CC6A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#000" />
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20 }}>
              Proof<span style={{ color: 'var(--proof)' }}>Hire</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 100, background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.2)', marginBottom: 20 }}>
            <Briefcase size={14} color="#0066FF" />
            <span style={{ fontSize: 13, color: '#0066FF', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>Recruiter Portal</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Hire on verified proof
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            Connect your Lace Wallet to access the talent marketplace. Verify credentials on the Midnight blockchain — no raw data, just proof.
          </p>

          <WalletConnect role="recruiter" onConnected={handleConnected} />
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-dimmer)' }}>
          Are you a job seeker?{' '}
          <button onClick={() => router.push('/talent/auth')} style={{ color: 'var(--proof)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
            Go to Talent Portal →
          </button>
        </p>
      </div>
    </div>
  );
}

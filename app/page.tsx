'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Eye, Lock, Zap, ArrowRight, Github, Twitter, Sun, Moon, ChevronRight, Database, Key, Fingerprint } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrollY, setScrollY] = useState(0);
  const [activeProof, setActiveProof] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProof(p => (p + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const proofTypes = [
    { label: 'Proof of Degree', icon: '🎓' },
    { label: 'Proof of Skills', icon: '⚡' },
    { label: 'Proof of Experience', icon: '💼' },
    { label: 'Proof of Certification', icon: '🏆' },
  ];

  const steps = [
    { num: '01', title: 'Build Your CV', desc: 'Fill in your credentials. Everything stays encrypted in your browser. Nothing leaves your device as raw data.' },
    { num: '02', title: 'Generate ZK Proofs', desc: 'Each section of your CV gets its own Zero Knowledge Proof — cryptographic evidence you hold that credential, without exposing it.' },
    { num: '03', title: 'Go Live on Chain', desc: 'Your proof commitments are deployed to Midnight Network. Your identity stays yours. Only the math goes on chain.' },
    { num: '04', title: 'Recruiters Verify', desc: 'Recruiters verify your claims on chain without seeing a single piece of raw data. Hire based on proof, not trust.' },
  ];

  const features = [
    {
      icon: <Lock size={20} />,
      title: 'Zero Raw Data On Chain',
      desc: 'Your name, school, employer — none of it touches the blockchain. Only cryptographic commitments are stored.'
    },
    {
      icon: <Shield size={20} />,
      title: 'Midnight Network Powered',
      desc: 'Built on the most privacy-focused blockchain in existence. Kachina protocol ensures private state never leaves your machine.'
    },
    {
      icon: <Fingerprint size={20} />,
      title: 'Wallet-Based Identity',
      desc: 'Your Lace Wallet is your identity. No email. No password. No account. Just your cryptographic key.'
    },
    {
      icon: <Eye size={20} />,
      title: 'Selective Disclosure',
      desc: 'Choose exactly what you prove. Share proof of skills without sharing your school. Complete control.'
    },
    {
      icon: <Database size={20} />,
      title: 'Immutable Verification',
      desc: 'Once verified on chain, it stays verified. No fake credentials. No data tampering. Math does not lie.'
    },
    {
      icon: <Key size={20} />,
      title: 'Recruiter Privacy Too',
      desc: 'Recruiters verify claims without storing candidate data. Compliance-friendly by architecture.'
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 50 ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #00FF87 0%, #00CC6A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20 }}>
            Proof<span style={{ color: 'var(--proof)' }}>Hire</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => router.push('/talent/auth')}
            className="btn-outline"
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: 14, cursor: 'pointer' }}>
            I&apos;m Talent
          </button>
          <button
            onClick={() => router.push('/recruiter/auth')}
            className="btn-proof"
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: 14, cursor: 'pointer' }}>
            I&apos;m a Recruiter
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '20%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(0,102,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 900 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            border: '1px solid rgba(0,255,135,0.3)',
            background: 'rgba(0,255,135,0.05)',
            marginBottom: 32, fontSize: 13,
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--proof)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--proof)', display: 'inline-block' }} />
            Built on Midnight Network · Preview Testnet
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(48px, 8vw, 88px)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Hire on proof.
            <br />
            <span style={{ color: 'var(--proof)' }} className="proof-text-glow">Not paper.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-dim)',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            ProofHire uses Zero Knowledge Proofs on the Midnight Network to let candidates prove their credentials to recruiters — without exposing a single byte of personal data.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button
              onClick={() => router.push('/talent/auth')}
              className="btn-proof"
              style={{
                padding: '14px 28px', borderRadius: 10, fontSize: 16,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
              Get Started as Talent <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/recruiter/auth')}
              className="btn-outline"
              style={{
                padding: '14px 28px', borderRadius: 10, fontSize: 16,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
              Hire Verified Talent <ChevronRight size={18} />
            </button>
          </div>

          {/* Live proof ticker */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '12px 20px', borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg-2)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-dm-mono)' }}>
              Now proving:
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {proofTypes.map((p, i) => (
                <div key={i} style={{
                  padding: '4px 12px', borderRadius: 100, fontSize: 12,
                  background: i === activeProof ? 'rgba(0,255,135,0.1)' : 'transparent',
                  border: i === activeProof ? '1px solid rgba(0,255,135,0.3)' : '1px solid transparent',
                  color: i === activeProof ? 'var(--proof)' : 'var(--text-dimmer)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-dm-mono)',
                  whiteSpace: 'nowrap',
                }}>
                  {p.icon} {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--proof)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            The Process
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            How ZK Hiring Works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <div key={i} className="glass-card" style={{ padding: 28, borderRadius: 16, position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-syne)', fontSize: 48, fontWeight: 800,
                color: 'rgba(0,255,135,0.1)', lineHeight: 1, marginBottom: 16,
              }}>
                {step.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: -12, top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'none',
                }}>
                  <ArrowRight size={20} color="var(--proof)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ZK VISUAL */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--proof)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Zero Knowledge Proofs
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Your data stays yours. The proof is all they need.
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Midnight&apos;s Kachina protocol keeps your private state on your device. Only cryptographic commitments — mathematical proofs of truth — are written to the blockchain. Recruiters verify the math, not the data.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['School name stays private', 'Company names never exposed', 'Skills proved without revealing', 'All verification on Midnight chain'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                  <CheckCircle size={16} color="var(--proof)" />
                  <span style={{ color: 'var(--text-dim)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ZK visualization */}
          <div style={{
            background: 'var(--bg-3)', borderRadius: 20, padding: 32,
            border: '1px solid var(--border)', fontFamily: 'var(--font-dm-mono)',
            fontSize: 13, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ color: 'var(--text-dimmer)', marginBottom: 16, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ZK Proof Generation
            </div>
            {[
              { label: 'private_input', value: '{ school: "..." }', color: '#FF6B6B' },
              { label: 'witness', value: 'getSchoolCredential()', color: '#FFD93D' },
              { label: 'circuit', value: 'commitCredential(school, sk)', color: '#6BCB77' },
              { label: 'commitment', value: '0x4f3a...c891', color: 'var(--proof)' },
              { label: 'on_chain', value: 'proofOfSchool ✓', color: 'var(--proof)' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: row.color, minWidth: 120 }}>{row.label}</span>
                <span style={{ color: 'var(--text-dim)' }}>=</span>
                <span style={{ color: 'var(--text)' }}>{row.value}</span>
              </div>
            ))}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              padding: '4px 10px', borderRadius: 100,
              background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)',
              fontSize: 11, color: 'var(--proof)',
            }}>
              ✓ Private data never exposed
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--proof)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            Platform Features
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Built for the privacy era
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: 24, borderRadius: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--proof)', marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto', textAlign: 'center',
          padding: '64px 40px', borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(0,255,135,0.05) 0%, rgba(0,102,255,0.05) 100%)',
          border: '1px solid rgba(0,255,135,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,255,135,0.05) 0%, transparent 70%)',
          }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Ready to prove your worth?
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 17, marginBottom: 36, lineHeight: 1.6 }}>
              Join the future of hiring where credentials are verified on chain and privacy is non-negotiable.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/talent/auth')}
                className="btn-proof"
                style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start as Talent <ArrowRight size={18} />
              </button>
              <button
                onClick={() => router.push('/recruiter/auth')}
                className="btn-outline"
                style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, cursor: 'pointer' }}>
                Start as Recruiter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--proof)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={14} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}>ProofHire</span>
          <span style={{ color: 'var(--text-dimmer)', fontSize: 13 }}>· Privacy-first hiring on Midnight Network</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-dimmer)' }}>
          <span>Built for Midnight Hackathon 2026</span>
          <a href="https://midnight.network" target="_blank" rel="noreferrer" style={{ color: 'var(--proof)', textDecoration: 'none' }}>Midnight Network</a>
        </div>
      </footer>
    </div>
  );
}

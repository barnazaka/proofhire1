'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2, UserPlus, Shield, GraduationCap, Zap, Briefcase, Award, Copy, Check } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { storage } from '@/lib/storage';
import { verifyOnChain } from '@/lib/midnight-utils';
import type { RecruiterProfile } from '@/lib/types';

export default function RecruiterMarketplace() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [talents, setTalents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterEdu, setFilterEdu] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyResults, setVerifyResults] = useState<Record<string, Record<string, boolean | null>>>({});
  const [verifySteps, setVerifySteps] = useState<Record<string, string>>({});
  const [hired, setHired] = useState<Set<string>>(new Set());
  const [copiedContract, setCopiedContract] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [calendlyModal, setCalendlyModal] = useState<{ talent: any } | null>(null);
  const [calendlyLink, setCalendlyLink] = useState('');

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
    const market = storage.getMarketplace();
    setTalents(market);
    setFiltered(market);
    setHired(new Set(p.savedCandidates.map((c: any) => c.walletAddress)));
  }, []);

  useEffect(() => {
    let result = talents;
    if (search) result = result.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.jobTitle?.toLowerCase().includes(search.toLowerCase()));
    if (filterRole) result = result.filter(t => t.jobTitle?.toLowerCase().includes(filterRole.toLowerCase()));
    if (filterEdu) result = result.filter(t => t.education?.degree?.toLowerCase().includes(filterEdu.toLowerCase()));
    if (filterExp) {
      result = result.filter(t => {
        const years = parseInt(t.experience?.[0]?.years || '0');
        if (filterExp === '0-1') return years <= 1;
        if (filterExp === '1-3') return years > 1 && years <= 3;
        if (filterExp === '3-5') return years > 3 && years <= 5;
        if (filterExp === '5+') return years > 5;
        return true;
      });
    }
    setFiltered(result);
  }, [search, filterRole, filterExp, filterEdu, talents]);

  const handleVerify = async (talent: any, claimType: 'school' | 'skills' | 'experience' | 'certifications') => {
    const key = `${talent.walletAddress}_${claimType}`;
    setVerifying(key);
    const commitment = talent.proofs?.[claimType];
    if (!commitment) {
      setVerifyResults(r => ({ ...r, [talent.walletAddress]: { ...r[talent.walletAddress], [claimType]: false } }));
      setVerifying(null);
      return;
    }
    const result = await verifyOnChain(talent.contractAddress, commitment, claimType, (msg) => setVerifySteps(s => ({ ...s, [key]: msg })));
    setVerifyResults(r => ({ ...r, [talent.walletAddress]: { ...r[talent.walletAddress], [claimType]: result } }));
    setVerifying(null);
    setVerifySteps(s => ({ ...s, [key]: '' }));
  };

  const handleSaveCandidate = (talent: any) => {
    if (!profile) return;
    const updated = {
      ...profile,
      savedCandidates: [...profile.savedCandidates.filter(c => c.walletAddress !== talent.walletAddress), {
        walletAddress: talent.walletAddress, name: talent.name, jobTitle: talent.jobTitle,
        savedAt: new Date().toISOString(), interviewLinkSent: false, status: 'pending',
        contractAddress: talent.contractAddress,
      }],
    };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
    setHired(h => new Set([...h, talent.walletAddress]));
    setSaveSuccess(talent.walletAddress);
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleSendInterview = () => {
    if (!calendlyModal || !calendlyLink || !profile) return;
    storage.addInterview(calendlyModal.talent.walletAddress, {
      recruiterWallet: profile.walletAddress,
      companyName: profile.company,
      companyMission: profile.mission,
      position: calendlyModal.talent.jobTitle,
      calendlyLink,
      sentAt: new Date().toISOString(),
      status: 'pending',
    });
    const updated = { ...profile, calendlyLink };
    storage.setRecruiter(updated as RecruiterProfile);
    setCalendlyModal(null);
    setCalendlyLink('');
  };

  const copyContract = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedContract(addr);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  const SELECT = { background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', cursor: 'pointer' };

  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Talent Marketplace</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{filtered.length} talent{filtered.length !== 1 ? 's' : ''} open for work · All credentials verifiable on Midnight Network</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
            <Search size={15} color="var(--text-dimmer)" />
            <input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, width: '100%' }} />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={SELECT}>
            <option value="">All Roles</option>
            {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'Social Media Manager', 'Graphic Designer', 'Marketing Manager'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={filterEdu} onChange={e => setFilterEdu(e.target.value)} style={SELECT}>
            <option value="">All Education</option>
            {["Bachelor's", "Master's", "PhD", "Bootcamp", "High School"].map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={filterExp} onChange={e => setFilterExp(e.target.value)} style={SELECT}>
            <option value="">All Experience</option>
            <option value="0-1">0–1 years</option>
            <option value="1-3">1–3 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        {/* Talent cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 16, border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: 16 }}>No talent found matching your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((talent) => {
              const isExpanded = expanded === talent.walletAddress;
              const vr = verifyResults[talent.walletAddress] || {};
              return (
                <div key={talent.walletAddress} className="glass-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                  {/* Card header */}
                  <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: 'var(--proof)' }}>
                        {talent.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{talent.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{talent.jobTitle}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', fontSize: 12, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)' }}>
                        Open for Work
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-dimmer)', fontFamily: 'var(--font-dm-mono)' }}>
                        {talent.walletAddress?.slice(0, 10)}...
                      </span>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : talent.walletAddress)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                        {isExpanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Expand CV</>}
                      </button>
                    </div>
                  </div>

                  {/* Expanded CV */}
                  {isExpanded && (
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ paddingTop: 24 }}>
                        {/* A4-style CV */}
                        <div style={{ background: 'var(--bg-3)', borderRadius: 12, padding: 28, marginBottom: 20, border: '1px solid var(--border)' }}>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{talent.name}</div>
                            <div style={{ fontSize: 15, color: 'var(--text-dim)' }}>{talent.jobTitle}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-dimmer)', fontFamily: 'var(--font-dm-mono)', marginTop: 4 }}>{talent.walletAddress}</div>
                          </div>

                          {/* ZK sections */}
                          {[
                            { key: 'school' as const, label: 'Education', icon: <GraduationCap size={15} />, message: 'Candidate holds an educational qualification. Raw data is private.' },
                            { key: 'experience' as const, label: 'Work Experience', icon: <Briefcase size={15} />, message: 'Candidate has verified work experience. Company names are private.' },
                            { key: 'skills' as const, label: 'Skills', icon: <Zap size={15} />, message: 'Candidate has verified skills. Individual skills are private.' },
                            { key: 'certifications' as const, label: 'Certifications', icon: <Award size={15} />, message: 'Candidate holds certifications. Details are private.' },
                          ].map(({ key, label, icon, message }) => {
                            const vKey = `${talent.walletAddress}_${key}`;
                            const isVerifying = verifying === vKey;
                            const result = vr[key];
                            const hasProof = !!talent.proofs?.[key];
                            return (
                              <div key={key} style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 10, background: 'var(--bg-2)', border: `1px solid ${result === true ? 'rgba(0,255,135,0.2)' : result === false ? 'rgba(255,100,100,0.2)' : 'var(--border)'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: 'var(--text-dim)' }}>{icon}</span>
                                    <div>
                                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Proof of {label}</div>
                                      {result === undefined && <div style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>{message}</div>}
                                      {result === true && <div style={{ fontSize: 12, color: 'var(--proof)' }}>✓ Verified on Midnight Network</div>}
                                      {result === false && <div style={{ fontSize: 12, color: '#FF6B6B' }}>✗ Proof not found or invalid</div>}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    {isVerifying && verifySteps[vKey] && (
                                      <span style={{ fontSize: 12, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> {verifySteps[vKey]}
                                      </span>
                                    )}
                                    {result === undefined && hasProof && (
                                      <button
                                        onClick={() => handleVerify(talent, key)}
                                        disabled={isVerifying}
                                        style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.25)', cursor: 'pointer', color: 'var(--proof)', fontSize: 12, fontFamily: 'var(--font-syne)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {isVerifying ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Shield size={12} />} Verify
                                      </button>
                                    )}
                                    {result === true && <CheckCircle size={18} color="var(--proof)" />}
                                    {result === false && <XCircle size={18} color="#FF6B6B" />}
                                    {!hasProof && result === undefined && <span style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>No proof</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Contract address */}
                          {talent.contractAddress && (
                            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.12)' }}>
                              <div style={{ fontSize: 11, color: 'var(--text-dimmer)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verification Contract</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--proof)', wordBreak: 'break-all' }}>{talent.contractAddress}</div>
                                <button onClick={() => copyContract(talent.contractAddress)} style={{ padding: '5px 10px', borderRadius: 6, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copiedContract === talent.contractAddress ? 'var(--proof)' : 'var(--text-dimmer)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                                  {copiedContract === talent.contractAddress ? <Check size={11} /> : <Copy size={11} />} Copy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          {!hired.has(talent.walletAddress) ? (
                            <button onClick={() => handleSaveCandidate(talent)} className="btn-proof" style={{ flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                              <UserPlus size={16} /> I Want to Hire This Person
                            </button>
                          ) : (
                            <>
                              <div style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', fontSize: 14, color: 'var(--proof)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <CheckCircle size={16} /> {saveSuccess === talent.walletAddress ? 'Saved!' : 'Saved to Candidates'}
                              </div>
                              <button onClick={() => setCalendlyModal({ talent })} style={{ padding: '12px 20px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                                Send Interview Link
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Calendly modal */}
      {calendlyModal && (
        <div className="modal-overlay">
          <div style={{ background: 'var(--bg-2)', borderRadius: 20, padding: 36, maxWidth: 440, width: '90%', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Send Interview Link</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 20 }}>
              Sending to: <strong style={{ color: 'var(--text)' }}>{calendlyModal.talent.name}</strong>
            </p>
            <input
              placeholder="Your Calendly or meeting link (e.g. calendly.com/yourname)"
              value={calendlyLink}
              onChange={e => setCalendlyLink(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 14px', borderRadius: 10, fontSize: 14, outline: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setCalendlyModal(null); setCalendlyLink(''); }} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-dim)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSendInterview} disabled={!calendlyLink} className="btn-proof" style={{ flex: 1, padding: '11px', borderRadius: 10, cursor: calendlyLink ? 'pointer' : 'not-allowed', opacity: !calendlyLink ? 0.5 : 1, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>Send Link</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

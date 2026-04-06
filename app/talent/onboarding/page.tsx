'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, ChevronLeft, Plus, X, Loader2, CheckCircle, Zap, GraduationCap, Briefcase, Star, Award, Heart } from 'lucide-react';
import { storage } from '@/lib/storage';
import { generateZKProof, deployContract } from '@/lib/midnight-utils';
import ContractModal from '@/components/ContractModal';
import type { TalentProfile } from '@/lib/types';

const STEPS = ['Personal Info', 'Education', 'Work Experience', 'Skills', 'Certifications', 'Hobbies', 'Review & Save'];

const INPUT_STYLE = {
  width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
  color: 'var(--text)', padding: '12px 14px', borderRadius: 10,
  fontFamily: 'var(--font-dm-sans)', fontSize: 14, outline: 'none',
};

export default function TalentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [walletAddr, setWalletAddr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState('');

  const [proofs, setProofs] = useState({
    school: null as string | null,
    skills: null as string | null,
    experience: null as string | null,
    certifications: null as string | null,
  });
  const [proofLoading, setProofLoading] = useState({ school: false, skills: false, experience: false, certs: false });
  const [proofSteps, setProofSteps] = useState({ school: '', skills: '', experience: '', certs: '' });

  const [form, setForm] = useState({
    name: '', headline: '', bio: '', location: '', email: '', phone: '',
    degree: '', field: '', institution: '', gradYear: '',
    jobTitle: '', company: '', yearsExp: '', responsibilities: '',
    primaryRole: '', skills: [] as { name: string; level: string }[],
    skillInput: '', certName: '', certIssuer: '', certYear: '',
    certifications: [] as { name: string; issuer: string; year: string }[],
    hobbies: [] as string[], hobbyInput: '',
  });

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    setWalletAddr(addr);
  }, []);

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = () => {
    if (!form.skillInput.trim()) return;
    setForm(f => ({ ...f, skills: [...f.skills, { name: f.skillInput.trim(), level: 'Intermediate' }], skillInput: '' }));
  };

  const addHobby = () => {
    if (!form.hobbyInput.trim()) return;
    setForm(f => ({ ...f, hobbies: [...f.hobbies, f.hobbyInput.trim()], hobbyInput: '' }));
  };

  const addCert = () => {
    if (!form.certName.trim()) return;
    setForm(f => ({ ...f, certifications: [...f.certifications, { name: f.certName, issuer: f.certIssuer, year: f.certYear }], certName: '', certIssuer: '', certYear: '' }));
  };

  const generateProof = async (type: 'school' | 'skills' | 'experience' | 'certs') => {
    setProofLoading(p => ({ ...p, [type]: true }));
    const dataMap = {
      school: `${form.degree}|${form.field}|${form.institution}|${form.gradYear}`,
      skills: form.skills.map(s => s.name).join(','),
      experience: `${form.jobTitle}|${form.company}|${form.yearsExp}`,
      certs: form.certifications.map(c => c.name).join(','),
    };
    try {
      const { commitment } = await generateZKProof(
        dataMap[type], type, walletAddr,
        (msg) => setProofSteps(p => ({ ...p, [type]: msg }))
      );
      setProofs(p => ({ ...p, [type === 'certs' ? 'certifications' : type]: commitment }));
    } catch (e) { console.error(e); }
    setProofLoading(p => ({ ...p, [type]: false }));
    setProofSteps(p => ({ ...p, [type]: '' }));
  };

  const handleSave = async () => {
    setDeploying(true);
    try {
      const contractAddress = await deployContract(walletAddr, (msg) => setDeployStep(msg));
      const profile: TalentProfile = {
        walletAddress: walletAddr,
        name: form.name, headline: form.headline, bio: form.bio,
        location: form.location, email: form.email, phone: form.phone,
        jobTitle: form.primaryRole, openForWork: false,
        education: { degree: form.degree, field: form.field, institution: form.institution, year: form.gradYear },
        experience: [{ title: form.jobTitle, company: form.company, years: form.yearsExp, responsibilities: form.responsibilities }],
        skills: form.skills, certifications: form.certifications, hobbies: form.hobbies,
        proofs, contractAddress, cvStatus: 'LIVE',
        deployedContracts: [{ address: contractAddress, timestamp: new Date().toISOString(), type: 'Initial CV Deployment' }],
      };
      storage.setTalent(profile);
      setDeployedAddress(contractAddress);
      setShowModal(true);
    } catch (e) { console.error(e); }
    setDeploying(false);
  };

  const ProofButton = ({ type, label, icon, hasData }: { type: 'school' | 'skills' | 'experience' | 'certs', label: string, icon: any, hasData: boolean }) => {
    const proofKey = type === 'certs' ? 'certifications' : type;
    const isProved = proofs[proofKey as keyof typeof proofs];
    const isLoading = proofLoading[type];
    const step = proofSteps[type];

    return (
      <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: isProved ? 'rgba(0,255,135,0.05)' : 'var(--bg-3)', border: `1px solid ${isProved ? 'rgba(0,255,135,0.3)' : 'var(--border)'}`, transition: 'all 0.3s ease' }}>
        {isProved ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} color="var(--proof)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--proof)', fontFamily: 'var(--font-syne)' }}>{label} Proof Generated</div>
              <div style={{ fontSize: 11, color: 'var(--text-dimmer)', fontFamily: 'var(--font-dm-mono)', marginTop: 2 }}>
                0x{(proofs[proofKey as keyof typeof proofs] || '').slice(0, 24)}...
              </div>
            </div>
          </div>
        ) : (
          <>
            {isLoading && step && (
              <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> {step}
              </div>
            )}
            <button
              onClick={() => generateProof(type)}
              disabled={isLoading || !hasData}
              className={hasData ? 'btn-proof' : ''}
              style={{
                width: '100%', padding: '11px', borderRadius: 8, fontSize: 14, cursor: hasData && !isLoading ? 'pointer' : 'not-allowed',
                opacity: !hasData ? 0.4 : 1,
                background: !hasData ? 'var(--bg-3)' : undefined,
                border: !hasData ? '1px solid var(--border)' : undefined,
                color: !hasData ? 'var(--text-dim)' : undefined,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'var(--font-syne)', fontWeight: 600,
              }}>
              {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating ZK Proof...</> : <><Zap size={16} /> Generate {label} Proof</>}
            </button>
            {!hasData && <p style={{ fontSize: 12, color: 'var(--text-dimmer)', marginTop: 8, textAlign: 'center' }}>Fill in the fields above first</p>}
          </>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Personal Information</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>This information will be shown on your profile card in the marketplace.</p>
          <input className="input-field" placeholder="Full Name *" value={form.name} onChange={e => update('name', e.target.value)} style={INPUT_STYLE} />
          <input className="input-field" placeholder="Professional Headline (e.g. Senior React Developer)" value={form.headline} onChange={e => update('headline', e.target.value)} style={INPUT_STYLE} />
          <textarea placeholder="Short Bio / About Me" value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} style={{ ...INPUT_STYLE, resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input-field" placeholder="Location (City, Country)" value={form.location} onChange={e => update('location', e.target.value)} style={INPUT_STYLE} />
            <input className="input-field" placeholder="Email Address" value={form.email} onChange={e => update('email', e.target.value)} style={INPUT_STYLE} />
          </div>
          <input className="input-field" placeholder="Phone Number" value={form.phone} onChange={e => update('phone', e.target.value)} style={INPUT_STYLE} />
        </div>
      );
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Education</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>Your school info stays private. Only a ZK proof commitment goes on chain.</p>
          <select value={form.degree} onChange={e => update('degree', e.target.value)} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
            <option value="">Highest Degree *</option>
            {["High School", "Associate's", "Bachelor's", "Master's", "PhD", "Bootcamp", "Self-taught", "Other"].map(d => <option key={d}>{d}</option>)}
          </select>
          <input className="input-field" placeholder="Field of Study (e.g. Computer Science)" value={form.field} onChange={e => update('field', e.target.value)} style={INPUT_STYLE} />
          <input className="input-field" placeholder="Institution Name" value={form.institution} onChange={e => update('institution', e.target.value)} style={INPUT_STYLE} />
          <input className="input-field" placeholder="Graduation Year" value={form.gradYear} onChange={e => update('gradYear', e.target.value)} style={INPUT_STYLE} />
          <ProofButton type="school" label="School" icon={<GraduationCap size={16} />} hasData={!!form.degree && !!form.institution} />
        </div>
      );
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Work Experience</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>Company names and roles stay private. A ZK proof proves you have the experience.</p>
          <input className="input-field" placeholder="Most Recent Job Title" value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} style={INPUT_STYLE} />
          <input className="input-field" placeholder="Company Name" value={form.company} onChange={e => update('company', e.target.value)} style={INPUT_STYLE} />
          <input className="input-field" placeholder="Total Years of Experience" type="number" value={form.yearsExp} onChange={e => update('yearsExp', e.target.value)} style={INPUT_STYLE} />
          <textarea placeholder="Key responsibilities / achievements" value={form.responsibilities} onChange={e => update('responsibilities', e.target.value)} rows={3} style={{ ...INPUT_STYLE, resize: 'vertical' }} />
          <ProofButton type="experience" label="Experience" icon={<Briefcase size={16} />} hasData={!!form.jobTitle && !!form.yearsExp} />
        </div>
      );
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Skills</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>Add all your skills. ZK proof proves you have them without revealing everything.</p>
          <input className="input-field" placeholder="Primary Role / Job Title for Marketplace *" value={form.primaryRole} onChange={e => update('primaryRole', e.target.value)} style={INPUT_STYLE} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-field" placeholder="Add a skill (press Enter)" value={form.skillInput} onChange={e => update('skillInput', e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ ...INPUT_STYLE, flex: 1 }} />
            <button onClick={addSkill} className="btn-proof" style={{ padding: '12px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <Plus size={16} />
            </button>
          </div>
          {form.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {form.skills.map((s, i) => (
                <div key={i} className="tag">
                  {s.name}
                  <button onClick={() => setForm(f => ({ ...f, skills: f.skills.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <ProofButton type="skills" label="Skills" icon={<Star size={16} />} hasData={form.skills.length > 0} />
        </div>
      );
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Certifications</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>Optional. Add any certifications you hold.</p>
          <input className="input-field" placeholder="Certification Name" value={form.certName} onChange={e => update('certName', e.target.value)} style={INPUT_STYLE} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input-field" placeholder="Issuing Body" value={form.certIssuer} onChange={e => update('certIssuer', e.target.value)} style={INPUT_STYLE} />
            <input className="input-field" placeholder="Year" value={form.certYear} onChange={e => update('certYear', e.target.value)} style={INPUT_STYLE} />
          </div>
          <button onClick={addCert} className="btn-outline" style={{ padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-syne)', fontWeight: 600, border: '1px solid var(--border)' }}>
            <Plus size={14} style={{ marginRight: 6 }} /> Add Certification
          </button>
          {form.certifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.certifications.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14 }}>{c.name} — {c.issuer} ({c.year})</span>
                  <button onClick={() => setForm(f => ({ ...f, certifications: f.certifications.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          {form.certifications.length > 0 && (
            <ProofButton type="certs" label="Certifications" icon={<Award size={16} />} hasData={form.certifications.length > 0} />
          )}
        </div>
      );
      case 5: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Hobbies & Interests</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 8 }}>Show your personality. No ZKP needed here.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-field" placeholder="Add a hobby or interest" value={form.hobbyInput} onChange={e => update('hobbyInput', e.target.value)} onKeyDown={e => e.key === 'Enter' && addHobby()} style={{ ...INPUT_STYLE, flex: 1 }} />
            <button onClick={addHobby} className="btn-proof" style={{ padding: '12px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <Plus size={16} />
            </button>
          </div>
          {form.hobbies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {form.hobbies.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, background: 'var(--bg-3)', border: '1px solid var(--border)', fontSize: 13 }}>
                  <Heart size={12} color="var(--proof)" /> {h}
                  <button onClick={() => setForm(f => ({ ...f, hobbies: f.hobbies.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 0 }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Review & Save CV</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Your CV will be deployed to Midnight Preview Network. Only ZK proof commitments go on chain — never your raw data.</p>

          {/* Summary */}
          {[
            { label: 'Personal', items: [form.name, form.headline, form.location].filter(Boolean) },
            { label: 'Education', items: [form.degree, form.field, form.institution].filter(Boolean) },
            { label: 'Experience', items: [form.jobTitle, `${form.yearsExp} years`, form.company].filter(Boolean) },
            { label: 'Skills', items: form.skills.map(s => s.name) },
            { label: 'Certifications', items: form.certifications.map(c => c.name) },
          ].map((section, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{section.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {section.items.length > 0 ? section.items.map((item, j) => (
                  <span key={j} style={{ padding: '3px 10px', borderRadius: 100, background: 'var(--bg-2)', border: '1px solid var(--border)', fontSize: 13 }}>{item}</span>
                )) : <span style={{ fontSize: 13, color: 'var(--text-dimmer)' }}>Not filled</span>}
              </div>
            </div>
          ))}

          {/* Proof status */}
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.15)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-syne)' }}>ZK Proofs Generated</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'School Proof', key: 'school' as const },
                { label: 'Skills Proof', key: 'skills' as const },
                { label: 'Experience Proof', key: 'experience' as const },
                { label: 'Certifications Proof', key: 'certifications' as const },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  {proofs[key] ? <CheckCircle size={14} color="var(--proof)" /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border)' }} />}
                  <span style={{ color: proofs[key] ? 'var(--text)' : 'var(--text-dimmer)' }}>{label}</span>
                  {proofs[key] && <span style={{ fontSize: 11, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Deploy button */}
          {deploying && deployStep && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.2)', fontSize: 13, color: 'var(--proof)', fontFamily: 'var(--font-dm-mono)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {deployStep}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={deploying || !proofs.school || !proofs.skills || !proofs.experience}
            className="btn-proof"
            style={{
              width: '100%', padding: '14px', borderRadius: 12, fontSize: 16,
              cursor: deploying ? 'wait' : (!proofs.school || !proofs.skills || !proofs.experience) ? 'not-allowed' : 'pointer',
              opacity: !proofs.school || !proofs.skills || !proofs.experience ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-syne)', fontWeight: 700,
            }}>
            {deploying ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Deploying to Midnight...</> : <>Save CV & Go Live on Chain <Zap size={18} /></>}
          </button>
          {(!proofs.school || !proofs.skills || !proofs.experience) && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dimmer)' }}>
              Generate School, Skills, and Experience proofs before saving
            </p>
          )}
        </div>
      );
      default: return null;
    }
  };

  const canNext = () => {
    if (step === 0) return !!form.name;
    if (step === 1) return !!proofs.school;
    if (step === 2) return !!proofs.experience;
    if (step === 3) return !!proofs.skills;
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 580 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--proof)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20 }}>
            ProofHire <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 14 }}>/ Build your ZK CV</span>
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-dim)' }}>Step {step + 1} of {STEPS.length}</span>
            <span style={{ color: 'var(--proof)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>{STEPS[step]}</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: 'var(--proof)', borderRadius: 2, width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ borderRadius: 20, padding: 36 }}>
          {renderStep()}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-outline"
            style={{ padding: '11px 20px', borderRadius: 10, cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
            <ChevronLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              className={canNext() ? 'btn-proof' : ''}
              style={{
                padding: '11px 20px', borderRadius: 10, cursor: canNext() ? 'pointer' : 'not-allowed',
                opacity: !canNext() ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14,
                background: !canNext() ? 'var(--bg-3)' : undefined,
                border: !canNext() ? '1px solid var(--border)' : undefined,
                color: !canNext() ? 'var(--text-dim)' : undefined,
                fontFamily: 'var(--font-syne)', fontWeight: 600,
              }}>
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {showModal && <ContractModal contractAddress={deployedAddress} onClose={() => { setShowModal(false); router.push('/talent/dashboard'); }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

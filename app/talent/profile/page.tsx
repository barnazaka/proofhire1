'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Save, Plus, X, Zap, Loader2, CheckCircle } from 'lucide-react';
import TalentSidebar from '@/components/TalentSidebar';
import { storage } from '@/lib/storage';
import { generateZKProof, deployContract } from '@/lib/midnight-utils';
import ContractModal from '@/components/ContractModal';
import type { TalentProfile } from '@/lib/types';

const INPUT = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '11px 14px', borderRadius: 10, fontFamily: 'var(--font-dm-sans)', fontSize: 14, outline: 'none' };

export default function TalentProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStep, setSaveStep] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/talent/auth'); return; }
    const p = storage.getTalent(addr);
    if (!p) { router.push('/talent/onboarding'); return; }
    setProfile(p);
    setForm({
      name: p.name, headline: p.headline, bio: p.bio, location: p.location,
      email: p.email, phone: p.phone, jobTitle: p.jobTitle,
      degree: p.education.degree, field: p.education.field,
      institution: p.education.institution, gradYear: p.education.year,
      expTitle: p.experience[0]?.title || '', expCompany: p.experience[0]?.company || '',
      expYears: p.experience[0]?.years || '', expResp: p.experience[0]?.responsibilities || '',
      skills: [...p.skills], hobbies: [...p.hobbies],
    });
  }, []);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm((f: any) => ({ ...f, skills: [...f.skills, { name: skillInput.trim(), level: 'Intermediate' }] }));
    setSkillInput('');
  };

  const addHobby = () => {
    if (!hobbyInput.trim()) return;
    setForm((f: any) => ({ ...f, hobbies: [...f.hobbies, hobbyInput.trim()] }));
    setHobbyInput('');
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveStep('Regenerating ZK proofs...');

    const addr = profile.walletAddress;
    const schoolData = `${form.degree}|${form.field}|${form.institution}`;
    const skillsData = form.skills.map((s: any) => s.name).join(',');
    const expData = `${form.expTitle}|${form.expCompany}|${form.expYears}`;

    const [schoolProof, skillsProof, expProof] = await Promise.all([
      generateZKProof(schoolData, 'school', addr),
      generateZKProof(skillsData, 'skills', addr),
      generateZKProof(expData, 'experience', addr),
    ]);

    setSaveStep('Deploying updated contract...');
    const contractAddress = await deployContract(addr, (msg) => setSaveStep(msg));

    const updated: TalentProfile = {
      ...profile,
      name: form.name, headline: form.headline, bio: form.bio,
      location: form.location, email: form.email, phone: form.phone,
      jobTitle: form.jobTitle,
      education: { degree: form.degree, field: form.field, institution: form.institution, year: form.gradYear },
      experience: [{ title: form.expTitle, company: form.expCompany, years: form.expYears, responsibilities: form.expResp }],
      skills: form.skills, hobbies: form.hobbies,
      proofs: { school: schoolProof.commitment, skills: skillsProof.commitment, experience: expProof.commitment, certifications: profile.proofs.certifications },
      contractAddress,
      deployedContracts: [...profile.deployedContracts, { address: contractAddress, timestamp: new Date().toISOString(), type: 'CV Update' }],
    };

    storage.setTalent(updated);
    setProfile(updated);
    setDeployedAddress(contractAddress);
    setSaving(false);
    setShowModal(true);
  };

  if (!profile || !form.name) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-dim)' }}>Loading...</div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <TalentSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Edit Profile</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Changes will regenerate your ZK proofs and deploy a new contract.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-proof" style={{ padding: '11px 22px', borderRadius: 10, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
            {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {saveStep}</> : <><Save size={16} /> Save & Redeploy</>}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>
          {/* Personal */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, gridColumn: '1 / -1' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Personal Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Full Name" value={form.name} onChange={e => update('name', e.target.value)} style={INPUT} />
              <input placeholder="Headline" value={form.headline} onChange={e => update('headline', e.target.value)} style={INPUT} />
              <input placeholder="Location" value={form.location} onChange={e => update('location', e.target.value)} style={INPUT} />
              <input placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} style={INPUT} />
              <textarea placeholder="Bio" value={form.bio} onChange={e => update('bio', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical', gridColumn: '1 / -1' }} />
            </div>
          </div>

          {/* Education */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <select value={form.degree} onChange={e => update('degree', e.target.value)} style={{ ...INPUT, cursor: 'pointer' }}>
                {["Bachelor's", "Master's", "PhD", "Bootcamp", "High School", "Other"].map(d => <option key={d}>{d}</option>)}
              </select>
              <input placeholder="Field of Study" value={form.field} onChange={e => update('field', e.target.value)} style={INPUT} />
              <input placeholder="Institution" value={form.institution} onChange={e => update('institution', e.target.value)} style={INPUT} />
              <input placeholder="Graduation Year" value={form.gradYear} onChange={e => update('gradYear', e.target.value)} style={INPUT} />
            </div>
          </div>

          {/* Experience */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Job Title" value={form.expTitle} onChange={e => update('expTitle', e.target.value)} style={INPUT} />
              <input placeholder="Company" value={form.expCompany} onChange={e => update('expCompany', e.target.value)} style={INPUT} />
              <input placeholder="Years of Experience" type="number" value={form.expYears} onChange={e => update('expYears', e.target.value)} style={INPUT} />
              <textarea placeholder="Responsibilities" value={form.expResp} onChange={e => update('expResp', e.target.value)} rows={2} style={{ ...INPUT, resize: 'vertical' }} />
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, gridColumn: '1 / -1' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Skills & Role</h3>
            <input placeholder="Primary Role for Marketplace" value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} style={{ ...INPUT, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ ...INPUT, flex: 1 }} />
              <button onClick={addSkill} className="btn-proof" style={{ padding: '11px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600 }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {form.skills.map((s: any, i: number) => (
                <div key={i} className="tag">
                  {s.name}
                  <button onClick={() => setForm((f: any) => ({ ...f, skills: f.skills.filter((_: any, j: number) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}><X size={11} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {showModal && <ContractModal contractAddress={deployedAddress} onClose={() => { setShowModal(false); router.push('/talent/dashboard'); }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

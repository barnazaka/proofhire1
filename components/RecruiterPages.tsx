'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Users, Plus, Trash2, Copy, Check, LogOut, AlertTriangle, Shield } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { storage } from '@/lib/storage';
import type { RecruiterProfile } from '@/lib/types';

// HIRED PAGE
export function RecruiterHired() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
  }, []);

  if (!profile) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Hired Talent</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Your employment records on ProofHire.</p>
        </div>
        {profile.hiredTalent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 16, border: '1px dashed var(--border)', maxWidth: 500 }}>
            <Award size={44} color="var(--text-dimmer)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No hires yet</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>Save candidates, send interview links, and mark them as hired.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
            {profile.hiredTalent.map((h, i) => (
              <div key={i} className="glass-card" style={{ borderRadius: 14, padding: 20, borderColor: 'rgba(0,255,135,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{h.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{h.position}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmer)', marginTop: 4 }}>{h.walletAddress?.slice(0, 16)}...</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="proof-badge"><Award size={11} /> Hired</span>
                    <div style={{ fontSize: 12, color: 'var(--text-dimmer)', marginTop: 8 }}>{new Date(h.hiredAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// TEAM PAGE
export function RecruiterTeam() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [walletInput, setWalletInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
  }, []);

  const handleAdd = () => {
    if (!walletInput || !roleInput || !profile) return;
    const updated = { ...profile, teamMembers: [...profile.teamMembers, { walletAddress: walletInput, role: roleInput, addedAt: new Date().toISOString() }] };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
    setWalletInput('');
    setRoleInput('');
  };

  const handleRemove = (addr: string) => {
    if (!profile) return;
    const updated = { ...profile, teamMembers: profile.teamMembers.filter(m => m.walletAddress !== addr) };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
  };

  if (!profile) return null;

  const INPUT = { background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '11px 14px', borderRadius: 10, fontFamily: 'var(--font-dm-sans)', fontSize: 14, outline: 'none' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Team Access</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Add team members who can access your organisation's recruiter account.</p>
        </div>

        <div style={{ maxWidth: 640 }}>
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Add Team Member</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Wallet Address" value={walletInput} onChange={e => setWalletInput(e.target.value)} style={{ ...INPUT, width: '100%' }} />
              <input placeholder="Role (e.g. HR Manager, CEO, Technical Lead)" value={roleInput} onChange={e => setRoleInput(e.target.value)} style={{ ...INPUT, width: '100%' }} />
              <button onClick={handleAdd} disabled={!walletInput || !roleInput} className="btn-proof" style={{ padding: '11px', borderRadius: 10, cursor: walletInput && roleInput ? 'pointer' : 'not-allowed', opacity: !walletInput || !roleInput ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                <Plus size={16} /> Add Member
              </button>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.12)', fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 20 }}>
            <strong style={{ color: 'var(--proof)' }}>Note:</strong> Team members added here can log in using their Lace Wallet and will operate under <strong style={{ color: 'var(--text)' }}>{profile.company}</strong>'s account.
          </div>

          {profile.teamMembers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {profile.teamMembers.map((m, i) => (
                <div key={i} className="glass-card" style={{ borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{m.role}</div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--text-dimmer)' }}>{m.walletAddress.slice(0, 20)}...</div>
                  </div>
                  <button onClick={() => handleRemove(m.walletAddress)} style={{ padding: '7px', borderRadius: 8, background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', cursor: 'pointer', color: '#FF6B6B', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', borderRadius: 12, border: '1px dashed var(--border)', color: 'var(--text-dimmer)', fontSize: 14 }}>
              No team members added yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// SETTINGS PAGE
export function RecruiterSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ company: '', mission: '', objectives: '' });

  useEffect(() => {
    const addr = storage.getWallet();
    if (!addr) { router.push('/recruiter/auth'); return; }
    const p = storage.getRecruiter(addr);
    if (!p) { router.push('/recruiter/onboarding'); return; }
    setProfile(p);
    setForm({ company: p.company, mission: p.mission, objectives: p.objectives });
  }, []);

  const handleCopy = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!profile) return;
    const updated = { ...profile, ...form };
    storage.setRecruiter(updated as RecruiterProfile);
    setProfile(updated as RecruiterProfile);
    setEditMode(false);
  };

  const handleLogout = () => { storage.clearWallet(); router.push('/'); };
  const handleDelete = () => { if (!confirmDelete) { setConfirmDelete(true); return; } localStorage.clear(); router.push('/'); };

  if (!profile) return null;

  const INPUT = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '11px 14px', borderRadius: 10, fontFamily: 'var(--font-dm-sans)', fontSize: 14, outline: 'none' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <RecruiterSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Settings</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Manage your company profile and account settings.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
          {/* Company Profile */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>Company Profile</h3>
              <button onClick={() => setEditMode(!editMode)} style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder="Company Name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={INPUT} />
                <textarea placeholder="Mission Statement" value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} rows={2} style={{ ...INPUT, resize: 'vertical' }} />
                <textarea placeholder="Company Objectives" value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} rows={3} style={{ ...INPUT, resize: 'vertical' }} />
                <button onClick={handleSave} className="btn-proof" style={{ padding: '11px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 700 }}>Save Changes</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Company', profile.company], ['Mission', profile.mission || '—'], ['Objectives', profile.objectives || '—']].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wallet */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Shield size={16} color="var(--proof)" />
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16 }}>Wallet Address</h3>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--proof)', wordBreak: 'break-all', marginBottom: 10, lineHeight: 1.6 }}>
              {profile.walletAddress}
            </div>
            <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', color: copied ? 'var(--proof)' : 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Logout */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, marginBottom: 10 }}>Logout</h3>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <LogOut size={15} /> Logout
            </button>
          </div>

          {/* Delete */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 24, borderColor: 'rgba(255,100,100,0.15)' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: '#FF6B6B', marginBottom: 10 }}>Delete Account</h3>
            {confirmDelete && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.2)', marginBottom: 12, fontSize: 13, color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={13} /> Click again to confirm</div>}
            <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: confirmDelete ? 'rgba(255,100,100,0.1)' : 'transparent', border: '1px solid rgba(255,100,100,0.3)', cursor: 'pointer', color: '#FF6B6B', fontSize: 14, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
              <Trash2 size={15} /> {confirmDelete ? 'Confirm Delete' : 'Delete Account'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

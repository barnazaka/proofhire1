'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, User, FileText, Code, Mail, Award, Settings, LogOut } from 'lucide-react';
import { storage } from '@/lib/storage';

const links = [
  { href: '/talent/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { href: '/talent/profile', icon: <User size={16} />, label: 'My Profile' },
  { href: '/talent/proofs', icon: <FileText size={16} />, label: 'My Proofs' },
  { href: '/talent/contracts', icon: <Code size={16} />, label: 'Contracts Deployed' },
  { href: '/talent/interviews', icon: <Mail size={16} />, label: 'Interview Requests' },
  { href: '/talent/hired', icon: <Award size={16} />, label: 'Hired Status' },
  { href: '/talent/settings', icon: <Settings size={16} />, label: 'Settings' },
];

export default function TalentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const addr = storage.getWallet() || '';

  const handleLogout = () => {
    storage.clearWallet();
    router.push('/');
  };

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--bg-2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 16px', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--proof)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={16} color="#000" />
        </div>
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 17 }}>
          Proof<span style={{ color: 'var(--proof)' }}>Hire</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>

      {/* Wallet + Logout */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
        <div style={{
          padding: '8px 12px', borderRadius: 8, marginBottom: 8,
          background: 'var(--bg-3)', fontSize: 11, fontFamily: 'var(--font-dm-mono)',
          color: 'var(--text-dimmer)', wordBreak: 'break-all',
        }}>
          {addr.slice(0, 12)}...{addr.slice(-8)}
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: '#FF6B6B' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

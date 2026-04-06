import type { TalentProfile, RecruiterProfile, InterviewRequest } from './types';

const KEYS = {
  TALENT: 'proofhire_talent_',
  RECRUITER: 'proofhire_recruiter_',
  WALLET: 'proofhire_wallet_address',
  ROLE: 'proofhire_role',
  MARKETPLACE: 'proofhire_marketplace',
  INTERVIEWS: 'proofhire_interviews_',
};

export const storage = {
  // Wallet
  getWallet: () => typeof window !== 'undefined' ? localStorage.getItem(KEYS.WALLET) : null,
  setWallet: (addr: string) => localStorage.setItem(KEYS.WALLET, addr),
  getRole: () => typeof window !== 'undefined' ? localStorage.getItem(KEYS.ROLE) as 'talent' | 'recruiter' | null : null,
  setRole: (role: 'talent' | 'recruiter') => localStorage.setItem(KEYS.ROLE, role),
  clearWallet: () => {
    localStorage.removeItem(KEYS.WALLET);
    localStorage.removeItem(KEYS.ROLE);
  },

  // Talent
  getTalent: (addr: string): TalentProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.TALENT + addr);
    return data ? JSON.parse(data) : null;
  },
  setTalent: (profile: TalentProfile) => {
    localStorage.setItem(KEYS.TALENT + profile.walletAddress, JSON.stringify(profile));
    // Update marketplace
    if (profile.openForWork && profile.cvStatus === 'LIVE') {
      const market = storage.getMarketplace();
      const idx = market.findIndex((t: any) => t.walletAddress === profile.walletAddress);
      const entry = {
        walletAddress: profile.walletAddress,
        name: profile.name,
        jobTitle: profile.jobTitle,
        skills: profile.skills,
        education: profile.education,
        experience: profile.experience,
        proofs: profile.proofs,
        contractAddress: profile.contractAddress,
        openForWork: profile.openForWork,
        cvStatus: profile.cvStatus,
        headline: profile.headline,
        certifications: profile.certifications,
      };
      if (idx >= 0) market[idx] = entry;
      else market.push(entry);
      localStorage.setItem(KEYS.MARKETPLACE, JSON.stringify(market));
    } else {
      const market = storage.getMarketplace();
      const filtered = market.filter((t: any) => t.walletAddress !== profile.walletAddress);
      localStorage.setItem(KEYS.MARKETPLACE, JSON.stringify(filtered));
    }
  },

  // Recruiter
  getRecruiter: (addr: string): RecruiterProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.RECRUITER + addr);
    return data ? JSON.parse(data) : null;
  },
  setRecruiter: (profile: RecruiterProfile) => {
    localStorage.setItem(KEYS.RECRUITER + profile.walletAddress, JSON.stringify(profile));
  },

  // Marketplace
  getMarketplace: (): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.MARKETPLACE);
    return data ? JSON.parse(data) : [];
  },

  // Interviews
  getInterviews: (talentAddr: string): InterviewRequest[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.INTERVIEWS + talentAddr);
    return data ? JSON.parse(data) : [];
  },
  addInterview: (talentAddr: string, interview: InterviewRequest) => {
    const interviews = storage.getInterviews(talentAddr);
    interviews.push(interview);
    localStorage.setItem(KEYS.INTERVIEWS + talentAddr, JSON.stringify(interviews));
  },
};

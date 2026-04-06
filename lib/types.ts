export interface TalentProfile {
  walletAddress: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  jobTitle: string;
  openForWork: boolean;
  education: {
    degree: string;
    field: string;
    institution: string;
    year: string;
  };
  experience: {
    title: string;
    company: string;
    years: string;
    responsibilities: string;
  }[];
  skills: { name: string; level: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  hobbies: string[];
  proofs: {
    school: string | null;
    skills: string | null;
    experience: string | null;
    certifications: string | null;
  };
  contractAddress: string | null;
  cvStatus: 'DRAFT' | 'LIVE';
  deployedContracts: { address: string; timestamp: string; type: string }[];
}

export interface RecruiterProfile {
  walletAddress: string;
  name: string;
  jobTitle: string;
  company: string;
  mission: string;
  objectives: string;
  savedCandidates: SavedCandidate[];
  hiredTalent: HiredTalent[];
  teamMembers: TeamMember[];
  calendlyLink: string;
}

export interface SavedCandidate {
  walletAddress: string;
  name: string;
  jobTitle: string;
  savedAt: string;
  interviewLinkSent: boolean;
  status: 'pending' | 'interviewing' | 'hired' | 'rejected';
  contractAddress: string;
}

export interface HiredTalent {
  walletAddress: string;
  name: string;
  position: string;
  hiredAt: string;
}

export interface TeamMember {
  walletAddress: string;
  role: string;
  addedAt: string;
}

export interface InterviewRequest {
  recruiterWallet: string;
  companyName: string;
  companyMission: string;
  position: string;
  calendlyLink: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

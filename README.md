# ProofHire

**Privacy-first hiring powered by Zero Knowledge Proofs on the Midnight Network.**

> Prove your credentials without exposing your data. Hire on proof, not paper.

---

# Run on Web

Open [ProofHire Website for Demo](https://proofhire1-k8d6.vercel.app/)

---

# Contract

contract: mn_d859b6887d635fd543f1134bc669c136051910eaf66ec2827c91740bce

---

## What is ProofHire?

ProofHire is a decentralized hiring platform built on the [Midnight Network](https://midnight.network). Candidates submit their CV details, generate Zero Knowledge Proofs for each section (education, skills, experience, certifications), and deploy a smart contract to the Midnight Preview testnet. Recruiters can verify any credential claim on-chain without ever seeing the raw data.


---

## How Zero Knowledge is Used

Each section of a talent's CV gets its own ZK proof commitment:

| CV Section | Proof | What Recruiter Sees |
|---|---|---|
| Education | `proofOfSchool` | Verified / Not Verified |
| Skills | `proofOfSkills` | Verified / Not Verified |
| Experience | `proofOfExperience` | Verified / Not Verified |
| Certifications | `proofOfCertifications` | Verified / Not Verified |

The Compact smart contract uses `persistentHash` to create commitments. Credentials go through witness functions and never touch the public ledger. Only the commitment hash (the mathematical proof) is stored on-chain via `disclose()`.

Recruiters call `verifySchoolProof(commitment)` etc. on the deployed contract. The circuit returns `true` or `false` — the raw data is never exposed.

---

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, TypeScript
- **Blockchain**: Midnight Network (Preview Testnet)
- **Smart Contract**: Compact language (`proof-hire.compact`)
- **Wallet**: Midnight Lace Wallet (DApp Connector API v4.0.1)
- **Deployment**: Vercel

---

## Install Dependencies

```bash
git clone https://github.com/yourusername/proofhire
cd proofhire
npm install
```

---

## Run Locally

```bash
cp .env.example .env.local
npm run dev
```

Open `http://localhost:6300`

---

## Configure Lace Wallet

1. Install [Midnight Lace Wallet](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk)
2. Open Lace → Settings → Midnight
3. Set **Network** to `Preview`
4. Set **Proof Server** to `Remote`
5. Click Save
6. Refresh the ProofHire page

---

## Get Test Tokens

1. Visit [Preview Faucet](https://faucet.preview.midnight.network) to get tNIGHT
2. Open Lace → Tokens → Click **Generate tDUST** for transaction fees

---

## Deploy Smart Contract on Midnight

### Prerequisites
- [Compact Compiler](https://docs.midnight.network) installed
- Lace Wallet configured for Preview network

### Compile

```bash
cd contracts
compact compile proof-hire.compact managed/proof-hire
```

### Copy Keys to Frontend

```bash
cp -r contracts/dist/managed/proof-hire/keys ./public/keys
cp -r contracts/dist/managed/proof-hire/zkir ./public/zkir
```

The frontend deploys the contract automatically when a talent saves their CV. The contract address is shown in a modal and saved to localStorage.

---

## Deploy Frontend on Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables from `.env.example`
4. Deploy

---

## How to Test Proof Generation

1. Go to `/talent/auth` and connect Lace Wallet
2. Complete the onboarding form
3. On the Education step, click **Generate School Proof** — watch the ZK animation
4. Do the same for Experience and Skills steps
5. On the final step, click **Save CV & Go Live**
6. A modal shows your deployed contract address
7. Copy and save it

---

## How to Test Verification

1. Go to `/recruiter/auth` and connect a different Lace Wallet (or same for demo)
2. Complete recruiter onboarding
3. Go to **Talent Marketplace**
4. Find a talent with Open for Work status
5. Click **Expand CV**
6. Click **Verify** next to any section (School, Skills, Experience)
7. Watch the on-chain verification run
8. See green checkmark ✓ with "Verified on Midnight Network"

---

## Demo Steps for Hackathon Judges

### As Talent

1. Open `/talent/auth` → Connect Lace Wallet
2. Fill in personal info → Click Next
3. Fill in education → Click **Generate School Proof** → watch ZK animation → Next
4. Fill in experience → Click **Generate Experience Proof** → Next
5. Add skills → Click **Generate Skills Proof** → Next
6. Skip certifications → Next
7. Add hobbies → Next
8. Review summary → Click **Save CV & Go Live**
9. Copy the contract address from the modal
10. Toggle **Open for Work** to ON → Save

### As Recruiter

1. Open new browser tab or incognito → `/recruiter/auth` → Connect Lace Wallet
2. Fill in company onboarding form
3. Go to **Talent Marketplace**
4. See the talent you just created (filtered by Open for Work)
5. Click **Expand CV**
6. Click **Verify** on School → see "Verified on Midnight Network" ✓
7. Click **I Want to Hire This Person**
8. Go to **Saved Candidates** → Send interview link
9. Mark as Hired → Check **Hired Talent** page

### Back as Talent

10. Go to `/talent/interviews` → see the company and Calendly link
11. Go to `/talent/hired` → see hired status

---

## Smart Contract Reference

**File**: `contracts/proof-hire.compact`

| Circuit | Description |
|---|---|
| `submitSchoolProof()` | Generates and stores education commitment |
| `submitSkillsProof()` | Generates and stores skills commitment |
| `submitExperienceProof()` | Generates and stores experience commitment |
| `submitCertificationsProof()` | Generates and stores certifications commitment |
| `saveCV()` | Sets CV status to LIVE (requires all proofs) |
| `verifySchoolProof(commitment)` | Returns Boolean — on-chain verification |
| `verifySkillsProof(commitment)` | Returns Boolean — on-chain verification |
| `verifyExperienceProof(commitment)` | Returns Boolean — on-chain verification |
| `verifyCertificationsProof(commitment)` | Returns Boolean — on-chain verification |
| `clearProfile()` | Resets all proof state |

---

## Network

| Service | Endpoint |
|---|---|
| Node RPC | `https://rpc.preview.midnight.network` |
| Indexer | `https://indexer.preview.midnight.network/api/v3/graphql` |
| Proof Server | `https://proof-server.preview.midnight.network` |
| Faucet | `https://faucet.preview.midnight.network` |

---

## Project Structure

```
proofhire/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── talent/
│   │   ├── auth/page.tsx           # Talent login
│   │   ├── onboarding/page.tsx     # Multi-step CV form + ZKP
│   │   ├── dashboard/page.tsx      # Talent dashboard
│   │   ├── profile/page.tsx        # Edit CV
│   │   ├── proofs/page.tsx         # View ZK proofs
│   │   ├── contracts/page.tsx      # Deployed contracts
│   │   ├── interviews/page.tsx     # Interview requests
│   │   ├── hired/page.tsx          # Hired status
│   │   └── settings/page.tsx       # Wallet + account
│   └── recruiter/
│       ├── auth/page.tsx           # Recruiter login
│       ├── onboarding/page.tsx     # Company setup
│       ├── dashboard/page.tsx      # Recruiter dashboard
│       ├── marketplace/page.tsx    # Talent marketplace + verify
│       ├── candidates/page.tsx     # Saved candidates
│       ├── hired/page.tsx          # Hired talent
│       ├── team/page.tsx           # Team access
│       └── settings/page.tsx       # Company settings
├── components/
│   ├── WalletConnect.tsx           # Lace wallet integration
│   ├── TalentSidebar.tsx
│   ├── RecruiterSidebar.tsx
│   ├── ContractModal.tsx           # Contract address modal
│   └── RecruiterPages.tsx          # Shared recruiter pages
├── lib/
│   ├── types.ts                    # TypeScript types
│   ├── storage.ts                  # localStorage utilities
│   └── midnight-utils.ts           # ZKP + wallet utilities
└── contracts/
    └── proof-hire.compact          # Midnight smart contract
```

---

## Privacy Architecture

```
Talent fills CV form
        ↓
Data stays in browser memory only
        ↓
ZK proof generated locally per section
        ↓
Only commitment hash goes to Midnight chain via disclose()
        ↓
Contract deployed → address shared with recruiter
        ↓
Recruiter calls verifyXProof(commitment) on chain
        ↓
Circuit returns true/false — zero raw data exposed
```

---

# DEX

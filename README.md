# 🎓 DBE OS — The Digital Bharat Entrepreneurship OS

[![Built for IIM Bangalore](https://img.shields.io/badge/Built%20for-IIM%20Bangalore-003366)](https://www.iimb.ac.in)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%2B-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%204.0-38b2ac)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DBE OS** is a premium, full-stack operating system built for the **IIM Bangalore Digital Business & Entrepreneurship (DBE)** program. It centralizes the academic journey, community networking, and career opportunities into a single, high-performance ecosystem.

---

## 📖 Developer & AI Onboarding

> [!IMPORTANT]
> **To all Developers and AI Assistants:** Before making structural changes, writing new features, or modifying the database, you **MUST** read the [**CONTEXT.md**](./CONTEXT.md) file. It contains the essential business logic, security protocols (RLS), and architectural patterns that this project follows.

---

## ✨ Core Pillars

### 📚 Dynamic Curriculum (Latest)
A robust, admin-controlled management system for the entire DBE academic cycle.
- **Hierarchical Structure:** Managed by Terms -> Subjects -> Modules -> Notes/Quizzes.
- **Dynamic Quiz Sets:** Relational "Exam Sets" (Mock Exams, PYQs) that span across all subject modules for a realistic testing experience.
- **Smart Bulk Import:** An advanced admin tool with real-time JSON validation and "Override Dropdowns" that inject Exam Set and Topic IDs instantly.
- **Subject-Level Simulator:** A dedicated Exam Mode for full-subject testing, distinct from module-level Practice and AI Concept Builder.
- **HQ Admin Control:** Super Admins can dynamically manage every aspect of the curriculum via a premium, dark-mode dashboard.
- **Batch-Specific View:** Students automatically see content relevant to their assigned batch and active term.
- **Moderator Handbook:** See [**QUIZ_MODERATOR_GUIDE.md**](./QUIZ_MODERATOR_GUIDE.md) for a detailed manual on managing questions and using the smart bulk import tool.

### 🤝 MatchForge Network
An advanced networking engine designed to bridge the gap between skill sets and startup ambitions. Connect with perfect learning partners or co-founders within the IIMB community.

### 🚀 Opportunity Hub
A curated aggregator of high-impact B-school competitions, MNC internships, and case challenges. Includes winning roadmaps and preparation guides to give DBE students a competitive edge.

### 🏆 Pro Pitch Decks
Exclusive access to a library of award-winning case decks from global organizations (L'Oréal, Maersk, etc.). Reverse-engineer success by studying the best in the business.

### 🍅 Tomato Economy
A gamified productivity system that rewards community contribution and academic consistency. Earn "Tomatoes" to climb the leaderboard and unlock community recognition.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15+ (App Router), React 19
- **Styling:** Tailwind CSS 4.0, Framer Motion (Animations), Lucide React (Icons)
- **Backend:** Next.js Server Actions (Type-safe mutations)
- **Database:** Supabase (PostgreSQL) with SSR Support
- **Authentication:** Supabase Auth (Strict 6-digit OTP system)
- **State Management:** Zustand
- **Content:** React Markdown (for curriculum notes)

---

## 📂 Project Architecture

```text
/
├── supabase/           # Migrations, Seed scripts & RLS policies
├── src/
│   ├── app/            # Next.js Pages (Public & HQ-Admin)
│   ├── actions/        # Server Actions (Secure DB Operations)
│   ├── components/     # UI Components (Radix/Lucide based)
│   ├── hooks/          # Custom React hooks (Auth, Store)
│   ├── lib/            # Shared utility clients (Supabase)
│   ├── utils/          # Helper functions & Middleware
│   └── types/          # Global TypeScript interfaces
└── CONTEXT.md          # CORE KNOWLEDGE BASE (Read First)
```

### Data Flow Overview
1. **User Request:** Handled by Next.js App Router.
2. **Middleware:** `src/utils/supabase/middleware.ts` handles session refreshing and protected routes.
3. **Data Fetching:** Server Components query Supabase directly via `@supabase/ssr`.
4. **Mutations:** Server Actions (`src/actions/`) handle secure data updates with RLS enforcement.
5. **Admin Access:** Elevated roles (`SUPER_ADMIN`) gain access to `/hq-admin` for platform management.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- A Supabase Project (PostgreSQL + Auth + Storage)

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/dbe-os.git
   cd dbe-os
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env.local` and fill in your credentials. Note that the `SUPABASE_SERVICE_ROLE_KEY` is required for certain admin actions (like permanently deleting users).
   ```bash
   cp .env.example .env.local
   ```

4. **Database Sync**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 🛣 Roadmap
- [ ] Mobile App (PWA) extension
- [ ] Real-time peer-to-peer chat for MatchForge
- [ ] AI-powered resume analyzer for Internship Hunter
- [ ] Automated deadline sync with Google Calendar

---

## 🤝 Contributing
We welcome contributions from the IIMB community! Please check our `CONTRIBUTING.md` (coming soon) for guidelines.

## 👨‍💻 Team
Built with Passion by **Ishaan Jha** & **Madhwendra**.
Special thanks to the IIM Bangalore DBE community.

---

*“Built by students, for students.”*

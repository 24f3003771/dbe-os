# 🎓 DBE OS — The Scholar Operating System

[![Built for IIM Bangalore](https://img.shields.io/badge/Built%20for-IIM%20Bangalore-003366)](https://www.iimb.ac.in)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-indigo)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DBE OS** is a premium, full-stack student-built platform designed specifically for the **IIM Bangalore Digital Business & Entrepreneurship (DBE)** program. It transforms the academic experience into a gamified, collaborative, and professional ecosystem.

---

## ✨ Core Pillars

### 🤝 MatchForge Network
An advanced matchmaking engine that uses behavioral traits and skill gaps to connect students with perfect learning partners or potential startup co-founders within the IIMB community.

### 🚀 Opportunity Hub
A curated aggregator of 150+ high-impact B-school competitions and MNC internships. It doesn't just list opportunities; it provides winning roadmaps and preparation guides.

### 🏆 Pro Pitch Decks
Exclusive access to a library of award-winning case decks from global organizations (L'Oréal, Maersk, etc.), allowing students to reverse-engineer success.

### 📚 Universal Library
A community-driven repository of academic notes, guides, and resources tailored specifically for the DBE curriculum.

### 🍅 Tomato Economy
A gamified productivity system where students earn "Tomatoes" for completing tasks and contributing, climbing the community leaderboard.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion
- **Backend:** Next.js Server Actions, Supabase (PostgreSQL)
- **Database ORM:** Prisma
- **Auth:** Clerk / Supabase Auth
- **AI Integration:** NVIDIA NIM (Doubt Resolver)
- **State Management:** Zustand

---

## 📂 Project Architecture

```text
/
├── prisma/             # Database schema & migrations
├── supabase/           # Edge functions & storage configs
├── scripts/            # Database seeding & maintenance scripts
├── public/             # Static assets (images, lotties)
└── src/
    ├── app/            # Next.js Pages & API routes
    ├── components/     # UI components (shared & feature-specific)
    ├── services/       # Core business logic (Matchmaking, API wrappers)
    ├── actions/        # Server Actions for DB mutations
    ├── hooks/          # Custom React hooks (Store, Auth)
    ├── lib/            # Utility libraries (Prisma client, Supabase)
    ├── types/          # TypeScript interfaces
    └── data/           # Static data & JSON databases

                ┌────────────────────────────┐
                │        Frontend (UI)       │
                │  Next.js + Tailwind + FM   │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │   Next.js Server Layer     │
                │  (Server Actions / Routes) │
                └────────────┬───────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
│  Services     │   │  Auth Layer    │   │ External Services│
│ (Business     │   │ Clerk + Supa   │   │ NVIDIA NIM (AI)  │
│ Logic Layer)  │   └────────────────┘   └──────────────────┘
└──────┬────────┘
       │
       ▼
┌────────────────────────────┐
│     Database Layer         │
│ PostgreSQL (Supabase)      │
│ + Prisma ORM               │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│   Supabase Infrastructure  │
│ (Storage, Edge Functions)  │
└────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Supabase Project
- Clerk Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dbe-os.git
   cd dbe-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env.local` and fill in your credentials.
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

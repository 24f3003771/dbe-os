# DBE OS - Project Context & Developer Handbook

This document serves as the central knowledge base for the **DBE OS** project. It is designed to be read by any new developer or LLM/AI assistant to instantly understand the architecture, database schema, business logic, and current state of the application.

**⚠️ INSTRUCTION FOR AI/LLMs:** Always read this document before making structural changes or writing new features to ensure you adhere to the project's established patterns.

---

## 1. Technology Stack

- **Framework:** Next.js 15+ (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Supabase SSR Auth, Row Level Security)
- **Emails:** Resend SMTP (configured directly inside the Supabase dashboard)
- **Deployment:** Vercel

---

## 2. Core Business Logic & Workflows

### Authentication Flow
- **OTP System:** The project strictly uses **6-digit OTPs** for both user registration and Magic Link logins.
- **Registration Constraints:** Registration can be restricted to `@iimb.ac.in` emails via the `restrict_emails` flag in `app_settings`.
- **Conditional Fields:** **Zone** and **Batch** are only required for `@iimb.ac.in` users.
- **Location Fetch:** Uses `api.postalpincode.in` to auto-fill City/State from Pincode.

### User Classification (`type` column)
- **`type = 0`**: **Disabled**. Locked out by a global UI overlay in `layout.tsx`.
- **`type = 1`**: **Active Internal** (`@iimb.ac.in`).
- **`type = 2`**: **Active External** (Other domains).

### Roles & Permissions (RBAC)
- `USER`: Standard access.
- `MODERATOR`: Elevated access.
- `SUPER_ADMIN`: Full access to `/hq-admin`. Can permanently hard-delete users from both the database and Supabase Auth.

### Dynamic Curriculum System
- **Terms:** Managed by IDs (1-9). Can be marked as `is_active` and assigned to a specific batch.
- **Subjects:** Linked to Terms. Defined by a `code` (e.g., ES211) and a `module_count` (strictly 4 or 8). Supports full CRUD (Add, Edit, Delete).
- **Topics:** Granular labels linked to subjects for better organization of notes and questions.
- **Notes:** One note per module per subject. Supports raw Markdown content, topic assignment, and deletion.
- **Questions:** Supports MCQ and Text types. Categorized by `type` (`cla`, `midterm`, `pyq`, `practice`). Includes inline editing, bulk import, and AI generation features.
- **Security:** RLS is configured so that all authenticated users can `SELECT`, but only `SUPER_ADMIN` can `INSERT/UPDATE/DELETE`.

---

## 3. Key Files & Directories

- `src/app/layout.tsx`: Global lockdown UI for disabled users.
- `src/utils/supabase/middleware.ts`: Session management and route protection.
- `src/actions/curriculum.ts`: Server Actions for curriculum CRUD.
- `src/app/hq-admin/curriculum/`: Admin interface for managing terms, subjects, and content.
- `src/app/notes/page.tsx`: Public view for study notes (fetches dynamically from Supabase).
- `src/app/quiz/`: Interactive quiz engine powered by the `questions` table.
- `supabase/migrations/`: SQL migration files for schema versioning.

---

## 4. Environment Variables

To run the project locally, the following environment variables must be present in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Required for admin API routes (e.g., hard-deleting users from Auth)
```

---

## 5. Maintenance Protocol

**For future Developers & AI Sessions:**
Whenever a new major feature is added, an architectural decision is made, or a database schema is updated, **you must update this `CONTEXT.md` file** before ending your session. This ensures the project context remains 100% accurate over time.

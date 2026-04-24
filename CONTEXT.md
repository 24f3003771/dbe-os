# DBE OS - Project Context & Developer Handbook

This document serves as the central knowledge base for the **DBE OS** project. It is designed to be read by any new developer or LLM/AI assistant to instantly understand the architecture, database schema, business logic, and current state of the application.

**⚠️ INSTRUCTION FOR AI/LLMs:** Always read this document before making structural changes or writing new features to ensure you adhere to the project's established patterns.

---

## 1. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Supabase SSR Auth, Row Level Security)
- **Emails:** Resend SMTP (configured directly inside the Supabase dashboard to bypass default rate limits)
- **Deployment:** Vercel

---

## 2. Core Business Logic & Workflows

### Authentication Flow
- **OTP System:** The project strictly uses **6-digit OTPs** for both user registration and Magic Link logins/password recovery. (Configured in `src/app/login/page.tsx` and `src/app/register/page.tsx`).
- **Registration Constraints (`app_settings`):** Registration can be globally restricted to official `@iimb.ac.in` emails via the `restrict_emails` flag in the `app_settings` database table.
- **Conditional Fields:** During registration (Step 3), the **Zone** and **Batch** fields are ONLY shown and required if the user registers with an `@iimb.ac.in` email address. For non-IIMB emails, these fields are safely left empty (`null` in the DB).
- **Location Auto-fetch:** The registration form (Step 2) uses the external API `api.postalpincode.in` to auto-fetch the City and State based on the 6-digit Pincode. If the API fails, the inputs are left editable as a fallback.

### User Classification & Account Status
The system uses the `type` integer column in the `users` table to manage account classification and active/disabled status:
- **`type = 0`**: **Disabled Account**. The user is locked out. A global, non-dismissible UI overlay in `src/app/layout.tsx` blocks all interaction.
- **`type = 1`**: **Active Internal User**. (Registered with an `@iimb.ac.in` email).
- **`type = 2`**: **Active External User**. (Registered with any other email domain).

*Note: The `handle_new_user` Postgres trigger automatically assigns `type 1` or `type 2` upon signup based on the email domain.*

### Roles & Permissions (RBAC)
The `role` string column dictates access levels:
- `USER`: Standard access.
- `MODERATOR`: Elevated access (can be checked via RLS or UI).
- `SUPER_ADMIN`: Maximum access (can access `src/app/hq-admin`).

### Admin Dashboard (`src/app/hq-admin`)
- Accessible only to Super Admins.
- **User Management:** Admins can view all users, change roles, and toggle account statuses.
- **Toggle Logic:** When an admin re-enables a disabled user (`type 0`), the code in `AdminTable.tsx` intelligently restores them to `type 1` or `type 2` based on their email domain, rather than hardcoding a default.
- **Stats:** Active users are correctly calculated by filtering `type !== 0` (accounting for both internal and external active users).

---

## 3. Key Files & Directories

- `src/app/layout.tsx`: Root layout containing the global lockdown UI check for disabled users (`type === 0`).
- `src/utils/supabase/middleware.ts`: Supabase SSR middleware handling session refreshing and route protection.
- `src/app/register/page.tsx`: Multi-step registration flow handling logic for conditional fields, Pincode validation, and 6-digit OTP verification.
- `src/app/login/page.tsx`: Handles Magic Link/OTP login with 6-digit validation.
- `src/app/hq-admin/AdminTable.tsx`: The data table and logic for the Super Admin dashboard.
- `schema.sql`: Contains the database schema, RLS policies, and the `handle_new_user` trigger.

---

## 4. Environment Variables

To run the project locally, the following environment variables must be present in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Note: The legacy Prisma `DATABASE_URL` is no longer used, as the project has fully migrated to `@supabase/ssr`.*

---

## 5. Maintenance Protocol

**For future Developers & AI Sessions:**
Whenever a new major feature is added, an architectural decision is made, or a database schema is updated, **you must update this `CONTEXT.md` file** before ending your session. This ensures the project context remains 100% accurate over time.

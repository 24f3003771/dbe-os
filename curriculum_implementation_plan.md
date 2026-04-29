# Admin Panel for Curriculum Management

This plan outlines the architecture and steps required to build a full-fledged backend curriculum management system in the HQ Admin panel, allowing you to dynamically control Terms, Subjects, Notes, and Quizzes, replacing the static JSON database.

## User Review Required

> [!IMPORTANT]
> - **Data Migration:** Since we are moving from a static file (`term2_quizDatabase.json`) to Supabase, we will need a one-time migration script to push your existing JSON data into the new database tables. 
> - **Schema Design:** Please review the proposed database schema below to ensure it covers all your requirements.

## Proposed Changes

### 1. Database Schema Update (Supabase)
We will create a new SQL migration to establish the relational tables for the curriculum.

#### [NEW] `supabase/migrations/[timestamp]_curriculum_schema.sql`
- **`terms` table:**
  - `id` (UUID, PK)
  - `name` (String, e.g., "Term 1", "Term 2")
  - `year` (Int, 1-3)
  - `order` (Int)
- **`subjects` table:**
  - `id` (String, PK, e.g., "ID211")
  - `term_id` (UUID, FK to terms)
  - `title` (String)
  - `description` (String)
  - `module_count` (Int, strictly 4 or 8)
- **`modules` table:**
  - `id` (UUID, PK)
  - `subject_id` (String, FK to subjects)
  - `title` (String)
  - *Note: Each subject will have either 4 or 8 modules. This ensures notes and quizzes are fully interlinked.*
- **`notes` table:**
  - `id` (UUID, PK)
  - `module_id` (UUID, FK to modules)
  - `title` (String)
  - `content` (Text/Markdown)
- **`questions` table:**
  - `id` (UUID, PK)
  - `module_id` (UUID, FK to modules)
  - `tag` (String, e.g., "cla", "midterm", "pyq")
  - `text` (String)
  - `options` (JSON array)
  - `correct_answer_index` (Int)
  - `explanation` (Text)

---

### 2. HQ Admin UI (Frontend + Server Actions)
We will create a dedicated `Curriculum` section in your existing `hq-admin` dashboard.

#### [NEW] `src/app/hq-admin/curriculum/page.tsx`
- The main dashboard for curriculum management.
- Displays a list of all Terms.
- Allows creating, editing, and deleting Terms.

#### [NEW] `src/app/hq-admin/curriculum/[termId]/page.tsx`
- Displays all Subjects under a specific Term.
- Forms to add/edit Subjects. *Note: When creating a subject, the form will ask if it is a 4-module or 8-module subject. Selecting this will automatically generate the corresponding empty modules in the database.*

#### [NEW] `src/app/hq-admin/curriculum/subjects/[subjectId]/page.tsx`
- A split view to manage both **Notes** and **Quizzes/Modules** for a specific subject.
- A rich text/markdown editor for creating notes.
- A dynamic form builder for creating modules and adding questions with options.

#### [NEW] `src/actions/curriculum.ts`
- Server actions using `@supabase/ssr` to handle all secure CRUD operations (Insert/Update/Delete) for terms, subjects, notes, and quizzes.

---

### 3. Public Frontend Refactoring
We will update the public-facing pages to fetch real-time data from Supabase instead of the local `db.ts` file.

#### [MODIFY] `src/app/notes/page.tsx` & `src/app/dbe_notes/[id]/page.tsx`
- Remove reliance on `getAllSubjects()` from `src/data/db.ts`.
- Fetch terms, subjects, and notes directly from the Supabase `terms`, `subjects`, and `notes` tables.

#### [MODIFY] `src/app/quiz/page.tsx` & `src/app/quiz/[subjectId]/page.tsx`
- Fetch quiz modules and questions dynamically from Supabase.

## Verification Plan

### Automated/Manual Testing
1. Apply the Supabase SQL migration locally and verify tables are created.
2. Navigate to `/hq-admin/curriculum` as a `SUPER_ADMIN` and manually create a Term, a Subject, a Note, and a Quiz.
3. Verify that the created entities appear correctly on the public `/notes` and `/quiz` pages.
4. Ensure row-level security (RLS) is properly configured so standard users can only *read* the data, while only admins can *modify* it.

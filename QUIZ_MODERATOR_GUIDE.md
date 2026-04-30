# 📑 Quiz System: Moderator & Content Guide

Welcome to the **DBE OS Quiz System**. This guide explains the architecture, the difference between study modes, and the fastest way to populate the platform with high-quality content.

---

## 1. The Student Experience (User View)

Students interact with the quiz system in two distinct ways:

### A. Practice & AI Modes (Module-Scoped)
Accessed by clicking a specific **Module Card** in the subject view.
- **Practice Mode:** Untimed. Shows all `practice` type questions assigned to that specific module.
- **AI Concept Builder:** Untimed. Uses AI to help students master module-specific concepts.
- **Scope:** If a question has `module_from: 1` and `module_to: 4`, it will appear in the practice list for Module 1, 2, 3, and 4.

### B. Exam Mode (Subject-Scoped)
Accessed via the amber **"Exam Mode"** button in the subject header.
- **Timed:** Default 60s per question (or set by subject admin).
- **Comprehensive:** Fetches questions from **every module** belonging to the selected Exam Set (e.g., "Mock 1").
- **Persistence:** Results are saved to the student's Performance Review.
- **Deduplication:** Even if a question spans multiple modules, it only appears **once** in the Exam session.

---

## 2. Question Types Reference

| Type | Purpose | UI Display |
| :--- | :--- | :--- |
| `practice` | Daily study and reinforcement. | Shown in Module Practice cards. |
| `exam` | Official mock tests and PYQs. | Shown only in the Subject-level Exam Mode. |
| `cla` / `midterm` | Legacy categorization. | Treated as practice but labeled differently in the admin. |

---

## 3. Adding Content (Moderator Workflow)

### Method 1: Creating Exam Sets (Crucial Step)
Before adding exam questions, you must create an **Exam Set**:
1. Go to **HQ Admin > Curriculum > [Subject]**.
2. Click **"Manage Exam Sets"**.
3. Create a set (e.g., "Mid-Term 2024" or "Mock 1").
4. Copy the name or ID to use in bulk imports.

### Method 2: Individual Questions
Click **"Add Question"** to open the manual form.
- **Spanning Modules:** If a question is relevant to the whole course, set `module_from: 1` and `module_to: 4` (or 8).
- **Exam Assignment:** To make it an exam question, change **Type** to `Exam Set` and select the set from the dropdown.

### Method 3: Smart Bulk Import (The Recommended Way)
Click **"Bulk Import"** to use the most powerful tool in the system.

#### **The Override Advantage**
The Bulk Import tool has two dropdowns: **Override Topic** and **Override Exam Set**. 
- If you select an Exam Set in the dropdown, the tool will **automatically** change every question in your JSON to `type: "exam"` and assign it to that set.
- You will see the JSON update in **real-time** in the text editor as you change the dropdown.

#### **Master JSON Reference (All Fields)**
Copy and adapt this structure for your bulk imports. You can mix and match these types in a single array.

```json
[
  {
    "type": "practice",           // Options: "practice", "exam", "cla", "midterm"
    "input_type": "mcq",          // Options: "mcq" (Multiple Choice), "text" (Subjective)
    "module_from": 1,             // Starting module number (1-8)
    "module_to": 1,               // Ending module number (can span e.g. 1 to 4)
    "question": "The question?",  // Actual question text
    "options": ["A", "B", "C", "D"], // Required for MCQ (exactly 4)
    "correct_index": 0,           // Required for MCQ (0=A, 1=B, 2=C, 3=D)
    "explanation": "Why...",      // Optional: Shown after answer
    "topic_id": "UUID",           // Optional: Topic ID (or use dropdown override)
    "quiz_set_id": "UUID"         // Optional: Required for "exam" (or use dropdown override)
  },
  {
    "type": "exam",
    "input_type": "text",         // Subjective type
    "module_from": 1,
    "module_to": 4,
    "question": "Discuss the impact of equity on bootstrapping.",
    "explanation": "Equity reduces control but provides...",
    "word_limit": 250,            // Recommended for subjective questions
    "quiz_set_id": "UUID"
  }
]
```

---

## 4. Pro-Tips for Moderators

1. **Spanning Questions:** Use `module_from` and `module_to` liberally. For example, a question about "Overall Strategy" should span from Module 1 to 4.
2. **Bulk Editing:** If you need to move 50 questions from "Mock 1" to "Mock 2", the fastest way is to use the Bulk Import tool with the override dropdown.
3. **AI Generation:** Use the **"Generate with AI"** button inside the bulk import modal to get a baseline JSON based on the module notes, then refine the questions before importing.
4. **Subjective Questions:** For text-based questions, always provide a detailed **Explanation**. This is what the student sees to "self-grade" their answer.

---

## 5. Visual Hierarchy in Admin

- **Blue Tags:** CLA questions.
- **Purple Tags:** Midterm questions.
- **Emerald Tags:** Practice questions.
- **Rose Tags:** Exam Set questions (shows the name of the set).

*For technical support or feature requests, contact the DBE OS Development Team.*

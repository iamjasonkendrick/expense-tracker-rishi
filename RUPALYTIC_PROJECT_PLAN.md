# RUPALYTIC - PROJECT MASTER DOCUMENT
## Last Updated: February 2026
## Developer: Rishi
## Timeline: Complete TODAY

---

## 1. PROJECT OVERVIEW

**Name:** Rupalytic
**Tagline:** Master your money, effortlessly.
**Type:** Personal Finance / Expense Tracker
**Target:** Individual users who want to track expenses, incomes, and split bills with friends.

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Neon PostgreSQL (Serverless) |
| ORM | Drizzle ORM |
| DB Driver | pg (node-postgres) |
| Authentication | Better Auth (Google OAuth + Email/Password) |
| Email | Nodemailer (Gmail SMTP) |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Linting/Formatting | Biome (replaces ESLint) |
| Package Manager | pnpm |
| Version Control | Git + GitHub |

---

## 3. COLOR PALETTE (FINAL DECISION)

| Element | Color Code | Preview |
|---------|-----------|---------|
| Primary Accent | `#0d9488` (Calm Teal) | Main buttons, links, highlights |
| Expenses | `#e57373` (Soft Light Red) | Expense amounts, expense cards |
| Income | `#66bb6a` (Soft Sage Green) | Income amounts, income cards |
| Page Background | `#f8fafc` (Warm Slate) | Main page background |
| Card Background | `#ffffff` with soft shadow | Cards, modals |
| Primary Text | `#1e293b` (Slate-800) | Headings, body text |
| Secondary Text | `#64748b` (Slate-500) | Subtitles, descriptions |
| Border | `#e2e8f0` (Slate-200) | Card borders, dividers |
| Sidebar Background | `#0f172a` (Slate-900) | Sidebar (already dark) |
| Sidebar Text | `#94a3b8` (Slate-400) | Sidebar links |

**Design Principles:**
- NO bright/flashy colors
- Muted, professional, calm tones
- Light red for expenses (easy to detect, not aggressive)
- Friendly, lightly distinct colors in charts and reports
- Both light and dark themes must look professional

---

## 4. DATABASE SCHEMA (12 Tables)

| Table | Purpose |
|-------|---------|
| users | User accounts |
| sessions | Active sessions |
| accounts | OAuth accounts |
| verifications | Email verification tokens |
| expenses | All expenses |
| categories | Expense categories |
| incomes | All incomes |
| income_sources | Income source types |
| user_profiles | Extended user info |
| user_settings | User preferences |
| shared_expenses | Shared expense records |
| shared_expense_members | Members in shared expenses |

---

## 5. FILE STRUCTURE
src/
├── app/
│ ├── (auth)/
│ │ ├── login/page.tsx
│ │ ├── signup/page.tsx
│ │ ├── reset-password/page.tsx
│ ├── api/
│ │ ├── auth/[...all]/route.ts
│ │ ├── expenses/route.ts
│ │ ├── incomes/route.ts
│ │ ├── shared-expenses/route.ts (PENDING)
│ │ ├── notifications/route.ts (PENDING)
│ ├── dashboard/
│ │ ├── layout.tsx
│ │ ├── page.tsx (Main Dashboard)
│ │ ├── calendar/page.tsx
│ │ ├── expenses/page.tsx
│ │ ├── incomes/page.tsx
│ │ ├── shared/page.tsx (PENDING - needs rebuild)
│ │ ├── notifications/page.tsx (PENDING - needs rebuild)
│ │ ├── settings/page.tsx
│ ├── page.tsx (Landing Page)
│ ├── layout.tsx (Root Layout)
├── components/
│ ├── modals/
│ │ ├── add-expense-modal.tsx
│ │ ├── add-income-modal.tsx
│ ├── ui/ (shadcn components)
├── contexts/
│ ├── currency-context.tsx
│ ├── theme-context.tsx (PENDING)
├── lib/
│ ├── auth-client.ts
│ ├── currency.ts
│ ├── utils.ts
├── server/
│ ├── auth.ts
│ ├── db/
│ ├── index.ts
│ └── schema/
│ ├── users.ts
│ ├── sessions.ts
│ ├── accounts.ts
│ ├── verifications.ts
│ ├── expenses.ts
│ ├── categories.ts
│ ├── incomes.ts
│ ├── income-sources.ts
│ ├── user-profiles.ts
│ ├── user-settings.ts
│ ├── shared-expenses.ts
│ ├── shared-expense-members.ts


---

## 6. CURRENT STATUS

### ✅ COMPLETED FEATURES
- Landing Page with Rupalytic branding
- Email Signup with password toggle
- Email Login with password toggle
- Google OAuth Login
- Reset Password (Nodemailer + Better Auth) - FULLY WORKING
- Dashboard with charts (Bar, Pie, Line)
- Calendar View (static - needs dynamic upgrade)
- Incomes Page + API
- Expenses Page (Table with filters/search/sort)
- Settings Page (Profile, Appearance, General, Security tabs)
- Currency Context (global currency system)
- Biome Integration (linting/formatting)
- Sidebar Navigation
- Database (12 tables created)
- Git + GitHub (dev branch)

### ❌ NOT YET BUILT
- Shared Expenses (create, invite, accept/reject, split)
- Notifications (bell, dropdown, mark read)
- Calendar Dynamic View (click date → show expenses)
- Theme Customization Engine (accent color picker, full dark mode)
- Toast Notifications (replace all alert())
- Edit/Delete Expenses
- Category Selection in forms
- Budget Setting + Alerts
- Export CSV/PDF
- Email Verification
- Two-Factor Authentication
- Loading Skeletons
- Pagination

---

## 7. PRIORITY LIST FOR TODAY

### 🔴 PRIORITY 1: Design Overhaul (~60 min)
Fix all flashy colors. Apply calm blue/teal palette.

| Task | Status |
|------|--------|
| 1.1 Update Tailwind config with new palette | ⬜ Pending |
| 1.2 Fix Dashboard colors | ⬜ Pending |
| 1.3 Fix Expenses page colors | ⬜ Pending |
| 1.4 Fix Incomes page colors | ⬜ Pending |
| 1.5 Fix Calendar page colors | ⬜ Pending |
| 1.6 Fix Settings page colors | ⬜ Pending |
| 1.7 Fix Login/Signup page colors | ⬜ Pending |
| 1.8 Fix Landing page colors | ⬜ Pending |

### 🔴 PRIORITY 2: Theme/Preference System (~55 min)
Users can customize accent color and toggle light/dark.

| Task | Status |
|------|--------|
| 2.1 Build Theme Context (accent color + light/dark) | ⬜ Pending |
| 2.2 Add accent color picker in Settings (6-8 presets) | ⬜ Pending |
| 2.3 Make Light/Dark mode fully functional | ⬜ Pending |
| 2.4 Ensure ALL pages respect the theme | ⬜ Pending |
| 2.5 Save preferences to localStorage | ⬜ Pending |

### 🔴 PRIORITY 3: Calendar Dynamic View (~40 min)
Clicking a date shows that day's expenses.

| Task | Status |
|------|--------|
| 3.1 Make each calendar day clickable | ⬜ Pending |
| 3.2 Show panel/modal with expenses for selected date | ⬜ Pending |
| 3.3 Show expense details (description, amount, category) | ⬜ Pending |
| 3.4 Add "Add Expense" button inside date panel | ⬜ Pending |

### 🔴 PRIORITY 4: Shared Expenses (~65 min)
Split bills with friends, accept/reject invitations.

| Task | Status |
|------|--------|
| 4.1 Create Shared Expense API (create, fetch) | ⬜ Pending |
| 4.2 Build Shared Expenses page UI | ⬜ Pending |
| 4.3 Add member by email | ⬜ Pending |
| 4.4 Accept/Reject invitation logic | ⬜ Pending |
| 4.5 Show who owes whom | ⬜ Pending |

### 🟡 PRIORITY 5: Essential UX Fixes (~45 min)
Make the app feel production-ready.

| Task | Status |
|------|--------|
| 5.1 Toast notifications (replace all alert()) | ⬜ Pending |
| 5.2 Edit Expense functionality | ⬜ Pending |
| 5.3 Delete Expense with confirmation dialog | ⬜ Pending |
| 5.4 Category selection in Add Expense form | ⬜ Pending |

### 🟡 PRIORITY 6: Notifications (~35 min)
Bell icon, dropdown, shared expense alerts.

| Task | Status |
|------|--------|
| 6.1 Notification bell icon in header | ⬜ Pending |
| 6.2 Notification dropdown panel | ⬜ Pending |
| 6.3 Generate notification on shared expense | ⬜ Pending |
| 6.4 Mark as read/unread | ⬜ Pending |

### 🟢 PRIORITY 7: Data Export (~20 min)
Download data as CSV.

| Task | Status |
|------|--------|
| 7.1 Export expenses as CSV | ⬜ Pending |
| 7.2 Add export button to Expenses page | ⬜ Pending |

### 🟢 PRIORITY 8: Final Polish (~25 min)
Last touches before presentation.

| Task | Status |
|------|--------|
| 8.1 Loading skeletons for pages | ⬜ Pending |
| 8.2 Fix responsive issues | ⬜ Pending |
| 8.3 Final Git push | ⬜ Pending |

### TOTAL ESTIMATED TIME: ~5 hours 45 minutes

---

## 8. GROUND RULES

1. We go in order: P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8. No skipping.
2. Complete code is provided. Copy, paste, save. No guessing.
3. Test immediately after each step. Report if it works or breaks.
4. If something breaks, fix it before moving to the next priority.
5. No distractions. Focus until it's done.
6. Colors must be calm, professional, NOT flashy.
7. Both light and dark themes must look good.

---

## 9. IMPORTANT NOTES

- The `incomes` table requires `income_source_id` (NOT NULL). Always auto-create a default source.
- The `incomes` table uses `userId` (not `ownerId`) to reference the user.
- Better Auth uses `authClient.requestPasswordReset()` (NOT `forgetPassword()`).
- The catch-all auth route is at `src/app/api/auth/[...all]/route.ts`.
- Nodemailer uses Gmail App Password (NOT regular Gmail password).
- Biome v2 is installed. Use `pnpm biome check --write .` to format.
- The currency system uses localStorage + React Context.
- The theme system will also use localStorage + React Context.

---

## 10. GIT INFORMATION

| Item | Value |
|------|-------|
| Repository | expense-tracker-rishi |
| Branch | dev |
| Remote | origin |
| Push Command | `git push origin dev` |

---

## 11. ENVIRONMENT VARIABLES (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Nodemailer (Gmail)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"

---

### How to Use This Document

1. **Save it** as `RUPALYTIC_PROJECT_PLAN.md` in your project root.
2. **In any future chat**, paste this document as your first message and say: *"Here is my project plan. Let's continue from Priority [X], Task [Y]."*
3. **Update the checkboxes** (change `⬜` to `✅`) as we complete each task.

---

### Question 179

Have you saved this document? Are you ready to start with **Priority 1, Task 1.1** (Update Tailwind config with the new calm color palette)?

**Why I am asking:** This document is your single source of truth. Whenever you feel lost or start a new chat, this document brings us right back on track. Confirm you've saved it, and we begin immediately!
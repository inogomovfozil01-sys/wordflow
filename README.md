# 🌊 WordFlow — Production-Ready English Vocabulary Platform

WordFlow is a full-stack, database-backed English vocabulary learning platform built with **Next.js 16 (App Router)**, **PostgreSQL**, **Prisma ORM**, and **Google Gemini 3.8 Flash AI**. It combines cognitive science (SuperMemo SM-2 spaced repetition), multi-modal practice, dual-language translations (Russian & Uzbek), and adaptive AI tutoring to take learners from A1 to C2 mastery.

---

## 🚀 Key Features

### 🧠 1. SM-2 Spaced Repetition System (SRS)
- Pure mathematical implementation of the SuperMemo SM-2 spaced repetition algorithm.
- Tracks `easeFactor` (minimum boundary 1.3), intervals (1 day, 6 days, exponential scaling), repetitions, and memory lapses.
- Automatic transition to **MASTERED** status once intervals exceed 21 days with successful recall.
- Real-time overdue scheduling and review queues at `/review`.

### 🎯 2. Interactive Learning Engine (`/learn`)
- Multi-step vocabulary progression:
  1. **Interactive Flashcard**: Word, IPA, definition, audio pronunciation, Russian & Uzbek translations.
  2. **Multiple Choice Recognition**: Contextual definition mapping with randomized distractors.
  3. **Active Recall Typing**: Spelling and active vocabulary production.
  4. **Fill-in-the-Blank Cloze**: Sentence completion testing contextual usage.
- Real-time progress bar, immediate feedback, audio cues, and confetti celebrations on session completion.

### 🎮 3. 10 Comprehensive Practice Modes (`/practice`)
1. **Speed Review**: 10-second rapid-fire recall challenge.
2. **Synonym Match**: Test semantic nuance and related vocabulary.
3. **Antonym Match**: Opposite-word recognition.
4. **Listening & Pronunciation**: Speech synthesis audio with transcription verification.
5. **Collocation Builder**: Master natural word pairings and prepositional combinations.
6. **Definition Match**: Match complex CEFR definitions to headwords.
7. **Word Scramble**: Anagram puzzle testing exact English spelling.
8. **Dual Translation (RU/UZ)**: English to Russian & Uzbek bidirectional testing.
9. **Reverse Translation**: Target native language to English recall.
10. **Sentence Builder**: Arrange scrambled words into grammatical sentences.

### 🤖 4. Google Gemini 3.8 Flash AI Integration
- **AI English Tutor (`/ai-tutor`)**: Conversational tutor that automatically calibrates explanations to the user's current CEFR level (A1–C2).
- **AI Word Explainer (Modal & Dictionary)**: On-demand mnemonics, CEFR-tailored sentences, false friend warnings, and instant mini-quizzes.
- Powered by official `@google/genai` SDK with graceful educational fallbacks.

### 🏆 5. Gamification & Analytics
- Server-authoritative XP and level curve: `XP = 50 * (Level - 1)^2`.
- Multi-day streak tracker with backward date traversal.
- Global Community Leaderboard (`/leaderboard`) with top-3 podiums and live rankings.
- Retention analytics (`/stats`): CEFR distribution breakdown, memory strength, and 30-day activity logs.
- Unlocked achievement milestones with badges.

### 🛡️ 6. Security & Administration
- Edge-ready JWT sessions with HTTP-only cookies (`jose`) and bcrypt password hashing.
- Server-side route middleware protection (`/dashboard`, `/learn`, `/review`, `/practice`, `/settings`, `/stats`, `/ai-tutor`, `/admin`).
- Role-protected Admin Control Center (`/admin`):
  - Live PostgreSQL database metrics.
  - Full Word CRUD dictionary editor (create, inspect, delete).
  - Admin audit logging for traceability.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.3.5](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: PostgreSQL + [Prisma 6.4.1](https://www.prisma.io/)
- **AI Engine**: [Google Gemini 3.8 Flash](https://ai.google.dev/) via `@google/genai`
- **Authentication**: JWT (`jose`) + `bcryptjs` + HTTP-only cookies
- **Validation**: [Zod v4](https://zod.dev/)
- **Speech**: Web Speech API native synthesizer
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node 24 recommended)
- PostgreSQL database (Local or Cloud like [Neon](https://neon.tech), Supabase, or AWS RDS)

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd excited-bardeen
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Set the following variables:
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
AUTH_SECRET="your-32-character-random-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Database Setup & Seed
Push the Prisma schema to your PostgreSQL database and populate initial vocabulary:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Run Automated Tests
```bash
npm test
```
All 27 automated unit tests for SM-2, XP curves, streaks, and Zod validation will run and pass.

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Accounts (Seeded)

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@wordflow.app` | `Admin@WordFlow2026!` | `ADMIN` (Full dictionary CRUD & panel) |
| **Demo Learner** | `demo@wordflow.app` | `Demo@WordFlow2026!` | `USER` (B1 Intermediate vocabulary) |

---

## 🚢 Production Deployment to Vercel

1. Push code to your Git repository (GitHub / GitLab / Bitbucket).
2. Connect the repository in [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `DATABASE_URL` (Pooled PostgreSQL connection string)
   - `DIRECT_URL` (Direct PostgreSQL connection string for Prisma)
   - `AUTH_SECRET` (Secure 32+ character string)
   - `NEXT_PUBLIC_APP_URL` (Production URL, e.g. `https://wordflow.app`)
   - `GEMINI_API_KEY` (Your Google AI Studio API key)
4. Build command is automatically detected: `next build`.
5. Deploy!

---

## 📄 License
MIT © 2026 WordFlow Team. All rights reserved.

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective date: September 20, 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Data Minimization Principle</h2>
        <p className="text-sm leading-relaxed">
          WordFlow collects only the essential information necessary to deliver and personalize your English vocabulary learning experience. We do not sell your personal data to advertisers or third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed">
          <li><strong>Account Details:</strong> Name, username, email, and password hash (encrypted using bcrypt).</li>
          <li><strong>Learning Progress:</strong> Words studied, review ratings, spaced repetition schedules, session accuracy, and streak counts.</li>
          <li><strong>Preferences:</strong> CEFR level, target learning goals, daily target words, and interface language.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Cookies and Authentication</h2>
        <p className="text-sm leading-relaxed">
          We use secure, HTTP-only, encrypted session cookies solely for authenticating your requests and safeguarding your account. We do not employ cross-site tracking cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. AI Features & Gemini API</h2>
        <p className="text-sm leading-relaxed">
          When you interact with the AI Tutor or request word explanations, only the relevant pedagogical inquiry (e.g. the word and your target CEFR level) is sent to the server-side Google Gemini API. We never send your email, password, or account credentials to external AI endpoints.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Your Right to Erasure</h2>
        <p className="text-sm leading-relaxed">
          You maintain full ownership of your data. You may delete your account at any time via the Settings page. Account deletion permanently and irrevocably removes your profile, study sessions, reviews, and activity logs from our database.
        </p>
      </section>
    </div>
  );
}

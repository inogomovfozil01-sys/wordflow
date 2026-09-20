import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective date: September 20, 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
        <p className="text-sm leading-relaxed">
          By creating an account or accessing the WordFlow platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must discontinue use of the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Acceptable Use</h2>
        <p className="text-sm leading-relaxed">
          You agree to use WordFlow solely for lawful personal or educational purposes. You agree not to:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed">
          <li>Reverse engineer, scrape, or systematically extract vocabulary databases for unauthorized commercial exploitation.</li>
          <li>Attempt to bypass server-side rate limits, authentication tokens, or administrative authorization boundaries.</li>
          <li>Abuse AI tutor endpoints with malicious prompts or automated spam scripts.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Intellectual Property</h2>
        <p className="text-sm leading-relaxed">
          WordFlow branding, design assets, and algorithmic implementations are the property of WordFlow. Vocabulary definitions, open phonetic transcriptions, and community example sentences are curated for educational reference.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
        <p className="text-sm leading-relaxed">
          WordFlow is provided on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive for 100% uptime and precision, we make no guarantees that service will be uninterrupted or error-free.
        </p>
      </section>
    </div>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ToastProvider } from '@/components/ui/toast';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { calculateStreak } from '@/lib/xp';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'WordFlow - Learn English Words That Actually Stay With You',
  description:
    'Master English vocabulary with personalized SM-2 spaced repetition, interactive practice modes, and Gemini AI tutoring. Multi-language support in English, Russian, and Uzbek.',
  keywords: [
    'English vocabulary',
    'spaced repetition',
    'SM-2 algorithm',
    'learn English',
    'CEFR levels',
    'AI tutor',
    'IELTS vocabulary',
  ],
  authors: [{ name: 'WordFlow Team' }],
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'WordFlow - Science-Backed English Vocabulary Mastery',
    description:
      'Learn English words that actually stay with you through spaced repetition and Gemini AI tutoring.',
    siteName: 'WordFlow',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  let streak = 0;
  if (session) {
    const activities = await prisma.dailyActivity.findMany({
      where: { userId: session.userId },
      select: { date: true },
    });
    const streakData = calculateStreak(activities.map((a) => a.date));
    streak = streakData.currentStreak;
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <ToastProvider>
          <Navbar user={session} streak={streak} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

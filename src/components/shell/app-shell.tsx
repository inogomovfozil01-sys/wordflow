'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './app-sidebar';
import { MobileNav } from './mobile-nav';
import { PublicHeader } from './public-header';
import { Footer } from '@/components/footer';
import { CommandMenu } from '@/components/ui/command-menu';
import { NavbarUser } from '@/components/navbar';

interface AppShellProps {
  user?: NavbarUser | null;
  streak?: number;
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/', '/about', '/contact', '/privacy', '/terms', '/login', '/register'];

export function AppShell({ user, streak = 0, children }: AppShellProps) {
  const pathname = usePathname();

  // If path is an auth page (login/register), we let the page handle its own layout without standard headers
  const isAuthPage = pathname === '/login' || pathname === '/register';
  // Check if current route is considered public
  const isPublicRoute = PUBLIC_PATHS.includes(pathname);

  // If not logged in, or browsing public pages, render Public Header + Content + Footer
  if (!user || isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <CommandMenu />
        {!isAuthPage && <PublicHeader />}
        <main className="flex-1">{children}</main>
        {!isAuthPage && <Footer />}
      </div>
    );
  }

  // Authenticated Application Shell (Sidebar + Main View + Mobile Nav)
  return (
    <div className="min-h-screen flex bg-slate-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <CommandMenu />
      
      {/* Desktop Left Sidebar */}
      <AppSidebar user={user} streak={streak} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header and Bottom Bar */}
        <MobileNav user={user} streak={streak} />

        <main className="flex-1 pb-24 lg:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}

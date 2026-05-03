'use server';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { getSession } from '@/infrastructure/auth/session';

interface BackToHomeLinkProps {
  forceHome?: boolean;
}

export const BackToPageLink = async ({ forceHome = false }: BackToHomeLinkProps) => {
  const session = await getSession();
  const hasSession = !!session && !forceHome;

  const href = hasSession ? routes.profile.dashboard : routes.home;
  const title = hasSession ? 'dashboard' : 'home';

  return (
    <div className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to {title}
      </Link>
    </div>
  );
};

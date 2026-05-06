'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type LucideIcon,
  Heart,
  LayoutDashboard,
  MailOpen,
  Settings,
} from 'lucide-react';

import { routes } from '@/config/routes';

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: routes.profile.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: routes.profile.messages, label: 'Messages', icon: MailOpen },
  { href: routes.profile.favorites, label: 'Favorites', icon: Heart },
  { href: routes.profile.settings, label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex sm:flex-col w-48 shrink-0 self-start sticky top-24">
      <nav className="flex flex-col gap-1 rounded-xl bg-card border border-border p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
              flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-primary-hover/20 hover:text-foreground'
              }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted'}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export const BottomSideBar = () => {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors
                ${isActive ? 'text-primary' : 'text-muted hover:text-foreground'}`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LayoutDashboard, Settings } from 'lucide-react';

import { routes } from '@/config/routes';

const NAV_ITEMS = [
  { href: routes.profile.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: routes.profile.favorites, label: 'Favorites', icon: Heart },
  { href: routes.profile.settings, label: 'Settings', icon: Settings },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex sm:flex-col w-56 shrink-0 bg-card border-r border-border p-3 rounded-lg">
      <nav className="flex flex-col gap-1 sticky top-24">
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

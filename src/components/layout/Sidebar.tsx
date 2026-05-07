'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon, Heart, LayoutDashboard, Mail, Settings } from 'lucide-react';

import { routes } from '@/config/routes';
import type { UserDTO } from '@/domain/user/types';

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: routes.profile.dashboard, label: 'My products', icon: LayoutDashboard },
  { href: routes.profile.messages, label: 'Messages', icon: Mail },
  { href: routes.profile.favorites, label: 'Favorites', icon: Heart },
  { href: routes.profile.settings, label: 'Settings', icon: Settings },
];

interface SidebarProps {
  user?: UserDTO;
  unreadMessagesCount?: number;
}

export const Sidebar = ({ user, unreadMessagesCount = 0 }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex sm:flex-col w-56 shrink-0 self-start sticky top-24 gap-2">
      {user && (
        <div className="rounded-xl bg-card border border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 rounded-xl bg-card border border-border p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const showBadge = href === routes.profile.messages && unreadMessagesCount > 0;
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
                    : 'text-muted-foreground hover:bg-background/20 hover:text-foreground'
                }
              `}
            >
              <div className="relative">
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted'}`}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

interface BottomSideBarProps {
  unreadMessagesCount?: number;
}

export const BottomSideBar = ({ unreadMessagesCount = 0 }: BottomSideBarProps) => {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const showBadge = href === routes.profile.messages && unreadMessagesCount > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors
                ${isActive ? 'text-primary' : 'text-muted hover:text-foreground'}`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                {showBadge && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

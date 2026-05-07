'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  LayoutDashboard,
  Mail,
  Heart,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

import { routes } from '@/config/routes';
import { logout } from '@/features/auth/actions';

interface UserDropdownProps {
  username: string;
  email: string;
}

interface DropdownItemProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

const DropdownItem = ({
  href,
  icon: Icon,
  label,
  danger = false,
  onClick,
}: DropdownItemProps) => {
  const baseClasses = `
    flex items-center gap-3 rounded-lg px-3 py-2 text-sm
    transition-colors duration-150
  `;

  const styles = danger
    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
    : 'text-muted-foreground hover:bg-background hover:text-foreground';

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${styles}`}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${styles} w-full text-left`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
};

const DROPDOWN_NAV_OPTIONS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: routes.profile.dashboard, icon: LayoutDashboard, label: 'My products' },
  { href: routes.profile.messages, icon: Mail, label: 'Messages' },
  { href: routes.profile.favorites, icon: Heart, label: 'Favorites' },
  { href: routes.profile.settings, icon: Settings, label: 'Settings' },
];

export const UserDropdown = ({ username, email }: UserDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="
          flex items-center gap-2 rounded-xl px-3 py-2
          transition-colors duration-150
          hover:bg-card cursor-pointer
        "
      >
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full bg-primary/10
            font-semibold text-primary
          "
        >
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left lg:block">
          <p className="max-w-30 truncate text-sm font-medium">{username}</p>
        </div>

        <ChevronDown
          className={`
            hidden h-4 w-4 text-muted-foreground transition-transform duration-200 lg:block
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-14 z-50
            w-72 overflow-hidden rounded-2xl
            border border-border bg-card shadow-2xl
            animate-in fade-in zoom-in-95
          "
        >
          <div className="border-b border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full bg-primary/10
                  font-semibold text-primary
                "
              >
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{username}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-2">
            {DROPDOWN_NAV_OPTIONS.map(({ href, icon: Icon, label }) => {
              return <DropdownItem key={href} href={href} icon={Icon} label={label} />;
            })}
          </div>

          <div className="border-t border-border p-2">
            <form action={logout}>
              <button
                type="submit"
                className="
                  flex w-full items-center gap-3 rounded-lg
                  px-3 py-2 text-sm text-red-400
                  transition-colors duration-150
                  hover:bg-red-500/10 hover:text-red-300
                  cursor-pointer
                "
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';

import { logout } from '@/features/auth/actions';

interface MenuOptionsProps {
  onItemClick?: () => void;
}

export const MenuOptions = ({ onItemClick }: MenuOptionsProps) => {
  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      <nav className="flex flex-col py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.href}
              onClick={onItemClick}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-foreground text-sm font-medium"
            >
              <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-red-600 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );
};

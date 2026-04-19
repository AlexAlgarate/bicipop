'use client';

import { useCloseMenuClickingOutside } from '@/hooks/use-close-menu';
import { Menu } from 'lucide-react';
import { useRef, useState } from 'react';
import { MenuOptions } from './MenuOptions';

export const DesktopMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useCloseMenuClickingOutside(menuRef, () => setMenuOpen(false), menuOpen);
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Menú de usuario"
        className={`
          w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20
          flex items-center justify-center transition-colors cursor-pointer
          ${menuOpen ? 'ring-2 ring-primary/40' : ''}
        `}
      >
        <Menu className="w-5 h-5 text-primary" />
      </button>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <MenuOptions onItemClick={() => setMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

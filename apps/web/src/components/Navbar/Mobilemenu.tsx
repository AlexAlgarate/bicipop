'use client';

import { Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SearchBar } from './SearchBar';
import Link from 'next/link';
import { ThemeToggle } from '../theme-toggle';
import { useCloseMenuClickingOutside } from '@/hooks/use-close-menu';
import { MenuOptions } from './MenuOptions';

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export const MobileMenu = ({ isAuthenticated }: MobileMenuProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useCloseMenuClickingOutside(menuRef, () => setMenuOpen(false), menuOpen);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  if (!isAuthenticated) {
    return (
      <div className="md:hidden shrink-0">
        <Link
          href="/login"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => {
            setSearchOpen((o) => !o);
            setMenuOpen(false);
          }}
          aria-label="Buscar"
          className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground"
        >
          {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
        <ThemeToggle />
        <button
          onClick={() => {
            setMenuOpen((o) => !o);
            setSearchOpen(false);
          }}
          aria-label="Menú"
          className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground"
        >
          {menuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      {searchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border shadow-md">
          <SearchBar mobileOpen />
        </div>
      )}

      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-14 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={menuRef}
            className="md:hidden absolute top-full right-4 z-50 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden"
          >
            <MenuOptions onItemClick={() => setMenuOpen(false)} />
          </div>
        </>
      )}
    </>
  );
};

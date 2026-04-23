import Link from 'next/link';

import { ThemeToggle } from '../theme-toggle';

import { SearchBar } from './SearchBar';
import { LogoSection } from './LogoSection';
import { DesktopMenu } from './DesktopMenu';

interface AuthSectionsProps {
  isAuthenticated: boolean;
}

export const Navbar = async ({ isAuthenticated }: AuthSectionsProps) => {
  return (
    <header>
      <nav className="border-b border-border py-3 md:py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 relative">
          <div className="shrink-0">
            <LogoSection />
          </div>

          <div className="mx-4 hidden flex-1 max-w-xl md:block">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />
            {isAuthenticated ? (
              <DesktopMenu />
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-border px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

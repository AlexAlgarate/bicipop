import { SearchBar } from './SearchBar';
import { LogoSection } from './LogoSection';
import { MobileMenu } from './Mobilemenu';
import { DesktopMenu } from './DesktopMenu';
import { ThemeToggle } from '../theme-toggle';
import Link from 'next/link';

interface AuthSectionsProps {
  isAuthenticated: boolean;
}

export const Navbar = ({ isAuthenticated }: AuthSectionsProps) => {
  return (
    <nav className="border-b border-border py-3 md:py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4 relative">
        <div className="shrink-0">
          <LogoSection />
        </div>
        {isAuthenticated && <SearchBar />}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {isAuthenticated ? (
            <DesktopMenu />
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        <MobileMenu isAuthenticated={isAuthenticated} />
      </div>
    </nav>
  );
};

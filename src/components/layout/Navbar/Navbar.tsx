import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

import { SearchBar } from '@/components/layout/Navbar/SearchBar';
import { routes } from '@/config/routes';
import { getCurrentUser } from '@/features/auth/api';

import { UserDropdown } from './MenuDropdown';

interface NavbarProps {
  unreadMessagesCount?: number;
  showSearchBar?: boolean;
}

export const Navbar = async ({
  unreadMessagesCount = 0,
  showSearchBar = true,
}: NavbarProps) => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <LogoSection />

        {showSearchBar && (
          <div className="mx-4 hidden flex-1 max-w-xl md:block">
            <SearchBar />
          </div>
        )}

        <nav className="flex items-center gap-2">
          {showSearchBar && (
            <Link
              href={routes.search}
              className="btn btn-ghost p-2 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
          )}

          {user ? (
            <>
              <UploadButton />
              <UserDropdown
                username={user.username}
                email={user.email}
                unreadMessagesCount={unreadMessagesCount}
              />{' '}
            </>
          ) : (
            <>
              <Link href={routes.auth.login} className="btn btn-ghost">
                Login
              </Link>
              <Link href={routes.auth.register} className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {showSearchBar && (
        <div className="border-t border-border px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      )}
    </header>
  );
};

const LogoSection = () => (
  <Link
    href={routes.home}
    className="text-2xl font-bold text-foreground flex items-center gap-2"
  >
    <div
      className="w-12 h-12 bg-primary rounded-full flex items-center
        justify-center text-primary-foreground font-bold hover:scale-105
        transition-transform duration-200"
    >
      <span>B</span>
    </div>
    <span className="hidden text-2xl sm:inline-block">BiciPop</span>
  </Link>
);

const UploadButton = () => (
  <Link href={routes.products.upload} className="btn btn-primary gap-2 px-3">
    <Plus className="h-5 w-5" />
    <span className="hidden sm:inline">Upload</span>
  </Link>
);

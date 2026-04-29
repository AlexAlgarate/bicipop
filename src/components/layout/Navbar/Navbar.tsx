import Link from 'next/link';
import { Plus, User, LogOut, LayoutDashboard, Search } from 'lucide-react';

import { getCurrentUser } from '@/infrastructure/auth/session';
import { SearchBar } from '@/components/layout/Navbar/SearchBar';
import { logout } from '@/features/auth/actions';
import { routes } from '@/config/routes';
import type { UserDTO } from '@/domain/user/types';

export const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <LogoSection />

        <div className="mx-4 hidden flex-1 max-w-xl md:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href={routes.search}
            className="btn btn-ghost p-2 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          {user ? (
            <>
              <UploadButton />
              <DashboardButton />
              <div className="flex items-center gap-2 border-l border-border pl-2">
                <UserButton id={user.id} username={user.username} />
                <LogoutButton />
              </div>
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

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
};

const LogoSection = () => {
  return (
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
};

const UploadButton = () => {
  return (
    <Link href={routes.items.upload} className="btn btn-primary gap-2">
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Upload</span>
    </Link>
  );
};

const DashboardButton = () => {
  return (
    <Link href={routes.dashboard} className="btn btn-ghost gap-2 px-3">
      <LayoutDashboard className="h-5 w-5" />
      <span className="hidden sm:inline">Dashboard</span>
    </Link>
  );
};

const UserButton = ({ id, username }: UserDTO) => {
  return (
    <Link href={`${routes.profile}/${id}`} className="btn btn-ghost gap-2 px-3">
      <User className="h-5 w-5" />
      <span className="hidden sm:inline">{username}</span>
    </Link>
  );
};

const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="btn btn-ghost p-2 text-muted hover:text-accent"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </button>
    </form>
  );
};

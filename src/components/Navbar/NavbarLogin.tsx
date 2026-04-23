import Link from 'next/link';

import { ROUTE } from '@/utils/constants';

export const NavbarLogin = async () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <LogoSection />

        <nav className="flex items-center gap-2">
          <>
            <Link href={ROUTE.auth.login} className="btn btn-ghost">
              Login
            </Link>
            <Link href={ROUTE.auth.register} className="btn btn-primary">
              Register
            </Link>
          </>
        </nav>
      </div>
    </header>
  );
};

const LogoSection = () => {
  return (
    <Link href="/" className="text-2xl font-bold text-foreground flex items-center gap-2">
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

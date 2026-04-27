import React from 'react';

import { NavbarLogin } from '@/features/auth/components/NavbarLogin';
import { Footer } from '@/components/layout/Footer/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarLogin />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

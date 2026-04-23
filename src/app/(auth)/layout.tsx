import React from 'react';

import { NavbarLogin } from '@/components/Navbar/NavbarLogin';
import { Footer } from '@/components/Footer/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarLogin />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar/Navbar';
import { cookies } from 'next/headers';
import { Footer } from '@/components/Footer/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ad-Marketplace',
  description: 'Marketplace website for a Next project Web KeepCoding XIX Bootcamp',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session-token';
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME);
  const isAuthenticated = !!sessionToken;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background`}
      >
        <Navbar isAuthenticated={isAuthenticated} />
        <main className="flex1 w-full">
          <div>{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}

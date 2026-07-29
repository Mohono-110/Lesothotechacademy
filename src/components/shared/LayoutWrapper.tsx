'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const HIDE_LAYOUT_ROUTES = ['/dashboard', '/admin', '/login', '/register'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = HIDE_LAYOUT_ROUTES.some((route) => pathname.startsWith(route));

  if (hideLayout) {
    return (
      <>
        <main className="min-h-screen flex flex-col">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">{children}</main>
      <Footer />
    </>
  );
}

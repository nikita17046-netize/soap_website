'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  if (isDashboard) return null;
  return <Footer />;
}

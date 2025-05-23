'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

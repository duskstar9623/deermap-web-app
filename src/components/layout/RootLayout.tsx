import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageSkeleton } from '@/components/shared';

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}

import { Suspense } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import PageSkeleton from '@/components/shared/PageSkeleton';
import { useRouteHandle } from '@/router/utils/useRouteHandle';
import useRouteTitle from '@/hooks/useRouteTitle';

export default function RootLayout() {
  const location = useLocation();
  const { hideNavbar = false, hideFooter = false } = useRouteHandle();

  useRouteTitle();

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && <Navbar />}
      <main className="pt-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
        {!hideFooter && <Footer />}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
}

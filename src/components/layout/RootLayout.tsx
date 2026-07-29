import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import NavigationOverlay from '@/components/layout/NavigationOverlay';

import useRouteHandle from '@/router/utils/useRouteHandle';
import useRouteTitle from '@/router/utils/useRouteTitle';

export default function RootLayout() {
  const location = useLocation();
  const { hideNavbar = false, hideFooter = false } = useRouteHandle();

  // Set the document title based on the current route's handle
  useRouteTitle();

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && <Navbar />}
      <main className="pt-0">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <ScrollRestoration getKey={(location) => location.pathname} />
      <NavigationOverlay />
    </div>
  );
}

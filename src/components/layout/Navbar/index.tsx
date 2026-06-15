import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/assets/icons';
import { ROUTES } from '@/router/routes';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const NAV_LINKS = [
  { path: ROUTES.home, labelKey: 'nav.home' },
  { path: ROUTES.services, labelKey: 'nav.services' },
  { path: ROUTES.visualization, labelKey: 'nav.visualization' },
  { path: ROUTES.multiomics, labelKey: 'nav.multiomics' },
  { path: ROUTES.academic, labelKey: 'nav.academic' },
  { path: ROUTES.pricing, labelKey: 'nav.pricing' },
  { path: ROUTES.contact, labelKey: 'nav.contact' },
] as const;

function Navbar() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.home} className="flex items-center space-x-2">
            <Logo className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-primary">{t('brand.name')}</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(l => (
              <Link key={l.path} to={l.path}
                className={`text-sm font-medium transition-colors ${isActive(l.path) ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                {t(l.labelKey)}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to={ROUTES.contact}
              className="flex items-center space-x-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
              <span>{t('action.startConsult')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {t(l.labelKey)}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
import { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Icon from '@/components/shared/Icon';
import { Logo } from '@/assets/icons';
import ROUTES from '@/router/paths';
import { LANGUAGE_NAMESPACES } from '@/constants/const';
// import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const NAV_LINKS = [
  { path: ROUTES.Home, labelKey: 'nav.home' },
  { path: ROUTES.Bioinformatics, labelKey: 'nav.services' },
  { path: ROUTES.Multiomics.Root, labelKey: 'nav.multiomics' },
  { path: ROUTES.Visualization.Root, labelKey: 'nav.visualization' },
  { path: ROUTES.Academic, labelKey: 'nav.academic' },
  { path: ROUTES.Pricing, labelKey: 'nav.pricing' },
  { path: ROUTES.Contact, labelKey: 'nav.contact' },
] as const;

type Rect = { left: number; width: number };

function Navbar() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverRect, setHoverRect] = useState<(Rect & { key: string }) | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const measureRect = (path: string): Rect | null => {
    const el = linkRefs.current.get(path);
    if (!el || !containerRef.current) return null;
    const cr = containerRef.current.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { left: er.left - cr.left, width: er.width };
  };

  // motion values avoid calling setState inside useLayoutEffect
  const activeLeft = useMotionValue(0);
  const activeWidth = useMotionValue(0);
  const springLeft = useSpring(activeLeft, { stiffness: 400, damping: 35 });
  const springWidth = useSpring(activeWidth, { stiffness: 400, damping: 35 });

  useLayoutEffect(() => {
    const path = NAV_LINKS.find(l => isActive(l.path))?.path;
    const rect = path ? measureRect(path) : null;
    activeLeft.set(rect?.left ?? 0);
    activeWidth.set(rect?.width ?? 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.Home} className="flex items-center space-x-2">
            <Logo className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-primary">{t('brand.name')}</span>
          </Link>
          <div ref={containerRef} className="hidden md:flex items-stretch self-stretch relative">
            {NAV_LINKS.map(l => {
              const active = isActive(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  ref={el => { if (el) linkRefs.current.set(l.path, el); }}
                  onMouseEnter={() => {
                    const r = measureRect(l.path);
                    if (r) setHoverRect({ ...r, key: l.path });
                  }}
                  onMouseLeave={() => setHoverRect(null)}
                  className={`h-full flex items-center px-4 text-sm transition-colors rounded-sm ${active ? 'font-bold text-primary' : 'font-semibold text-gray-600 hover:text-primary hover:bg-primary/5'}`}
                >
                  {t(l.labelKey)}
                </Link>
              );
            })}
            {/* single active indicator — slides purely horizontally via spring */}
            <motion.span
              className="absolute bottom-0 h-0.5 bg-primary rounded-full pointer-events-none"
              style={{ left: springLeft, width: springWidth }}
            />
            {/* hover indicator — expands from center only */}
            <AnimatePresence>
              {hoverRect && (
                <motion.span
                  key={hoverRect.key}
                  className="absolute bottom-0 h-0.5 bg-primary/40 rounded-full pointer-events-none"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  style={{ left: hoverRect.left, width: hoverRect.width, originX: '50%' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* <LanguageSwitcher /> */}
            <Link to={ROUTES.Contact}
              className="flex items-center space-x-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
              <span>{t('action.startConsult')}</span>
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <Icon name="close" size={24} /> : <Icon name="menu" size={24} />}
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
                {/* <LanguageSwitcher /> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
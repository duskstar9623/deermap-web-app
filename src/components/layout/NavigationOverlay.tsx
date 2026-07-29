import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/** Delay before showing overlay — prevents flicker on fast/cached navigations */
const SHOW_DELAY_MS = 150;
/** Hard cap — forces overlay closed if navigation never resolves */
const MAX_DURATION_MS = 15_000;

export default function NavigationOverlay() {
  const navigation = useNavigation();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  // showTimer: delays the appearance; hideTimer: handles max-timeout OR immediate close
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Primary: driven by React Router navigation state.
  // All setVisible calls are inside timer callbacks (async) to avoid
  // synchronous setState-in-effect lint violations.
  useEffect(() => {
    if (navigation.state === 'loading') {
      showTimer.current = setTimeout(() => {
        setVisible(true);
        // Hard cap — forces close if navigation never resolves
        hideTimer.current = setTimeout(() => setVisible(false), MAX_DURATION_MS);
      }, SHOW_DELAY_MS);
    } else {
      if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
      if (hideTimer.current) clearTimeout(hideTimer.current);
      // Schedule close in a microtask-like callback so setState is not synchronous
      hideTimer.current = setTimeout(() => setVisible(false), 0);
    }
    return () => {
      if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
      if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    };
  }, [navigation.state]);

  // Safety net: location.key changes whenever navigation actually completes,
  // ensuring the overlay is always closed even if navigation state is missed.
  useEffect(() => {
    if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 0);
    return () => {
      if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    };
  }, [location.key]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nav-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          aria-label="页面加载中"
          aria-busy="true"
        >
          <div className="relative h-10 w-10">
            {/* Track ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/20" />
            {/* Spinning indicator */}
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-white" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

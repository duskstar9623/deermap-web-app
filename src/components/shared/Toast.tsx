import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  info: 'bg-primary text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
};

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

/**
 * Fixed-position toast notification rendered in a Portal.
 * Auto-closes after `duration` ms (default 3000).
 */
export default function Toast({ open, onClose, message, variant = 'info', duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-medium ${VARIANT_CLASSES[variant]}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

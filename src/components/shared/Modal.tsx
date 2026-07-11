import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Portal-based modal with Framer Motion fade + scale animation.
 * Clicking the backdrop calls `onClose`.
 */
export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className={[
              'relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 z-10',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {title && (
              <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

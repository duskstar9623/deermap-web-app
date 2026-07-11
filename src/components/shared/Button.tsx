import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  outline: 'border border-primary text-primary bg-transparent hover:bg-primary/5',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Atomic button with Framer Motion hover/tap animations.
 * - Pass `variant` + `size` to use the built-in style system.
 * - Pass `className` alone to fully override styles (useful for
 *   one-off designs that need precise Tailwind classes).
 */
export default function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const computedClass = className
    ? className
    : [
        'inline-flex items-center justify-center font-medium transition-colors',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
      ].join(' ');

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...rest}
      className={computedClass}
    >
      {children}
    </motion.button>
  );
}

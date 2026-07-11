import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  title: string
  description?: string
  image?: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
  children?: ReactNode
}

/**
 * Shared card component for consistent card UI across pages.
 * Reusable for service cards, feature cards, result cards, etc.
 */
export default function Card({
  title,
  description,
  image,
  icon,
  onClick,
  className = '',
  children,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            width={800}
            height={192}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {icon && (
            <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/70">
              {icon}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        {description && <p className="text-gray-600">{description}</p>}
        {children}
      </div>
    </motion.div>
  );
}


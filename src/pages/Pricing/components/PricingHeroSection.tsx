import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

export function PricingHeroSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.PRICING);

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-6"
        >
          {t('page.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-xl text-white/80 max-w-3xl mx-auto"
        >
          {t('page.subtitle')}
        </motion.p>
      </div>
    </section>
  );
}

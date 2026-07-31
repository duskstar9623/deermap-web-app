import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '@/constants/assets';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

export function AcademicHeroSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.ACADEMIC);

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <img src={ASSETS.cards.transcriptomics} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

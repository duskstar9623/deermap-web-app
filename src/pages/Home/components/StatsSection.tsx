import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

const STATS = [
  { num: '1000+', labelKey: 'stats.services' },
  { num: '500+', labelKey: 'stats.partners' },
  { num: '50+', labelKey: 'stats.tools' },
  { num: '99.9%', labelKey: 'stats.satisfaction' },
];

export function StatsSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.HOME);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{s.num}</div>
              <div className="text-gray-500">{t(s.labelKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

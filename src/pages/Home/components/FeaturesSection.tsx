import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, BarChart3, Layers, FileText } from 'lucide-react';
import { ROUTES } from '@/router/paths';
import { ASSETS } from '@/constants/assets';
import { THEME_COLORS, LANGUAGE_NAMESPACES } from '@/constants/const';

const FEATURES = [
  { icon: Database, titleKey: 'features.bioinformatics.title', descKey: 'features.bioinformatics.desc', color: THEME_COLORS.primary, bgImage: ASSETS.cards.genomics, route: ROUTES.bioinformatics },
  { icon: BarChart3, titleKey: 'features.visualization.title', descKey: 'features.visualization.desc', color: THEME_COLORS.primaryLight, bgImage: ASSETS.cards.transcriptomics, route: ROUTES.visualization },
  { icon: Layers, titleKey: 'features.multiomics.title', descKey: 'features.multiomics.desc', color: THEME_COLORS.accent, bgImage: ASSETS.cards.proteomics, route: ROUTES.multiomics },
  { icon: FileText, titleKey: 'features.academic.title', descKey: 'features.academic.desc', color: THEME_COLORS.accentLight, bgImage: ASSETS.cards.metabolomics, route: ROUTES.academic },
];

export function FeaturesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation(LANGUAGE_NAMESPACES.HOME);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">{t('features.sectionTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('features.sectionSubtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              onClick={() => navigate(f.route)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={f.bgImage} alt={t(f.titleKey)} loading="lazy" decoding="async"
                  width={800} height={192}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${f.color}90` }}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{t(f.titleKey)}</h3>
                <p className="text-gray-600">{t(f.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

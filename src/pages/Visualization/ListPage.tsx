import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CHART_TYPES, getChartI18nKey } from './config';
import ROUTES from '@/router/paths';
import { ASSETS } from '@/constants/assets';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

function VisualizationListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(LANGUAGE_NAMESPACES.VISUALIZATION);
  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-primary-light to-accent overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={ASSETS.cards.genomics} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">{t('page.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            {t('page.subtitle')}
          </motion.p>
          <motion.button onClick={() => navigate(ROUTES.Visualization.ChartTool)}
            className="px-8 py-3 bg-white text-primary-light rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('page.cta')}
          </motion.button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHART_TYPES.map((c, i) => {
              const i18nKey = getChartI18nKey(c.id);
              const chartName = t(`data.${i18nKey}`);
              const tags = t(`descriptions.${i18nKey}.tags`, { returnObjects: true });
              const tagList = Array.isArray(tags) ? tags.slice(0, 3) : [];
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }} viewport={{ once: true }}
                  onClick={() => navigate(ROUTES.Visualization.ChartTool)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative h-40 overflow-hidden bg-gray-50">
                    <img src={c.img} alt={chartName} loading="lazy" decoding="async" width={400} height={160} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-primary mb-1">{chartName}</h4>
                    <p className="text-gray-500 text-sm mb-2">{t(`descriptions.${i18nKey}.desc`)}</p>
                    <div className="flex flex-wrap gap-1">
                      {tagList.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-primary-light text-xs rounded-md">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default VisualizationListPage;

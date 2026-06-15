import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, BarChart3, Check, PieChart as PieChartIcon, MessageSquare } from 'lucide-react';
import { THEME_COLORS } from '@/constants/theme';
import { ASSETS } from '@/constants/assets';

function AcademicPage() {
  const { t } = useTranslation('academic');
  const services = [
    {
      titleKey: 'items.sciWriting.title',
      descKey: 'items.sciWriting.desc',
      detailKey: 'items.sciWriting.detail',
      featuresKey: 'items.sciWriting.features',
      icon: FileText,
      color: THEME_COLORS.primary,
      bgImage: ASSETS.cards.academicPaper,
    },
    {
      titleKey: 'items.patent.title',
      descKey: 'items.patent.desc',
      detailKey: 'items.patent.detail',
      featuresKey: 'items.patent.features',
      icon: PieChartIcon,
      color: '#4b5bab',
      bgImage: ASSETS.cards.academicPatent,
    },
    {
      titleKey: 'items.funding.title',
      descKey: 'items.funding.desc',
      detailKey: 'items.funding.detail',
      featuresKey: 'items.funding.features',
      icon: BarChart3,
      color: '#6366f1',
      bgImage: ASSETS.cards.academicFund,
    },
    {
      titleKey: 'items.report.title',
      descKey: 'items.report.desc',
      detailKey: 'items.report.detail',
      featuresKey: 'items.report.features',
      icon: MessageSquare,
      color: '#8b5cf6',
      bgImage: ASSETS.cards.academicReport,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={ASSETS.cards.transcriptomics} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">{t('page.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            {t('page.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div key={s.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <img src={s.bgImage} alt={t(s.titleKey)} loading="lazy" decoding="async" width={800} height={208} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}90` }}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{t(s.titleKey)}</h3>
                  <p className="text-gray-600 mb-3">{t(s.descKey)}</p>
                  <p className="text-gray-500 text-sm mb-4">{t(s.detailKey)}</p>
                  <div className="flex flex-wrap gap-2">
                    {(t(s.featuresKey, { returnObjects: true }) as string[]).map(f => (
                      <span key={f} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AcademicPage;

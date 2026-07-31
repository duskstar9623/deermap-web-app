import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/shared/Icon';
import type { IconfontName } from '@/components/shared/Icon';
import { THEME_COLORS, LANGUAGE_NAMESPACES } from '@/constants/const';
import { ASSETS } from '@/constants/assets';

type AcademicServiceItem = {
  titleKey: string;
  descKey: string;
  detailKey: string;
  featuresKey: string;
  icon: IconfontName;
  color: string;
  bgImage: string;
};

const ACADEMIC_SERVICES: AcademicServiceItem[] = [
  { titleKey: 'items.sciWriting.title', descKey: 'items.sciWriting.desc', detailKey: 'items.sciWriting.detail', featuresKey: 'items.sciWriting.features', icon: 'report', color: THEME_COLORS.primary, bgImage: ASSETS.cards.academicPaper },
  { titleKey: 'items.patent.title', descKey: 'items.patent.desc', detailKey: 'items.patent.detail', featuresKey: 'items.patent.features', icon: 'professionalReport', color: '#4b5bab', bgImage: ASSETS.cards.academicPatent },
  { titleKey: 'items.funding.title', descKey: 'items.funding.desc', detailKey: 'items.funding.detail', featuresKey: 'items.funding.features', icon: 'dataAnalysis', color: '#6366f1', bgImage: ASSETS.cards.academicFund },
  { titleKey: 'items.report.title', descKey: 'items.report.desc', detailKey: 'items.report.detail', featuresKey: 'items.report.features', icon: 'contact', color: '#8b5cf6', bgImage: ASSETS.cards.academicReport },
];

export function AcademicServicesSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.ACADEMIC);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACADEMIC_SERVICES.map((s, i) => (
            <motion.div
              key={s.titleKey}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={s.bgImage} alt={t(s.titleKey)} loading="lazy" decoding="async"
                  width={800} height={208}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}90` }}
                >
                  <Icon name={s.icon} size={24} className="text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{t(s.titleKey)}</h3>
                <p className="text-gray-600 mb-3">{t(s.descKey)}</p>
                <p className="text-gray-500 text-sm mb-4">{t(s.detailKey)}</p>
                <div className="flex flex-wrap gap-2">
                  {(t(s.featuresKey, { returnObjects: true }) as string[]).map(f => (
                    <span key={f} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md flex items-center gap-1">
                      <Icon name="check" size={12} />{f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

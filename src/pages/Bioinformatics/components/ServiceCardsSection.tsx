import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Icon from '@/components/shared/Icon';
import type { IconfontName } from '@/components/shared/Icon';
import { THEME_COLORS, LANGUAGE_NAMESPACES } from '@/constants/const';
import { ASSETS } from '@/constants/assets';

type ServiceItem = {
  titleKey: string;
  descKey: string;
  featuresKey: string;
  icon: IconfontName;
  priceKey: string;
  bgImage: string;
  color: string;
};

const SERVICES: ServiceItem[] = [
  { titleKey: 'items.rnaseq.title', descKey: 'items.rnaseq.desc', featuresKey: 'items.rnaseq.features', icon: 'dataAnalysis', priceKey: 'items.rnaseq.price', bgImage: ASSETS.cards.transcriptomics, color: '#e17055' },
  { titleKey: 'items.chipseq.title', descKey: 'items.chipseq.desc', featuresKey: 'items.chipseq.features', icon: 'informatics', priceKey: 'items.chipseq.price', bgImage: ASSETS.cards.genomics, color: THEME_COLORS.primary },
  { titleKey: 'items.gwas.title', descKey: 'items.gwas.desc', featuresKey: 'items.gwas.features', icon: 'globe', priceKey: 'items.gwas.price', bgImage: ASSETS.cards.genomics, color: THEME_COLORS.primaryLight },
  { titleKey: 'items.singleCell.title', descKey: 'items.singleCell.desc', featuresKey: 'items.singleCell.features', icon: 'microorganism', priceKey: 'items.singleCell.price', bgImage: ASSETS.cards.singlecell, color: THEME_COLORS.accent },
  { titleKey: 'items.methylation.title', descKey: 'items.methylation.desc', featuresKey: 'items.methylation.features', icon: 'dataSecurity', priceKey: 'items.methylation.price', bgImage: ASSETS.cards.methylation, color: THEME_COLORS.accentLight },
  { titleKey: 'items.metagenome.title', descKey: 'items.metagenome.desc', featuresKey: 'items.metagenome.features', icon: 'biology', priceKey: 'items.metagenome.price', bgImage: ASSETS.cards.metagenome, color: '#22c55e' },
  { titleKey: 'items.proteomics.title', descKey: 'items.proteomics.desc', featuresKey: 'items.proteomics.features', icon: 'informatics', priceKey: 'items.proteomics.price', bgImage: ASSETS.cards.proteomics, color: THEME_COLORS.accentLight },
  { titleKey: 'items.metabolomics.title', descKey: 'items.metabolomics.desc', featuresKey: 'items.metabolomics.features', icon: 'biology', priceKey: 'items.metabolomics.price', bgImage: ASSETS.cards.metabolomics, color: '#00b894' },
];

export function ServiceCardsSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.BIOINFORMATICS);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.titleKey}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={s.bgImage} alt={t(s.titleKey)} loading="lazy" decoding="async"
                  width={800} height={192}
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-primary">{t(s.titleKey)}</h3>
                  <span className="text-primary font-bold">{t(s.priceKey)}</span>
                </div>
                <p className="text-gray-600 mb-4">{t(s.descKey)}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(t(s.featuresKey, { returnObjects: true }) as string[]).map(f => (
                    <div key={f} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Icon name="check" size={16} className="text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
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

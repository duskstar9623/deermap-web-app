import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Activity, Target, Globe, Microscope, Database, Beaker, Check, FlaskConical as Flask } from 'lucide-react'
import { THEME_COLORS } from '@/constants/theme'
import { ASSETS } from '@/constants/assets'

function ServicesPage() {
  const { t } = useTranslation('services')
  const services = [
    { titleKey: 'items.rnaseq.title', descKey: 'items.rnaseq.desc', featuresKey: 'items.rnaseq.features', icon: Activity, priceKey: 'items.rnaseq.price', bgImage: ASSETS.cards.transcriptomics, color: '#e17055' },
    { titleKey: 'items.chipseq.title', descKey: 'items.chipseq.desc', featuresKey: 'items.chipseq.features', icon: Target, priceKey: 'items.chipseq.price', bgImage: ASSETS.cards.genomics, color: THEME_COLORS.primary },
    { titleKey: 'items.gwas.title', descKey: 'items.gwas.desc', featuresKey: 'items.gwas.features', icon: Globe, priceKey: 'items.gwas.price', bgImage: ASSETS.cards.genomics, color: THEME_COLORS.primaryLight },
    { titleKey: 'items.singleCell.title', descKey: 'items.singleCell.desc', featuresKey: 'items.singleCell.features', icon: Microscope, priceKey: 'items.singleCell.price', bgImage: ASSETS.cards.singlecell, color: THEME_COLORS.accent },
    { titleKey: 'items.methylation.title', descKey: 'items.methylation.desc', featuresKey: 'items.methylation.features', icon: Database, priceKey: 'items.methylation.price', bgImage: ASSETS.cards.methylation, color: THEME_COLORS.accentLight },
    { titleKey: 'items.metagenome.title', descKey: 'items.metagenome.desc', featuresKey: 'items.metagenome.features', icon: Flask, priceKey: 'items.metagenome.price', bgImage: ASSETS.cards.metagenome, color: '#22c55e' },
    { titleKey: 'items.proteomics.title', descKey: 'items.proteomics.desc', featuresKey: 'items.proteomics.features', icon: Target, priceKey: 'items.proteomics.price', bgImage: ASSETS.cards.proteomics, color: THEME_COLORS.accentLight },
    { titleKey: 'items.metabolomics.title', descKey: 'items.metabolomics.desc', featuresKey: 'items.metabolomics.features', icon: Beaker, priceKey: 'items.metabolomics.price', bgImage: ASSETS.cards.metabolomics, color: '#00b894' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.bgImage} alt={t(s.titleKey)} loading="lazy" decoding="async" width={800} height={192} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}90` }}>
                    <s.icon className="w-6 h-6 text-white" />
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
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
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
    </div>
  )
}

export default ServicesPage

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dna, Activity, Target, Beaker, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { THEME_COLORS } from '@/constants/theme'
import { ASSETS } from '@/constants/assets'

function MultiomicsListPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('multiomics')
  const omicsTypes = [
    { titleKey: 'omics.genomics.title', descKey: 'omics.genomics.desc', icon: Dna, color: THEME_COLORS.primary, bgImage: ASSETS.cards.genomics, route: ROUTES.genomics },
    { titleKey: 'omics.transcriptomics.title', descKey: 'omics.transcriptomics.desc', icon: Activity, color: THEME_COLORS.transcriptomics, bgImage: ASSETS.cards.transcriptomics, route: ROUTES.transcriptomics },
    { titleKey: 'omics.proteomics.title', descKey: 'omics.proteomics.desc', icon: Target, color: THEME_COLORS.proteomics, bgImage: ASSETS.cards.proteomics, route: ROUTES.proteomics },
    { titleKey: 'omics.metabolomics.title', descKey: 'omics.metabolomics.desc', icon: Beaker, color: THEME_COLORS.metabolomics, bgImage: ASSETS.cards.metabolomics, route: ROUTES.metabolomics },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">{t('page.title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            {t('page.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('section.omicsTypes')}</h2>
            <p className="text-gray-600">{t('section.omicsSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {omicsTypes.map((o, i) => (
              <motion.div key={o.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                onClick={() => navigate(o.route)}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={o.bgImage} alt={t(o.titleKey)} loading="lazy" decoding="async" width={800} height={192} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${o.color}90` }}>
                    <o.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('section.hoverBadge')}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary">{t(o.titleKey)}</h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 mt-2">{t(o.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MultiomicsListPage

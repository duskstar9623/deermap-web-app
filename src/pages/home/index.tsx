import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, BarChart3, Layers, FileText, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { THEME_COLORS } from '@/constants/theme';
import { ASSETS } from '@/constants/assets';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');
  const stats = [
    { num: '1000+', labelKey: 'stats.services' },
    { num: '500+', labelKey: 'stats.partners' },
    { num: '50+', labelKey: 'stats.tools' },
    { num: '99.9%', labelKey: 'stats.satisfaction' },
  ];
  const features = [
    { icon: Database, titleKey: 'features.bioinformatics.title', descKey: 'features.bioinformatics.desc', color: THEME_COLORS.primary, bgImage: ASSETS.cards.genomics, route: ROUTES.services },
    { icon: BarChart3, titleKey: 'features.visualization.title', descKey: 'features.visualization.desc', color: THEME_COLORS.primaryLight, bgImage: ASSETS.cards.transcriptomics, route: ROUTES.visualization },
    { icon: Layers, titleKey: 'features.multiomics.title', descKey: 'features.multiomics.desc', color: THEME_COLORS.accent, bgImage: ASSETS.cards.proteomics, route: ROUTES.multiomics },
    { icon: FileText, titleKey: 'features.academic.title', descKey: 'features.academic.desc', color: THEME_COLORS.accentLight, bgImage: ASSETS.cards.metabolomics, route: ROUTES.academic },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero — fullscreen video background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline preload="metadata" poster={ASSETS.cards.genomics} className="absolute inset-0 w-full h-full object-cover">
          <source src={ASSETS.hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a0e27]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/30 via-transparent to-[#0a0e27]/70 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              {t('hero.badge')}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero.titleLine1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{t('hero.titleHighlight')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button onClick={() => navigate(ROUTES.services)}
              className="px-8 py-4 bg-white text-primary rounded-xl font-medium flex items-center space-x-2 hover:bg-blue-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>{tc('action.explore')}</span><ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button onClick={() => navigate(ROUTES.visualization)}
              className="px-8 py-4 bg-transparent text-white border-2 border-white/40 rounded-xl font-medium flex items-center space-x-2 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>{tc('action.viewPlans')}</span><BarChart3 className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.labelKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{s.num}</div>
                <div className="text-gray-500">{t(s.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">{t('features.sectionTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('features.sectionSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                onClick={() => navigate(f.route)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={f.bgImage} alt={t(f.titleKey)} loading="lazy" decoding="async" width={800} height={192} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}90` }}>
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
    </div>
  );
}

export default HomePage;

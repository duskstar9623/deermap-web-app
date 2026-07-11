import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight } from 'lucide-react';
import ROUTES from '@/router/paths';
import { ASSETS } from '@/constants/assets';
import { LANGUAGE_NAMESPACES } from '@/constants/const';
import Button from '@/components/shared/Button';

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation(LANGUAGE_NAMESPACES.HOME);
  const { t: tc } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay loop muted playsInline preload="metadata"
        poster={ASSETS.cards.genomics}
        className="absolute inset-0 w-full h-full object-cover"
      >
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
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          {t('hero.titleLine1')}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {t('hero.titleHighlight')}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10"
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => navigate(ROUTES.Bioinformatics)}
            className="px-8 py-4 bg-white text-primary rounded-xl font-medium flex items-center space-x-2 hover:bg-blue-50 transition-colors shadow-lg"
          >
            <span>{tc('action.explore')}</span><ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate(ROUTES.Visualization.Root)}
            className="px-8 py-4 bg-transparent text-white border-2 border-white/40 rounded-xl font-medium flex items-center space-x-2 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <span>{tc('action.viewPlans')}</span><BarChart3 className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

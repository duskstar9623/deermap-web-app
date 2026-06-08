import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Dna, BarChart3, Search, Layers, Target, Share2, TrendingUp,
  ScatterChart, Beaker, ArrowRight
} from 'lucide-react'
import WorkflowSection from '@/components/shared/WorkflowSection'
import { ROUTES } from '@/router/routes'
import { THEME_COLORS } from '@/constants/theme'
import { ASSETS } from '@/constants/assets'

/* ───────────────────  OmicsPageConfig  ─────────────────── */

interface OmicsPageConfig {
  omicsKey: string
  i18nKey: string
  gradientFrom: string
  gradientTo: string
  bgImage: string
  badgeBg: string
  badgeText: string
  analysisTypes: { i18nKey: string; tools: string[]; icon: React.ComponentType<{ className?: string }>; image: string }[]
  results: { img: string; i18nKey: string }[]
}

const omicsPageConfigs: Record<string, OmicsPageConfig> = {
  genomics: {
    omicsKey: 'genomics', i18nKey: 'genomics',
    gradientFrom: THEME_COLORS.primary, gradientTo: THEME_COLORS.primaryDark, bgImage: ASSETS.cards.genomics,
    badgeBg: 'bg-blue-50', badgeText: 'text-primary',
    analysisTypes: [
      { i18nKey: 'genomics.analysisTypes.variant', tools: ['GATK','Samtools','DeepVariant'], icon: Search, image: ASSETS.analysis.genomicsVariant },
      { i18nKey: 'genomics.analysisTypes.cnv', tools: ['CNVkit','GISTIC2','PennCNV'], icon: Layers, image: ASSETS.analysis.genomicsCnv },
      { i18nKey: 'genomics.analysisTypes.sv', tools: ['Delly','Lumpy','Manta'], icon: Dna, image: ASSETS.cards.genomics },
      { i18nKey: 'genomics.analysisTypes.gwas', tools: ['PLINK','GEMMA','GCTA'], icon: Target, image: ASSETS.omics.genomics },
    ],
    results: [
      { img: ASSETS.charts.manhattan, i18nKey: 'genomics.results.manhattan' },
      { img: ASSETS.charts.cnv, i18nKey: 'genomics.results.cnv' },
      { img: ASSETS.charts.ideogram, i18nKey: 'genomics.results.ideogram' },
    ],
  },
  transcriptomics: {
    omicsKey: 'transcriptomics', i18nKey: 'transcriptomics',
    gradientFrom: THEME_COLORS.transcriptomics, gradientTo: '#d35400', bgImage: ASSETS.cards.transcriptomics,
    badgeBg: 'bg-orange-50', badgeText: 'text-orange-700',
    analysisTypes: [
      { i18nKey: 'transcriptomics.analysisTypes.de', tools: ['DESeq2','edgeR','limma'], icon: BarChart3, image: ASSETS.analysis.rnaExpression },
      { i18nKey: 'transcriptomics.analysisTypes.splicing', tools: ['rMATS','SUPPA','LeafCutter'], icon: ScatterChart, image: ASSETS.analysis.rnaSplicing },
      { i18nKey: 'transcriptomics.analysisTypes.fusion', tools: ['STAR-Fusion','Arriba','FusionCatcher'], icon: Dna, image: ASSETS.omics.transcriptomics },
      { i18nKey: 'transcriptomics.analysisTypes.pathway', tools: ['clusterProfiler','GSEA','DAVID'], icon: Target, image: ASSETS.cards.transcriptomics },
    ],
    results: [
      { img: ASSETS.charts.volcano, i18nKey: 'transcriptomics.results.volcano' },
      { img: ASSETS.charts.heatmap, i18nKey: 'transcriptomics.results.heatmap' },
      { img: ASSETS.charts.goBubble, i18nKey: 'transcriptomics.results.goBubble' },
    ],
  },
  proteomics: {
    omicsKey: 'proteomics', i18nKey: 'proteomics',
    gradientFrom: '#5b2c6f', gradientTo: '#7d3c98', bgImage: ASSETS.cards.proteomics,
    badgeBg: 'bg-purple-50', badgeText: 'text-purple-700',
    analysisTypes: [
      { i18nKey: 'proteomics.analysisTypes.identification', tools: ['MaxQuant','MSFragger','DIA-NN'], icon: Search, image: ASSETS.analysis.proteinMs },
      { i18nKey: 'proteomics.analysisTypes.ptm', tools: ['pFind','AScore','MaxQuant-PTM'], icon: Target, image: ASSETS.analysis.proteinPtm },
      { i18nKey: 'proteomics.analysisTypes.ppi', tools: ['STRING','Cytoscape','BioGRID'], icon: Share2, image: ASSETS.omics.proteomics },
      { i18nKey: 'proteomics.analysisTypes.integration', tools: ['MOFA','mixOmics','DIABLO'], icon: Layers, image: ASSETS.cards.proteomics },
    ],
    results: [
      { img: ASSETS.charts.heatmap, i18nKey: 'proteomics.results.heatmap' },
      { img: ASSETS.charts.volcano, i18nKey: 'proteomics.results.volcano' },
      { img: ASSETS.charts.network, i18nKey: 'proteomics.results.network' },
    ],
  },
  metabolomics: {
    omicsKey: 'metabolomics', i18nKey: 'metabolomics',
    gradientFrom: '#0e6655', gradientTo: '#17a589', bgImage: ASSETS.cards.metabolomics,
    badgeBg: 'bg-teal-50', badgeText: 'text-teal-700',
    analysisTypes: [
      { i18nKey: 'metabolomics.analysisTypes.identification', tools: ['XCMS','MS-DIAL','MetaboAnalyst'], icon: Beaker, image: ASSETS.analysis.metabolite },
      { i18nKey: 'metabolomics.analysisTypes.pathway', tools: ['KEGG','MetaboAnalyst','SMPDB'], icon: Target, image: ASSETS.analysis.metabolismPathway },
      { i18nKey: 'metabolomics.analysisTypes.lipidomics', tools: ['LipidSearch','LipidMaps','MS-DIAL'], icon: Layers, image: ASSETS.cards.metabolomics },
      { i18nKey: 'metabolomics.analysisTypes.flux', tools: ['IsoCor','Metran','13CFLUX2'], icon: TrendingUp, image: ASSETS.omics.metabolomics },
    ],
    results: [
      { img: ASSETS.charts.heatmap, i18nKey: 'metabolomics.results.heatmap' },
      { img: ASSETS.charts.pca, i18nKey: 'metabolomics.results.pca' },
      { img: ASSETS.charts.keggPathway, i18nKey: 'metabolomics.results.kegg' },
    ],
  },
}

/* ───────────────────  OmicsDetailPage  ─────────────────── */

function OmicsDetailPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('multiomics')
  const { t: tc } = useTranslation('common')
  const location = useLocation()
  // Derive configKey from URL: /multiomics/genomics → "genomics"
  const configKey = location.pathname.split('/').pop() || 'genomics'
  const cfg = omicsPageConfigs[configKey]
  if (!cfg) return null

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${cfg.gradientFrom}, ${cfg.gradientTo})` }}>
        <div className="absolute inset-0 opacity-20"><img src={cfg.bgImage} alt="" className="w-full h-full object-cover" fetchPriority="high" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate(ROUTES.multiomics)}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /><span>{t('detailPage.backButton')}</span>
          </motion.button>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">{t(`${cfg.i18nKey}.title`)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl">{t(`${cfg.i18nKey}.subtitle`)}</motion.p>
        </div>
      </section>

      <WorkflowSection omicsKey={cfg.omicsKey} subtitle={t(`${cfg.i18nKey}.workflowSubtitle`)} />

      {/* Core analysis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('detailPage.coreAnalysis')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cfg.analysisTypes.map((item, i) => (
              <motion.div key={item.i18nKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={t(`${item.i18nKey}.title`)} loading="lazy" decoding="async" width={800} height={176} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, ${cfg.gradientFrom}, ${cfg.gradientTo})` }}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{t(`${item.i18nKey}.title`)}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3">{t(`${item.i18nKey}.desc`)}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tools.map(tool => <span key={tool} className={`px-2 py-0.5 ${cfg.badgeBg} ${cfg.badgeText} text-xs rounded-md`}>{tool}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classic results */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('detailPage.results')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cfg.results.map((item, i) => (
              <motion.div key={item.i18nKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative h-48 overflow-hidden bg-gray-50"><img src={item.img} alt={t(`${item.i18nKey}.title`)} loading="lazy" decoding="async" width={400} height={192} className="w-full h-full object-contain p-2" /></div>
                <div className="p-4"><h4 className="font-bold text-primary">{t(`${item.i18nKey}.title`)}</h4><p className="text-gray-500 text-sm">{t(`${item.i18nKey}.desc`)}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: `linear-gradient(to bottom right, ${cfg.gradientFrom}, ${cfg.gradientTo})` }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">{t(`${cfg.i18nKey}.ctaTitle`)}</h2>
            <motion.button onClick={() => navigate(ROUTES.contact)} className="px-8 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100"
              style={{ color: cfg.gradientFrom }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{tc('action.consult')}</motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OmicsDetailPage

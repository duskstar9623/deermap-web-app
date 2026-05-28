import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna, BarChart3, Database, FileText, Phone, Menu, X, ArrowRight,
  Activity, Microscope, TrendingUp, Globe, Beaker, Zap, Check, Target,
  Search, Share2, Layers, FlaskConical as Flask,
  ScatterChart,
  Download,
  Upload, MessageSquare,
  PieChart as PieChartIcon,
  Settings
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ScatterChart as ReScatterChart, Scatter,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts'

type Page = 'home' | 'services' | 'visualization' | 'chart-tool' | 'multiomics'
  | 'academic' | 'pricing' | 'contact' | 'genomics' | 'transcriptomics'
  | 'proteomics' | 'metabolomics'

/* ───────────────────  workflow step data  ─────────────────── */

const workflowStepsData: Record<string, { num: string; title: string; desc: string; img: string }[]> = {
  genomics: [
    { num: '1', title: '样本制备', desc: 'DNA提取 + 质检', img: '/workflow-steps/genomics-step1.png' },
    { num: '2', title: '文库构建', desc: '打断 + 接头连接', img: '/workflow-steps/genomics-step2.png' },
    { num: '3', title: '上机测序', desc: 'Illumina 高通量测序', img: '/workflow-steps/genomics-step3.png' },
    { num: '4', title: '数据质控', desc: '去接头 + 去低质量', img: '/workflow-steps/genomics-step4.png' },
    { num: '5', title: '序列比对', desc: '比对到参考基因组', img: '/workflow-steps/genomics-step5.png' },
    { num: '6', title: '变异检测', desc: 'SNP/InDel + CNV/SV', img: '/workflow-steps/genomics-step6.png' },
  ],
  transcriptomics: [
    { num: '1', title: 'RNA提取', desc: 'Total RNA + mRNA富集', img: '/workflow-steps/transcriptomics-step1.png' },
    { num: '2', title: '文库构建', desc: '片段化 + cDNA合成', img: '/workflow-steps/transcriptomics-step2.png' },
    { num: '3', title: '上机测序', desc: 'Illumina PE150', img: '/workflow-steps/transcriptomics-step3.png' },
    { num: '4', title: '质控过滤', desc: '去除rRNA + 低质量过滤', img: '/workflow-steps/transcriptomics-step4.png' },
    { num: '5', title: '比对定量', desc: 'STAR比对 + 表达量计算', img: '/workflow-steps/transcriptomics-step5.png' },
    { num: '6', title: '差异分析', desc: 'DESeq2 + 功能富集', img: '/workflow-steps/transcriptomics-step6.png' },
  ],
  proteomics: [
    { num: '1', title: '蛋白提取', desc: '裂解 + 定量', img: '/workflow-steps/proteomics-step1.png' },
    { num: '2', title: '酶切消化', desc: '胰蛋白酶 + 肽段纯化', img: '/workflow-steps/proteomics-step2.png' },
    { num: '3', title: 'LC分离', desc: '液相色谱 + 肽段分离', img: '/workflow-steps/proteomics-step3.png' },
    { num: '4', title: '质谱检测', desc: 'DDA/DIA 数据采集', img: '/workflow-steps/proteomics-step4.png' },
    { num: '5', title: '数据库搜索', desc: 'MaxQuant + 蛋白鉴定', img: '/workflow-steps/proteomics-step5.png' },
    { num: '6', title: '功能分析', desc: 'GO/KEGG + 互作网络', img: '/workflow-steps/proteomics-step6.png' },
  ],
  metabolomics: [
    { num: '1', title: '样本制备', desc: '代谢物提取 + 内标添加', img: '/workflow-steps/metabolomics-step1.png' },
    { num: '2', title: '质谱检测', desc: 'LC-MS / GC-MS', img: '/workflow-steps/metabolomics-step2.png' },
    { num: '3', title: '峰提取', desc: '特征峰 + 识别对齐', img: '/workflow-steps/metabolomics-step3.png' },
    { num: '4', title: '鉴定注释', desc: '数据库匹配 + 代谢物鉴定', img: '/workflow-steps/metabolomics-step4.png' },
    { num: '5', title: '差异分析', desc: '多元统计 + 差异代谢物', img: '/workflow-steps/metabolomics-step5.png' },
    { num: '6', title: '通路分析', desc: 'KEGG + 代谢通路', img: '/workflow-steps/metabolomics-step6.png' },
  ],
}

/* ───────────────────  chart data (Visualization)  ─────────────────── */

const chartTypes = [
  { id: 'heatmap',       name: '热图',          img: '/charts/heatmap.png' },
  { id: 'volcano',       name: '火山图',        img: '/charts/volcano.png' },
  { id: 'pca',           name: 'PCA分析',       img: '/charts/pca.png' },
  { id: 'venn',          name: '韦恩图',        img: '/charts/venn.png' },
  { id: 'line',          name: '折线图',        img: '/charts/line.png' },
  { id: 'bar',           name: '柱状图',        img: '/charts/bar.png' },
  { id: 'scatter',       name: '散点图',        img: '/charts/scatter.png' },
  { id: 'pie',           name: '饼图',          img: '/charts/pie.png' },
  { id: 'boxplot',       name: '箱线图',        img: '/charts/boxplot.png' },
  { id: 'violin',        name: '小提琴图',      img: '/charts/violin.png' },
  { id: 'bubble',        name: '气泡图',        img: '/charts/bubble.png' },
  { id: 'radar',         name: '雷达图',        img: '/charts/radar.png' },
  { id: 'sankey',        name: '桑基图',        img: '/charts/sankey.png' },
  { id: 'survival',      name: '生存曲线',      img: '/charts/survival.png' },
  { id: 'roc',           name: 'ROC曲线',       img: '/charts/roc.png' },
  { id: 'waterfall',     name: '瀑布图',        img: '/charts/waterfall.png' },
  { id: 'network',       name: '网络图',        img: '/charts/network.png' },
  { id: 'manhattan',     name: '曼哈顿图',      img: '/charts/manhattan.png' },
  { id: 'qqplot',        name: 'QQ图',          img: '/charts/qqplot.png' },
  { id: 'dendrogram',    name: '树状图',        img: '/charts/dendrogram.png' },
  { id: 'area',          name: '面积图',        img: '/charts/area.png' },
  { id: 'stackedbar',    name: '堆叠柱状图',    img: '/charts/stackedbar.png' },
  { id: 'sunburst',      name: '旭日图',        img: '/charts/sunburst.png' },
  { id: 'errorbar',      name: '误差线图',      img: '/charts/errorbar.png' },
  { id: 'go-bubble',     name: 'GO富集气泡图',  img: '/charts/go-bubble.png' },
  { id: 'kegg-pathway',  name: 'KEGG通路图',    img: '/charts/kegg-pathway.png' },
  { id: 'gsea',          name: 'GSEA富集图',    img: '/charts/gsea.png' },
  { id: 'correlation',   name: '相关性矩阵图',  img: '/charts/correlation.png' },
  { id: 'kmeans',        name: 'K-means聚类',   img: '/charts/kmeans.png' },
  { id: 'umap',          name: 'UMAP降维',      img: '/charts/umap.png' },
  { id: 'wgcna',         name: 'WGCNA网络',     img: '/charts/wgcna.png' },
  { id: 'ideogram',      name: '染色体图',      img: '/charts/ideogram.png' },
  { id: 'cnv',           name: 'CNV图',         img: '/charts/cnv.png' },
  { id: 'fusion',        name: '融合基因图',    img: '/charts/fusion.png' },
  { id: 'oncoplot',      name: '突变谱图',      img: '/charts/oncoplot.png' },
  { id: 'alignment',     name: '序列比对图',    img: '/charts/alignment.png' },
  { id: 'phylogenetic',  name: '系统发育树',    img: '/charts/phylogenetic.png' },
  { id: 'splicing',      name: '可变剪接图',    img: '/charts/splicing.png' },
  { id: 'atacseq',       name: 'ATAC-seq图',    img: '/charts/atacseq.png' },
  { id: 'methylation',   name: '甲基化图谱',    img: '/charts/methylation.png' },
]

const demoLineData = [
  { name: '1h', geneA: 2.1, geneB: 1.8, geneC: 3.2 },
  { name: '2h', geneA: 2.5, geneB: 2.0, geneC: 3.5 },
  { name: '4h', geneA: 3.2, geneB: 2.3, geneC: 3.8 },
  { name: '8h', geneA: 4.5, geneB: 2.8, geneC: 4.1 },
  { name: '12h', geneA: 5.8, geneB: 3.2, geneC: 4.5 },
  { name: '24h', geneA: 7.2, geneB: 3.8, geneC: 5.0 },
]

/* demo data placeholders removed */

/* ───────────────────  shared: WorkflowSection  ─────────────────── */

function WorkflowSection({ omicsKey, subtitle }: { omicsKey: string; subtitle: string }) {
  const steps = workflowStepsData[omicsKey] || []
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">标准分析流程</h2>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 text-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1.5"
                  style={{ backgroundColor:
                    omicsKey === 'genomics' ? '#1a1f71' :
                    omicsKey === 'transcriptomics' ? '#c0392b' :
                    omicsKey === 'proteomics' ? '#6c5ce7' : '#00b894' }}
                >
                  {step.num}
                </div>
                <h4 className="font-bold text-[#1a1f71] text-sm mb-0.5">{step.title}</h4>
                <p className="text-gray-500 text-[11px]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────  Navbar  ─────────────────── */

function Navbar({ currentPage, setPage }: { currentPage: Page; setPage: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links: { id: Page; label: string }[] = [
    { id: 'home', label: '首页' },
    { id: 'services', label: '生信分析' },
    { id: 'visualization', label: '可视化' },
    { id: 'multiomics', label: '多组学' },
    { id: 'academic', label: '学术服务' },
    { id: 'pricing', label: '价格' },
    { id: 'contact', label: '联系我们' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setPage('home')} className="flex items-center space-x-2">
            <Dna className="w-7 h-7 text-[#1a1f71]" />
            <span className="text-xl font-bold text-[#1a1f71]">BioInfo Pro</span>
          </button>
          <div className="hidden md:flex items-center space-x-8">
            {links.map(l => (
              <button key={l.id} onClick={() => setPage(l.id)}
                className={`text-sm font-medium transition-colors ${currentPage === l.id ? 'text-[#1a1f71]' : 'text-gray-600 hover:text-[#1a1f71]'}`}>
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => setPage('contact')}
            className="hidden md:flex items-center space-x-2 px-5 py-2 bg-[#1a1f71] text-white rounded-lg text-sm font-medium hover:bg-[#4b5bab] transition-colors">
            <span>开始咨询</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {links.map(l => (
                <button key={l.id} onClick={() => { setPage(l.id); setMobileOpen(false) }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ───────────────────  Footer  ─────────────────── */

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#1a1f71] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Dna className="w-6 h-6" />
              <span className="text-lg font-bold">BioInfo Pro</span>
            </div>
            <p className="text-white/60 text-sm">专业的生物信息学分析服务平台，为科研提供高质量数据分析与可视化。</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">服务</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {['services','visualization','multiomics','academic'].map(k => (
                <li key={k}><button onClick={() => setPage(k as Page)} className="hover:text-white capitalize">{k}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">资源</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><button onClick={() => setPage('visualization')} className="hover:text-white">图表工具</button></li>
              <li><button onClick={() => setPage('pricing')} className="hover:text-white">价格方案</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">联系</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>support@bioinfopro.com</li>
              <li>+86 400-123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; 2024 BioInfo Pro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}


/* ───────────────────  HomePage (fullscreen video hero)  ─────────────────── */

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const stats = [
    { num: '1000+', label: '服务项目' },
    { num: '500+', label: '合作机构' },
    { num: '50+', label: '专业工具' },
    { num: '99.9%', label: '客户满意度' },
  ]
  const features = [
    { icon: Database, title: '生物信息学分析', desc: '基因组、转录组、蛋白质组、代谢组等全方位分析服务', color: '#1a1f71', bgImage: '/card-bg-genomics.jpg' },
    { icon: BarChart3, title: '数据可视化作图', desc: '40+种专业科研图表，支持交互式在线生成与下载', color: '#4b5bab', bgImage: '/card-bg-transcriptomics.jpg' },
    { icon: Layers, title: '多组学整合分析', desc: '多维度数据整合，揭示深层生物学机制', color: '#6366f1', bgImage: '/card-bg-proteomics.jpg' },
    { icon: FileText, title: '学术撰写服务', desc: 'SCI论文润色、数据分析报告、图表优化', color: '#8b5cf6', bgImage: '/card-bg-metabolomics.jpg' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero — fullscreen video background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a0e27]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/30 via-transparent to-[#0a0e27]/70 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              专业生物信息学服务平台
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            精准生物信息学<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">解决方案</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            以尖端计算精准度加速您的科学研究，为科研人员提供高质量的数据分析和可视化解决方案
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button onClick={() => setPage('services')}
              className="px-8 py-4 bg-white text-[#1a1f71] rounded-xl font-medium flex items-center space-x-2 hover:bg-blue-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>探索服务</span><ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button onClick={() => setPage('visualization')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white/40 rounded-xl font-medium flex items-center space-x-2 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>查看方案</span><BarChart3 className="w-5 h-5" />
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
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#1a1f71] mb-2">{s.num}</div>
                <div className="text-gray-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1f71] mb-4">核心服务</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">全方位的生物信息学解决方案，助力您的科研项目</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                onClick={() => setPage(f.title === '生物信息学分析' ? 'services' : f.title === '数据可视化作图' ? 'visualization' : f.title === '多组学整合分析' ? 'multiomics' : 'academic')}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={f.bgImage} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}90` }}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a1f71] mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


/* ───────────────────  ServicesPage  ─────────────────── */

function ServicesPage({ setPage }: { setPage: (p: Page) => void }) {
  void setPage
  const services = [
    { title: 'RNA测序分析', desc: '差异表达、可变剪接、融合基因检测', icon: Activity, features: ['差异表达分析', '可变剪接分析', '融合基因检测', '通路富集分析'], price: '¥2,999起', bgImage: '/card-bg-transcriptomics.jpg', color: '#e17055' },
    { title: 'ChIP测序分析', desc: ' peak calling、motif分析、注释分析', icon: Target, features: ['Peak Calling', 'Motif分析', '功能注释', '可视化报告'], price: '¥3,499起', bgImage: '/card-bg-genomics.jpg', color: '#1a1f71' },
    { title: 'GWAS分析', desc: '全基因组关联分析、群体遗传学', icon: Globe, features: ['关联分析', '曼哈顿图', 'QQ图', 'LD分析'], price: '¥4,999起', bgImage: '/card-bg-genomics.jpg', color: '#4b5bab' },
    { title: '单细胞测序', desc: '细胞聚类、轨迹推断、细胞通讯', icon: Microscope, features: ['细胞聚类', '轨迹推断', '细胞通讯', 'Marker分析'], price: '¥5,999起', bgImage: '/card-bg-singlecell.jpg', color: '#6366f1' },
    { title: '甲基化分析', desc: '差异甲基化、功能富集、关联分析', icon: Database, features: ['差异甲基化', '功能富集', '关联分析', '可视化'], price: '¥3,999起', bgImage: '/card-bg-methylation.jpg', color: '#8b5cf6' },
    { title: '宏基因组分析', desc: '物种注释、功能预测、差异分析', icon: Flask, features: ['物种注释', '功能预测', '差异分析', '网络分析'], price: '¥2,999起', bgImage: '/card-bg-metagenome.jpg', color: '#22c55e' },
    { title: '蛋白质组学分析', desc: '蛋白鉴定定量、差异分析、修饰分析', icon: Target, features: ['蛋白质鉴定定量', '差异蛋白分析', '翻译后修饰分析', '蛋白互作网络'], price: '¥3,999起', bgImage: '/card-bg-proteomics.jpg', color: '#8b5cf6' },
    { title: '代谢组学分析', desc: '代谢物检测、通路分析、脂质组学', icon: Beaker, features: ['代谢物鉴定定量', '代谢通路分析', '脂质组学分析', '代谢流分析'], price: '¥3,499起', bgImage: '/card-bg-metabolomics.jpg', color: '#00b894' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-[#1a1f71] to-[#2d3561]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">生信分析服务</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            提供全面的生物信息学分析服务，从数据质控到深度解读
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.bgImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}90` }}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#1a1f71]">{s.title}</h3>
                    <span className="text-[#1a1f71] font-bold">{s.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{s.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.features.map(f => (
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

/* ───────────────────  VisualizationPage  ─────────────────── */

function VisualizationPage({ setPage }: { setPage: (p: Page) => void }) {
  const chartDescriptions: Record<string, { desc: string; tags: string[] }> = {
    'heatmap': { desc: '展示基因表达矩阵或相关性矩阵的可视化', tags: ['聚类热图', '相关性热图', '差异热图'] },
    'volcano': { desc: '展示差异表达基因的统计显著性和倍数变化', tags: ['差异基因标注', '阈值线显示', '多组比较'] },
    'pca': { desc: '展示样本间的相似性和差异性，降维可视化', tags: ['2D/3D PCA', '聚类分析', '批次效应'] },
    'venn': { desc: '展示多个数据集之间的交集和并集关系', tags: ['2-5组比较', ' upset图', '比例韦恩'] },
    'line': { desc: '展示数据随时间或条件变化的趋势', tags: ['折线图', '面积图', '多系列对比'] },
    'bar': { desc: '展示不同组别之间的数值比较', tags: ['分组柱状图', '堆叠柱状图', '误差线'] },
    'scatter': { desc: '展示两个变量之间的相关关系', tags: ['相关性分析', '回归线', '密度散点'] },
    'pie': { desc: '展示各部分占总体的比例关系', tags: ['饼图', '环形图', '南丁格尔图'] },
    'boxplot': { desc: '展示数据分布的中位数、四分位数和异常值', tags: ['箱线图', '小提琴图', '蜂群图'] },
    'violin': { desc: '展示数据分布密度和统计特征', tags: ['小提琴图', '分半小提琴', '带箱线'] },
    'bubble': { desc: '展示三维数据的关系，大小表示额外维度', tags: ['气泡图', '交互式', '动态展示'] },
    'radar': { desc: '展示多维度数据的综合表现', tags: ['雷达图', '蜘蛛图', '能力评估'] },
    'sankey': { desc: '展示流量在不同节点间的分配和转化', tags: ['桑基图', '流向图', ' alluvial'] },
    'survival': { desc: '展示生存数据的时间-事件分析', tags: ['Kaplan-Meier', 'Log-rank', '风险表'] },
    'roc': { desc: '评估分类模型的性能和 cutoff 选择', tags: ['ROC曲线', 'AUC计算', '多模型对比'] },
    'waterfall': { desc: '展示累积变化对总体的影响', tags: ['瀑布图', '桥图', '财务分析'] },
    'network': { desc: '展示基因/蛋白质之间的相互作用关系', tags: ['网络图', 'PPI', '调控网络'] },
    'manhattan': { desc: '展示全基因组关联分析的染色体定位结果', tags: ['曼哈顿图', '显著性阈值', '基因标注'] },
    'qqplot': { desc: '评估数据分布是否符合理论分布', tags: ['QQ图', '正态检验', '离群值检测'] },
    'dendrogram': { desc: '展示层次聚类的树状结构', tags: ['树状图', '聚类分析', '进化树'] },
    'area': { desc: '展示数据随时间累积的总量变化', tags: ['面积图', '堆叠面积', '流图'] },
    'stackedbar': { desc: '展示各部分对总量的贡献', tags: ['堆叠柱状图', '百分比堆叠', '分组对比'] },
    'sunburst': { desc: '展示层次结构数据的环形占比', tags: ['旭日图', '多层环形', '路径分析'] },
    'errorbar': { desc: '展示数据均值和误差范围', tags: ['误差线图', '置信区间', '标准差/误'] },
    'go-bubble': { desc: '展示GO富集分析的条目、基因数和显著性', tags: ['气泡图', '富集分析', '三合一'] },
    'kegg-pathway': { desc: '展示KEGG通路中的基因富集情况', tags: ['通路图', '富集映射', '网络通路'] },
    'gsea': { desc: '展示基因集富集分析的动态累积分布', tags: ['GSEA图', 'ES曲线', 'Leading edge'] },
    'correlation': { desc: '展示多变量之间的相关系数矩阵', tags: ['相关性矩阵', '数值标注', '显著性标记'] },
    'kmeans': { desc: '展示K-means聚类的分组结果', tags: ['聚类散点', '中心点', '轮廓分析'] },
    'umap': { desc: '展示高维数据的非线性降维聚类', tags: ['UMAP', 't-SNE', '密度聚类'] },
    'wgcna': { desc: '展示加权基因共表达网络分析结果', tags: ['模块聚类', '性状关联', '网络图'] },
    'ideogram': { desc: '展示染色体水平的基因组特征分布', tags: ['染色体图', '基因密度', '变异位点'] },
    'cnv': { desc: '展示基因组拷贝数变异的区域和程度', tags: ['CNV图谱', 'Segment', '基因水平'] },
    'fusion': { desc: '展示基因融合事件的结构和位置', tags: ['融合基因图', 'Circos', '基因组视图'] },
    'oncoplot': { desc: '展示多个样本的突变谱矩阵', tags: ['突变谱', 'Oncoprint', '共突变'] },
    'alignment': { desc: '展示序列比对的结果和一致性', tags: ['序列比对', 'Coverage', '变异标注'] },
    'phylogenetic': { desc: '展示物种或基因的系统发育关系', tags: ['进化树', 'Bootstrap', '时间轴'] },
    'splicing': { desc: '展示可变剪接事件的模式和频率', tags: ['剪接图', 'Sashimi', '外显子 inclusion'] },
    'atacseq': { desc: '展示染色质可及性区域的信号分布', tags: ['ATAC-seq', 'Peak信号', '基因组浏览器'] },
    'methylation': { desc: '展示DNA甲基化水平的基因组分布', tags: ['甲基化热图', 'DMR', 'Circos'] },
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#4b5bab] to-[#6366f1] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/card-bg-genomics.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">数据可视化工具</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            专业的科研图表制作工具，支持多种图表类型，让数据更直观
          </motion.p>
          <motion.button onClick={() => setPage('chart-tool')}
            className="px-8 py-3 bg-white text-[#4b5bab] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            开始作图
          </motion.button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chartTypes.map((c, i) => {
              const info = chartDescriptions[c.id] || { desc: '', tags: [] }
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }} viewport={{ once: true }}
                  onClick={() => setPage('chart-tool')}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative h-40 overflow-hidden bg-gray-50">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-[#1a1f71] mb-1">{c.name}</h4>
                    <p className="text-gray-500 text-sm mb-2">{info.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {info.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-blue-50 text-[#4b5bab] text-xs rounded-md">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


/* ───────────────────  ChartToolPage  ─────────────────── */

const COLOR_PALETTES = [
  { name: 'Nature', colors: ['#E64B35', '#4DBBD5', '#00A087', '#3C5488', '#F39B7F', '#8491B4', '#91D1C2', '#DC0000'], filter: 'none' },
  { name: 'Science', colors: ['#08519C', '#3182BD', '#6BAED6', '#BDD7E7', '#74C476', '#FDBB84', '#FC9272', '#FB6A4A'], filter: 'hue-rotate(-10deg) saturate(1.1)' },
  { name: 'Cell', colors: ['#D62728', '#FF7F0E', '#FFBB78', '#2CA02C', '#98DF8A', '#1F77B4', '#AEC7E8', '#9467BD'], filter: 'hue-rotate(25deg) saturate(1.15)' },
  { name: 'Lancet', colors: ['#005A8C', '#4A90A4', '#7BAE7C', '#B8D4A0', '#F5D491', '#E8A838', '#D4634F', '#A33B3B'], filter: 'hue-rotate(-35deg) saturate(0.95)' },
  { name: 'NEJM', colors: ['#006BA4', '#3B8EA5', '#7EB8A2', '#BFD3B0', '#F4D06F', '#E8A838', '#C46A53', '#A33B3B'], filter: 'hue-rotate(-30deg) saturate(0.9)' },
  { name: 'JAMA', colors: ['#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124'], filter: 'hue-rotate(60deg) saturate(1.05)' },
  { name: 'IEEE', colors: ['#003F5C', '#2F4B7C', '#665191', '#A05195', '#D45087', '#F95D6A', '#FF7C43', '#FFA600'], filter: 'hue-rotate(-50deg) saturate(1.2)' },
  { name: 'Pastel', colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6B3FF', '#FFB3E6', '#B3FFF0'], filter: 'saturate(0.6) brightness(1.1)' },
]

/* ───────────────────  LiveChart - 实时渲染图表  ─────────────────── */

function LiveChart({
  chartId,
  palette,
  titleFontSize,
  xAxisFontSize,
  yAxisFontSize,
  legendFontSize,
  tickFontSize,
  axisXLength,
  axisYLength
}: {
  chartId: string
  palette: { name: string; colors: string[]; filter: string }
  titleFontSize: number
  xAxisFontSize: number
  yAxisFontSize: number
  legendFontSize: number
  tickFontSize: number
  axisXLength: number
  axisYLength: number
}) {
  const C = palette.colors
  const w = Math.min(axisXLength, 650)
  const h = Math.min(axisYLength, 420)
  const xTickProps = { fontSize: tickFontSize, fill: '#555' }
  const yTickProps = { fontSize: tickFontSize, fill: '#555' }
  const xLabelProps = { value: '', position: 'insideBottomRight' as const, offset: -5, style: { fontSize: xAxisFontSize, fill: '#333' } }
  const yLabelProps = { value: '', angle: -90, position: 'insideLeft' as const, style: { fontSize: yAxisFontSize, fill: '#333' } }
  const legendProps = { wrapperStyle: { fontSize: legendFontSize } }

  // ====== 折线图 ======
  if (chartId === 'line') {
    const data = [
      { x: '1h', a: 2.1, b: 1.8, c: 3.2, d: 4.5 },
      { x: '2h', a: 2.5, b: 2.0, c: 3.5, d: 4.8 },
      { x: '4h', a: 3.2, b: 2.3, c: 3.8, d: 5.2 },
      { x: '8h', a: 4.5, b: 2.8, c: 4.1, d: 5.8 },
      { x: '12h', a: 5.8, b: 3.2, c: 4.5, d: 6.5 },
      { x: '24h', a: 7.2, b: 3.8, c: 5.0, d: 7.0 },
      { x: '48h', a: 8.5, b: 4.2, c: 5.8, d: 7.8 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Time (hours)' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Expression Level' }} />
          <Tooltip /><Legend {...legendProps} />
          <Line type="monotone" dataKey="a" name="Gene A" stroke={C[0]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="b" name="Gene B" stroke={C[1]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="c" name="Gene C" stroke={C[2]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="d" name="Gene D" stroke={C[3]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // ====== 柱状图 ======
  if (chartId === 'bar') {
    const data = [
      { x: 'Sample 1', a: 85, b: 62 },
      { x: 'Sample 2', a: 72, b: 78 },
      { x: 'Sample 3', a: 90, b: 55 },
      { x: 'Sample 4', a: 68, b: 88 },
      { x: 'Sample 5', a: 78, b: 70 },
      { x: 'Sample 6', a: 82, b: 75 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Samples' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Value' }} />
          <Tooltip /><Legend {...legendProps} />
          <Bar dataKey="a" name="Group A" fill={C[0]} radius={[3, 3, 0, 0]} />
          <Bar dataKey="b" name="Group B" fill={C[1]} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // ====== 散点图 ======
  if (chartId === 'scatter' || chartId === 'pca' || chartId === 'volcano') {
    const np = (s: number) => {
      const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    const makeScatter = (n: number, cx: number, cy: number, sx: number, sy: number, colorIdx: number) =>
      Array.from({ length: n }, (_, i) => ({
        x: cx + sx * (np(i * 0.1 + colorIdx * 100) - 0.5) * 2,
        y: cy + sy * (np(i * 0.1 + colorIdx * 100 + 50) - 0.5) * 2,
        group: `Group ${String.fromCharCode(65 + colorIdx)}`,
        fill: C[colorIdx % C.length]
      }))
    const groups = chartId === 'pca'
      ? [...makeScatter(50, 2, 3, 1.5, 1.5, 0), ...makeScatter(50, -1, 1, 1, 1, 1), ...makeScatter(50, 0, -2, 1.2, 1.2, 2)]
      : [...makeScatter(60, 3, 3, 2, 2, 0), ...makeScatter(60, -1, -1, 2, 2, 1), ...makeScatter(60, 5, -2, 1.5, 1.5, 2)]
    const xLabel = chartId === 'pca' ? 'PC1 (45.2%)' : chartId === 'volcano' ? 'log2(Fold Change)' : 'Variable X'
    const yLabel = chartId === 'pca' ? 'PC2 (28.7%)' : chartId === 'volcano' ? '-log10(p-value)' : 'Variable Y'
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: xLabel }} domain={['auto', 'auto']} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: yLabel }} domain={['auto', 'auto']} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} /><Legend {...legendProps} />
          {[0, 1, 2].map(gi => (
            <Scatter key={gi} name={`${chartId === 'pca' ? 'Treatment' : 'Group'} ${String.fromCharCode(65 + gi)}`}
              data={groups.filter((g: {group: string}) => g.group === `Group ${String.fromCharCode(65 + gi)}`)}
              fill={C[gi]} shape="circle" />
          ))}
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== 饼图 ======
  if (chartId === 'pie') {
    const data = [
      { name: 'Protein Coding', value: 65 },
      { name: 'lncRNA', value: 15 },
      { name: 'miRNA', value: 8 },
      { name: 'rRNA', value: 5 },
      { name: 'tRNA', value: 4 },
      { name: 'Others', value: 3 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <PieChart>
          <Tooltip />
          <Legend {...legendProps} verticalAlign="middle" align="right" layout="vertical" />
          <Pie data={data} cx="40%" cy="50%" innerRadius="40%" outerRadius="70%" paddingAngle={3}
            dataKey="value" label={{ fontSize: tickFontSize }}>
            {data.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // ====== 韦恩图 ======
  if (chartId === 'venn') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const r = Math.min(w, h) * 0.22
    const sets = [
      { x: w * 0.35, y: h * 0.42, r, label: 'Set A', n: 55 + Math.floor(np(0) * 20) },
      { x: w * 0.5, y: h * 0.42, r, label: 'Set B', n: 45 + Math.floor(np(50) * 20) },
      { x: w * 0.425, y: h * 0.62, r, label: 'Set C', n: 35 + Math.floor(np(100) * 20) },
    ]
    const overlapAB = 20 + Math.floor(np(25) * 15)
    const overlapAC = 15 + Math.floor(np(75) * 10)
    const overlapBC = 12 + Math.floor(np(125) * 10)
    const overlapABC = 8 + Math.floor(np(150) * 8)
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={25} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Venn Diagram (3 Sets)</text>
        {sets.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={s.r} fill={C[i]} fillOpacity={0.4} stroke={C[i]} strokeWidth={2} />
          </g>
        ))}
        {/* Only A */}
        <text x={sets[0].x - r * 0.3} y={sets[0].y - r * 0.15} textAnchor="middle" style={{ fontSize: tickFontSize + 2, fontWeight: 'bold', fill: '#333' }}>{sets[0].n - overlapAB - overlapAC + overlapABC}</text>
        {/* Only B */}
        <text x={sets[1].x + r * 0.3} y={sets[1].y - r * 0.15} textAnchor="middle" style={{ fontSize: tickFontSize + 2, fontWeight: 'bold', fill: '#333' }}>{sets[1].n - overlapAB - overlapBC + overlapABC}</text>
        {/* Only C */}
        <text x={sets[2].x} y={sets[2].y + r * 0.5} textAnchor="middle" style={{ fontSize: tickFontSize + 2, fontWeight: 'bold', fill: '#333' }}>{sets[2].n - overlapAC - overlapBC + overlapABC}</text>
        {/* A∩B */}
        <text x={(sets[0].x + sets[1].x) / 2} y={sets[0].y - r * 0.3} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapAB - overlapABC}</text>
        {/* A∩C */}
        <text x={(sets[0].x + sets[2].x) / 2 - 5} y={(sets[0].y + sets[2].y) / 2 + 5} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapAC - overlapABC}</text>
        {/* B∩C */}
        <text x={(sets[1].x + sets[2].x) / 2 + 5} y={(sets[1].y + sets[2].y) / 2 + 5} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapBC - overlapABC}</text>
        {/* A∩B∩C */}
        <text x={(sets[0].x + sets[1].x + sets[2].x) / 3} y={(sets[0].y + sets[2].y) / 2} textAnchor="middle" style={{ fontSize: tickFontSize, fontWeight: 'bold', fill: '#333' }}>{overlapABC}</text>
        {/* Legend */}
        {sets.map((s, i) => (
          <g key={`legend-${i}`}>
            <rect x={w * 0.1 + i * 120} y={h - 30} width={12} height={12} fill={C[i]} opacity={0.6} rx={2} />
            <text x={w * 0.1 + i * 120 + 18} y={h - 20} style={{ fontSize: tickFontSize, fill: '#555' }}>{s.label} ({s.n})</text>
          </g>
        ))}
      </svg>
    )
  }

  // ====== 面积图 ======
  if (chartId === 'area') {
    const data = [
      { x: 'T1', a: 30, b: 25, c: 20 },
      { x: 'T2', a: 45, b: 35, c: 25 },
      { x: 'T3', a: 55, b: 40, c: 35 },
      { x: 'T4', a: 50, b: 48, c: 40 },
      { x: 'T5', a: 65, b: 52, c: 45 },
      { x: 'T6', a: 70, b: 55, c: 50 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Time Point' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Cumulative Count' }} />
          <Tooltip /><Legend {...legendProps} />
          <Area type="monotone" dataKey="a" name="Pathway A" stackId="1" fill={C[0]} fillOpacity={0.7} stroke={C[0]} />
          <Area type="monotone" dataKey="b" name="Pathway B" stackId="1" fill={C[1]} fillOpacity={0.7} stroke={C[1]} />
          <Area type="monotone" dataKey="c" name="Pathway C" stackId="1" fill={C[2]} fillOpacity={0.7} stroke={C[2]} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  // ====== 堆叠柱状图 ======
  if (chartId === 'stackedbar') {
    const data = [
      { x: 'S1', a: 35, b: 25, c: 20, d: 12, e: 8 },
      { x: 'S2', a: 30, b: 28, c: 18, d: 15, e: 9 },
      { x: 'S3', a: 32, b: 22, c: 25, d: 10, e: 11 },
      { x: 'S4', a: 28, b: 30, c: 22, d: 13, e: 7 },
      { x: 'S5', a: 33, b: 26, c: 19, d: 14, e: 8 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Samples' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Percentage (%)' }} />
          <Tooltip /><Legend {...legendProps} />
          {['a', 'b', 'c', 'd', 'e'].map((k, i) => (
            <Bar key={k} dataKey={k} name={['T cells', 'B cells', 'Mono', 'NK', 'Other'][i]} stackId="1" fill={C[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // ====== 雷达图 ======
  if (chartId === 'radar') {
    const data = [
      { metric: 'Sensitivity', a: 0.92, b: 0.85, c: 0.78 },
      { metric: 'Specificity', a: 0.88, b: 0.92, c: 0.85 },
      { metric: 'Accuracy', a: 0.90, b: 0.88, c: 0.82 },
      { metric: 'Precision', a: 0.89, b: 0.91, c: 0.84 },
      { metric: 'F1-Score', a: 0.90, b: 0.88, c: 0.81 },
      { metric: 'AUC', a: 0.94, b: 0.90, c: 0.86 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
          <PolarGrid /><PolarAngleAxis dataKey="metric" tick={{ fontSize: tickFontSize }} />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fontSize: tickFontSize - 1 }} />
          <Tooltip /><Legend {...legendProps} />
          <Radar name="Method A" dataKey="a" stroke={C[0]} fill={C[0]} fillOpacity={0.25} />
          <Radar name="Method B" dataKey="b" stroke={C[1]} fill={C[1]} fillOpacity={0.25} />
          <Radar name="Method C" dataKey="c" stroke={C[2]} fill={C[2]} fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  // ====== 箱线图（用ErrorBar模拟） ======
  if (chartId === 'boxplot' || chartId === 'violin') {
    const data = [
      { x: 'Group A', min: 10, q1: 25, median: 45, q3: 65, max: 90 },
      { x: 'Group B', min: 15, q1: 30, median: 50, q3: 70, max: 85 },
      { x: 'Group C', min: 20, q1: 35, median: 55, q3: 75, max: 95 },
      { x: 'Group D', min: 12, q1: 28, median: 48, q3: 68, max: 88 },
      { x: 'Group E', min: 18, q1: 32, median: 52, q3: 72, max: 92 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Groups' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Expression Level' }} />
          <Tooltip /><Legend {...legendProps} />
          <Bar dataKey="median" name="Median" fill={C[0]} radius={[3, 3, 0, 0]} barSize={40} />
          <Line type="monotone" dataKey="max" name="Max" stroke={C[1]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="min" name="Min" stroke={C[2]} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // ====== 热图（自定义SVG） ======
  if (chartId === 'heatmap') {
    const rows = 15, cols = 12
    const cells = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = Math.sin(r * 0.5) * Math.cos(c * 0.4) + Math.random() * 0.3
        const ci = Math.floor(Math.abs(v) * C.length) % C.length
        cells.push({ r, c, color: C[ci], opacity: 0.3 + Math.abs(v) * 0.7 })
      }
    }
    const cellW = (w - 80) / cols, cellH = (h - 60) / rows
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Gene Expression Heatmap</text>
        {cells.map((cell, i) => (
          <rect key={i} x={60 + cell.c * cellW} y={30 + cell.r * cellH} width={cellW - 0.5} height={cellH - 0.5}
            fill={cell.color} opacity={cell.opacity} rx={1} />
        ))}
        <text x={30} y={h - 15} textAnchor="middle" style={{ fontSize: xAxisFontSize, fill: '#555' }}>Samples →</text>
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Genes →</text>
      </svg>
    )
  }

  // ====== 气泡图 ======
  if (chartId === 'bubble') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const data = Array.from({ length: 30 }, (_, i) => ({
      x: Math.round((np(i * 0.1) * 10 - 5) * 100) / 100,
      y: Math.round((np(i * 0.1 + 50) * 8 - 4) * 100) / 100,
      z: Math.round((50 + np(i * 0.1 + 100) * 450)),
      group: `Group ${String.fromCharCode(65 + (i % 3))}`
    }))
    const groups = [...new Set(data.map(d => d.group))]
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'PC1' }} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: 'PC2' }} />
          <Tooltip /><Legend {...legendProps} />
          {groups.map((g, gi) => (
            <Scatter key={g} name={g} data={data.filter(d => d.group === g)} fill={C[gi]} shape="circle"
              r={Math.sqrt(data.filter(d => d.group === g)[0]?.z || 100) / 3} />
          ))}
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }


  // ====== 火山图（专用） ======
  if (chartId === 'volcano') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const data = Array.from({ length: 200 }, (_, i) => {
      const fc = (np(i * 0.05) - 0.5) * 6
      const pv = -Math.log10(np(i * 0.05 + 100) * 0.05 + 1e-10)
      return { x: Math.round(fc * 100) / 100, y: Math.round(pv * 100) / 100, 
        sig: Math.abs(fc) > 1 && pv > -Math.log10(0.05) ? (fc > 0 ? 'up' : 'down') : 'ns' }
    })
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'log2(Fold Change)' }} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: '-log10(p-value)' }} />
          <Tooltip /><Legend {...legendProps} />
          <Scatter name="Up-regulated" data={data.filter(d => d.sig === 'up')} fill={C[0]} shape="circle" r={3} />
          <Scatter name="Down-regulated" data={data.filter(d => d.sig === 'down')} fill={C[1]} shape="circle" r={3} />
          <Scatter name="Not significant" data={data.filter(d => d.sig === 'ns')} fill="#ccc" shape="circle" r={2} />
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== K-means聚类 ======
  if (chartId === 'kmeans') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const centers = [[2, 3], [-1, 1], [0, -2], [3, -1]]
    const data = centers.flatMap((c, ci) => 
      Array.from({ length: 40 }, (_, i) => ({
        x: Math.round((c[0] + (np(i * 0.1 + ci * 100) - 0.5) * 2) * 100) / 100,
        y: Math.round((c[1] + (np(i * 0.1 + ci * 100 + 50) - 0.5) * 2) * 100) / 100,
        cluster: `Cluster ${ci + 1}`, fill: C[ci % C.length]
      }))
    )
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Feature 1' }} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: 'Feature 2' }} />
          <Tooltip /><Legend {...legendProps} />
          {[0, 1, 2, 3].map(ci => (
            <Scatter key={ci} name={`Cluster ${ci + 1}`} 
              data={data.filter(d => d.cluster === `Cluster ${ci + 1}`)} 
              fill={C[ci]} shape="circle" r={4} />
          ))}
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== UMAP降维 ======
  if (chartId === 'umap') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const centers = [[-2, 2], [2, 2], [0, -1], [-1, -3], [3, -2], [1, 3]]
    const data = centers.flatMap((c, ci) =>
      Array.from({ length: 35 }, (_, i) => ({
        x: Math.round((c[0] + (np(i * 0.1 + ci * 100) - 0.5) * 3) * 100) / 100,
        y: Math.round((c[1] + (np(i * 0.1 + ci * 100 + 50) - 0.5) * 3) * 100) / 100,
        cell: `Cell Type ${String.fromCharCode(65 + ci)}`, fill: C[ci % C.length]
      }))
    )
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'UMAP 1' }} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: 'UMAP 2' }} />
          <Tooltip /><Legend {...legendProps} />
          {[0, 1, 2, 3, 4, 5].map(ci => (
            <Scatter key={ci} name={`Cell Type ${String.fromCharCode(65 + ci)}`}
              data={data.filter(d => d.cell === `Cell Type ${String.fromCharCode(65 + ci)}`)}
              fill={C[ci]} shape="circle" r={3} />
          ))}
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== 生存曲线 ======
  if (chartId === 'survival') {
    const data = [
      { t: 0, a: 1.0, b: 1.0, c: 1.0 }, { t: 6, a: 0.95, b: 0.92, c: 0.98 },
      { t: 12, a: 0.88, b: 0.80, c: 0.92 }, { t: 18, a: 0.82, b: 0.72, c: 0.85 },
      { t: 24, a: 0.75, b: 0.65, c: 0.80 }, { t: 30, a: 0.70, b: 0.58, c: 0.75 },
      { t: 36, a: 0.65, b: 0.52, c: 0.70 }, { t: 42, a: 0.60, b: 0.48, c: 0.65 },
      { t: 48, a: 0.55, b: 0.42, c: 0.60 }, { t: 54, a: 0.50, b: 0.38, c: 0.55 },
      { t: 60, a: 0.48, b: 0.35, c: 0.52 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="t" tick={xTickProps} label={{ ...xLabelProps, value: 'Time (months)' }} />
          <YAxis domain={[0, 1.05]} tick={yTickProps} label={{ ...yLabelProps, value: 'Survival Probability' }} />
          <Tooltip /><Legend {...legendProps} />
          <Line type="stepAfter" dataKey="a" name="Treatment A (HR=0.65)" stroke={C[0]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="stepAfter" dataKey="b" name="Treatment B (HR=0.82)" stroke={C[1]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="stepAfter" dataKey="c" name="Control (HR=1.0)" stroke={C[2]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // ====== ROC曲线 ======
  if (chartId === 'roc') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const makeROC = (seed: number, auc: number) =>
      Array.from({ length: 50 }, (_, i) => ({
        x: Math.round((i / 49) * 100) / 100,
        y: Math.round(Math.min(1, Math.pow(i / 49, 0.5 + (auc - 0.5) * 2) + (np(i * 0.1 + seed) - 0.5) * 0.05) * 100) / 100,
      }))
    const dataA = makeROC(0, 0.92), dataB = makeROC(50, 0.85), dataC = makeROC(100, 0.78)
    const diag = Array.from({ length: 50 }, (_, i) => ({ x: Math.round((i / 49) * 100) / 100, y: Math.round((i / 49) * 100) / 100 }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, 1]} tick={xTickProps} label={{ ...xLabelProps, value: 'False Positive Rate' }} />
          <YAxis type="number" dataKey="y" domain={[0, 1.05]} tick={yTickProps} label={{ ...yLabelProps, value: 'True Positive Rate' }} />
          <Tooltip /><Legend {...legendProps} />
          <Line data={diag} dataKey="y" name="Random (AUC=0.5)" stroke="#999" strokeDasharray="5 5" strokeWidth={1} dot={false} />
          <Line data={dataA} dataKey="y" name="Model A (AUC=0.92)" stroke={C[0]} strokeWidth={2} dot={false} />
          <Line data={dataB} dataKey="y" name="Model B (AUC=0.85)" stroke={C[1]} strokeWidth={2} dot={false} />
          <Line data={dataC} dataKey="y" name="Model C (AUC=0.78)" stroke={C[2]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // ====== 瀑布图 ======
  if (chartId === 'waterfall') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    let cum = 0
    const data = Array.from({ length: 30 }, (_, i) => {
      const val = Math.round((np(i * 0.3) * 60 - 25) * 10) / 10
      const prev = cum
      cum += val
      return { x: `P${i + 1}`, val, prev, cum: Math.round(cum * 10) / 10, color: val > 0 ? C[0] : C[1] }
    })
    return (
      <ResponsiveContainer width={w} height={h}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Patient ID' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Change from Baseline (%)' }} />
          <Tooltip /><Legend {...legendProps} />
          <Bar dataKey="val" name="Change" fill={C[0]} radius={[2, 2, 0, 0]}>{data.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // ====== 网络图 ======
  if (chartId === 'network') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: np(i * 0.5) * 500 + 50, y: np(i * 0.5 + 100) * 300 + 30,
      r: 8 + np(i * 0.5 + 200) * 12, color: C[i % 5], label: `G${i + 1}`
    }))
    const edges = []
    for (let i = 0; i < 20; i++) for (let j = i + 1; j < 20; j++) if (np(i * j * 0.1) < 0.12) edges.push([i, j])
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#ccc" strokeWidth={0.8} />
        ))}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.8} stroke="white" strokeWidth={1.5} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" style={{ fontSize: tickFontSize, fill: 'white', fontWeight: 'bold' }}>{n.label}</text>
          </g>
        ))}
      </svg>
    )
  }

  // ====== 曼哈顿图 ======
  if (chartId === 'manhattan') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    let offset = 0
    const chromData = Array.from({ length: 22 }, (_, chrom) => {
      const n = 20 + Math.floor(np(chrom * 10) * 30)
      const pts = Array.from({ length: n }, (_, i) => ({
        x: offset + i, y: chrom === 4 || chrom === 11 || chrom === 16 ? 8 + np(i * 0.5 + chrom) * 20 : np(i * 0.5 + chrom) * 6,
        chrom, sig: chrom === 4 || chrom === 11 || chrom === 16
      }))
      offset += n
      return pts
    }).flat()
    const maxX = chromData.length
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, maxX]} tick={xTickProps} label={{ ...xLabelProps, value: 'Chromosome' }} />
          <YAxis type="number" dataKey="y" tick={yTickProps} label={{ ...yLabelProps, value: '-log10(p-value)' }} />
          <Tooltip /><Legend {...legendProps} />
          <Scatter name="SNPs" data={chromData.filter(d => !d.sig)} fill="#bbb" shape="circle" r={2} />
          <Scatter name="Significant" data={chromData.filter(d => d.sig)} fill={C[0]} shape="circle" r={3} />
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== QQ图 ======
  if (chartId === 'qqplot') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const n = 100
    const data = Array.from({ length: n }, (_, i) => ({
      x: Math.round(-Math.log10((i + 0.5) / n) * 100) / 100,
      y: Math.round(-Math.log10(np(i * 0.1) * (i < 10 ? 0.001 : 0.3) + 1e-10) * 100) / 100,
    }))
    const maxVal = Math.max(...data.map(d => Math.max(d.x, d.y)))
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, maxVal]} tick={xTickProps} label={{ ...xLabelProps, value: 'Expected -log10(p)' }} />
          <YAxis type="number" dataKey="y" domain={[0, maxVal]} tick={yTickProps} label={{ ...yLabelProps, value: 'Observed -log10(p)' }} />
          <Tooltip /><Legend {...legendProps} />
          <Scatter name="P-values" data={data} fill={C[0]} shape="circle" r={3} />
          <Line data={[{ x: 0, y: 0 }, { x: maxVal, y: maxVal }]} dataKey="y" stroke="#999" strokeDasharray="5 5" dot={false} />
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== 树状图 ======
  if (chartId === 'dendrogram') {
    const labels = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12']
    const merges = [[0, 1, 0.3], [2, 3, 0.4], [4, 5, 0.5], [6, 7, 0.35], [8, 9, 0.45], [10, 11, 0.38],
      [12, 13, 0.7], [14, 15, 0.8], [16, 17, 0.9]]
    const yScale = h - 60, xScale = (w - 100) / labels.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {merges.map((m, i) => {
          const x1 = 50 + (m[0] % labels.length) * xScale + xScale / 2
          const x2 = 50 + (m[1] % labels.length) * xScale + xScale / 2
          const y = yScale - m[2] * (h - 100)
          return <g key={i}>
            <line x1={x1} y1={yScale} x2={x1} y2={y} stroke={C[0]} strokeWidth={1.5} />
            <line x1={x2} y1={yScale} x2={x2} y2={y} stroke={C[1]} strokeWidth={1.5} />
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={C[2]} strokeWidth={1.5} />
          </g>
        })}
        {labels.map((l, i) => (
          <text key={i} x={50 + i * xScale + xScale / 2} y={h - 20} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{l}</text>
        ))}
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Distance</text>
      </svg>
    )
  }

  // ====== 旭日图 ======
  if (chartId === 'sunburst') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const cx = w / 2, cy = h / 2
    const maxR = Math.min(w, h) * 0.38
    // Inner ring: cell types
    const inner = [
      { label: 'T cells', value: 0.35, color: C[0] },
      { label: 'B cells', value: 0.20, color: C[1] },
      { label: 'Mono', value: 0.15, color: C[2] },
      { label: 'NK', value: 0.12, color: C[3] },
      { label: 'DC', value: 0.10, color: C[4] },
      { label: 'Other', value: 0.08, color: C[5] },
    ]
    // Outer ring: subtypes
    const outerLabels = [
      ['CD4+', 'CD8+', 'Treg'],
      ['Naive', 'Memory', 'Plasma'],
      ['Classical', 'Non-classical'],
      ['Bright', 'Dim'],
      ['mDC', 'pDC'],
      ['NKT', 'MAIT']
    ]
    let startAngle = -Math.PI / 2
    const arcs: { path: string; color: string; label?: string; lx?: number; ly?: number }[] = []
    inner.forEach((seg, si) => {
      const sweep = seg.value * Math.PI * 2
      const endAngle = startAngle + sweep
      // Inner ring
      const iR1 = maxR * 0.25, iR2 = maxR * 0.52
      const iPath = [
        `M ${cx + Math.cos(startAngle) * iR1} ${cy + Math.sin(startAngle) * iR1}`,
        `A ${iR1} ${iR1} 0 ${sweep > Math.PI ? 1 : 0} 1 ${cx + Math.cos(endAngle) * iR1} ${cy + Math.sin(endAngle) * iR1}`,
        `L ${cx + Math.cos(endAngle) * iR2} ${cy + Math.sin(endAngle) * iR2}`,
        `A ${iR2} ${iR2} 0 ${sweep > Math.PI ? 1 : 0} 0 ${cx + Math.cos(startAngle) * iR2} ${cy + Math.sin(startAngle) * iR2}`,
        'Z'
      ].join(' ')
      arcs.push({ path: iPath, color: seg.color })
      // Outer ring sub-segments
      const subs = outerLabels[si]
      const subTotal = subs.reduce((sum, _, i) => sum + (0.3 + np(si * 100 + i * 30) * 0.7), 0)
      let subStart = startAngle
      subs.forEach((sub, ssi) => {
        const subVal = (0.3 + np(si * 100 + ssi * 30) * 0.7) / subTotal
        const subSweep = subVal * sweep
        const subEnd = subStart + subSweep
        const oR1 = maxR * 0.54, oR2 = maxR * 0.82
        const oPath = [
          `M ${cx + Math.cos(subStart) * oR1} ${cy + Math.sin(subStart) * oR1}`,
          `A ${oR1} ${oR1} 0 ${subSweep > Math.PI ? 1 : 0} 1 ${cx + Math.cos(subEnd) * oR1} ${cy + Math.sin(subEnd) * oR1}`,
          `L ${cx + Math.cos(subEnd) * oR2} ${cy + Math.sin(subEnd) * oR2}`,
          `A ${oR2} ${oR2} 0 ${subSweep > Math.PI ? 1 : 0} 0 ${cx + Math.cos(subStart) * oR2} ${cy + Math.sin(subStart) * oR2}`,
          'Z'
        ].join(' ')
        const midAngle = subStart + subSweep / 2
        arcs.push({
          path: oPath,
          color: seg.color,
          label: sub,
          lx: cx + Math.cos(midAngle) * maxR * 0.92,
          ly: cy + Math.sin(midAngle) * maxR * 0.92
        })
        subStart = subEnd
      })
      // Inner label
      const midAngle = startAngle + sweep / 2
      arcs.push({
        path: '',
        color: seg.color,
        label: seg.label,
        lx: cx + Math.cos(midAngle) * maxR * 0.38,
        ly: cy + Math.sin(midAngle) * maxR * 0.38
      })
      startAngle = endAngle
    })
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={cx} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Cell Type Composition</text>
        {arcs.map((a, i) => (
          <g key={i}>
            {a.path && <path d={a.path} fill={a.color} fillOpacity={0.75} stroke="white" strokeWidth={1.5} />}
            {a.label && a.lx && a.ly && (
              <text x={a.lx} y={a.ly} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: a.path && a.lx ? tickFontSize - 1 : tickFontSize, fill: a.path ? '#444' : 'white', fontWeight: a.path ? 'normal' : 'bold' }}>{a.label}</text>
            )}
          </g>
        ))}
      </svg>
    )
  }

  // ====== 误差线图 ======
  if (chartId === 'errorbar') {
    const data = [
      { x: 'Gene A', val: 85, err: 5 }, { x: 'Gene B', val: 72, err: 8 }, { x: 'Gene C', val: 90, err: 4 },
      { x: 'Gene D', val: 68, err: 10 }, { x: 'Gene E', val: 78, err: 6 }, { x: 'Gene F', val: 82, err: 7 },
    ]
    return (
      <ResponsiveContainer width={w} height={h}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Gene' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Expression Level' }} />
          <Tooltip /><Legend {...legendProps} />
          <Bar dataKey="val" name="Expression" fill={C[0]} radius={[3, 3, 0, 0]} barSize={40} />
          <Line type="monotone" dataKey="err" name="Error" stroke={C[1]} strokeWidth={2} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // ====== 桑基图（简化流图） ======
  if (chartId === 'sankey') {
    const stages = ['RNA-seq', 'ChIP-seq', 'ATAC-seq', 'WGBS', 'Proteomics', 'Metabolomics']
    const targets = ['Analysis', 'Integration', 'Results']
    const flows = [120, 95, 80, 65, 110, 85]
    const stageW = (w - 120) / (stages.length + targets.length)
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {stages.map((s, i) => (
          <g key={i}>
            <rect x={40 + i * stageW} y={60} width={stageW * 0.7} height={flows[i] * 2} fill={C[i % C.length]} opacity={0.8} rx={5} />
            <text x={40 + i * stageW + stageW * 0.35} y={55} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#333', fontWeight: 'bold' }}>{s}</text>
          </g>
        ))}
        {targets.map((t, i) => (
          <g key={i}>
            <rect x={40 + (stages.length + i) * stageW + 20} y={100 + i * 80} width={stageW * 0.7} height={60} fill={C[(i + 3) % C.length]} opacity={0.8} rx={5} />
            <text x={40 + (stages.length + i) * stageW + 20 + stageW * 0.35} y={95 + i * 80} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#333', fontWeight: 'bold' }}>{t}</text>
          </g>
        ))}
        {stages.map((_, i) => (
          <line key={i} x1={40 + i * stageW + stageW * 0.7} y1={60 + flows[i]} 
            x2={40 + stages.length * stageW + 20} y2={130} stroke={C[i % C.length]} strokeWidth={2} opacity={0.5} />
        ))}
      </svg>
    )
  }

  // ====== KEGG通路图 ======
  if (chartId === 'kegg-pathway') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const pathwayNodes = [
      { id: 'Glc', label: 'Glucose', x: 80, y: h * 0.5, r: 22, color: C[0] },
      { id: 'G6P', label: 'G-6-P', x: 200, y: h * 0.35, r: 18, color: C[1] },
      { id: 'F6P', label: 'F-6-P', x: 320, y: h * 0.35, r: 18, color: C[1] },
      { id: 'F1BP', label: 'F-1,6-BP', x: 440, y: h * 0.35, r: 18, color: C[2] },
      { id: 'GAP', label: 'GAP', x: 560, y: h * 0.25, r: 16, color: C[2] },
      { id: 'BPG', label: '1,3-BPG', x: 560, y: h * 0.45, r: 16, color: C[3] },
      { id: 'PYR', label: 'Pyruvate', x: 680, y: h * 0.35, r: 20, color: C[4] },
      { id: 'Lac', label: 'Lactate', x: 820, y: h * 0.35, r: 22, color: C[5] },
      { id: 'TCA1', label: 'Citrate', x: 560, y: h * 0.65, r: 18, color: C[6 % C.length] },
      { id: 'TCA2', label: 'α-KG', x: 440, y: h * 0.65, r: 18, color: C[6 % C.length] },
      { id: 'TCA3', label: 'Succinate', x: 320, y: h * 0.65, r: 18, color: C[6 % C.length] },
      { id: 'TCA4', label: 'Malate', x: 200, y: h * 0.65, r: 18, color: C[6 % C.length] },
      { id: 'ATP', label: 'ATP', x: 80, y: h * 0.2, r: 18, color: '#e74c3c' },
      { id: 'NADH', label: 'NADH', x: 80, y: h * 0.8, r: 18, color: '#f39c12' },
    ]
    const pathwayEdges: [string, string][] = [
      ['Glc', 'G6P'], ['G6P', 'F6P'], ['F6P', 'F1BP'], ['F1BP', 'GAP'],
      ['F1BP', 'BPG'], ['GAP', 'BPG'], ['BPG', 'PYR'], ['PYR', 'Lac'],
      ['PYR', 'TCA1'], ['TCA1', 'TCA2'], ['TCA2', 'TCA3'], ['TCA3', 'TCA4'],
      ['G6P', 'ATP'], ['BPG', 'ATP'], ['TCA4', 'NADH'], ['GAP', 'NADH'],
    ]
    const nodeMap = Object.fromEntries(pathwayNodes.map(n => [n.id, n]))
    const upGenes = ['HK1', 'PFK', 'PKM', 'LDHA']
    const downGenes = ['TCA', 'OXPHOS', 'PDH']
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Glycolysis / Gluconeogenesis Pathway</text>
        {/* Edges */}
        {pathwayEdges.map(([a, b], i) => (
          <g key={i}>
            <line x1={nodeMap[a].x} y1={nodeMap[a].y} x2={nodeMap[b].x} y2={nodeMap[b].y}
              stroke={np(i * 10) > 0.7 ? '#e74c3c' : np(i * 10) < 0.3 ? '#3498db' : '#95a5a6'}
              strokeWidth={np(i * 10) > 0.7 || np(i * 10) < 0.3 ? 2.5 : 1.5} opacity={0.7} />
            {/* Arrow */}
            {(() => {
              const nx = nodeMap[b].x, ny = nodeMap[b].y, ox = nodeMap[a].x, oy = nodeMap[a].y
              const angle = Math.atan2(ny - oy, nx - ox)
              const arrLen = 8
              const arrX = nx - nodeMap[b].r * Math.cos(angle), arrY = ny - nodeMap[b].r * Math.sin(angle)
              return <polygon points={`${arrX},${arrY} ${arrX - arrLen * Math.cos(angle - 0.4)},${arrY - arrLen * Math.sin(angle - 0.4)} ${arrX - arrLen * Math.cos(angle + 0.4)},${arrY - arrLen * Math.sin(angle + 0.4)}`}
                fill={np(i * 10) > 0.7 ? '#e74c3c' : '#95a5a6'} />
            })()}
          </g>
        ))}
        {/* Nodes */}
        {pathwayNodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity={0.85} stroke="white" strokeWidth={2} />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: n.r > 19 ? tickFontSize + 1 : tickFontSize - 1, fill: 'white', fontWeight: 'bold' }}>{n.label}</text>
          </g>
        ))}
        {/* Up/Down regulated gene labels */}
        <text x={w - 120} y={h * 0.15} textAnchor="start" style={{ fontSize: tickFontSize, fill: '#e74c3c', fontWeight: 'bold' }}>Up: {upGenes.join(', ')}</text>
        <text x={w - 120} y={h * 0.15 + 18} textAnchor="start" style={{ fontSize: tickFontSize, fill: '#3498db', fontWeight: 'bold' }}>Down: {downGenes.join(', ')}</text>
        {/* Legend */}
        <rect x={30} y={h - 45} width={14} height={14} fill={C[0]} opacity={0.8} rx={2} />
        <text x={50} y={h - 33} style={{ fontSize: tickFontSize, fill: '#555' }}>Glycolysis</text>
        <rect x={140} y={h - 45} width={14} height={14} fill={C[6 % C.length]} opacity={0.8} rx={2} />
        <text x={160} y={h - 33} style={{ fontSize: tickFontSize, fill: '#555' }}>TCA Cycle</text>
        <line x1={260} y1={h - 38} x2={280} y2={h - 38} stroke="#e74c3c" strokeWidth={2.5} />
        <text x={285} y={h - 33} style={{ fontSize: tickFontSize, fill: '#555' }}>Up-regulated</text>
        <line x1={390} y1={h - 38} x2={410} y2={h - 38} stroke="#3498db" strokeWidth={2.5} />
        <text x={415} y={h - 33} style={{ fontSize: tickFontSize, fill: '#555' }}>Down-regulated</text>
      </svg>
    )
  }

  // ====== GSEA富集图 ======
  if (chartId === 'gsea') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    let running = 0
    const n = 200
    const data = Array.from({ length: n }, (_, i) => {
      running += np(i * 0.05) < 0.35 ? 0.8 : -0.3
      return { x: i, y: Math.round(Math.max(-0.3, Math.min(0.6, running / 50)) * 100) / 100 }
    })
    const hits = Array.from({ length: 30 }, (_, i) => ({ x: Math.floor(np(i * 0.3) * n), y: -0.25 }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, n]} tick={xTickProps} label={{ ...xLabelProps, value: 'Gene Rank' }} />
          <YAxis type="number" dataKey="y" domain={[-0.35, 0.7]} tick={yTickProps} label={{ ...yLabelProps, value: 'Running ES' }} />
          <Tooltip /><Legend {...legendProps} />
          <Area data={data} dataKey="y" name="Enrichment Score" fill={C[0]} fillOpacity={0.5} stroke={C[0]} strokeWidth={2} />
          <Scatter data={hits} dataKey="y" name="Leading Edge" fill={C[1]} shape="triangle" r={3} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // ====== GO富集气泡图 ======
  if (chartId === 'go-bubble') {
    const goTerms = ['cell cycle', 'DNA repair', 'apoptosis', 'signal', 'metabolic', 'immune', 'adhesion', 'folding', 'transcription', 'translation']
    const data = goTerms.map((t, i) => ({
      x: 15 + Math.sin(i * 0.7) * 40 + 30, y: i,
      z: 20 + Math.abs(Math.sin(i * 0.5)) * 60,
      p: -Math.log10(0.05 / (i + 1)),
      name: t
    }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <ReScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Gene Count' }} />
          <YAxis type="number" dataKey="y" tick={false} label={{ ...yLabelProps, value: '' }} />
          <Tooltip /><Legend {...legendProps} />
          <Scatter name="GO Terms" data={data} fill={C[0]}
            shape={(props: any) => {
              const r = Math.sqrt(props?.payload?.z || 100) * 1.5
              return <circle cx={props.cx} cy={props.cy} r={r} fill={C[0]} opacity={0.7} />
            }} />
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== 相关性矩阵 ======
  if (chartId === 'correlation') {
    const n = 10
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const cellW = (w - 80) / n, cellH = (h - 80) / n
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {Array.from({ length: n }, (_, r) =>
          Array.from({ length: n }, (_, c) => {
            const v = r === c ? 1 : Math.round((np(r * n + c) * 2 - 1) * 100) / 100
            const ci = Math.floor(Math.abs(v) * (C.length - 1))
            return <rect key={`${r}-${c}`} x={60 + c * cellW} y={30 + r * cellH} width={cellW - 1} height={cellH - 1}
              fill={v > 0 ? C[ci] : C[ci]} opacity={Math.abs(v)} rx={2} />
          })
        )}
        {Array.from({ length: n }, (_, i) => (
          <text key={`x${i}`} x={60 + i * cellW + cellW / 2} y={h - 10} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>G{i + 1}</text>
        ))}
        {Array.from({ length: n }, (_, i) => (
          <text key={`y${i}`} x={45} y={30 + i * cellH + cellH / 2 + 4} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>G{i + 1}</text>
        ))}
      </svg>
    )
  }

  // ====== CNV图 ======
  if (chartId === 'cnv') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const segs = Array.from({ length: 100 }, (_, i) => ({
      x: i, y: Math.round(((np(i * 0.3) > 0.75 ? 0.6 : np(i * 0.3) < 0.25 ? -0.6 : 0) + np(i * 0.1) * 0.2) * 100) / 100
    }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} tick={xTickProps} label={{ ...xLabelProps, value: 'Genomic Position' }} />
          <YAxis type="number" domain={[-2, 2]} tick={yTickProps} label={{ ...yLabelProps, value: 'Log2 Ratio' }} />
          <Tooltip /><Legend {...legendProps} />
          <Scatter data={segs} dataKey="y" name="Segments" fill={C[0]} shape="circle" r={2} />
          <line x1={0} y1={0.2} x2={100} y2={0.2} stroke="#e74c3c" strokeDasharray="5 5" />
          <line x1={0} y1={-0.2} x2={100} y2={-0.2} stroke="#3498db" strokeDasharray="5 5" />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // ====== WGCNA模块-性状关联图 ======
  if (chartId === 'wgcna') {
    const traits = ['Age', 'Gender', 'BMI', 'Disease', 'Treatment']
    const modules = ['Turquoise', 'Blue', 'Brown', 'Yellow', 'Green']
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const corrData: number[][] = modules.map((_, mi) =>
      traits.map((_, ti) => Math.round((np(mi * 50 + ti * 30) * 2 - 1) * 100) / 100)
    )
    const cellW = (w - 120) / traits.length, cellH = (h - 80) / modules.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Module-Trait Correlation</text>
        {modules.map((_, mi) =>
          traits.map((_, ti) => {
            const v = corrData[mi][ti]
            const ci = Math.floor(Math.abs(v) * (C.length - 1))
            return <rect key={`${mi}-${ti}`} x={100 + ti * cellW} y={40 + mi * cellH} width={cellW - 1} height={cellH - 1}
              fill={v > 0 ? C[Math.min(ci, C.length - 1)] : C[Math.min(ci, C.length - 1)]} opacity={0.3 + Math.abs(v) * 0.7} rx={3} />
          })
        )}
        {traits.map((t, i) => (
          <text key={`t${i}`} x={100 + i * cellW + cellW / 2} y={h - 10} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{t}</text>
        ))}
        {modules.map((m, i) => (
          <text key={`m${i}`} x={90} y={40 + i * cellH + cellH / 2 + 4} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>{m}</text>
        ))}
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Modules</text>
      </svg>
    )
  }

  // ====== 染色体图 ======
  if (chartId === 'ideogram') {
    const chroms = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','X','Y']
    const lengths = [248, 242, 198, 190, 181, 170, 159, 145, 138, 133, 135, 133, 114, 107, 101, 90, 83, 80, 58, 64, 46, 50, 156, 57]
    const maxLen = Math.max(...lengths)
    const bandH = (h - 80) / chroms.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {chroms.map((c, i) => (
          <g key={i}>
            <rect x={60} y={30 + i * bandH} width={(lengths[i] / maxLen) * (w - 150)} height={bandH * 0.7} 
              fill={i % 2 === 0 ? C[0] : C[1]} opacity={0.8} rx={3} />
            <circle cx={60 + (lengths[i] / maxLen) * (w - 150) * 0.4} cy={30 + i * bandH + bandH * 0.35} r={bandH * 0.25} fill="white" opacity={0.9} />
            <text x={45} y={30 + i * bandH + bandH * 0.5} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>chr{c as string}</text>
          </g>
        ))}
        <text x={w / 2} y={h - 5} textAnchor="middle" style={{ fontSize: xAxisFontSize, fill: '#555' }}>Position (Mb)</text>
      </svg>
    )
  }

  // ====== Oncoplot突变谱 ======
  if (chartId === 'oncoplot') {
    const genes = ['TP53', 'KRAS', 'EGFR', 'PIK3CA', 'PTEN', 'BRAF', 'AKT1', 'MYC']
    const samples = Array.from({ length: 20 }, (_, i) => `S${i + 1}`)
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const cellW = (w - 80) / samples.length, cellH = (h - 60) / genes.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {genes.map((_, gi) =>
          samples.map((_, si) => {
            const v = np(gi * 20 + si * 0.5)
            const color = v > 0.7 ? C[0] : v > 0.5 ? C[1] : v > 0.3 ? C[2] : '#f5f5f5'
            return <rect key={`${gi}-${si}`} x={60 + si * cellW} y={30 + gi * cellH} width={cellW - 0.5} height={cellH - 0.5} fill={color} rx={1} />
          })
        )}
        {genes.map((g, i) => (
          <text key={i} x={45} y={30 + i * cellH + cellH / 2 + 4} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>{g}</text>
        ))}
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Mutation Landscape</text>
      </svg>
    )
  }

  // ====== 系统发育树 ======
  if (chartId === 'phylogenetic') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const labels = ['Human', 'Chimp', 'Gorilla', 'Orangutan', 'Macaque', 'Mouse', 'Rat', 'Dog', 'Cat', 'Cow']
    const yStep = (h - 80) / labels.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {labels.map((l, i) => (
          <g key={i}>
            <line x1={50} y1={40 + i * yStep} x2={50 + np(i * 10) * (w - 200)} y2={40 + i * yStep} stroke={C[i % C.length]} strokeWidth={2} />
            <circle cx={50 + np(i * 10) * (w - 200)} cy={40 + i * yStep} r={4} fill={C[i % C.length]} />
            <text x={60 + np(i * 10) * (w - 200)} y={40 + i * yStep + 4} style={{ fontSize: tickFontSize, fill: '#333' }}>{l}</text>
          </g>
        ))}
        <line x1={50} y1={40} x2={50} y2={40 + (labels.length - 1) * yStep} stroke="#999" strokeWidth={1} />
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Evolutionary Distance</text>
      </svg>
    )
  }

  // ====== 融合基因图 ======
  if (chartId === 'fusion') {
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <rect x={50} y={80} width={150} height={40} fill={C[0]} opacity={0.8} rx={8} />
        <text x={125} y={105} textAnchor="middle" style={{ fontSize: titleFontSize, fill: 'white', fontWeight: 'bold' }}>BCR</text>
        <rect x={350} y={80} width={150} height={40} fill={C[1]} opacity={0.8} rx={8} />
        <text x={425} y={105} textAnchor="middle" style={{ fontSize: titleFontSize, fill: 'white', fontWeight: 'bold' }}>ABL1</text>
        <line x1={200} y1={100} x2={300} y2={160} stroke={C[0]} strokeWidth={3} markerEnd="url(#arrow)" />
        <line x1={350} y1={100} x2={300} y2={160} stroke={C[1]} strokeWidth={3} markerEnd="url(#arrow)" />
        <rect x={225} y={160} width={150} height={40} fill={C[4]} opacity={0.9} rx={8} />
        <text x={300} y={185} textAnchor="middle" style={{ fontSize: titleFontSize, fill: 'white', fontWeight: 'bold' }}>BCR-ABL1</text>
        <text x={125} y={60} textAnchor="middle" style={{ fontSize: tickFontSize, fill: C[0], fontWeight: 'bold' }}>Chr 22</text>
        <text x={425} y={60} textAnchor="middle" style={{ fontSize: tickFontSize, fill: C[1], fontWeight: 'bold' }}>Chr 9</text>
        <text x={300} y={230} textAnchor="middle" style={{ fontSize: xAxisFontSize, fill: '#555' }}>Fusion Transcript</text>
        <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
      </svg>
    )
  }

  // ====== 可变剪接图 ======
  if (chartId === 'splicing') {
    const exons = [[50, 120], [160, 230], [280, 350], [400, 470], [520, 590]]
    const isoforms = [[0, 1, 2, 3, 4], [0, 1, 3, 4], [0, 2, 3, 4], [0, 1, 2, 4]]
    const colors_iso = [C[0], C[1], C[2], C[3]]
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {exons.map((e, i) => (
          <rect key={i} x={e[0]} y={40} width={e[1] - e[0]} height={30} fill={C[0]} opacity={0.7} rx={5} />
        ))}
        <line x1={30} y1={55} x2={620} y2={55} stroke="#ccc" strokeWidth={1} />
        {isoforms.map((indices, ii) => (
          <g key={ii}>
            {indices.map(ei => (
              <rect key={ei} x={exons[ei][0]} y={100 + ii * 50} width={exons[ei][1] - exons[ei][0]} height={25} fill={colors_iso[ii]} opacity={0.8} rx={4} />
            ))}
            {indices.slice(0, -1).map((ei, i) => (
              <line key={i} x1={exons[ei][1]} y1={112 + ii * 50} x2={exons[indices[i + 1]][0]} y2={112 + ii * 50} stroke={colors_iso[ii]} strokeWidth={2} />
            ))}
            <text x={10} y={117 + ii * 50} style={{ fontSize: tickFontSize, fill: '#555' }}>Iso {ii + 1}</text>
          </g>
        ))}
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Alternative Splicing Events</text>
      </svg>
    )
  }

  // ====== 甲基化水平图 ======
  if (chartId === 'methylation') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const data = Array.from({ length: 20 }, (_, i) => ({
      x: `CpG${i + 1}`,
      normal: Math.round(np(i * 0.3) * 40 + 20),
      tumor: Math.round(np(i * 0.3 + 50) * 50 + 40),
    }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'CpG Site' }} />
          <YAxis domain={[0, 100]} tick={yTickProps} label={{ ...yLabelProps, value: 'Methylation (%)' }} />
          <Tooltip /><Legend {...legendProps} />
          <Bar dataKey="normal" name="Normal" fill={C[0]} radius={[2, 2, 0, 0]} />
          <Bar dataKey="tumor" name="Tumor" fill={C[1]} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // ====== ATAC-seq信号图 ======
  if (chartId === 'atacseq') {
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const data = Array.from({ length: 100 }, (_, i) => ({
      x: i,
      s1: Math.round((np(i * 0.2) * 30 + (i > 30 && i < 40 ? 40 : 0) + (i > 60 && i < 75 ? 35 : 0)) * 10) / 10,
      s2: Math.round((np(i * 0.2 + 50) * 25 + (i > 35 && i < 45 ? 35 : 0) + (i > 55 && i < 70 ? 30 : 0)) * 10) / 10,
    }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="x" tick={xTickProps} label={{ ...xLabelProps, value: 'Genomic Position (kb)' }} />
          <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Signal Intensity' }} />
          <Tooltip /><Legend {...legendProps} />
          <Area type="monotone" dataKey="s1" name="Sample A" fill={C[0]} fillOpacity={0.5} stroke={C[0]} />
          <Area type="monotone" dataKey="s2" name="Sample B" fill={C[1]} fillOpacity={0.5} stroke={C[1]} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  // ====== 序列比对图 ======
  if (chartId === 'alignment') {
    const bases = ['A', 'T', 'G', 'C']
    const np = (s: number) => { const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }
    const ref = Array.from({ length: 30 }, (_, i) => bases[Math.floor(np(i * 0.1) * 4)])
    const seqs = [ref, ...Array.from({ length: 4 }, (_, si) => ref.map((b, i) => np(i * 0.1 + si * 100) < 0.15 ? bases[Math.floor(np(i * 0.1 + si * 100 + 50) * 4)] : b))]
    const cellW = (w - 80) / ref.length, cellH = (h - 80) / seqs.length
    const baseColors: Record<string, string> = { A: C[0], T: C[1], G: C[2], C: C[3], '-': '#f5f5f5' }
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {seqs.map((seq, si) =>
          seq.map((b, bi) => (
            <rect key={`${si}-${bi}`} x={60 + bi * cellW} y={30 + si * cellH} width={cellW - 0.5} height={cellH - 0.5}
              fill={baseColors[b] || '#ccc'} opacity={0.8} rx={1} />
          ))
        )}
        {seqs.map((_, i) => (
          <text key={i} x={45} y={30 + i * cellH + cellH / 2 + 4} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>{i === 0 ? 'Ref' : `S${i}`}</text>
        ))}
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: '#1a1f71' }}>Sequence Alignment</text>
      </svg>
    )
  }

  // ====== 默认：用折线图兜底 ======
  return (
    <ResponsiveContainer width={w} height={h}>
      <LineChart data={demoLineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="name" tick={xTickProps} label={{ ...xLabelProps, value: 'Time (hours)' }} />
        <YAxis tick={yTickProps} label={{ ...yLabelProps, value: 'Expression Level' }} />
        <Tooltip /><Legend {...legendProps} />
        <Line type="monotone" dataKey="geneA" name="Gene A" stroke={C[0]} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="geneB" name="Gene B" stroke={C[1]} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="geneC" name="Gene C" stroke={C[2]} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ChartToolPage() {
  const [selectedChart, setSelectedChart] = useState(chartTypes[0])
  const [dataInput, setDataInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // 样式参数 - 改为色系索引
  const [paletteIdx, setPaletteIdx] = useState(0)
  // 字体大小：标题、X轴、Y轴、图例、刻度 分别控制
  const [titleFontSize, setTitleFontSize] = useState(14)
  const [xAxisFontSize, setXAxisFontSize] = useState(11)
  const [yAxisFontSize, setYAxisFontSize] = useState(11)
  const [legendFontSize, setLegendFontSize] = useState(10)
  const [tickFontSize, setTickFontSize] = useState(9)
  // 图片尺寸：X轴长度、Y轴长度（绘图区域）
  const [axisXLength, setAxisXLength] = useState(600)
  const [axisYLength, setAxisYLength] = useState(400)

  const palette = COLOR_PALETTES[paletteIdx]

  const handleGenerate = () => { setShowPreview(true) }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Chart type list */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-bold text-[#1a1f71] mb-4 text-sm">图表类型</h3>
            <div className="space-y-1">
              {chartTypes.map(c => (
                <button key={c.id} onClick={() => { setSelectedChart(c); setShowPreview(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedChart.id === c.id ? 'bg-[#1a1f71] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Chart preview + data + actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Chart preview - LiveChart 实时渲染 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1a1f71] mb-4" style={{ fontSize: `${titleFontSize}px` }}>{selectedChart.name}</h3>
              <div 
                className="overflow-hidden rounded-lg bg-gray-50 mx-auto border border-gray-100 flex items-center justify-center"
                style={{ 
                  width: `${Math.min(axisXLength + 150, 700)}px`, 
                  height: `${Math.min(axisYLength + 120, 460)}px`,
                  maxWidth: '100%'
                }}
              >
                <LiveChart
                  chartId={selectedChart.id}
                  palette={palette}
                  titleFontSize={titleFontSize}
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  legendFontSize={legendFontSize}
                  tickFontSize={tickFontSize}
                  axisXLength={axisXLength}
                  axisYLength={axisYLength}
                />
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <button onClick={() => setSelectedChart(chartTypes[Math.max(0, chartTypes.indexOf(selectedChart) - 1)])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">上一个</button>
                <button onClick={() => setSelectedChart(chartTypes[Math.min(chartTypes.length - 1, chartTypes.indexOf(selectedChart) + 1)])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">下一个</button>
                <span className="text-sm text-gray-500">{chartTypes.indexOf(selectedChart) + 1} / {chartTypes.length}</span>
              </div>
            </div>

            {/* Data upload */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1a1f71] mb-4 text-sm">数据上传</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a1f71] transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">拖拽文件到此处或点击上传</p>
                <p className="text-gray-400 text-xs mb-3">支持 CSV, TSV, Excel 格式</p>
                <button className="px-4 py-2 bg-[#1a1f71] text-white rounded-lg text-sm hover:bg-[#4b5bab] transition-colors">
                  选择文件
                </button>
                <textarea 
                  value={dataInput} 
                  onChange={e => setDataInput(e.target.value)}
                  placeholder="或直接粘贴数据 (CSV格式)"
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4">
              <button onClick={handleGenerate}
                className="px-6 py-3 bg-[#1a1f71] text-white rounded-lg font-medium hover:bg-[#4b5bab] transition-colors flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>生成图表</span>
              </button>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>导出PNG</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>导出PDF</span>
                </button>
              </div>
            </div>

            {/* Interactive preview */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-[#1a1f71] mb-4 text-sm">交互式预览</h3>
                <LiveChart
                  chartId="line"
                  palette={palette}
                  titleFontSize={titleFontSize}
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  legendFontSize={legendFontSize}
                  tickFontSize={tickFontSize}
                  axisXLength={Math.min(axisXLength, 600)}
                  axisYLength={Math.min(axisYLength, 320)}
                />
              </div>
            )}
          </div>

          {/* Right: Parameter panel */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24">
              <h3 className="font-bold text-[#1a1f71] mb-4 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                参数配置
              </h3>

              {/* 色系选择 */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">配色方案</label>
                <div className="space-y-2">
                  {COLOR_PALETTES.map((p, i) => (
                    <button key={p.name} onClick={() => setPaletteIdx(i)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${paletteIdx === i ? 'bg-blue-50 ring-1 ring-[#1a1f71]' : 'hover:bg-gray-50'}`}>
                      <div className="flex space-x-0.5">
                        {p.colors.slice(0, 4).map(c => (
                          <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${paletteIdx === i ? 'text-[#1a1f71]' : 'text-gray-600'}`}>{p.name}</span>
                      {paletteIdx === i && <Check className="w-3 h-3 text-[#1a1f71] ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* 字体大小 - 分别控制 */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">字体大小</label>
                <div className="space-y-2">
                  {/* 标题 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">标题</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={28} value={titleFontSize}
                        onChange={e => setTitleFontSize(Number(e.target.value))}
                        className="w-16 accent-[#1a1f71]" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{titleFontSize}px</span>
                    </div>
                  </div>
                  {/* X轴标签 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">X轴标签</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={20} value={xAxisFontSize}
                        onChange={e => setXAxisFontSize(Number(e.target.value))}
                        className="w-16 accent-[#1a1f71]" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{xAxisFontSize}px</span>
                    </div>
                  </div>
                  {/* Y轴标签 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Y轴标签</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={20} value={yAxisFontSize}
                        onChange={e => setYAxisFontSize(Number(e.target.value))}
                        className="w-16 accent-[#1a1f71]" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{yAxisFontSize}px</span>
                    </div>
                  </div>
                  {/* 图例 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">图例</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={18} value={legendFontSize}
                        onChange={e => setLegendFontSize(Number(e.target.value))}
                        className="w-16 accent-[#1a1f71]" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{legendFontSize}px</span>
                    </div>
                  </div>
                  {/* 刻度 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">刻度</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={6} max={16} value={tickFontSize}
                        onChange={e => setTickFontSize(Number(e.target.value))}
                        className="w-16 accent-[#1a1f71]" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{tickFontSize}px</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* 图片尺寸 - X轴/Y轴长度 */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">图片尺寸 (轴长)</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">X轴长度</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value={axisXLength}
                        onChange={e => setAxisXLength(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                        min={200} max={2000} step={50} />
                      <span className="text-[10px] text-gray-400">px</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Y轴长度</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value={axisYLength}
                        onChange={e => setAxisYLength(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                        min={200} max={2000} step={50} />
                      <span className="text-[10px] text-gray-400">px</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    { label: 'A4横', x: 600, y: 400 },
                    { label: 'A4竖', x: 400, y: 600 },
                    { label: '方形', x: 500, y: 500 },
                    { label: '宽屏', x: 800, y: 400 },
                  ].map(preset => (
                    <button key={preset.label} 
                      onClick={() => { setAxisXLength(preset.x); setAxisYLength(preset.y) }}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${axisXLength === preset.x && axisYLength === preset.y ? 'bg-[#1a1f71] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* 当前设置预览 */}
              <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">色系</span>
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-0.5">
                      {palette.colors.slice(0, 3).map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="font-medium text-gray-700 ml-1">{palette.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">字体</span>
                  <span className="font-medium text-gray-700">标题{titleFontSize}/轴{xAxisFontSize},{yAxisFontSize}/图例{legendFontSize}/刻度{tickFontSize}px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">轴长</span>
                  <span className="font-medium text-gray-700">X={axisXLength} x Y={axisYLength}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ───────────────────  GenomicsPage  ─────────────────── */

function GenomicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const analysisTypes = [
    { title: '变异检测', desc: '从测序数据中识别SNP、InDel等基因组变异', tools: ['GATK','Samtools','DeepVariant'], apps: ['致病突变筛查','药物基因组学'], icon: Search, image: '/analysis-genomics-variant.jpg' },
    { title: 'CNV分析', desc: '检测基因组区域的拷贝数增加或缺失', tools: ['CNVkit','GISTIC2','PennCNV'], apps: ['肿瘤基因组','遗传病诊断'], icon: Layers, image: '/analysis-genomics-cnv.jpg' },
    { title: '结构变异', desc: '识别大片段的基因组结构重排', tools: ['Delly','Lumpy','Manta'], apps: ['癌症基因组学','罕见病'], icon: Dna, image: '/card-bg-genomics.jpg' },
    { title: 'GWAS', desc: '寻找与疾病或性状相关的遗传位点', tools: ['PLINK','GEMMA','GCTA'], apps: ['复杂疾病','性状定位'], icon: Target, image: '/genomics.jpg' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f71] to-[#2d3561] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="/card-bg-genomics.jpg" alt="" className="w-full h-full object-cover" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPage('multiomics')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /><span>返回多组学</span>
          </motion.button>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">基因组学分析</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl">
            全面解析DNA序列变异、拷贝数变异和结构变异
          </motion.p>
        </div>
      </section>

      <WorkflowSection omicsKey="genomics" subtitle="遵循国际最佳实践，确保结果的准确性和可重复性" />

      {/* Core analysis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">核心分析内容</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisTypes.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1a1f71] to-[#4b5bab] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tools.map(t => <span key={t} className="px-2 py-0.5 bg-blue-50 text-[#1a1f71] text-xs rounded-md">{t}</span>)}
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
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">经典结果展示</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ img: '/charts/manhattan.png', title: '曼哈顿图', desc: '全基因组关联分析结果' },
              { img: '/charts/cnv.png', title: 'CNV图谱', desc: '拷贝数变异分布' },
              { img: '/charts/ideogram.png', title: '染色体图谱', desc: '染色体水平基因组特征' }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative h-48 overflow-hidden bg-gray-50"><img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" /></div>
                <div className="p-4"><h4 className="font-bold text-[#1a1f71]">{item.title}</h4><p className="text-gray-500 text-sm">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1a1f71] to-[#4b5bab]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">开始基因组学分析</h2>
            <motion.button onClick={() => setPage('contact')} className="px-8 py-3 bg-white text-[#1a1f71] rounded-lg font-semibold hover:bg-gray-100"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>立即咨询</motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────  TranscriptomicsPage  ─────────────────── */

function TranscriptomicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const analysisTypes = [
    { title: '差异表达分析', desc: '比较不同条件下基因表达水平的变化', tools: ['DESeq2','edgeR','limma'], apps: ['疾病标志物','药物响应'], icon: BarChart3, image: '/analysis-rna-expression.jpg' },
    { title: '可变剪接分析', desc: '识别和定量不同的mRNA剪接异构体', tools: ['rMATS','SUPPA','LeafCutter'], apps: ['肿瘤异质性','神经疾病'], icon: ScatterChart, image: '/analysis-rna-splicing.jpg' },
    { title: '融合基因检测', desc: '发现基因融合事件，识别致癌融合基因', tools: ['STAR-Fusion','Arriba','FusionCatcher'], apps: ['癌症诊断','靶向治疗'], icon: Dna, image: '/transcriptomics.jpg' },
    { title: '通路富集分析', desc: '解析差异基因的生物学功能和信号通路', tools: ['clusterProfiler','GSEA','DAVID'], apps: ['机制研究','靶点筛选'], icon: Target, image: '/card-bg-transcriptomics.jpg' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#c0392b] to-[#d35400] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="/card-bg-transcriptomics.jpg" alt="" className="w-full h-full object-cover" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPage('multiomics')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /><span>返回多组学</span>
          </motion.button>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">转录组学分析</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl">
            全面解析基因表达谱、可变剪接和融合基因
          </motion.p>
        </div>
      </section>

      <WorkflowSection omicsKey="transcriptomics" subtitle="从原始测序数据到生物学洞察的完整流程" />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">核心分析内容</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisTypes.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#c0392b] to-[#d35400] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tools.map(t => <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-md">{t}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">经典结果展示</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ img: '/charts/volcano.png', title: '火山图', desc: '差异表达基因分布' },
              { img: '/charts/heatmap.png', title: '热图', desc: '基因表达模式' },
              { img: '/charts/go-bubble.png', title: 'GO富集气泡图', desc: '功能富集分析' }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative h-48 overflow-hidden bg-gray-50"><img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" /></div>
                <div className="p-4"><h4 className="font-bold text-[#1a1f71]">{item.title}</h4><p className="text-gray-500 text-sm">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#c0392b] to-[#d35400]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">开始转录组学分析</h2>
            <motion.button onClick={() => setPage('contact')} className="px-8 py-3 bg-white text-[#c0392b] rounded-lg font-semibold hover:bg-gray-100"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>立即咨询</motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


/* ───────────────────  ProteomicsPage  ─────────────────── */

function ProteomicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const analysisTypes = [
    { title: '蛋白质鉴定定量', desc: '基于质谱的蛋白质鉴定和相对/绝对定量', tools: ['MaxQuant','MSFragger','DIA-NN'], apps: ['标志物发现','蛋白表达谱'], icon: Search, image: '/analysis-protein-ms.jpg' },
    { title: '翻译后修饰分析', desc: '磷酸化、乙酰化、泛素化等修饰全景分析', tools: ['pFind','AScore','MaxQuant-PTM'], apps: ['信号通路','药物靶点'], icon: Target, image: '/analysis-protein-ptm.jpg' },
    { title: '蛋白互作网络', desc: '构建和分析蛋白质之间的相互作用网络', tools: ['STRING','Cytoscape','BioGRID'], apps: ['复合物预测','功能模块'], icon: Share2, image: '/proteomics.jpg' },
    { title: '多组学整合', desc: '蛋白质组与转录组、代谢组的关联分析', tools: ['MOFA','mixOmics','DIABLO'], apps: ['系统生物学','精准医学'], icon: Layers, image: '/card-bg-proteomics.jpg' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#5b2c6f] to-[#7d3c98] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="/card-bg-proteomics.jpg" alt="" className="w-full h-full object-cover" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPage('multiomics')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /><span>返回多组学</span>
          </motion.button>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">蛋白质组学分析</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl">
            深度解析蛋白质表达、修饰和互作网络
          </motion.p>
        </div>
      </section>

      <WorkflowSection omicsKey="proteomics" subtitle="基于质谱技术的蛋白质组学分析流程" />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">核心分析内容</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisTypes.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5b2c6f] to-[#7d3c98] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tools.map(t => <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-md">{t}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">经典结果展示</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ img: '/charts/heatmap.png', title: '蛋白表达热图', desc: '蛋白质表达差异模式' },
              { img: '/charts/volcano.png', title: '差异蛋白火山图', desc: '差异表达蛋白分布' },
              { img: '/charts/network.png', title: '蛋白互作网络', desc: '蛋白质相互作用网络' }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative h-48 overflow-hidden bg-gray-50"><img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" /></div>
                <div className="p-4"><h4 className="font-bold text-[#1a1f71]">{item.title}</h4><p className="text-gray-500 text-sm">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#5b2c6f] to-[#7d3c98]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">开始蛋白质组学分析</h2>
            <motion.button onClick={() => setPage('contact')} className="px-8 py-3 bg-white text-[#5b2c6f] rounded-lg font-semibold hover:bg-gray-100"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>立即咨询</motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────  MetabolomicsPage  ─────────────────── */

function MetabolomicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const analysisTypes = [
    { title: '代谢物鉴定定量', desc: '基于LC-MS/GC-MS的非靶向和靶向代谢物检测', tools: ['XCMS','MS-DIAL','MetaboAnalyst'], apps: ['标志物筛选','代谢表型'], icon: Beaker, image: '/analysis-metabolite.jpg' },
    { title: '代谢通路分析', desc: '代谢物富集分析和代谢通路可视化', tools: ['KEGG','MetaboAnalyst','SMPDB'], apps: ['通路扰动','药物机制'], icon: Target, image: '/analysis-metabolism-pathway.jpg' },
    { title: '脂质组学分析', desc: '脂质的全面鉴定和定量分析', tools: ['LipidSearch','LipidMaps','MS-DIAL'], apps: ['膜生物学','炎症研究'], icon: Layers, image: '/card-bg-metabolomics.jpg' },
    { title: '代谢流分析', desc: '基于稳定同位素示踪的代谢通量分析', tools: ['IsoCor','Metran','13CFLUX2'], apps: ['代谢工程','肿瘤代谢'], icon: TrendingUp, image: '/metabolomics.jpg' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#0e6655] to-[#17a589] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="/card-bg-metabolomics.jpg" alt="" className="w-full h-full object-cover" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPage('multiomics')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /><span>返回多组学</span>
          </motion.button>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">代谢组学分析</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl">
            全面检测和定量小分子代谢物，揭示代谢表型
          </motion.p>
        </div>
      </section>

      <WorkflowSection omicsKey="metabolomics" subtitle="从样本到代谢洞察的完整流程" />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">核心分析内容</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisTypes.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0e6655] to-[#17a589] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tools.map(t => <span key={t} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-md">{t}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">经典结果展示</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ img: '/charts/heatmap.png', title: '代谢物热图', desc: '代谢物表达差异模式' },
              { img: '/charts/pca.png', title: 'PCA分析', desc: '样本间代谢相似性' },
              { img: '/charts/kegg-pathway.png', title: 'KEGG通路富集', desc: '代谢通路分析' }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative h-48 overflow-hidden bg-gray-50"><img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" /></div>
                <div className="p-4"><h4 className="font-bold text-[#1a1f71]">{item.title}</h4><p className="text-gray-500 text-sm">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#0e6655] to-[#17a589]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-white mb-4">开始代谢组学分析</h2>
            <motion.button onClick={() => setPage('contact')} className="px-8 py-3 bg-white text-[#0e6655] rounded-lg font-semibold hover:bg-gray-100"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>立即咨询</motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


/* ───────────────────  MultiomicsPage  ─────────────────── */

function MultiomicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const omicsTypes = [
    { title: '基因组学 (Genomics)', desc: 'DNA序列变异、拷贝数变异、结构变异分析', icon: Dna, color: '#1a1f71', bgImage: '/card-bg-genomics.jpg', page: 'genomics' as Page },
    { title: '转录组学 (Transcriptomics)', desc: '基因表达谱、可变剪接、融合基因分析', icon: Activity, color: '#c0392b', bgImage: '/card-bg-transcriptomics.jpg', page: 'transcriptomics' as Page },
    { title: '蛋白质组学 (Proteomics)', desc: '蛋白质鉴定、定量分析、修饰分析', icon: Target, color: '#5b2c6f', bgImage: '/card-bg-proteomics.jpg', page: 'proteomics' as Page },
    { title: '代谢组学 (Metabolomics)', desc: '代谢物鉴定、通路分析、代谢网络构建', icon: Beaker, color: '#0e6655', bgImage: '/card-bg-metabolomics.jpg', page: 'metabolomics' as Page },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">多组学整合分析</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            多维度数据整合分析，揭示深层生物学机制
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1f71] mb-4">组学类型</h2>
            <p className="text-gray-600">点击下方卡片了解各组学详情</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {omicsTypes.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                onClick={() => setPage(o.page)}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={o.bgImage} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${o.color}90` }}>
                    <o.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-[#1a1f71] opacity-0 group-hover:opacity-100 transition-opacity">
                    点击查看详情
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#1a1f71]">{o.title}</h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1a1f71] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 mt-2">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────  AcademicPage  ─────────────────── */

function AcademicPage({ setPage }: { setPage: (p: Page) => void }) {
  void setPage
  const services = [
    {
      title: 'SCI论文撰写',
      desc: '专业的SCI论文撰写和润色服务，从实验设计到论文发表全流程支持',
      icon: FileText,
      color: '#1a1f71',
      bgImage: '/card-bg-academic-paper.jpg',
      features: ['论文撰写', '语言润色', '格式排版', '投稿指导'],
      detail: '提供从摘要、引言、方法、结果到讨论的全文撰写服务，由具有丰富发表经验的博士团队完成'
    },
    {
      title: '专利申请',
      desc: '生物信息学相关专利的撰写和申请服务，保护您的知识产权',
      icon: PieChartIcon,
      color: '#4b5bab',
      bgImage: '/card-bg-academic-patent.jpg',
      features: ['专利检索', '权利要求', '说明书', '审查答复'],
      detail: '涵盖生物信息学算法、分析方法、数据库等方面的发明专利申请'
    },
    {
      title: '基金申请',
      desc: '国家自然科学基金、省市级基金等申请书的撰写和修改服务',
      icon: BarChart3,
      color: '#6366f1',
      bgImage: '/card-bg-academic-fund.jpg',
      features: ['选题论证', '研究方案', '可行性分析', '预算编制'],
      detail: '针对NSFC、省市基金等不同层级，提供个性化申请策略和高质量标书'
    },
    {
      title: '数据分析报告',
      desc: '专业的生物信息学数据分析报告撰写，适合项目结题和成果汇报',
      icon: MessageSquare,
      color: '#8b5cf6',
      bgImage: '/card-bg-academic-report.jpg',
      features: ['结果解读', '图表制作', '方法描述', '结论总结'],
      detail: '将复杂的生物信息学分析结果转化为清晰、专业的学术报告'
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/card-bg-transcriptomics.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">学术撰写服务</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            专业的学术写作团队，助力您的科研成果发表
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <img src={s.bgImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}90` }}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a1f71] mb-2">{s.title}</h3>
                  <p className="text-gray-600 mb-3">{s.desc}</p>
                  <p className="text-gray-500 text-sm mb-4">{s.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.features.map(f => (
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
  )
}

/* ───────────────────  PricingPage  ─────────────────── */

function PricingPage({ setPage }: { setPage: (p: Page) => void }) {
  const plans = [
    { name: '基础版', price: '¥999', period: '/项目', desc: '适合单个简单分析', features: ['数据质控', '标准分析', '基础图表', 'PDF报告'], color: '#4b5bab', popular: false },
    { name: '专业版', price: '¥2,999', period: '/项目', desc: '适合常规科研分析', features: ['基础版全部', '高级可视化', '通路富集', '交互式图表', '在线查看'], color: '#1a1f71', popular: true },
    { name: '定制版', price: '¥9,999', period: '/项目', desc: '适合大型复杂项目', features: ['专业版全部', '多组学整合', '定制分析', '论文图表', '一对一咨询'], color: '#6366f1', popular: false },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-[#1a1f71] to-[#6366f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">价格方案</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            灵活的定价方案，满足不同科研需求
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-[#1a1f71]' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#1a1f71] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">推荐</div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#1a1f71] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center space-x-3 text-sm text-gray-600">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPage('contact')}
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: plan.color, color: 'white' }}>
                    开始咨询
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────  ContactPage  ─────────────────── */

function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-to-br from-[#1a1f71] to-[#4b5bab]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-white mb-6">联系我们</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-3xl mx-auto">
            有任何问题或需求？我们随时为您提供帮助
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-[#1a1f71] mb-6">联系方式</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1a1f71]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#1a1f71]" />
                  </div>
                  <div><h4 className="font-semibold text-[#1a1f71]">电话</h4><p className="text-gray-600">+86 400-123-4567</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1a1f71]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#1a1f71]" />
                  </div>
                  <div><h4 className="font-semibold text-[#1a1f71]">邮箱</h4><p className="text-gray-600">support@bioinfopro.com</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1a1f71]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-[#1a1f71]" />
                  </div>
                  <div><h4 className="font-semibold text-[#1a1f71]">地址</h4><p className="text-gray-600">北京市海淀区中关村科技园</p></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1a1f71] mb-6">在线咨询</h2>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">姓名</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label><input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">机构</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">咨询内容</label><textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                <button type="submit" className="w-full py-3 bg-[#1a1f71] text-white rounded-lg font-medium hover:bg-[#4b5bab] transition-colors">
                  提交咨询
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────  App  ─────────────────── */

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const mainRef = useRef<HTMLDivElement>(null)

  const scrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSetPage = useCallback((page: Page) => {
    setCurrentPage(page)
    scrollToTop()
  }, [scrollToTop])

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setPage={handleSetPage} />
      case 'services': return <ServicesPage setPage={handleSetPage} />
      case 'visualization': return <VisualizationPage setPage={handleSetPage} />
      case 'chart-tool': return <ChartToolPage />
      case 'genomics': return <GenomicsPage setPage={handleSetPage} />
      case 'transcriptomics': return <TranscriptomicsPage setPage={handleSetPage} />
      case 'proteomics': return <ProteomicsPage setPage={handleSetPage} />
      case 'metabolomics': return <MetabolomicsPage setPage={handleSetPage} />
      case 'multiomics': return <MultiomicsPage setPage={handleSetPage} />
      case 'academic': return <AcademicPage setPage={handleSetPage} />
      case 'pricing': return <PricingPage setPage={handleSetPage} />
      case 'contact': return <ContactPage />
      default: return <HomePage setPage={handleSetPage} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} setPage={handleSetPage} />
      <main ref={mainRef} className="pt-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        <Footer setPage={handleSetPage} />
      </main>
    </div>
  )
}

export default App

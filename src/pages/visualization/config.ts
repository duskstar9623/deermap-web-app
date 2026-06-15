import { ASSETS } from '@/constants/assets';

export const CHART_TYPES = [
  { id: 'heatmap', img: ASSETS.charts.heatmap },
  { id: 'volcano', img: ASSETS.charts.volcano },
  { id: 'pca', img: ASSETS.charts.pca },
  { id: 'venn', img: ASSETS.charts.venn },
  { id: 'line', img: ASSETS.charts.line },
  { id: 'bar', img: ASSETS.charts.bar },
  { id: 'scatter', img: ASSETS.charts.scatter },
  { id: 'pie', img: ASSETS.charts.pie },
  { id: 'boxplot', img: ASSETS.charts.boxplot },
  { id: 'violin', img: ASSETS.charts.violin },
  { id: 'bubble', img: ASSETS.charts.bubble },
  { id: 'radar', img: ASSETS.charts.radar },
  { id: 'sankey', img: ASSETS.charts.sankey },
  { id: 'survival', img: ASSETS.charts.survival },
  { id: 'roc', img: ASSETS.charts.roc },
  { id: 'waterfall', img: ASSETS.charts.waterfall },
  { id: 'network', img: ASSETS.charts.network },
  { id: 'manhattan', img: ASSETS.charts.manhattan },
  { id: 'qqplot', img: ASSETS.charts.qqplot },
  { id: 'dendrogram', img: ASSETS.charts.dendrogram },
  { id: 'area', img: ASSETS.charts.area },
  { id: 'stackedbar', img: ASSETS.charts.stackedBar },
  { id: 'sunburst', img: ASSETS.charts.sunburst },
  { id: 'errorbar', img: ASSETS.charts.errorbar },
  { id: 'go-bubble', img: ASSETS.charts.goBubble },
  { id: 'kegg-pathway', img: ASSETS.charts.keggPathway },
  { id: 'gsea', img: ASSETS.charts.gsea },
  { id: 'correlation', img: ASSETS.charts.correlation },
  { id: 'kmeans', img: ASSETS.charts.kmeans },
  { id: 'umap', img: ASSETS.charts.umap },
  { id: 'wgcna', img: ASSETS.charts.wgcna },
  { id: 'ideogram', img: ASSETS.charts.ideogram },
  { id: 'cnv', img: ASSETS.charts.cnv },
  { id: 'fusion', img: ASSETS.charts.fusion },
  { id: 'oncoplot', img: ASSETS.charts.oncoplot },
  { id: 'alignment', img: ASSETS.charts.alignment },
  { id: 'phylogenetic', img: ASSETS.charts.phylogenetic },
  { id: 'splicing', img: ASSETS.charts.splicing },
  { id: 'atacseq', img: ASSETS.charts.atacseq },
  { id: 'methylation', img: ASSETS.charts.methylation },
];

/** Maps chart IDs with special characters to their i18n keys */
export function getChartI18nKey(id: string): string {
  const mapping: Record<string, string> = {
    'go-bubble': 'goBubble',
    'kegg-pathway': 'keggPathway',
    'stackedbar': 'stackedBar',
  };
  return mapping[id] ?? id;
}

/** Color palette definitions. Names are translation keys under `visualization.palettes`. */
export const COLOR_PALETTES = [
  { nameKey: 'palettes.nature', colors: ['#E64B35', '#4DBBD5', '#00A087', '#3C5488', '#F39B7F', '#8491B4', '#91D1C2', '#DC0000'], filter: 'none' },
  { nameKey: 'palettes.science', colors: ['#08519C', '#3182BD', '#6BAED6', '#BDD7E7', '#74C476', '#FDBB84', '#FC9272', '#FB6A4A'], filter: 'hue-rotate(-10deg) saturate(1.1)' },
  { nameKey: 'palettes.cell', colors: ['#D62728', '#FF7F0E', '#FFBB78', '#2CA02C', '#98DF8A', '#1F77B4', '#AEC7E8', '#9467BD'], filter: 'hue-rotate(25deg) saturate(1.15)' },
  { nameKey: 'palettes.lancet', colors: ['#005A8C', '#4A90A4', '#7BAE7C', '#B8D4A0', '#F5D491', '#E8A838', '#D4634F', '#A33B3B'], filter: 'hue-rotate(-35deg) saturate(0.95)' },
  { nameKey: 'palettes.nejm', colors: ['#006BA4', '#3B8EA5', '#7EB8A2', '#BFD3B0', '#F4D06F', '#E8A838', '#C46A53', '#A33B3B'], filter: 'hue-rotate(-30deg) saturate(0.9)' },
  { nameKey: 'palettes.jama', colors: ['#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124'], filter: 'hue-rotate(60deg) saturate(1.05)' },
  { nameKey: 'palettes.ieee', colors: ['#003F5C', '#2F4B7C', '#665191', '#A05195', '#D45087', '#F95D6A', '#FF7C43', '#FFA600'], filter: 'hue-rotate(-50deg) saturate(1.2)' },
  { nameKey: 'palettes.pastel', colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6B3FF', '#FFB3E6', '#B3FFF0'], filter: 'saturate(0.6) brightness(1.1)' },
];

export const DEMO_LINE_DATA = [
  { name: '1h', geneA: 2.1, geneB: 1.8, geneC: 3.2 },
  { name: '2h', geneA: 2.5, geneB: 2.0, geneC: 3.5 },
  { name: '4h', geneA: 3.2, geneB: 2.3, geneC: 3.8 },
  { name: '8h', geneA: 4.5, geneB: 2.8, geneC: 4.1 },
  { name: '12h', geneA: 5.8, geneB: 3.2, geneC: 4.5 },
  { name: '24h', geneA: 7.2, geneB: 3.8, geneC: 5.0 },
];

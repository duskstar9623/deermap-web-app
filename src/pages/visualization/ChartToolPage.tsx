import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ScatterChart as ReScatterChart, Scatter,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts'
import { Upload, Download, Zap, Check, Settings } from 'lucide-react'
import { seededRandom } from '@/utils/common'
import { CHART_TYPES, DEMO_LINE_DATA, COLOR_PALETTES, getChartI18nKey } from './config'
import { THEME_COLORS } from '@/constants/theme'

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

  // ====== ??? ======
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

  // ====== ??? ======
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

  // ====== ??? ======
  if (chartId === 'scatter' || chartId === 'pca' || chartId === 'volcano') {
    const makeScatter = (n: number, cx: number, cy: number, sx: number, sy: number, colorIdx: number) =>
      Array.from({ length: n }, (_, i) => ({
        x: cx + sx * (seededRandom(i * 0.1 + colorIdx * 100) - 0.5) * 2,
        y: cy + sy * (seededRandom(i * 0.1 + colorIdx * 100 + 50) - 0.5) * 2,
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

  // ====== ?? ======
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

  // ====== ??? ======
  if (chartId === 'venn') {
    const r = Math.min(w, h) * 0.22
    const sets = [
      { x: w * 0.35, y: h * 0.42, r, label: 'Set A', n: 55 + Math.floor(seededRandom(0) * 20) },
      { x: w * 0.5, y: h * 0.42, r, label: 'Set B', n: 45 + Math.floor(seededRandom(50) * 20) },
      { x: w * 0.425, y: h * 0.62, r, label: 'Set C', n: 35 + Math.floor(seededRandom(100) * 20) },
    ]
    const overlapAB = 20 + Math.floor(seededRandom(25) * 15)
    const overlapAC = 15 + Math.floor(seededRandom(75) * 10)
    const overlapBC = 12 + Math.floor(seededRandom(125) * 10)
    const overlapABC = 8 + Math.floor(seededRandom(150) * 8)
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={25} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Venn Diagram (3 Sets)</text>
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
        {/* AnB */}
        <text x={(sets[0].x + sets[1].x) / 2} y={sets[0].y - r * 0.3} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapAB - overlapABC}</text>
        {/* AnC */}
        <text x={(sets[0].x + sets[2].x) / 2 - 5} y={(sets[0].y + sets[2].y) / 2 + 5} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapAC - overlapABC}</text>
        {/* BnC */}
        <text x={(sets[1].x + sets[2].x) / 2 + 5} y={(sets[1].y + sets[2].y) / 2 + 5} textAnchor="middle" style={{ fontSize: tickFontSize, fill: '#555' }}>{overlapBC - overlapABC}</text>
        {/* AnBnC */}
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

  // ====== ??? ======
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

  // ====== ????? ======
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

  // ====== ??? ======
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

  // ====== ???(?ErrorBar??) ======
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

  // ====== ??(???SVG) ======
  if (chartId === 'heatmap') {
    const rows = 15, cols = 12
    const cells = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = Math.sin(r * 0.5) * Math.cos(c * 0.4) + seededRandom(r * cols + c) * 0.3
        const ci = Math.floor(Math.abs(v) * C.length) % C.length
        cells.push({ r, c, color: C[ci], opacity: 0.3 + Math.abs(v) * 0.7 })
      }
    }
    const cellW = (w - 80) / cols, cellH = (h - 60) / rows
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Gene Expression Heatmap</text>
        {cells.map((cell, i) => (
          <rect key={i} x={60 + cell.c * cellW} y={30 + cell.r * cellH} width={cellW - 0.5} height={cellH - 0.5}
            fill={cell.color} opacity={cell.opacity} rx={1} />
        ))}
        <text x={30} y={h - 15} textAnchor="middle" style={{ fontSize: xAxisFontSize, fill: '#555' }}>Samples ?</text>
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Genes ?</text>
      </svg>
    )
  }

  // ====== ??? ======
  if (chartId === 'bubble') {
    const data = Array.from({ length: 30 }, (_, i) => ({
      x: Math.round((seededRandom(i * 0.1) * 10 - 5) * 100) / 100,
      y: Math.round((seededRandom(i * 0.1 + 50) * 8 - 4) * 100) / 100,
      z: Math.round((50 + seededRandom(i * 0.1 + 100) * 450)),
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


  // ====== ???(??) ======
  if (chartId === 'volcano') {
    const data = Array.from({ length: 200 }, (_, i) => {
      const fc = (seededRandom(i * 0.05) - 0.5) * 6
      const pv = -Math.log10(seededRandom(i * 0.05 + 100) * 0.05 + 1e-10)
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

  // ====== K-means?? ======
  if (chartId === 'kmeans') {
    const centers = [[2, 3], [-1, 1], [0, -2], [3, -1]]
    const data = centers.flatMap((c, ci) => 
      Array.from({ length: 40 }, (_, i) => ({
        x: Math.round((c[0] + (seededRandom(i * 0.1 + ci * 100) - 0.5) * 2) * 100) / 100,
        y: Math.round((c[1] + (seededRandom(i * 0.1 + ci * 100 + 50) - 0.5) * 2) * 100) / 100,
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

  // ====== UMAP?? ======
  if (chartId === 'umap') {
    const centers = [[-2, 2], [2, 2], [0, -1], [-1, -3], [3, -2], [1, 3]]
    const data = centers.flatMap((c, ci) =>
      Array.from({ length: 35 }, (_, i) => ({
        x: Math.round((c[0] + (seededRandom(i * 0.1 + ci * 100) - 0.5) * 3) * 100) / 100,
        y: Math.round((c[1] + (seededRandom(i * 0.1 + ci * 100 + 50) - 0.5) * 3) * 100) / 100,
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

  // ====== ???? ======
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

  // ====== ROC?? ======
  if (chartId === 'roc') {
    const makeROC = (seed: number, auc: number) =>
      Array.from({ length: 50 }, (_, i) => ({
        x: Math.round((i / 49) * 100) / 100,
        y: Math.round(Math.min(1, Math.pow(i / 49, 0.5 + (auc - 0.5) * 2) + (seededRandom(i * 0.1 + seed) - 0.5) * 0.05) * 100) / 100,
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

  // ====== ??? ======
  if (chartId === 'waterfall') {
    const data = Array.from({ length: 30 }, (_, i) => {
      const val = Math.round((seededRandom(i * 0.3) * 60 - 25) * 10) / 10
      return { x: `P${i + 1}`, val, color: val > 0 ? C[0] : C[1] }
    }).reduce<Array<{ x: string; val: number; prev: number; cum: number; color: string }>>((acc, item, i) => {
      const prev = i === 0 ? 0 : acc[i - 1].cum
      const cum = Math.round((prev + item.val) * 10) / 10
      acc.push({ ...item, prev, cum })
      return acc
    }, [])
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

  // ====== ??? ======
  if (chartId === 'network') {
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: seededRandom(i * 0.5) * 500 + 50, y: seededRandom(i * 0.5 + 100) * 300 + 30,
      r: 8 + seededRandom(i * 0.5 + 200) * 12, color: C[i % 5], label: `G${i + 1}`
    }))
    const edges = []
    for (let i = 0; i < 20; i++) for (let j = i + 1; j < 20; j++) if (seededRandom(i * j * 0.1) < 0.12) edges.push([i, j])
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

  // ====== ???? ======
  if (chartId === 'manhattan') {
    const chromSizes = Array.from({ length: 22 }, (_, chrom) => 20 + Math.floor(seededRandom(chrom * 10) * 30))
    const chromOffsets = chromSizes.reduce<number[]>((acc, _size, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + chromSizes[i - 1]); return acc }, [])
    const chromData = Array.from({ length: 22 }, (_, chrom) => {
      const off = chromOffsets[chrom]
      return Array.from({ length: chromSizes[chrom] }, (_, i) => ({
        x: off + i, y: chrom === 4 || chrom === 11 || chrom === 16 ? 8 + seededRandom(i * 0.5 + chrom) * 20 : seededRandom(i * 0.5 + chrom) * 6,
        chrom, sig: chrom === 4 || chrom === 11 || chrom === 16
      }))
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

  // ====== QQ? ======
  if (chartId === 'qqplot') {
    const n = 100
    const data = Array.from({ length: n }, (_, i) => ({
      x: Math.round(-Math.log10((i + 0.5) / n) * 100) / 100,
      y: Math.round(-Math.log10(seededRandom(i * 0.1) * (i < 10 ? 0.001 : 0.3) + 1e-10) * 100) / 100,
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

  // ====== ??? ======
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

  // ====== ??? ======
  if (chartId === 'sunburst') {
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
      const subTotal = subs.reduce((sum, _, i) => sum + (0.3 + seededRandom(si * 100 + i * 30) * 0.7), 0)
      let subStart = startAngle
      subs.forEach((sub, ssi) => {
        const subVal = (0.3 + seededRandom(si * 100 + ssi * 30) * 0.7) / subTotal
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
        <text x={cx} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Cell Type Composition</text>
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

  // ====== ???? ======
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

  // ====== ???(????) ======
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

  // ====== KEGG??? ======
  if (chartId === 'kegg-pathway') {
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
      { id: 'TCA2', label: 'a-KG', x: 440, y: h * 0.65, r: 18, color: C[6 % C.length] },
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
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Glycolysis / Gluconeogenesis Pathway</text>
        {/* Edges */}
        {pathwayEdges.map(([a, b], i) => (
          <g key={i}>
            <line x1={nodeMap[a].x} y1={nodeMap[a].y} x2={nodeMap[b].x} y2={nodeMap[b].y}
              stroke={seededRandom(i * 10) > 0.7 ? '#e74c3c' : seededRandom(i * 10) < 0.3 ? '#3498db' : '#95a5a6'}
              strokeWidth={seededRandom(i * 10) > 0.7 || seededRandom(i * 10) < 0.3 ? 2.5 : 1.5} opacity={0.7} />
            {/* Arrow */}
            {(() => {
              const nx = nodeMap[b].x, ny = nodeMap[b].y, ox = nodeMap[a].x, oy = nodeMap[a].y
              const angle = Math.atan2(ny - oy, nx - ox)
              const arrLen = 8
              const arrX = nx - nodeMap[b].r * Math.cos(angle), arrY = ny - nodeMap[b].r * Math.sin(angle)
              return <polygon points={`${arrX},${arrY} ${arrX - arrLen * Math.cos(angle - 0.4)},${arrY - arrLen * Math.sin(angle - 0.4)} ${arrX - arrLen * Math.cos(angle + 0.4)},${arrY - arrLen * Math.sin(angle + 0.4)}`}
                fill={seededRandom(i * 10) > 0.7 ? '#e74c3c' : '#95a5a6'} />
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

  // ====== GSEA??? ======
  if (chartId === 'gsea') {
    const gseaN = 200
    const data = Array.from({ length: gseaN }, (_, i) => {
      const step = seededRandom(i * 0.05) < 0.35 ? 0.8 : -0.3
      return { x: i, step }
    }).reduce<Array<{ x: number; y: number }>>((acc, item, i) => {
      const prev = i === 0 ? 0 : acc[i - 1].y * 50
      const running = prev + item.step
      acc.push({ x: item.x, y: Math.round(Math.max(-0.3, Math.min(0.6, running / 50)) * 100) / 100 })
      return acc
    }, [])
    const hits = Array.from({ length: 30 }, (_, i) => ({ x: Math.floor(seededRandom(i * 0.3) * gseaN), y: -0.25 }))
    return (
      <ResponsiveContainer width={w} height={h}>
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" dataKey="x" domain={[0, gseaN]} tick={xTickProps} label={{ ...xLabelProps, value: 'Gene Rank' }} />
          <YAxis type="number" dataKey="y" domain={[-0.35, 0.7]} tick={yTickProps} label={{ ...yLabelProps, value: 'Running ES' }} />
          <Tooltip /><Legend {...legendProps} />
          <Area data={data} dataKey="y" name="Enrichment Score" fill={C[0]} fillOpacity={0.5} stroke={C[0]} strokeWidth={2} />
          <Scatter data={hits} dataKey="y" name="Leading Edge" fill={C[1]} shape="triangle" r={3} />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  // ====== GO????? ======
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
            shape={(props: unknown) => {
              const p = props as Record<string, unknown>
              const payload = p?.payload as Record<string, number> | undefined
              const r = Math.sqrt(payload?.z || 100) * 1.5
              return <circle cx={p.cx as number} cy={p.cy as number} r={r} fill={C[0]} opacity={0.7} />
            }} />
        </ReScatterChart>
      </ResponsiveContainer>
    )
  }

  // ====== ????? ======
  if (chartId === 'correlation') {
    const n = 10
    const cellW = (w - 80) / n, cellH = (h - 80) / n
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {Array.from({ length: n }, (_, r) =>
          Array.from({ length: n }, (_, c) => {
            const v = r === c ? 1 : Math.round((seededRandom(r * n + c) * 2 - 1) * 100) / 100
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

  // ====== CNV? ======
  if (chartId === 'cnv') {
    const segs = Array.from({ length: 100 }, (_, i) => ({
      x: i, y: Math.round(((seededRandom(i * 0.3) > 0.75 ? 0.6 : seededRandom(i * 0.3) < 0.25 ? -0.6 : 0) + seededRandom(i * 0.1) * 0.2) * 100) / 100
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

  // ====== WGCNA??-????? ======
  if (chartId === 'wgcna') {
    const traits = ['Age', 'Gender', 'BMI', 'Disease', 'Treatment']
    const modules = ['Turquoise', 'Blue', 'Brown', 'Yellow', 'Green']
    const corrData: number[][] = modules.map((_, mi) =>
      traits.map((_, ti) => Math.round((seededRandom(mi * 50 + ti * 30) * 2 - 1) * 100) / 100)
    )
    const cellW = (w - 120) / traits.length, cellH = (h - 80) / modules.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Module-Trait Correlation</text>
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

  // ====== ???? ======
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

  // ====== Oncoplot??? ======
  if (chartId === 'oncoplot') {
    const genes = ['TP53', 'KRAS', 'EGFR', 'PIK3CA', 'PTEN', 'BRAF', 'AKT1', 'MYC']
    const samples = Array.from({ length: 20 }, (_, i) => `S${i + 1}`)
    const cellW = (w - 80) / samples.length, cellH = (h - 60) / genes.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {genes.map((_, gi) =>
          samples.map((_, si) => {
            const v = seededRandom(gi * 20 + si * 0.5)
            const color = v > 0.7 ? C[0] : v > 0.5 ? C[1] : v > 0.3 ? C[2] : '#f5f5f5'
            return <rect key={`${gi}-${si}`} x={60 + si * cellW} y={30 + gi * cellH} width={cellW - 0.5} height={cellH - 0.5} fill={color} rx={1} />
          })
        )}
        {genes.map((g, i) => (
          <text key={i} x={45} y={30 + i * cellH + cellH / 2 + 4} textAnchor="end" style={{ fontSize: tickFontSize, fill: '#555' }}>{g}</text>
        ))}
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Mutation Landscape</text>
      </svg>
    )
  }

  // ====== ????? ======
  if (chartId === 'phylogenetic') {
    const labels = ['Human', 'Chimp', 'Gorilla', 'Orangutan', 'Macaque', 'Mouse', 'Rat', 'Dog', 'Cat', 'Cow']
    const yStep = (h - 80) / labels.length
    return (
      <svg width={w} height={h} style={{ maxWidth: '100%' }}>
        {labels.map((l, i) => (
          <g key={i}>
            <line x1={50} y1={40 + i * yStep} x2={50 + seededRandom(i * 10) * (w - 200)} y2={40 + i * yStep} stroke={C[i % C.length]} strokeWidth={2} />
            <circle cx={50 + seededRandom(i * 10) * (w - 200)} cy={40 + i * yStep} r={4} fill={C[i % C.length]} />
            <text x={60 + seededRandom(i * 10) * (w - 200)} y={40 + i * yStep + 4} style={{ fontSize: tickFontSize, fill: '#333' }}>{l}</text>
          </g>
        ))}
        <line x1={50} y1={40} x2={50} y2={40 + (labels.length - 1) * yStep} stroke="#999" strokeWidth={1} />
        <text x={15} y={h / 2} textAnchor="middle" transform={`rotate(-90, 15, ${h / 2})`} style={{ fontSize: yAxisFontSize, fill: '#555' }}>Evolutionary Distance</text>
      </svg>
    )
  }

  // ====== ????? ======
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

  // ====== ????? ======
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
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Alternative Splicing Events</text>
      </svg>
    )
  }

  // ====== ?????? ======
  if (chartId === 'methylation') {
    const data = Array.from({ length: 20 }, (_, i) => ({
      x: `CpG${i + 1}`,
      normal: Math.round(seededRandom(i * 0.3) * 40 + 20),
      tumor: Math.round(seededRandom(i * 0.3 + 50) * 50 + 40),
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

  // ====== ATAC-seq??? ======
  if (chartId === 'atacseq') {
    const data = Array.from({ length: 100 }, (_, i) => ({
      x: i,
      s1: Math.round((seededRandom(i * 0.2) * 30 + (i > 30 && i < 40 ? 40 : 0) + (i > 60 && i < 75 ? 35 : 0)) * 10) / 10,
      s2: Math.round((seededRandom(i * 0.2 + 50) * 25 + (i > 35 && i < 45 ? 35 : 0) + (i > 55 && i < 70 ? 30 : 0)) * 10) / 10,
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

  // ====== ????? ======
  if (chartId === 'alignment') {
    const bases = ['A', 'T', 'G', 'C']
    const ref = Array.from({ length: 30 }, (_, i) => bases[Math.floor(seededRandom(i * 0.1) * 4)])
    const seqs = [ref, ...Array.from({ length: 4 }, (_, si) => ref.map((b, i) => seededRandom(i * 0.1 + si * 100) < 0.15 ? bases[Math.floor(seededRandom(i * 0.1 + si * 100 + 50) * 4)] : b))]
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
        <text x={w / 2} y={20} textAnchor="middle" style={{ fontSize: titleFontSize, fontWeight: 'bold', fill: THEME_COLORS.primary }}>Sequence Alignment</text>
      </svg>
    )
  }

  // ====== ??:?????? ======
  return (
    <ResponsiveContainer width={w} height={h}>
      <LineChart data={DEMO_LINE_DATA}>
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
  const { t } = useTranslation('visualization')
  const { t: tc } = useTranslation('common')
  const [selectedChart, setSelectedChart] = useState(CHART_TYPES[0])
  const [dataInput, setDataInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // ???? - ??????
  const [paletteIdx, setPaletteIdx] = useState(0)
  // ????:???X??Y??????? ????
  const [titleFontSize, setTitleFontSize] = useState(14)
  const [xAxisFontSize, setXAxisFontSize] = useState(11)
  const [yAxisFontSize, setYAxisFontSize] = useState(11)
  const [legendFontSize, setLegendFontSize] = useState(10)
  const [tickFontSize, setTickFontSize] = useState(9)
  // ????:X????Y???(????)
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
            <h3 className="font-bold text-primary mb-4 text-sm">{t('sidebar.chartType')}</h3>
            <div className="space-y-1">
              {CHART_TYPES.map(c => (
                <button key={c.id} onClick={() => { setSelectedChart(c); setShowPreview(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedChart.id === c.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {t(`data.${getChartI18nKey(c.id)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Chart preview + data + actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Chart preview - LiveChart ???? */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-primary mb-4" style={{ fontSize: `${titleFontSize}px` }}>{t(`data.${getChartI18nKey(selectedChart.id)}`)}</h3>
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
                <button onClick={() => setSelectedChart(CHART_TYPES[Math.max(0, CHART_TYPES.indexOf(selectedChart) - 1)])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">{tc('action.prev')}</button>
                <button onClick={() => setSelectedChart(CHART_TYPES[Math.min(CHART_TYPES.length - 1, CHART_TYPES.indexOf(selectedChart) + 1)])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">{tc('action.next')}</button>
                <span className="text-sm text-gray-500">{CHART_TYPES.indexOf(selectedChart) + 1} / {CHART_TYPES.length}</span>
              </div>
            </div>

            {/* Data upload */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-primary mb-4 text-sm">{t('upload.title')}</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">{t('upload.dragHint')}</p>
                <p className="text-gray-400 text-xs mb-3">{t('upload.formatHint')}</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-light transition-colors">
                  {tc('action.selectFile')}
                </button>
                <textarea 
                  value={dataInput} 
                  onChange={e => setDataInput(e.target.value)}
                  placeholder={t('upload.pasteHint')}
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4">
              <button onClick={handleGenerate}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>{tc('action.generate')}</span>
              </button>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>{tc('action.exportPng')}</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>{tc('action.exportPdf')}</span>
                </button>
              </div>
            </div>

            {/* Interactive preview */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-primary mb-4 text-sm">{t('preview.title')}</h3>
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
              <h3 className="font-bold text-primary mb-4 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('params.title')}
              </h3>

              {/* ???? */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">{t('params.palette')}</label>
                <div className="space-y-2">
                  {COLOR_PALETTES.map((p, i) => (
                    <button key={p.name} onClick={() => setPaletteIdx(i)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${paletteIdx === i ? 'bg-blue-50 ring-1 ring-primary' : 'hover:bg-gray-50'}`}>
                      <div className="flex space-x-0.5">
                        {p.colors.slice(0, 4).map(c => (
                          <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${paletteIdx === i ? 'text-primary' : 'text-gray-600'}`}>{p.name}</span>
                      {paletteIdx === i && <Check className="w-3 h-3 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* ???? - ????? */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">{t('params.fontSize')}</label>
                <div className="space-y-2">
                  {/* ?? */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.fontLabels.title')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={28} value={titleFontSize}
                        onChange={e => setTitleFontSize(Number(e.target.value))}
                        className="w-16 accent-primary" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{titleFontSize}px</span>
                    </div>
                  </div>
                  {/* X??? */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.fontLabels.xAxis')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={20} value={xAxisFontSize}
                        onChange={e => setXAxisFontSize(Number(e.target.value))}
                        className="w-16 accent-primary" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{xAxisFontSize}px</span>
                    </div>
                  </div>
                  {/* Y??? */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.fontLabels.yAxis')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={20} value={yAxisFontSize}
                        onChange={e => setYAxisFontSize(Number(e.target.value))}
                        className="w-16 accent-primary" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{yAxisFontSize}px</span>
                    </div>
                  </div>
                  {/* ?? */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.fontLabels.legend')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={8} max={18} value={legendFontSize}
                        onChange={e => setLegendFontSize(Number(e.target.value))}
                        className="w-16 accent-primary" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{legendFontSize}px</span>
                    </div>
                  </div>
                  {/* ?? */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.fontLabels.tick')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="range" min={6} max={16} value={tickFontSize}
                        onChange={e => setTickFontSize(Number(e.target.value))}
                        className="w-16 accent-primary" />
                      <span className="text-[10px] text-gray-400 w-8 text-right">{tickFontSize}px</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* ???? - X?/Y??? */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">{t('params.chartSize')}</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.dimensions.xLength')}</span>
                    <div className="flex items-center space-x-2">
                      <input type="number" value={axisXLength}
                        onChange={e => setAxisXLength(Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                        min={200} max={2000} step={50} />
                      <span className="text-[10px] text-gray-400">px</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t('params.dimensions.yLength')}</span>
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
                    { label: t('params.presets.a4Landscape'), x: 600, y: 400 },
                    { label: t('params.presets.a4Portrait'), x: 400, y: 600 },
                    { label: t('params.presets.square'), x: 500, y: 500 },
                    { label: t('params.presets.widescreen'), x: 800, y: 400 },
                  ].map(preset => (
                    <button key={preset.label} 
                      onClick={() => { setAxisXLength(preset.x); setAxisYLength(preset.y) }}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${axisXLength === preset.x && axisYLength === preset.y ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* ?????? */}
              <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t('params.summary.palette')}</span>
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
                  <span className="text-gray-500">{t('params.summary.fontSize')}</span>
                  <span className="font-medium text-gray-700">{titleFontSize}/{xAxisFontSize},{yAxisFontSize}/{legendFontSize}/{tickFontSize}px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t('params.summary.size')}</span>
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



export default ChartToolPage

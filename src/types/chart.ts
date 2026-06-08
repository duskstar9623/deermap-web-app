/** Chart & visualization types */

export interface ChartType {
  id: string
  name: string
  img: string
  description?: string
  tags?: string[]
}

export interface ColorPalette {
  name: string
  colors: string[]
  filter?: string
}

export interface ChartConfig {
  titleFontSize: number
  labelFontSize: number
  axisFontSize: number
  legendFontSize: number
  tickFontSize: number
  axisXLength: number
  axisYLength: number
  paletteIndex: number
}

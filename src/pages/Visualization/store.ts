import { create } from 'zustand';

interface VisualizationState {
  /** Currently selected chart type id */
  selectedChart: string | null
  /** Chart configuration parameters */
  chartParams: Record<string, unknown>
  /** Actions */
  setSelectedChart: (id: string | null) => void
  updateChartParams: (params: Record<string, unknown>) => void
  resetParams: () => void
}

/**
 * Visualization module store.
 * Manages chart selection state, configuration parameters.
 * Persists while app is running (navigating away and back retains state).
 */
export const useVisualizationStore = create<VisualizationState>((set) => ({
  selectedChart: null,
  chartParams: {},
  setSelectedChart: (id) => set({ selectedChart: id }),
  updateChartParams: (params) =>
    set((state) => ({ chartParams: { ...state.chartParams, ...params } })),
  resetParams: () => set({ selectedChart: null, chartParams: {} }),
}));

import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'
import { AuthProvider } from './AuthProvider'

/**
 * Composes all global providers in correct nesting order.
 * Add new providers here to keep App.tsx clean.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

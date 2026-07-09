import ThemeProvider from './ThemeProvider';
import I18nProvider from './I18nProvider';
// import AuthProvider from './AuthProvider';

import type { ComponentType, ReactNode } from 'react';

type AppProvider = ComponentType<{ children: ReactNode }>;

// Order matters: reduceRight preserves Theme -> I18n -> Auth nesting
const providers: AppProvider[] = [
  ThemeProvider,
  I18nProvider,
  // AuthProvider
];

/**
 * Composes all global providers in correct nesting order.
 * Add new providers here to keep App.tsx clean.
 */
const AppProviders = ({ children }: { children: ReactNode }) => {
  return providers.reduceRight(
    (content, Provider) => <Provider>{content}</Provider>,
    children
  );
};

export default AppProviders;

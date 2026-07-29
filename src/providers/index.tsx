import ThemeProvider from './ThemeProvider';
import I18nProvider from './I18nProvider';
// import AuthProvider from './AuthProvider';

import type { ComponentType, ReactNode } from 'react';

type AppProvider = ComponentType<{ children: ReactNode }>;

// Strict provider loading order Theme -> I18n -> Auth
const providers: AppProvider[] = [
  ThemeProvider,
  I18nProvider,
  // AuthProvider
];

/**
 * Composes all global providers in correct nesting order.
 * Add new providers in `providers` in right order.
 */
const AppProviders = ({ children }: { children: ReactNode }) => {
  return providers.reduceRight(
    (content, Provider) => <Provider>{content}</Provider>,
    children
  );
};

export default AppProviders;

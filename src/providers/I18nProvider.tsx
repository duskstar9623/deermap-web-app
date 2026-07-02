import { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

/**
 * Wraps the app with react-i18next's I18nextProvider.
 * Language initialisation is handled once in main.tsx (initializeI18n),
 * so this provider only wires up the i18n instance to the React tree.
 */
const I18nProvider = ({ children }: { children: ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;

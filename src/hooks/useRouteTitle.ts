import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { DEFAULT_LANGUAGE_NAMESPACE } from '@/constants/const';
import { useRouteHandle } from '@/router/utils/useRouteHandle';
import { useI18n } from './useI18n';

function resolveTitle(i18nInstance: typeof i18n, titleKey?: string): string {
  if (!titleKey) {
    return i18nInstance.t('brand.titleSuffix');
  }

  const separatorIndex = titleKey.indexOf(':');
  if (separatorIndex > 0) {
    const ns = titleKey.slice(0, separatorIndex);
    const key = titleKey.slice(separatorIndex + 1);
    return i18nInstance.t(key, { ns, defaultValue: i18nInstance.t(titleKey, { ns: DEFAULT_LANGUAGE_NAMESPACE, defaultValue: titleKey }) });
  }

  return i18nInstance.t(titleKey, { ns: DEFAULT_LANGUAGE_NAMESPACE, defaultValue: titleKey });
}

/**
 * Updates `document.title` based on the current route's `handle.title`.
 *
 * The title key is translated through the global i18n instance and joined with
 * the site name using the format `{pageTitle} - {siteName}`. The hook re-runs
 * when the resolved language changes so that switching language updates the
 * browser tab title immediately.
 */
export function useRouteTitle() {
  // Subscribe to i18n changes; the hook re-renders when language is switched.
  const { i18n } = useTranslation();
  const { currentLanguage } = useI18n();
  const { title } = useRouteHandle();

  useEffect(() => {
    const siteName = i18n.t('brand.titleSuffix');
    const pageTitle = resolveTitle(i18n, title);
    document.title = title ? `${pageTitle} - ${siteName}` : siteName;
  }, [title, currentLanguage, i18n]);
}

import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/shared/Icon';
import { LANGUAGE_NAMESPACES } from '@/constants/const';
import Button from '@/components/shared/Button';

/**
 * Route-level error boundary.
 *
 * Catches rendering errors, lazy-load failures and other route-level errors
 * surfaced by React Router via `useRouteError()`. Presents a friendly fallback
 * UI and a reload action instead of leaving the user with a blank screen.
 */
export default function RouteErrorBoundary() {
  const error = useRouteError();
  const { t, i18n } = useTranslation(LANGUAGE_NAMESPACES.ERRORS);

  const message = error instanceof Error ? error.message : String(error);
  const pageTitle = t('boundary.title');
  const siteName = i18n.t('brand.titleSuffix');

  useEffect(() => {
    document.title = `${pageTitle} - ${siteName}`;
  }, [pageTitle, siteName]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <Icon name="report" size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">
          {pageTitle}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('boundary.description')}
        </p>
        {import.meta.env.DEV && (
          <pre className="text-left text-xs text-red-600 bg-red-50 rounded-lg p-4 mb-6 overflow-auto">
            {message}
          </pre>
        )}
        <Button
          onClick={() => window.location.reload()}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          <Icon name="techSupport" size={16} />
          <span>{t('boundary.reload')}</span>
        </Button>
      </div>
    </div>
  );
}

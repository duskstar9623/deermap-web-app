import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import ROUTES from '@/router/paths';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

function NotFoundPage() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.ERRORS);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-primary mb-4">
          {t('notFound.title')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('notFound.description')}
        </p>
        <Link
          to={ROUTES.Home}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{t('notFound.backHome')}</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

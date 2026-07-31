import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '@/components/shared/Icon';
import ROUTES from '@/router/paths';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

function NotFoundPage() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.ERRORS);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-primary mb-4">
          {t('404.title')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('404.description')}
        </p>
        <Link
          to={ROUTES.Home}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          <Icon name="home" size={16} />
          <span>{t('404.backHome')}</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

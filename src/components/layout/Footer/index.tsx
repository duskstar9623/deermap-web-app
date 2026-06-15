import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '@/assets/icons';
import { ROUTES } from '@/router/routes';

function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="w-6 h-6" />
              <span className="text-lg font-bold">{t('brand.name')}</span>
            </div>
            <p className="text-white/60 text-sm">{t('footer.description')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to={ROUTES.services} className="hover:text-white">{t('nav.services')}</Link></li>
              <li><Link to={ROUTES.visualization} className="hover:text-white">{t('nav.visualization')}</Link></li>
              <li><Link to={ROUTES.multiomics} className="hover:text-white">{t('nav.multiomics')}</Link></li>
              <li><Link to={ROUTES.academic} className="hover:text-white">{t('nav.academic')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to={ROUTES.chartTool} className="hover:text-white">{t('footer.chartTool')}</Link></li>
              <li><Link to={ROUTES.pricing} className="hover:text-white">{t('footer.pricingPlan')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>{t('footer.email')}</li>
              <li>{t('footer.phone')}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
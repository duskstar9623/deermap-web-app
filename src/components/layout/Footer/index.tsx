import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '@/assets/icons';
import ROUTES from '@/router/paths';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

function Footer() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex gap-16 xl:gap-24">

          {/* Left: brand identity + legal */}
          <div className="w-[38%] flex-shrink-0 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <Logo className="w-7 h-7 text-primary-light" />
              <span className="text-xl font-bold tracking-wide">{t('brand.name')}</span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed mb-3">
              {t('footer.description')}
            </p>
            <p className="text-xs text-white/30 leading-relaxed italic">
              {t('footer.tagline')}
            </p>

            <div className="mt-auto pt-10">
              <div className="border-t border-white/[0.08] pt-5 space-y-2.5">
                <p className="text-xs text-white/35">
                  Copyright &copy; 2024–{year} {t('brand.name')}. {t('footer.rights')}
                </p>
                <p className="text-xs text-white/25 leading-relaxed">
                  {t('footer.reprint')}
                </p>
                <div className="flex items-center gap-2.5 pt-0.5">
                  <a href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors">{t('footer.terms')}</a>
                  <span className="text-white/15">·</span>
                  <a href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors">{t('footer.privacy')}</a>
                  <span className="text-white/15">·</span>
                  <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-white/25 hover:text-white/45 transition-colors">
                    {t('footer.icp')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-white/[0.07] flex-shrink-0 self-stretch" />

          {/* Right: nav columns */}
          <div className="flex-1 grid grid-cols-3 gap-8 pt-1">
            <div>
              <h4 className="text-sm font-semibold text-white/85 mb-4">{t('footer.services')}</h4>
              <ul className="space-y-3 text-sm text-white/45">
                <li><Link to={ROUTES.Bioinformatics} className="hover:text-white/70 transition-colors">{t('nav.services')}</Link></li>
                <li><Link to={ROUTES.Visualization.Root} className="hover:text-white/70 transition-colors">{t('nav.visualization')}</Link></li>
                <li><Link to={ROUTES.Multiomics.Root} className="hover:text-white/70 transition-colors">{t('nav.multiomics')}</Link></li>
                <li><Link to={ROUTES.Academic} className="hover:text-white/70 transition-colors">{t('nav.academic')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/85 mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-3 text-sm text-white/45">
                <li><Link to={ROUTES.Visualization.ChartTool} className="hover:text-white/70 transition-colors">{t('footer.chartTool')}</Link></li>
                <li><Link to={ROUTES.Pricing} className="hover:text-white/70 transition-colors">{t('footer.pricingPlan')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/85 mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-3 text-sm text-white/45">
                <li className="break-all">{t('footer.email')}</li>
                <li>{t('footer.phone')}</li>
                <li><Link to={ROUTES.Contact} className="hover:text-white/70 transition-colors">{t('nav.contact')}</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
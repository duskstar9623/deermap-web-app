import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import ROUTES from '@/router/paths';
import { THEME_COLORS, LANGUAGE_NAMESPACES } from '@/constants/const';

type PlanItem = {
  nameKey: string;
  priceKey: string;
  periodKey: string;
  descKey: string;
  featuresKey: string;
  color: string;
  popular: boolean;
};

const PLANS: PlanItem[] = [
  { nameKey: 'plans.basic.name', priceKey: 'plans.basic.price', periodKey: 'plans.basic.period', descKey: 'plans.basic.desc', featuresKey: 'plans.basic.features', color: THEME_COLORS.primaryLight, popular: false },
  { nameKey: 'plans.pro.name', priceKey: 'plans.pro.price', periodKey: 'plans.pro.period', descKey: 'plans.pro.desc', featuresKey: 'plans.pro.features', color: THEME_COLORS.primary, popular: true },
  { nameKey: 'plans.custom.name', priceKey: 'plans.custom.price', periodKey: 'plans.custom.period', descKey: 'plans.custom.desc', featuresKey: 'plans.custom.features', color: '#6366f1', popular: false },
];

export function PricingPlansSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.PRICING);
  const { t: tc } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL);
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.nameKey}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden${plan.popular ? ' ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {t('badge.popular')}
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold text-primary mb-2">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold" style={{ color: plan.color }}>{t(plan.priceKey)}</span>
                  <span className="text-gray-500 ml-1">{t(plan.periodKey)}</span>
                </div>
                <p className="text-gray-600 mb-6">{t(plan.descKey)}</p>
                <ul className="space-y-3 mb-8">
                  {(t(plan.featuresKey, { returnObjects: true }) as string[]).map(f => (
                    <li key={f} className="flex items-center space-x-3 text-sm text-gray-600">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(ROUTES.Contact)}
                  className="w-full py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: plan.color, color: 'white' }}
                >
                  {tc('action.startConsult')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

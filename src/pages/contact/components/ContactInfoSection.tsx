import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, Globe, MessageSquare } from 'lucide-react';
import { LANGUAGE_NAMESPACES } from '@/constants/const';

export function ContactInfoSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.CONTACT);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold text-primary mb-6">{t('info.title')}</h2>
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">{t('info.phone')}</h4>
            <p className="text-gray-600">{t('info.phoneValue')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">{t('info.email')}</h4>
            <p className="text-gray-600">{t('info.emailValue')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">{t('info.address')}</h4>
            <p className="text-gray-600">{t('info.addressValue')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

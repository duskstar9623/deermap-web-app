import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_NAMESPACES } from '@/constants/const';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';

export function ContactFormSection() {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.CONTACT);
  const { t: tc } = useTranslation(LANGUAGE_NAMESPACES.GLOBAL);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">{t('form.title')}</h2>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('form.name')} type="text" />
          <Input label={t('form.email')} type="email" />
        </div>
        <Input label={t('form.organization')} type="text" />
        <Input label={t('form.content')} type="textarea" rows={4} />
        <Button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          {tc('action.submit')}
        </Button>
      </form>
    </motion.div>
  );
}

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { THEME_COLORS, LANGUAGE_NAMESPACES } from '@/constants/const';
import { ASSETS } from '@/constants/assets';

const WORKFLOW_STEPS: Record<string, { num: string; titleKey: string; descKey: string; img: string }[]> = {
  genomics: [
    { num: '1', titleKey: 'workflow.genomics.steps.0.title', descKey: 'workflow.genomics.steps.0.desc', img: ASSETS.workflowSteps.genomicsStep1 },
    { num: '2', titleKey: 'workflow.genomics.steps.1.title', descKey: 'workflow.genomics.steps.1.desc', img: ASSETS.workflowSteps.genomicsStep2 },
    { num: '3', titleKey: 'workflow.genomics.steps.2.title', descKey: 'workflow.genomics.steps.2.desc', img: ASSETS.workflowSteps.genomicsStep3 },
    { num: '4', titleKey: 'workflow.genomics.steps.3.title', descKey: 'workflow.genomics.steps.3.desc', img: ASSETS.workflowSteps.genomicsStep4 },
    { num: '5', titleKey: 'workflow.genomics.steps.4.title', descKey: 'workflow.genomics.steps.4.desc', img: ASSETS.workflowSteps.genomicsStep5 },
    { num: '6', titleKey: 'workflow.genomics.steps.5.title', descKey: 'workflow.genomics.steps.5.desc', img: ASSETS.workflowSteps.genomicsStep6 },
  ],
  transcriptomics: [
    { num: '1', titleKey: 'workflow.transcriptomics.steps.0.title', descKey: 'workflow.transcriptomics.steps.0.desc', img: ASSETS.workflowSteps.transcriptomicsStep1 },
    { num: '2', titleKey: 'workflow.transcriptomics.steps.1.title', descKey: 'workflow.transcriptomics.steps.1.desc', img: ASSETS.workflowSteps.transcriptomicsStep2 },
    { num: '3', titleKey: 'workflow.transcriptomics.steps.2.title', descKey: 'workflow.transcriptomics.steps.2.desc', img: ASSETS.workflowSteps.transcriptomicsStep3 },
    { num: '4', titleKey: 'workflow.transcriptomics.steps.3.title', descKey: 'workflow.transcriptomics.steps.3.desc', img: ASSETS.workflowSteps.transcriptomicsStep4 },
    { num: '5', titleKey: 'workflow.transcriptomics.steps.4.title', descKey: 'workflow.transcriptomics.steps.4.desc', img: ASSETS.workflowSteps.transcriptomicsStep5 },
    { num: '6', titleKey: 'workflow.transcriptomics.steps.5.title', descKey: 'workflow.transcriptomics.steps.5.desc', img: ASSETS.workflowSteps.transcriptomicsStep6 },
  ],
  proteomics: [
    { num: '1', titleKey: 'workflow.proteomics.steps.0.title', descKey: 'workflow.proteomics.steps.0.desc', img: ASSETS.workflowSteps.proteomicsStep1 },
    { num: '2', titleKey: 'workflow.proteomics.steps.1.title', descKey: 'workflow.proteomics.steps.1.desc', img: ASSETS.workflowSteps.proteomicsStep2 },
    { num: '3', titleKey: 'workflow.proteomics.steps.2.title', descKey: 'workflow.proteomics.steps.2.desc', img: ASSETS.workflowSteps.proteomicsStep3 },
    { num: '4', titleKey: 'workflow.proteomics.steps.3.title', descKey: 'workflow.proteomics.steps.3.desc', img: ASSETS.workflowSteps.proteomicsStep4 },
    { num: '5', titleKey: 'workflow.proteomics.steps.4.title', descKey: 'workflow.proteomics.steps.4.desc', img: ASSETS.workflowSteps.proteomicsStep5 },
    { num: '6', titleKey: 'workflow.proteomics.steps.5.title', descKey: 'workflow.proteomics.steps.5.desc', img: ASSETS.workflowSteps.proteomicsStep6 },
  ],
  metabolomics: [
    { num: '1', titleKey: 'workflow.metabolomics.steps.0.title', descKey: 'workflow.metabolomics.steps.0.desc', img: ASSETS.workflowSteps.metabolomicsStep1 },
    { num: '2', titleKey: 'workflow.metabolomics.steps.1.title', descKey: 'workflow.metabolomics.steps.1.desc', img: ASSETS.workflowSteps.metabolomicsStep2 },
    { num: '3', titleKey: 'workflow.metabolomics.steps.2.title', descKey: 'workflow.metabolomics.steps.2.desc', img: ASSETS.workflowSteps.metabolomicsStep3 },
    { num: '4', titleKey: 'workflow.metabolomics.steps.3.title', descKey: 'workflow.metabolomics.steps.3.desc', img: ASSETS.workflowSteps.metabolomicsStep4 },
    { num: '5', titleKey: 'workflow.metabolomics.steps.4.title', descKey: 'workflow.metabolomics.steps.4.desc', img: ASSETS.workflowSteps.metabolomicsStep5 },
    { num: '6', titleKey: 'workflow.metabolomics.steps.5.title', descKey: 'workflow.metabolomics.steps.5.desc', img: ASSETS.workflowSteps.metabolomicsStep6 },
  ],
};

const OMICS_COLOR: Record<string, string> = {
  genomics: THEME_COLORS.genomics,
  transcriptomics: THEME_COLORS.transcriptomics,
  proteomics: THEME_COLORS.proteomics,
  metabolomics: THEME_COLORS.metabolomics,
};

function WorkflowSection({ omicsKey, subtitle }: { omicsKey: string; subtitle: string }) {
  const { t } = useTranslation(LANGUAGE_NAMESPACES.MULTIOMICS);
  const steps = WORKFLOW_STEPS[omicsKey] || [];
  const color = OMICS_COLOR[omicsKey] || THEME_COLORS.primary;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">{t('detailPage.workflowTitle')}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={step.img} alt={t(step.titleKey)} loading="lazy" decoding="async" width={400} height={128} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 text-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1.5"
                  style={{ backgroundColor: color }}
                >
                  {step.num}
                </div>
                <h4 className="font-bold text-primary text-sm mb-0.5">{t(step.titleKey)}</h4>
                <p className="text-gray-500 text-[11px]">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
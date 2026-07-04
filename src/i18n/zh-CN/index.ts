import { LANGUAGE_NAMESPACES } from '@/constants/const';
import type { LanguageNamespace } from '@/types/common';

import globalData from './Global.json';
import homeData from './Home.json';
import bioinformaticsData from './Bioinformatics.json';
import visualizationData from './Visualization.json';
import multiomicsData from './Multiomics.json';
import academicData from './Academic.json';
import pricingData from './Pricing.json';
import consultingData from './Consulting.json';
import contactData from './Contact.json';
import errorsData from './Errors.json';

const zhCN: Record<LanguageNamespace, object> = {
  [LANGUAGE_NAMESPACES.GLOBAL]: globalData,
  [LANGUAGE_NAMESPACES.HOME]: homeData,
  [LANGUAGE_NAMESPACES.BIOINFORMATICS]: bioinformaticsData,
  [LANGUAGE_NAMESPACES.VISUALIZATION]: visualizationData,
  [LANGUAGE_NAMESPACES.MULTIOMICS]: multiomicsData,
  [LANGUAGE_NAMESPACES.ACADEMIC]: academicData,
  [LANGUAGE_NAMESPACES.PRICING]: pricingData,
  [LANGUAGE_NAMESPACES.CONSULTING]: consultingData,
  [LANGUAGE_NAMESPACES.CONTACT]: contactData,
  [LANGUAGE_NAMESPACES.ERRORS]: errorsData,
};

export default zhCN;

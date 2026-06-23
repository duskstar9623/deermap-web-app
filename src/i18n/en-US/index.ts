import { LanguageNamespace } from '@/types';

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

const enUS: Record<LanguageNamespace, object> = {
  Global: globalData,
  Home: homeData,
  Bioinformatics: bioinformaticsData,
  Visualization: visualizationData,
  Multiomics: multiomicsData,
  Academic: academicData,
  Pricing: pricingData,
  Consulting: consultingData,
  Contact: contactData,
  Errors: errorsData,
};

export default enUS;

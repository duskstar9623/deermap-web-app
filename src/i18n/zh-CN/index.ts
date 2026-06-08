import common from './common.json'
import home from './home.json'
import services from './services.json'
import visualization from './visualization.json'
import multiomics from './multiomics.json'
import academic from './academic.json'
import pricing from './pricing.json'
import industryConsulting from './industry-consulting.json'
import contact from './contact.json'

const zhCN = {
  common,
  home,
  services,
  visualization,
  multiomics,
  academic,
  pricing,
  'industry-consulting': industryConsulting,
  contact,
}

export default zhCN
export type LocaleResources = typeof zhCN

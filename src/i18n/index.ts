import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { 
  LANGUAGES, DEFAULT_LANGUAGE_CODE, DEFAULT_LANGUAGE,
  LANGUAGE_NAMESPACES, DEFAULT_LANGUAGE_NAMESPACE
} from '@/constants/const';
import { LanguageCode, Language } from '@/types';
import { getLanguageCode, getLanguage, saveLanguageCode } from '@/utils/language';
import zhCN from './zh-CN';

// 初始化默认语言
i18n.use(initReactI18next).init({
  resources: {
    [DEFAULT_LANGUAGE]: zhCN,
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: DEFAULT_LANGUAGE_NAMESPACE,
  ns: LANGUAGE_NAMESPACES,
  interpolation: { escapeValue: false },
  react: { useSuspense: true }
});

// 所有非默认语言包资源的懒加载入口
const languageBundles = {
  [LANGUAGES.en]: () => import('./en-US')
};

/************************ Language Feature Actions ************************/

// 懒加载指定语言的整包资源（已加载则跳过）
export async function loadLanguage(language: Language): Promise<void> {
  if (language === DEFAULT_LANGUAGE) return;
  if (i18n.hasResourceBundle(language, DEFAULT_LANGUAGE_NAMESPACE)) return;

  const loader = languageBundles[language];
  const { default: resources } = await loader();
  for (const [ns, bundle] of Object.entries(resources)) {
    i18n.addResourceBundle(language, ns, bundle, false, true);
  }
}

// 统一语言切换入口，加载整包 -> 切换语言 -> 持久化到 localStorage
export async function changeLanguage(languageCode: LanguageCode): Promise<void> {
  const targetLanguage = LANGUAGES[languageCode];
  await loadLanguage(targetLanguage);
  await i18n.changeLanguage(targetLanguage);
  saveLanguageCode(languageCode);
}

// 应用启动时调用，根据用户偏好预加载语言，避免首屏闪烁
export async function initializeI18n(): Promise<void> {
  const savedLanguageCode = getLanguageCode();
  const targetLanguage = getLanguage();

  // 如果用户偏好非默认语言，异步加载后再切换，确保首屏直接显示正确语言
  if (savedLanguageCode !== DEFAULT_LANGUAGE_CODE) {
    await loadLanguage(targetLanguage);
    await i18n.changeLanguage(targetLanguage);
  }
}

/**************************************************************************/

export default i18n;

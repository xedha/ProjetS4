import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  }
};

const i18n = i18next
  .use(LanguageDetector)
  .use(initReactI18next);

i18n.init({
  resources,
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  }
});

export default i18n; 
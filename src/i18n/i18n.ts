import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nb from './nb.json';
import en from './en.json';

const LANGUAGE_KEY = 'blindtest-language';

i18n.use(initReactI18next).init({
  resources: {
    nb: { translation: nb },
    en: { translation: en },
  },
  lng: localStorage.getItem(LANGUAGE_KEY) ?? 'nb',
  fallbackLng: 'nb',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_KEY, lng);
});

export default i18n;

import i18n from 'i18next';
// import * as enLangJson from '../../app/extraResources/locales/en-US.json';

i18n.init({
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    escapeValue: false // not needed for react!!
  },
  resources: {
    en: {}
  }
});

export default i18n;

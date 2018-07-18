import { translate } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-sync-fs-backend';

export const instance = i18n.use(Backend).init({
  lng: 'en',
  initImmediate: false,
  debug: true,
  backend: {
    loadPath: `${__dirname}/locales/{{lng}}.json`
  },
  returnEmptyString: true, // required so when we have a key, but no translation for it, it fallbacks to English
  react: {
    wait: true
  }
});

export const wrapComponent = Element => {
  return translate()(Element);
};

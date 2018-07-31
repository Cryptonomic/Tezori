import { translate } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-sync-fs-backend';
import { remote } from 'electron';
import path from 'path';

export const instance = i18n.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  initImmediate: false,
  debug: true,
  backend: {
    loadPath: () => {
      const filename = `../locales/{{lng}}.json`;
      if (process.env.NODE_ENV === 'production') {
        return path.join(remote.app.getAppPath(), filename);
      }

      return path.join(__dirname, filename);
    }
  },
  returnEmptyString: true, // required so when we have a key, but no translation for it, it fallbacks to English
  react: {
    wait: true
  }
});

export const wrapComponent = Element => {
  return translate()(Element);
};

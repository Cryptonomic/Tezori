import { translate } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-sync-fs-backend';
import { remote } from 'electron';
import path from 'path';

export function createIl8nInstance(local) {
  return i18n.use(Backend).init({
    lng: local,
    fallbackLng: 'en',
    initImmediate: false,
    debug: true,
    backend: {
      loadPath: () => {
        const filename = `../extraResources/locales/{{lng}}.json`;
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
}

export const wrapComponent = Element => {
  return translate()(Element);
};

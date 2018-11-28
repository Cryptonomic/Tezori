import { translate } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-sync-fs-backend';
import { remote } from 'electron';
import path from 'path';
import localesMap, { defaultLanguage } from '../constants/LocalesMap';

export function createIl8nInstance(locale) {
  return i18n.use(Backend).init({
    lng: locale,
    fallbackLng: 'en-US',
    initImmediate: false,
    debug: true,
    backend: {
      loadPath: () => {
        const filename = `extraResources/locales/{{lng}}.json`;
        if (process.env.NODE_ENV === 'production') {
          return path.join(remote.app.getAppPath(), 'dist',filename);
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

export function wrapComponent(Element) {
  return translate()(Element);
}

export function getDefaultLocale() {
  try {
    const locale = remote.app.getLocale();
    const language = locale.substring(0, 2);

    let found = Object.keys(localesMap).find((key) => { return (key === locale || key === langage); });

    return found ? locale : defaultLanguage;
  } catch (err) {
    return defaultLanguage;
  }
}

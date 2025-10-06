import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en.json';
import ar from './translations/ar.json';
import { LANGUAGE_KEY } from '../constants/Variable'; // المسار حسب مشروعك

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
     try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        callback(storedLanguage);
        console.log('storedLanguage',storedLanguage)
      } else {
        callback('ar'); // لغة افتراضية عند أول تشغيل
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
     try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    pluralSeparator: '_',
    keySeparator: '.',
  });

export const changeLanguage = async (language) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;

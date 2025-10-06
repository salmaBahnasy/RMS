// src/utils/languageStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_LANGUAGE_KEY = 'lang';

export const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
  } catch (error) {
    console.log('Error saving language:', error);
  }
};

export const loadLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
    return language;
  } catch (error) {
    console.log('Error loading language:', error);
    return null;
  }
};
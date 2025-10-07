import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import moment from 'moment';
import 'moment/locale/ar-sa';
import momentHijri from 'moment-hijri';

import {
  changePassword,
  getEmpDetails,
  getUserDetails,
} from '../../../constants/ServicesNames';
import { BaseURL } from '../../../constants/BaseUrl';

// locale-bridge.ts
import { NativeModules, Platform } from 'react-native';

export const applyAndroidLocale = langTag => {
  if (Platform.OS === 'android' && NativeModules.LocaleModule) {
    NativeModules.LocaleModule.setAppLocale(langTag); // 'ar' أو 'en-US'
  }
};

const changeLanguage = async (lng, i18n) => {
  try {
    // Change the language in i18n
    await i18n.changeLanguage(lng);
    // Save the selected language to AsyncStorage
    await AsyncStorage.setItem('user-language', lng);
    // Configure RTL if the selected language is Arabic
    const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
    applyAndroidLocale(lang);
    // عادةً AppCompatDelegate بيعمل إعادة إنشاء Activity تلقائيًا.
    // لو ما اتعرّبتش فورًا، اعملي إعادة تشغيل شاشة/Activity أو استخدمي RNRestart.

    if (lng === 'ar') {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
    } else {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};
// ---------------------------------------------------------
const ChangePasswordApi = async (
  currentPassword,
  newPassword,
  newPasswordConfirmation,
) => {
  const User = await AsyncStorage.getItem('userId');
  const userId = JSON.parse(User);
  const url = BaseURL + changePassword;
  const data = {
    currentPassword,
    newPassword,
    newPasswordConfirmation,
    userId,
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
      body: JSON.stringify(data),
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      console.error(
        'Error fetching data:',
        response.status,
        response.statusText,
      );
      const errorData = await response.json();
      console.log(errorData);
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
// ---------------------------------------------------------
const logoutFun = async () => {
  await AsyncStorage.removeItem('userId');
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('empId');
  await AsyncStorage.removeItem('useAuth');
  return true;
};
// const removeAppKeys = async () => {
//   let keys = [];
//   try {
//     keys = await AsyncStorage.getAllKeys();
//     // Filter out email and password keys
//     const filteredKeys = keys.filter(key => key !== 'email' && key !== 'password');
//     console.log(`Keys: ${filteredKeys}`); // Just to see what's going on
//     await AsyncStorage.multiRemove(filteredKeys);
//   } catch (e) {
//     console.log(e);
//   }
//   console.log('Done');
// };
const removeAppKeys = async () => {
  try {
    // 🟢 امسح كل حاجة بما فيها الإيميل والباسورد
    await AsyncStorage.multiRemove([
      'userToken',
      'userId',
      'empId',
      'useAuth',
      'FCM',
      'email',
      'password',
    ]);
    console.log('All keys removed, user completely logged out');
  } catch (e) {
    console.log('Error removing keys:', e);
  }
};

const getDataEmpDetails = async () => {
  const User = await AsyncStorage.getItem('userId');
  const userId = User ? JSON.parse(User) : null;
  const storedEmpId = await AsyncStorage.getItem('empId');
  const empId = storedEmpId ? JSON.parse(storedEmpId) : 0;
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  console.log('userId', userId);
  console.log('empId', empId);

  const url =
    empId === 0
      ? `${BaseURL}${getUserDetails}?id=${userId}`
      : `${BaseURL}${getEmpDetails}?id=${empId}`;

  console.log('Fetching from:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log('Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      console.error(
        'Error fetching data:',
        response.status,
        response.statusText,
      );
      const errorData = await response.json();
      console.log('Error Details:', errorData);
      return errorData;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.message || 'Unknown error';
  }
};

const formatDateHijri = date => {
  moment.locale(I18nManager.isRTL ? 'ar-sa' : 'en');
  return momentHijri(date).format('iDD iMMMM iYYYY');
};

const formatDate = date => {
  moment.locale(I18nManager.isRTL ? 'ar-sa' : 'en');
  return moment(date).format('DD MMMM YYYY');
};

const formatDayName = date => {
  moment.locale(I18nManager.isRTL ? 'ar-sa' : 'en');
  return moment(date).format('dddd');
};

export {
  changeLanguage,
  ChangePasswordApi,
  logoutFun,
  getDataEmpDetails,
  removeAppKeys,
  formatDate,
  formatDayName,
  formatDateHijri,
};

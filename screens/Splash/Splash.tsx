import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  I18nManager,
  PermissionsAndroid,
  Platform,
  Alert,
  DevSettings,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { StackNavigationProp } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_KEY } from '../../constants/Variable'; 
import images from '../../constants/images';
import { COLORS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import { isTokenExpired } from './services';
import { biometricAuth } from '../Login/services/services';
import { applyAndroidLocale } from '../Profile/Services/services';

interface SplashScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'SplashScreen'>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(200)).current;
  const { i18n } = useTranslation();

  useEffect(() => {
    requestNotificationPermission();
    requestFCMToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('رسالة جديدة', JSON.stringify(remoteMessage.notification));
    });
    return unsubscribe;
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      }
    }
  };

  const requestFCMToken = async () => {
    try {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      await AsyncStorage.setItem('FCM', token);
    } catch (err) {
      console.log('FCM error:', err);
    }
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setAppDirection();
    routeFunction();
  }, [slideAnim]);

  const biometric = async (): Promise<boolean> => {
    try {
      const result = await biometricAuth();
      console.log('Biometric result...', result);

      if (result === 'successful biometrics provided') {
        return true;
      }

      if (result === 'Biometrics not supported') {
        return true; // ✅ الجهاز مش بيدعمها → هيدخل لو التوكن صالح
      }

      if (result === 'user cancelled biometric prompt') {
        Alert.alert('تم الإلغاء', 'تم إلغاء التحقق بالبصمة.');
        return false;
      }

      if (result === 'biometrics failed') {
        Alert.alert('خطأ', 'فشل التحقق بالبصمة.');
        return false;
      }

      // Handle any unexpected result
      console.warn('Unexpected biometric result:', result);
      Alert.alert('خطأ', 'حدث خطأ غير متوقع في التحقق بالبصمة.');
      return false;
    } catch (error) {
      console.error('Error in biometric function:', error);
      Alert.alert('خطأ', 'حدث خطأ في التحقق بالبصمة.');
      return false;
    }
  };

// const setAppDirection = async () => {
//   const isRtl = I18nManager?.isRTL;
//   console.log('Is RTL: ', isRtl);

//   await AsyncStorage.getItem('user-language').then(async (language) => {
//     console.log("language", language);

//     if (language) {
//       if (language === 'ar') {
//         await i18n.changeLanguage('ar');
//         if (!isRtl) {

//           I18nManager.forceRTL(true);
//           I18nManager.allowRTL(true);
//           RNRestart.Restart();
//         }
//       } else if (language === 'en') {
//         await i18n.changeLanguage('en');
//         if (isRtl) {
//           I18nManager.forceRTL(false);
//           I18nManager.allowRTL(false);
//           RNRestart.Restart();
//         }
//       }
//     } else {
//       // أول مرة → نخليه إنجليزي افتراضي
//       await AsyncStorage.setItem('user-language', 'ar');
//       await i18n.changeLanguage('ar');
//       if (isRtl) {
//         I18nManager.forceRTL(false);
//         I18nManager.allowRTL(false);
//         RNRestart.Restart();
//       }
//     }
//   });
// };

 const setAppDirection = async () => {
  try {
    const isRtl = I18nManager.isRTL;
    console.log('Is RTL: ', isRtl);

    let language = await AsyncStorage.getItem(LANGUAGE_KEY);
    console.log('language:', language);
    applyAndroidLocale(language);


    // لو أول مرة يفتح التطبيق
    if (!language) {
      language = 'ar'; // خليها اللغة الافتراضية اللي انت عايزها
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      console.log('LANGUAGE_KEY ' , language)
    }

    await i18n.changeLanguage(language);

    if (language === 'ar' && !isRtl) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
       console.log('languageAr', language)
      RNRestart.Restart();
    } else if (language === 'en' && isRtl) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
       console.log('languageEn', language)
      RNRestart.Restart();
    }
  } catch (error) {
    console.error('Error setting app direction:', error);
  }
};


  const routeFunction = () => {
    setTimeout(async () => {
      const token = await AsyncStorage.getItem('userToken');
      const isExpired = await isTokenExpired();

      if (!token || isExpired) {
        console.log('🔴 مفيش توكن أو منتهي → Login');
        navigation.replace('Login');
        return;
      }

      // ✅ فيه توكن صالح
      const isBioEnabled = await AsyncStorage.getItem('useAuth');
      if (isBioEnabled === 'true') {
        const bioSuccess = await biometric();
        console.log("bioSuccess",bioSuccess)
        if (bioSuccess) {
          console.log('✅ توكن صالح والبصمة تمام → Home');
          navigation.replace('Home');
        } else {
          console.log('❌ biometric → Login');
          navigation.replace('Home');
        }
      } else {
        console.log('✅ توكن صالح والبصمة مش مفعلة → Home');
        navigation.replace('Home');
      }
    }, 3000);
  };
   

  return (
    <View style={styles.container}>
      <StatusBar  hidden = {true}/>
      <ImageBackground source={images.splash} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;

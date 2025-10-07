import React, {useEffect} from 'react'; // استيراد React
import {NavigationContainer} from '@react-navigation/native'; // مكتبة التنقل
import {createNativeStackNavigator} from '@react-navigation/native-stack'; // مكدس التنقل
import {I18nextProvider} from 'react-i18next'; // دعم الترجمة
import {SafeAreaProvider} from 'react-native-safe-area-context'; // إدارة المناطق الآمنة
import messaging from '@react-native-firebase/messaging';
//.................................................................
import i18n from './localization/i18n'; // إعداد الترجمة
import Navigation from './navigation/navigation'; // ملف التنقل الخاص بك
import {Alert, StatusBar} from 'react-native';
import { registerTranslation, en, ar } from 'react-native-paper-dates';
registerTranslation('en', en);
registerTranslation('ar', ar);


function App(): JSX.Element {
  useEffect(() => {
    console.log('✅ App loaded');
  }, []);
  // useEffect(() => {
  //   // طلب الإذن
  //   messaging().requestPermission().then(authStatus => {
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   });

  //   // الحصول على التوكن
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('FCM Token:', token);
  //       // احفظي التوكن في السيرفر أو استخدميه في الاختبار
  //     });

  //   // استقبال الرسائل أثناء تشغيل التطبيق
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('رسالة جديدة', JSON.stringify(remoteMessage.notification));
  //   });

  //   return unsubscribe;
  // }, []);
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
          translucent={false}
        />
        <Navigation />
      </SafeAreaProvider>
    </I18nextProvider>
  );
}

export default App;

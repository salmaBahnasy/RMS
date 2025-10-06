import { useEffect, useState } from 'react';
import { Alert, AppState, BackHandler, I18nManager, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useFakeLocationDetection() {
  const [isFake, setIsFake] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);

  useEffect(() => {
    const checkStoredFakeFlag = async () => {
      const isBlocked = await AsyncStorage.getItem('isBlocked');
      if (isBlocked === 'true') {
        showAlertAndExit(
          getMessage('🚫 تم منع الدخول', 'Fake location previously detected. App will now exit.'),
          getMessage('تم اكتشاف استخدام موقع مزيف سابقاً. سيتم الخروج الآن.', 'You have previously used a fake location.')
        );
        setIsFake(true);
      }
    };

    const handleFakeDetection = async (messageAr, messageEn) => {
      const alreadyBlocked = await AsyncStorage.getItem('isBlocked');
      if (alreadyBlocked === 'true') return; // منع التكرار
      await AsyncStorage.setItem('isBlocked', 'true');
      setIsFake(true);
      showAlertAndExit(messageAr, messageEn);
    };

    const showAlertAndExit = (messageAr, messageEn) => {
      Alert.alert(
        getMessage('تحذير', 'Warning'),
        getMessage(messageAr, messageEn),
        [{ text: getMessage('موافق', 'OK'), onPress: () => BackHandler.exitApp() }],
        { cancelable: false }
      );
    };

    const checkFakeLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy, speed, timestamp } = position.coords;

          // 🌍 كشف إحداثيات غير منطقية
          if (latitude === 0 && longitude === 0) {
            handleFakeDetection(
              'تم اكتشاف إحداثيات غير منطقية (0,0).',
              'Invalid coordinates (0,0) detected.'
            );
            return;
          }

          // 🍏 تحسين iOS
          if (Platform.OS === 'ios') {
            if (accuracy <= 1) { // الدقة أقل من 1 متر غير منطقية
              handleFakeDetection(
                'دقة الموقع غير طبيعية جدًا، قد يكون الموقع مزيفًا!',
                'Unrealistic location accuracy detected.'
              );
              return;
            }

            if (speed && speed > 300) { // سرعة عالية جدًا
              handleFakeDetection(
                'تم اكتشاف سرعة غير طبيعية تشير إلى موقع مزيف.',
                'Unrealistic speed detected, indicating fake location.'
              );
              return;
            }
          }

          // كشف التنقل المفاجئ لكلا النظامين
          if (lastPosition) {
            const distance = getDistanceFromLatLonInKm(
              lastPosition.latitude,
              lastPosition.longitude,
              latitude,
              longitude
            );
            const timeDiffHours = (timestamp - lastPosition.timestamp) / 3600000;
            const calculatedSpeed = distance / (timeDiffHours || 1 / 3600);
            if (calculatedSpeed > 500) { // سرعة غير منطقية
              handleFakeDetection(
                'الكشف عن تنقل غير منطقي! قد يكون الموقع مزيفًا.',
                'Unrealistic movement detected, indicating fake location.'
              );
              return;
            }
          }

          setLastPosition({ latitude, longitude, timestamp });
          setIsFake(false);
        },
        error => {
          console.warn(error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const deg2rad = deg => deg * (Math.PI / 180);

    const getMessage = (ar, en) => I18nManager.isRTL ? ar : en;

    checkStoredFakeFlag();
    checkFakeLocation();

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkFakeLocation();
      }
    });

    return () => {
      appStateSub.remove();
    };
  }, []);

  return isFake;
}

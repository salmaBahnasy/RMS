// LocationService.js

import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

const requestLocationPermission = async () => {
  const platformSpecificValue = Platform.select({
    ios: 'ios',
    android: 'android',
    default: 'Default value'
  });
  
  console.log("platformSpecificValue",platformSpecificValue);
  if (platformSpecificValue === 'ios') {
    const auth = await Geolocation.requestAuthorization('always');
    return auth === 'granted';
  } else if (platformSpecificValue === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs access to your location to track your position.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
};

const startTrackingLocation = (onLocationUpdate, onError) => {
  Geolocation.watchPosition(
    position => {
      onLocationUpdate(position);
    },
    error => {
      if (onError) {
        onError(error);
      }
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 0,
      interval: 10000, // Update every 10 seconds
      fastestInterval: 5000,
      showsBackgroundLocationIndicator: true, // iOS only
      forceRequestLocation: true, // Request location even if location services are off (Android only)
    }
  );
};

const stopTrackingLocation = () => {
  Geolocation.clearWatch();
};

export { requestLocationPermission, startTrackingLocation, stopTrackingLocation };

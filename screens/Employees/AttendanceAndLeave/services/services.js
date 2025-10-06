import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { I18nManager } from "react-native";
// ........................................
import { BaseURL } from "../../../../constants/BaseUrl";
import { GetFCMForUser, ShiftAttendances, UpdateFCMForUser, userShift } from "../../../../constants/ServicesNames";
// ........................................
import moment from 'moment';
import 'moment/locale/ar-sa';
import { sendTIME } from "../../../../constants/dateFormate";

const getUserShift = async () => {
  let userdate = await AsyncStorage.getItem('empId')
  let empId = JSON.parse(userdate)
  let url = BaseURL + userShift + `?empId=${empId}`
  console.log("getUserShift", url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en"
      },
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
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};

const checkUserAuthenticationDataFCM = async () => {

  let userdate = await AsyncStorage.getItem('userObject')
  let userId = JSON.parse(userdate)
  let url = BaseURL + GetFCMForUser + userId?.ReturnData2
  console.log("url", url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
const uptateAuthenticationDataFCM = async (key) => {
  let userdate = await AsyncStorage.getItem('userObject')
  let userId = JSON.parse(userdate)
  let url = BaseURL + UpdateFCMForUser
  console.log("url", url)
  let data = {
    userID: userId,
    FCMToken: key
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
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
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
const authenticateWithBiometrics = () => {
  const rnBiometrics = new ReactNativeBiometrics();
  rnBiometrics.isSensorAvailable()
    .then(async (resultObject) => {
      const { available, biometryType } = resultObject;

      if (available && biometryType === BiometryTypes.TouchID) {
        console.log('TouchID', 'Would you like to enable TouchID authentication for the next time?');
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log('FaceID', 'Would you like to enable FaceID authentication for the next time?');
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        console.log('Device Supported Biometrics', 'Biometrics authentication is supported.');
      } else {
        console.log('Biometrics not supported', 'This device does not support biometric authentication.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('Error', 'An error occurred while checking biometrics availability.');
    });
};
const handleBiometricAuth = async () => {
  authenticateWithBiometrics()
  try {
    const rnBiometrics = new ReactNativeBiometrics();
    const { success, error } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate to continue' });

    if (success) {
      console.log('Success', 'Biometric authentication successful');
      return { statues: true, code: 'Success' };
    } else {
      console.log('Authentication failed', 'Biometric authentication failed');
      return { statues: false, code: 'Authentication failed' };
    }
  } catch (error) {
    console.log('[handleBiometricAuth] Error:', error);
    console.log('Error', 'Biometric authentication failed from device');
    return { statues: false, code: error.code };
  }
};
// Helper function to get time part from a date string
// ............................................................
const RecordShiftAttendances = async (attendanceId, status, shiftId, locationId, radius, latitude, longitude) => {
  let url = BaseURL + ShiftAttendances
  // .......................bodydata...........................
  let userdate = await AsyncStorage.getItem('empId')
  let fingerPrint = await AsyncStorage.getItem('fingerPrint')
  let empId = JSON.parse(userdate)
  console.log("url", url, fingerPrint)
  let data = {
    "id": attendanceId,
    "status": status,//١-حضور ٢- انصراف ٣- غاىب بإذن ٤ +بدون الاذن
    "empId": empId,
    "shiftId": shiftId,
    "fingerPrint": fingerPrint,
    "locationId": locationId,
    "radius": radius,
    "lat": latitude,
    "longitude": longitude
  }
  console.log("data..", data)
  // ...........................................................
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en"

      },
      body: JSON.stringify(data)
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
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
// ...........................date formate......................................
const formatTime = (time) => {
  console.log("formateTime", time)

  moment.locale(I18nManager.isRTL ? 'ar-sa' : "en");
  const formateTime = moment(time).format('hh:mm A');
  console.log("formateTime", formateTime)
  return formateTime;
};

const getShiftType = (startTime) => {
  const afternoonThreshold = moment(startTime).set({ hour: 16, minute: 0 });
  const isEvening = moment(startTime).isSameOrAfter(afternoonThreshold);
  return isEvening;
};

const formatDate = (date) => {
  moment.locale(I18nManager.isRTL ? 'ar-sa' : "en");
  return moment(date).format('DD MMMM YYYY');
};
const formatDayName = (date) => {
  moment.locale(I18nManager.isRTL ? 'ar-sa' : "en");
  return moment(date).format('dddd');
};
const getTimeFromDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toTimeString().split(' ')[0]; // Format HH:MM:SS
};
// .........................................................
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);  // Difference in latitude
  const dLon = deg2rad(lon2 - lon1);  // Difference in longitude
  console.log("dLat", lat1, lat2, lon1, lon2)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters

  return Math.round(distance * 100) / 100; // Round to nearest two digits
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function isWithinRange(userLat, userLon, siteLat, siteLon, rangeInMeters) {
  const distance = calculateDistance(userLat, userLon, siteLat, siteLon);
  return distance <= rangeInMeters;
}

// Example usage:
// const userLat = 12.9716;  // User's latitude
// const userLon = 77.5946;  // User's longitude

// const siteLat = 28.7041;  // Site's latitude
// const siteLon = 77.1025;  // Site's longitude

// const range = 3000; // Range in meters

// const withinRange = isWithinRange(userLat, userLon, siteLat, siteLon, range);

// if (withinRange) {
//   console.log("You are within 3000 meters of the site location.");
// } else {
//   console.log("You are outside the 3000-meter range.");
// }

export {
  getUserShift,
  getTimeFromDate,
  RecordShiftAttendances,
  formatTime,
  getShiftType,
  formatDate,
  formatDayName,
  checkUserAuthenticationDataFCM,
  uptateAuthenticationDataFCM,
  authenticateWithBiometrics,
  handleBiometricAuth,
  calculateDistance
}
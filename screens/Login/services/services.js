import { CommonActions } from '@react-navigation/native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
// ...........................................
import { BaseURL } from '../../../constants/BaseUrl';
import { AuthenticateOtp, GenerateAndSendMobileOtp, SendHaskKey, login, verifyOtp, saveFingerPrint } from '../../../constants/ServicesNames';
import { I18nManager } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics();

const preventBackAction = () => {
  return CommonActions.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  });
};
const onSubmitLogin = async (UserNameOrEmailAddress, Password, RememberClient, recaptchaToken) => {
  const url = BaseURL + login;
  let fcm = await AsyncStorage.getItem('FCM')
  console.log("fcm",fcm)
  const data = {
    UserNameOrEmailAddress,
    Password,
    RememberClient,
    recaptchaToken,
    fcm
  };
  console.log('data', data, url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en"
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
      console.log(errorData)
      return errorData;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
const fastLoginFunction = async (phoneNumber) => {
  const url = BaseURL + GenerateAndSendMobileOtp + `?phoneNumber=${phoneNumber}`; //phoneNumber=01208127427
  console.log('data', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
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
const VerifyOTP = async (phoneNumber, enteredOtp) => {
  const url = BaseURL + verifyOtp + `?phoneNumber=${phoneNumber}&enteredOtp=${enteredOtp}`;
  console.log('data', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
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
const authenticateOtp = async (phoneNumber) => {
  const url = BaseURL + AuthenticateOtp;
  const data = {
    phoneNumber,
  };
  console.log('data', data, url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en"

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
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
// ......
const sendHashKey = async (phoneNumber, key) => {
  const url = BaseURL + SendHaskKey + `${phoneNumber}/${key}`;

  console.log('data', data, url);
  try {
    const response = await fetch(url, {
      method: 'POST',
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
const getUniqueId = async () => {
  const uniqueId = await DeviceInfo.getUniqueId();
  console.log('Device Unique ID:', uniqueId);
  return uniqueId;
};
const saveFingerPrintApi = async (empId) => {
  const fingerPrint = await getUniqueId();
   const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken)
  const url = BaseURL + saveFingerPrint +`?empId=${empId}&fingerPrint=${fingerPrint}`;
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        'Authorization': `Bearer ${userToken}`,

      },
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      await AsyncStorage.setItem('fingerPrint', fingerPrint)
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
// .................................handle login.................................
const commonAction = () => {
  // navigation.dispatch(
  return CommonActions.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  });
  // );
};
// -------------------------------------------------------------------------------
const biometricAuth = async () => {
  try {
    // const {available, biometryType} = await rnBiometrics.isSensorAvailable();
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    let val = ''
    if (biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported');
      const result = await authenticate();
      console.log(result)
      val = result;
      return result
    }
    if (biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported');
      const result = await authenticate();
      val = result;
      return result

    }
    if (biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported');
      const result = await authenticate();
      val = result;
      return result

    } else {
      console.log('Biometrics not supported');
      val = 'Biometrics not supported';
      return false

    }
    if (val != '') {
      console.log("val",val)

      // return val
    }

  } catch (error) {
    console.error('Error in biometricAuth:', error);
    return false;

  }
};

const authenticate = async () => {
  try {
    const resultObject = await rnBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint',
    });
    const { success } = resultObject;
    console.log('resultObject', resultObject);
    if (success) {
      console.log('successful biometrics provided');
      return success;
      // navigation.navigate('Home')
      // alert('Authentication successful', 'You have successfully authenticated using biometrics');
    } else {
      console.log('user cancelled biometric prompt');
      alert(I18nManager?.isRTL?"تم إلغاء المصادقة البيومترية": 'Biometric authentication was cancelled');
      return 'user cancelled biometric prompt';
    }
  } catch (err) {
    console.log('biometrics failed', err);
    alert(I18nManager.isRTL?"فشل المصادقة": 'Authentication failed');
    return 'biometrics failed';
  }
};
export {
  preventBackAction,
  onSubmitLogin,
  fastLoginFunction,
  VerifyOTP,
  authenticateOtp,
  sendHashKey,
  commonAction,
  biometricAuth,
  saveFingerPrintApi
}
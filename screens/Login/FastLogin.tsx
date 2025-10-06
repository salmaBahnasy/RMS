import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RNRestart from 'react-native-restart';
import OtpVerify from 'react-native-otp-verify';
// Components
import { LoginHeader } from './components/LoginHeader';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import { icons } from '../../constants';
import styles from './styles';
import { RootStackParamList } from '../../navigation/types';
import LanguageModal from '../common/components/LanguageModal';
import { changeLanguage } from '../Profile/Services/services';
import ErrorView from '../common/components/ErrorView';
import { VerifyOTP, authenticateOtp, fastLoginFunction, sendHashKey } from './services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FastLogin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [phone, setPhone] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loginError, setloginError] = useState<string | null>(null);
  const [showOTPView, setShowOTPView] = useState<boolean>(false);
  const [languageModal, setLanguageModal] = useState(false)
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>('');
  const [focused, setFocused] = useState<boolean>(false);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [hashKey, sethashKey] = useState<string|any>('');

  // Request SMS permission
  const requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to read your SMS to auto-fill the OTP.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS permission granted');
        return true;
      } else {
        console.log('SMS permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestSMSPermission();
    };
    init();
  }, []);
  // Automatically request permission and start SMS listener when the component mounts
  useEffect(() => {
    // Step 1: Get the app hash (optional, for debugging)
    OtpVerify.getHash()
      .then((hash) => {
        console.log('App hash:', hash,`<#${hash[0]}>`);
        sethashKey(`<#${hash[0]}>`)
      })
      .catch((error) => {
        console.error('Failed to get app hash:', error);
      });
    // Step 2: Start the OTP listener
    const startListener = () => {
      OtpVerify.startOtpListener((message) => {
        console.log('SMS received:', message);

        // Step 3: Extract the OTP using regex
        const otpMatch = /(\d{4,6})/g.exec(message); // Adjust regex for 4-6 digit OTP
        if (otpMatch && otpMatch[1]) {
          const otp = otpMatch[1];
          console.log('OTP extracted:', otp);
          setOtp(otp); // Auto-fill the OTP in the input field
        } else {
          console.error('No OTP found in the SMS message.');
        }
      });
    };
    startListener();
    // Step 4: Restart the listener after 5 minutes (300,000 milliseconds)
    const timeout = setTimeout(() => {
      console.log('Restarting SMS listener...');
      OtpVerify.removeListener(); // Stop the current listener
      startListener(); // Restart the listener
    }, 300000); // 5 minutes
    // Step 5: Clean up the listener and timeout when the component unmounts
    return () => {
      OtpVerify.removeListener();
      clearTimeout(timeout);
    };
  }, []);

  const setOTP = async () => {
    setIsloading(true)
    if (phone == null) {
      setPhoneError(t('Pleaseenteryourphone'));
      setIsloading(false)
      return 0;
    }
    let sendHash = await sendHashKey(phone, hashKey)
    console.log(sendHash)
    let loginResponse = await fastLoginFunction(phone);
    console.log("Login response", loginResponse?.success);
    if (loginResponse?.success == false) {
      setIsloading(false)
      setloginError(loginResponse?.MessageContent || "حدث خطأ ما !!");
    } else if (loginResponse?.success) {
      setShowOTPView(true)
      setIsloading(false)
    }
  };
  const verifyOTP = async () => {
    setIsloading(true)

    if (otp == null) {
      setOtpError(t('PleaseenteryourOtp'));
      setIsloading(false)
      return 0;
    }
    let loginResponse = await VerifyOTP(phone, otp);
    console.log("Login response", loginResponse?.success);
    if (loginResponse?.result == false) {
      setloginError(loginResponse?.MessageContent || "حدث خطأ ما !!");
      setIsloading(false)
    } else if (loginResponse?.result) {
      let authOTP = await authenticateOtp(phone)
      if (authOTP?.result?.message?.type == 'Success') {
        await AsyncStorage.setItem('userToken', loginResponse?.result?.accessToken)
        await AsyncStorage.setItem('userId', JSON.stringify(loginResponse?.result?.userId))
        await AsyncStorage.setItem('empId', JSON.stringify(loginResponse?.result?.empId))
        setIsloading(false)
        navigation.replace('Home');//
      } else if (authOTP?.result?.message?.type !== 'Success') {
        setloginError("حدث خطأ ما !!");
        setIsloading(false)
      } else {
        setloginError("حدث خطأ ما !!");
        setIsloading(false)
      }
    }
  };
  return (
    <View style={styles.container}>
      <LoginHeader
        description={t('login_prompt')}
        header={t('welcome_message')}
        txtView={{ height: '100%', justifyContent: 'flex-end' }}
        changelng={() => { setLanguageModal(true); }} showchangelng={true} />
      <LanguageModal
        onDismiss={(val) => { setLanguageModal(val) }}
        isVisible={languageModal}
        changeLanguage={async (val) => {
          let lang = await changeLanguage(val, i18n)
          console.log(lang)
          setLanguageModal(false)
          RNRestart.Restart();
        }}
      />
      <View style={{ padding: 20 }}>
        {showOTPView ?
          <>
            <MainTextInput
              onChangeText={(val: string) => { setOtpError(null); setloginError(null); setOtp(val) }}
              placeholder={t('Typethesentcode')}
              value={otp}
              containerStyle={{}}
              label={t('otp')}
              onFocus={(val: boolean) => setFocused(val)}
              focused={focused}
              keyboardType='numeric'
              textContentType="oneTimeCode"
              autoComplete="one-time-code"

            />
            {otpError ? <ErrorView label={otpError} /> : null}

          </> :
          <>
            <MainTextInput
              onChangeText={(val: string) => { setPhoneError(null); setloginError(null); setPhone(val) }}
              placeholder={t('phone')}
              leftIcon={icons.phone}
              value={phone || ''}
              containerStyle={{ marginTop: 90 }}
              label={t('phone')}
              keyboardType='numeric'
            />
            {phoneError ? <ErrorView label={phoneError} /> : null}
          </>
        }
        {loginError ? <ErrorView label={loginError} /> : null}

        {/* Login Button */}
        <MainButton
          onPress={() => showOTPView ? verifyOTP() : setOTP()}
          label={t('login')}
          containerStyle={{ marginTop: 48 }} disabled={isloading} />
      </View>
    </View>
  );
};

export default FastLogin;
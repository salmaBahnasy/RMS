import React, { useState, useEffect } from 'react';
import { Text, View, I18nManager, PermissionsAndroid, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import OtpVerify from 'react-native-otp-verify';
// .........................................................................
import { RootStackParamList } from '../../navigation/types';
import { LoginHeader } from '../Login/components/LoginHeader';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import styles from './styles';
import { COLORS, FONTS, icons } from '../../constants';
import { VerifyOTP, sendHashKey } from '../Login/services/services';
import ErrorView from '../common/components/ErrorView';
import { sendemailForOTP, sendphoneForOTP } from './services/services';

const SendOtp: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const data = useRoute()
  const [email, setEmail] = useState<string | any>(data?.params?.data);
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>('');
  const [focused, setFocused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [feedbacksucess, setfeedbacksucess] = useState('');
  const [feedbackfail, setfeedbackfail] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [hashKey, sethashKey] = useState<string|any>('');


  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (isResendEnabled) {
      setTimeLeft(300);
      setIsResendEnabled(false);
      if (email.includes('@')) {
        let emailResponse = await sendemailForOTP(email)
        console.log(emailResponse)
        if (emailResponse?.result?.message?.type == 'Success') {
          setfeedbacksucess(emailResponse?.result?.message?.content)
        } else {
          setfeedbackfail(emailResponse?.result?.message?.content)
        }
      } else {
        let mobileResponse = await sendphoneForOTP(email)
        console.log(mobileResponse)
        if (mobileResponse?.result?.message?.type == 'Success') {
          setfeedbacksucess(mobileResponse?.result?.message?.content)
        } else {
          setfeedbackfail(mobileResponse?.result?.message?.content)
        }
      }
    }
  };
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
      .then(async (hash) => {
        console.log('App hash:', hash);
        sethashKey(`<#${hash[0]}>`)
        if (!email.includes('@')) {
          let sendHash = await sendHashKey(email, hashKey)
          console.log(sendHash)
        }

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
  const verifyOTPfunction = async () => {
    setIsloading(true)
    // Step 6: Verify the OTP using the OtpVerify API
    if (otp == '') {
      setOtpError(t("PleaseenteryourOtp"))
      setIsloading(false)
      return 0;
    }
    let verifyResponse = await VerifyOTP(otp)
    console.log({ verifyResponse })
    if (verifyResponse.result) {
      navigation.navigate('ResetPassword', { "data": email })
      setIsloading(false)
    } else {
      setOtpError(t("InvalidOTP"))
      setIsloading(false)
    }
  }

  return (
    <View style={styles.container}>
      <LoginHeader
        backAction={() => navigation.goBack()}
        back={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        description={`${t('wehavesentotp')} ${email} ${t('checkinbox')}`}
        header={t('Email_verification')}
        showchangelng={false}
        changelng={function (): void {
          throw new Error('Function not implemented.');
        }} />
      <View style={{ padding: 20, backgroundColor: COLORS.white, flex: 1 }}>
        <MainTextInput
          onChangeText={(val: string) => { setfeedbackfail(""); setfeedbacksucess(''); setOtpError(null); setOtp(val) }}
          placeholder={t('Typethesentcode')}
          value={otp}
          containerStyle={{}}
          label={t('otp')}
          onFocus={(val: boolean) => setFocused(val)}
          focused={focused}
          keyboardType="numeric"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
        />
        {otpError ? <ErrorView label={otpError} /> : null}
        <View style={styles.row}>
          <Text>{t('didnontreceive')}</Text>
          <Text>{formatTime(timeLeft)} </Text>
          <Text onPress={handleResend} style={{ color: COLORS.primary }}>{t('Resend')}</Text>
        </View>
        {feedbackfail ? <Text style={{ ...FONTS?.h3, color: "red", marginVertical: 4, textAlign: "center" } as TextStyle}>{feedbackfail}</Text> : null}
        {feedbacksucess ? <Text style={{ ...FONTS?.h3, color: "green", marginVertical: 4, textAlign: "center" } as TextStyle}>{feedbacksucess}</Text> : null}

        <MainButton
          onPress={() => verifyOTPfunction()}
          label={t('verification')}
          containerStyle={{ marginTop: 48 }} disabled={isloading}        />
        <MainButton
          onPress={() => { navigation.goBack(); } }
          label={t('Back')}
          containerStyle={{ backgroundColor: COLORS.white }}
          labelStyle={{ color: COLORS.primary }} disabled={undefined}        />
      </View>
    </View>
  );
};

export default SendOtp;
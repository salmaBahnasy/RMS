import React, {useState, useEffect} from 'react';
import {
  I18nManager,
  ScrollView,
  Text,
  TextStyle,
  View,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LoginHeader} from './components/LoginHeader';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import {COLORS, FONTS, icons} from '../../constants';
import RememberMe from './components/RememberMe';
import styles from './styles';
import {
  biometricAuth,
  onSubmitLogin,
  saveFingerPrintApi,
} from './services/services';
import {RootStackParamList} from '../../navigation/types';
import LanguageModal from '../common/components/LanguageModal';
import {changeLanguage} from '../Profile/Services/services';
import ErrorView from '../common/components/ErrorView';
import ReCaptcha from './components/ReCaptcha';
import {LANGUAGE_KEY} from '../../constants/Variable';

const Login: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [languageModal, setLanguageModal] = useState(false);
  const [loginerror, setloginError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setIsloading] = useState<boolean>(false);
  const [recaptchaToken, setrecaptchaToken] = useState<string | null>('');
  const [isCheckedvalue, setisCheckedvalue] = useState<boolean>(false);

  // useEffect(() => {
  //   const getSavedCredentials = async () => {
  //     const savedPassword = await AsyncStorage.getItem('password');
  //     const savedEmail = await AsyncStorage.getItem('email');
  //     setPassword(savedPassword);
  //     setEmail(savedEmail);
  //   };
  //   getSavedCredentials();
  // }, []);
  useEffect(() => {
    const getSavedCredentials = async () => {
      if (isChecked) {
        // ✅ يتحقق الأول هل Remember Me متعلم عليها
        const savedPassword = await AsyncStorage.getItem('password');
        const savedEmail = await AsyncStorage.getItem('email');
        setPassword(savedPassword || '');
        setEmail(savedEmail || '');
      }
    };
    getSavedCredentials();
  }, [isChecked]);

  // ✅ التحقق بالبصمة
  const biometric = async (): Promise<boolean> => {
    const result = await biometricAuth();
    console.log('Biometric result...', result);

    if (result === true) {
      return true; // البصمة نجحت
    }

    if (result ===false) {

      return false; // الجهاز مش بيدعم البصمة → يسمح له بالدخول بعد التحقق من اليوزر والباسورد
    }

    Alert.alert('خطأ', 'فشل التحقق بالبصمة. حاول مرة أخرى.');
    return false; // البصمة موجودة وفشلت → لا يدخل
  };

  // ✅ تسجيل الدخول
  const loginFunction = async () => {
    setIsloading(true);
    setloginError(null);

    if (!email) {
      setEmailError(t('PleaseenteryourEmail'));
      setIsloading(false);
      return;
    }
    if (!password) {
      setPasswordError(t('Pleaseenteryourpassword'));
      setIsloading(false);
      return;
    }

    try {
      if (isChecked) {
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('email', email);
      }

      let loginResponse = await onSubmitLogin(
        email,
        password,
        isChecked,
        recaptchaToken,
      );

      if (loginResponse?.result?.type === 'error') {
        console.log('Backend Error:', loginResponse?.result?.message);
        setloginError(loginResponse?.result?.message || 'خطأ غير معروف');
        setisCheckedvalue(false);
        setIsloading(false);
        return;
      }

      if (loginResponse?.result?.type === 'Success') {
        await AsyncStorage.setItem(
          'userToken',
          loginResponse.result.accessToken,
        );
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(loginResponse.result.userId),
        );
        await AsyncStorage.setItem(
          'empId',
          JSON.stringify(loginResponse.result.empId),
        );
        await AsyncStorage.setItem('useAuth', 'true');
        console.log(
          'loginResponse.result.accessToken',
          loginResponse.result.accessToken,
        );
        console.log('loginResponse.result.userId', loginResponse.result.userId);
        console.log('loginResponse.result.empId', loginResponse.result.empId);
        await saveFingerPrintApi(loginResponse.result.empId);
          console.log('loginResponse.result.empId',loginResponse.result.empId)
        setEmail('');
        setPassword('');
        // ✅ تحقق البصمة بعد التحقق من اليوزر والباسورد
        const isBioSuccess = await biometric();
        console.log('isBioSuccess', isBioSuccess);
        if (isBioSuccess) {
          navigation.replace('Home');
        } else {
          setloginError('فشل تسجيل الدخول بالبصمة.');
          setIsloading(false);
        }
      } else {
        setloginError(loginResponse?.result?.message || 'حدث خطأ ما !!');
        setisCheckedvalue(false);
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        console.log('Backend Error:', err.response.data.error);
        setloginError(err.response.data.error.message || 'حدث خطأ ما !!');
      } else {
        console.log('Login Error:', err);
        setloginError(err.message || 'حدث خطأ ما !!');
      }
    }
  };

  const Indicator = () => (
    <ActivityIndicator
      size={'small'}
      style={{justifyContent: 'center', alignItems: 'center'}}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView>
        <LoginHeader
          description={t('login_prompt')}
          header={t('welcome_message')}
          txtView={{height: '100%', justifyContent: 'flex-end'}}
          changelng={() => {
            setLanguageModal(true);
          }}
          showchangelng={true}
        />
        <LanguageModal
          onDismiss={val => {
            setLanguageModal(val);
          }}
          isVisible={languageModal}
          changeLanguage={async val => {
            // ✅ حفظ اللغة المختارة
            await AsyncStorage.setItem(LANGUAGE_KEY, val);
            console.log('LANGUAGE_KEY', val);

            // ✅ تغيير اللغة في i18n
            await changeLanguage(val, i18n);

            setLanguageModal(false);

            // ✅ إعادة تشغيل التطبيق لتطبيق اتجاه اللغة
            RNRestart.Restart();
          }}
        />
        <View style={{padding: 20}}>
          {/* Email */}
          <MainTextInput
            onChangeText={(val: string) => {
              setIsloading(false);
              setEmailError(null);
              setloginError(null);
              setPasswordError(null);
              setEmail(val);
            }}
            placeholder={t('email')}
            leftIcon={icons.email}
            value={email || ''}
            containerStyle={{marginTop: 50}}
            label={t('email')}
            labelStyle={{lineHeight: 19, fontWeight: '500'}}
            labelStyle2={{lineHeight: 19, fontWeight: '500'}}
          />
          {emailError ? <ErrorView label={emailError} /> : null}

          {/* Password */}
          <MainTextInput
            onChangeText={(val: string) => {
              setIsloading(false);
              setEmailError(null);
              setloginError(null);
              setPasswordError(null);
              setPassword(val);
            }}
            placeholder={t('enterPassword')}
            secureTextEntry={secureTextEntry}
            value={password || ''}
            leftIcon={icons.key}
            rightIcon={secureTextEntry ? icons.eyeSlash : icons.eye}
            rightIconAction={() => setSecureTextEntry(prev => !prev)}
            label={t('password')}
            inputStyle={{
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
          />
          {passwordError ? <ErrorView label={passwordError} /> : null}

          {/* Remember Me */}
          <View style={{marginTop: 10}} />
          <RememberMe
            isChecked={isChecked}
            setIsChecked={(val: boolean) => setIsChecked(val)}
          />

          {/* ReCaptcha
          <ReCaptcha
            styleView={{marginBottom: loginerror ? 12 : 0}}
            isCheckedvalue={isCheckedvalue}
            getrecapchaToken={(val: string) => {
              setrecaptchaToken(val);
            }}
          /> */}

          {loginerror ? <ErrorView label={loginerror} /> : null}
          <View style={{marginTop: 10}} />
          <MainButton
            onPress={loginFunction}
            label={loading ? <Indicator /> : t('login')}
            containerStyle={{marginTop: '10%'}}
            disabled={loading}
          />
          {/* 
          <Text style={{...FONTS.h3, alignSelf: 'center'} as TextStyle}>
            {t('or')}
          </Text> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

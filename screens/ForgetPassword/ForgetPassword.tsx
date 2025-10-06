import React, {useState} from 'react';
import {Text, SafeAreaView, View, I18nManager, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types'; // Define this type based on your navigation structure
// ............................................
import {LoginHeader} from '../Login/components/LoginHeader';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import styles from './styles';
import {COLORS, icons} from '../../constants';
import {sendemailForOTP, sendphoneForOTP} from './services/services';
import ErrorView from '../common/components/ErrorView';

const ForgetPassword: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>('');
  const [focused, setFocused] = useState<boolean>(false);
  const [isloading, setIsloading] = useState<boolean>(false);

  const ForgetPasswordFunction = async () => {
    setIsloading(true);
    if (email == '') {
      setEmailError(t('PleaseenteryourEmail'));
      setIsloading(false);
      return 0;
    }
    if (email.includes('@')) {
      let emailResponse = await sendemailForOTP(email);
      console.log(emailResponse);
      if (emailResponse?.result?.message?.type == 'Success') {
        navigation.navigate('SendOtp', {data: email});
        setIsloading(false);
      } else {
        setEmailError(emailResponse?.result?.message?.content);
        setIsloading(false);
      }
    } else {
      let mobileResponse = await sendphoneForOTP(email);
      console.log(mobileResponse);
      if (mobileResponse?.result?.message?.type == 'Success') {
        navigation.navigate('SendOtp', {data: email});
        setIsloading(false);
      } else {
        setEmailError(mobileResponse?.result?.message?.content);
        setIsloading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LoginHeader
        backAction={() => navigation.goBack()}
        back={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        description={t('sendEmailtosendotp')}
        header={t('sendEmailHeader')}
        changelng={function (): void {
          throw new Error('Function not implemented.');
        }}
        showchangelng={false}
      />
      <View style={{padding: 20, backgroundColor: COLORS.white, flex: 1}}>
        {/* Email Input */}
        <MainTextInput
          onChangeText={(val: string) => {
            setEmailError(null);
            setEmail(val);
          }}
          placeholder={`${t('email')}/${t('phone')}`}
          leftIcon={icons.email}
          containerStyle={{}}
          label={t('email')}
          onFocus={(val: boolean) => setFocused(val)}
          focused={focused}
        />
        {emailError ? <ErrorView label={emailError} /> : null}
        {/* Resend OTP Button */}
        <MainButton
          onPress={() => ForgetPasswordFunction()}
          label={t('resendOtp')}
          containerStyle={{marginTop: 48}}
          disabled={undefined}
        />

        {/* Secondary Resend OTP Button */}
        <MainButton
          onPress={() => {
            navigation.navigate('Login');
          }}
          label={t('Backtologin')}
          containerStyle={{backgroundColor: COLORS.white}}
          labelStyle={{color: COLORS.primary}}
          disabled={undefined}
        />
      </View>
    </View>
  );
};

export default ForgetPassword;

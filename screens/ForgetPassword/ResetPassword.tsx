import React, {useEffect, useState} from 'react';
import {Text, View, I18nManager, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types'; // Define this type based on your navigation structure
// ............................................
import {LoginHeader} from '../Login/components/LoginHeader';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import styles from './styles';
import {COLORS, icons, images} from '../../constants';
import {resetPassword} from './services/services';
import ErrorView from '../common/components/ErrorView';

const ResetPassword: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const data = useRoute();
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [passwordError, setPasswordError] = useState<string | null>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isloading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    if (data.params) {
      console.log(data.params);
      if (data.params?.data?.includes('@')) {
        setEmail(data.params.data);
      } else {
        setPhone(data.params.data);
      }
    }
  }, []);
  const ForgetPasswordFunction = async () => {
    setIsloading(true);
    if (password == '' || password == null) {
      setPasswordError(t('enterPassword'));
      setIsloading(false);

      return 0;
    }
    if (confirmPassword == '' || confirmPassword == null) {
      setConfirmPasswordError(t('enterPassword'));
      setIsloading(false);
      return 0;
    }
    if (password != confirmPassword) {
      setConfirmPasswordError(t('passwordisnotcorrect'));
      setIsloading(false);
      return 0;
    }

    let ForgetPasswordResponse = await resetPassword(
      password,
      confirmPassword,
      phone,
      email,
    );
    console.log({ForgetPasswordResponse});
    if (ForgetPasswordResponse.success) {
      setIsloading(false);
      navigation.navigate('FeedBackScreen', {
        header: t('password_has_been_set_succ'),
        image: images.success,
        buttonText: t('gotohome'),
        onPress: () => navigation.navigate('Login'),
        description: '',
      });
    } else {
      setIsloading(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <LoginHeader
        backAction={() => navigation.goBack()}
        back={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        description={t('restpassdes')}
        header={t('setNewPass')}
        changelng={function (): void {
          throw new Error('Function not implemented.');
        }}
        showchangelng={false}
      />
      <View style={{padding: 20, backgroundColor: COLORS.white, flex: 1}}>
        {/* Password Input */}
        <MainTextInput
          onChangeText={(val: string) => {
            setPasswordError(null);
            setConfirmPasswordError(null);
            setPassword(val);
          }}
          rightIconAction={() => setSecureTextEntry(!secureTextEntry)}
          placeholder={t('writePass')}
          secureTextEntry={secureTextEntry}
          value={password || ''}
          leftIcon={icons.key}
          rightIcon={icons.eye}
          label={t('password')}
        />
        {passwordError ? <ErrorView label={passwordError} /> : null}
        {/* Confirm Password Input */}
        <MainTextInput
          onChangeText={(val: string) => {
            setPasswordError(null);
            setConfirmPasswordError(null);
            setConfirmPassword(val);
          }}
          rightIconAction={() => setSecureTextEntry(!secureTextEntry)}
          placeholder={t('cpass')}
          secureTextEntry={secureTextEntry}
          value={confirmPassword || ''}
          leftIcon={icons.key}
          rightIcon={icons.eye}
          label={t('cpass')}
        />
        {confirmPasswordError ? (
          <ErrorView label={confirmPasswordError} />
        ) : null}

        {/* Submit Button */}
        <MainButton
          onPress={() => {
            ForgetPasswordFunction();
          }}
          label={t('sendEmailHeader')}
          containerStyle={{marginTop: 48}}
          disabled={isloading}
        />
      </View>
    </View>
  );
};

export default ResetPassword;

import React, {useState} from 'react';
import { I18nManager, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {COLORS, SIZES, icons, images} from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainTextInput from '../common/components/MainTextInput';
import MainButton from '../common/components/MainButton';
import {ChangePasswordScreenNavigationProp} from '../../navigation/types';
import {ChangePasswordApi, removeAppKeys} from './Services/services';
import ErrorView from '../common/components/ErrorView';
import FeedBackModal from '../common/components/FeedBackModal';
import SubHeader from '../common/components/SubHeader';

const ChangePassword: React.FC = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const {t} = useTranslation();
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState<boolean>(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState<boolean>(true);
  const [isloading, setIsloading] = useState<boolean>(false);

  const [feedBack, setfeedBack] = useState<boolean>(false);
  const [feedBackmsg, setfeedBackmsg] = useState<boolean | string>(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // .........................................................................................
  const [currentPassword, setcurrentPassword] = useState<string | null>('');
  const [currentPasswordError, setcurrentPasswordError] = useState<
    string | null
  >('');
  const [newPassword, setnewPassword] = useState<string | null>('');
  const [newPasswordError, setnewPasswordError] = useState<string | null>('');
  const [newPasswordConfirmation, setnewPasswordConfirmation] = useState<
    string | null
  >('');
  const [newPasswordConfirmationError, setnewPasswordConfirmationError] =
    useState<string | null>('');
  const [forgrtPasswordError, setforgrtPasswordError] = useState<string | null>(
    '',
  );

  const changePasswordfunction = async () => {
    setIsloading(true);
    if (currentPassword == '') {
      setcurrentPasswordError(t('currentPasswordError'));
      setIsloading(false);
      return 0;
    }
    if (newPassword == '') {
      setnewPasswordError(t('newPasswordError'));
      setIsloading(false);
      return 0;
    }
    if (newPasswordConfirmation == '') {
      setnewPasswordConfirmationError(t('newPasswordConfirmationError'));
      setIsloading(false);
      return 0;
    }
    if (newPassword != newPasswordConfirmation) {
      setnewPasswordConfirmationError(t('newPasswordConfirmationError'));
      setIsloading(false);
      return 0;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      setfeedBackmsg(
        t('passwordMustContain') ||
          'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص على الأقل',
      );
      setErrorModal(true); // ✅ فتح مودال الفشل
      setIsloading(false);
      return 0;
    }
    let changePasswordResponse = await ChangePasswordApi(
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    );
    console.log({changePasswordResponse});
    if (changePasswordResponse.result?.message?.type == 'Success') {
      setfeedBackmsg(changePasswordResponse.result?.message?.content);
      setSuccessModal(true);
      setIsloading(false);
      setfeedBack(true);
    } else if (changePasswordResponse.result?.message?.type == 'Error') {
      setforgrtPasswordError(changePasswordResponse.result?.message?.content);
      setErrorModal(true);
      setIsloading(false);
    } else {
      setforgrtPasswordError(t('somethingerror'));
      setIsloading(false);
    }
  };

  return (
    <SafeAreaView>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('changePassword')}
      />
      {/* <FeedBackModal
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => { setfeedBack(val) }}
        isVisible={feedBack}
        description={feedBackmsg}
        Image={images?.success}
      /> */}
      <FeedBackModal
        onDismiss={async () => {
          setSuccessModal(false); // ✅ يقفل المودال
          setcurrentPassword('');
          setnewPassword('');
          setnewPasswordConfirmation('');
           await removeAppKeys();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}], // ✅ يروح على صفحة اللوجن مباشرة
          });
        }}
        isVisible={successModal}
        description={feedBackmsg}
        Image={images?.success}
      />

      <FeedBackModal
        onDismiss={() => setErrorModal(false)}
        isVisible={errorModal}
        description={feedBackmsg}
        Image={images?.fail}
      />
      <View style={{height: SIZES.height - 220, margin: 20}}>
        <MainTextInput
          value={currentPassword || ''}
          onChangeText={val => {
            setcurrentPassword(val);
            setcurrentPasswordError(null);
            setnewPasswordError(null);
            setnewPasswordConfirmationError(null);
            setforgrtPasswordError(null);
          }}
          secureTextEntry={secureTextEntry}
          leftIcon={icons.key}
          rightIcon={icons.eye}
          containerStyle={{marginVertical: 8}}
          inputContainer={{backgroundColor: COLORS.white}}
          label={t('currentPassword')}
          placeholder={t('currentPassword')}
          rightIconAction={() => setSecureTextEntry(!secureTextEntry)}
        />
        {currentPasswordError ? (
          <ErrorView label={currentPasswordError} />
        ) : null}

        <MainTextInput
          value={newPassword || ''}
          onChangeText={val => {
            setnewPassword(val);
            setnewPasswordError(null);
            setnewPasswordConfirmationError(null);
            setforgrtPasswordError(null);
          }}
          secureTextEntry={secureTextEntry1}
          leftIcon={icons.key}
          rightIcon={icons.eye}
          containerStyle={{marginVertical: 8}}
          inputContainer={{backgroundColor: COLORS.white}}
          label={t('newPassword')}
          placeholder={t('newPassword')}
          rightIconAction={() => setSecureTextEntry1(!secureTextEntry1)}
        />
        {newPasswordError ? <ErrorView label={newPasswordError} /> : null}

        <MainTextInput
          value={newPasswordConfirmation || ''}
          onChangeText={val => {
            setnewPasswordConfirmation(val);
            setnewPasswordError(null);
            setnewPasswordConfirmationError(null);
            setforgrtPasswordError(null);
          }}
          secureTextEntry={secureTextEntry2}
          leftIcon={icons.key}
          rightIcon={icons.eye}
          containerStyle={{marginVertical: 8}}
          inputContainer={{backgroundColor: COLORS.white}}
          label={t('confirmNewPassword')}
          placeholder={t('confirmNewPassword')}
          rightIconAction={() => setSecureTextEntry2(!secureTextEntry2)}
        />
      </View>
      {newPasswordConfirmationError ? (
        <ErrorView label={newPasswordConfirmationError} />
      ) : null}
      {forgrtPasswordError ? <ErrorView label={forgrtPasswordError} /> : null}

      <MainButton
        containerStyle={{margin: 20}}
        label={t('changePassword')}
        onPress={() => {
          changePasswordfunction();
        }}
        disabled={isloading}
      />
    </SafeAreaView>
  );
};

export default ChangePassword;

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

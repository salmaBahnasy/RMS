import React, {useState} from 'react';
import { Alert, I18nManager, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import { SafeAreaView } from 'react-native-safe-area-context';

// .........................................................................
import OptionsView from './Component/OptionsView';
import {COLORS, SIZES, icons} from '../../constants';
import MainHeader from '../common/components/MainHeader';
import {ProfileScreenNavigationProp} from '../../navigation/types';
import {changeLanguage, removeAppKeys} from './Services/services';
import LanguageModal from '../common/components/LanguageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LANGUAGE_KEY} from '../../constants/Variable';
import SubHeader from '../common/components/SubHeader';

const Profile: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {t, i18n} = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('employees');
  const [languageModal, setLanguageModal] = useState(false);

  return (
    <SafeAreaView style={{flex:1}}>
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
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('profile')}
       
      />
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 8,
          flex: 1,
        }}>
        <OptionsView
          onPress={() => navigation.navigate('PersonalData')}
          leftIcon={icons.user}
          label={t('personalData')}
          rightIcon={I18nManager.isRTL ? icons.leftBack : icons.rightBack}
        />
        <OptionsView
          onPress={() => navigation.navigate('ChangePassword')}
          leftIcon={icons.lock}
          label={t('changePassword')}
          rightIcon={I18nManager.isRTL ? icons.leftBack : icons.rightBack}
        />
        <OptionsView
          onPress={() => navigation.navigate('ContractData')}
          leftIcon={icons.bag}
          label={t('contractData')}
          rightIcon={I18nManager.isRTL ? icons.leftBack : icons.rightBack}
        />
        <OptionsView
          onPress={() => {
            setLanguageModal(true);
          }}
          leftIcon={icons.bag}
          label={t('changelanguage')}
          rightIcon={I18nManager.isRTL ? icons.leftBack : icons.rightBack}
        />
      </View>
      <OptionsView
        labelStyle={{color: COLORS.lightRed}}
        leftIcon={icons.logout}
        label={t('logout')}
        onPress={async function () {
          // await removeAppKeys();
          await AsyncStorage.multiRemove([
            'userToken',
            'userId',
            'empId',
            'useAuth',
          ]);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;

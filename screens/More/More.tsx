import React from 'react';
import {I18nManager, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types'; // Define this type based on your navigation structure
// ............................................
import MainHeader from '../common/components/MainHeader';
import UserInfoCard from './Component/UserInfoCard';
import CardView from './Component/CardView';
import styles from './styles';
import {icons} from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';


// Define the type for the component's props (if any)
interface MoreProps {
  // Add any props here if needed
}

const More: React.FC<MoreProps> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={{flex: 1,}}>
      <MainHeader
        labelStyle={{
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontWeight: 'bold',
          fontSize: 20,
         // lineHeight: 32,
        }}
        title={t('more')}
      />
      <View style={{padding: 20}}>
        <UserInfoCard />
        <View style={[styles.row, styles.btnView]}>
          <CardView
            onPress={() => navigation.navigate('VacationRequest')}
            image={icons.vacc}
            label={t('leave_request')}
          />
          <CardView
            onPress={() => navigation.navigate('VacationHistory')}
            image={icons.vacc}
            label={t('leave_requestHistory')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default More;

import React, { useState } from 'react';
import { Text, SafeAreaView, I18nManager, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types'; // Define this type based on your navigation structure
// ............................................
import MainHeader from '../../common/components/MainHeader';
import { icons } from '../../../constants';
import TabView from './components/TabView';
import ReportsViewList from './components/ReportsViewList';
import SubHeader from '../../common/components/SubHeader';

// Define the type for the component's props (if any)
interface EquipmentReportsProps {
  // Add any props here if needed
}

const EquipmentReports: React.FC<EquipmentReportsProps> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('awaitingApproval');

  return (
    <SafeAreaView>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('equipment_reports')}
      />
      <TabView onSelected={(tab) => setSelectedTab(tab)} />
      <ReportsViewList
        data={selectedTab === 'awaitingApproval' ? [1, 1, 1] : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
      />
    </SafeAreaView>
  );
};

export default EquipmentReports;
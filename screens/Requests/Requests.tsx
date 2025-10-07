import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  I18nManager,
} from 'react-native';
import { COLORS, FONTS, icons } from '../../constants';
import MainHeader from '../common/components/MainHeader';
import { t } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReportsViewList from '../Notification/components/ReportsViewList';
import { getTasks } from '../Notification/services/services';



const RequestsScreen: React.FC = () => {

  const [tasks, settasks] = useState<any>([]);

  useEffect(() => {

    const getTasksFunc = async () => {
      const notList = await getTasks()
      settasks(notList)
    }
    getTasksFunc()
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainHeader
        labelStyle={{
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontWeight: 'bold',
          fontSize: 20,
          // lineHeight: 32,
        }}
        title={t('requests')}
      />
      <ReportsViewList
        data={tasks}
      />
    </SafeAreaView>

  );
};

export default RequestsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    //   paddingHorizontal: 16,
    //   paddingTop: 8,
  },

  gameImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    resizeMode: 'cover',
    marginTop: 8,
  },
  boxUnderImage: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  allRequests: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  sortIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.primary,
    marginStart: 4,
    resizeMode: 'contain',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EDEDED',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardText: {
    flex: 1,
    marginEnd: 12,
  },
  status: {
    backgroundColor: '#FFF1E6',
    color: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    alignSelf: 'flex-start',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
});



// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native';
// import MainHeader from '../common/components/MainHeader';
// import ReportsViewList from '../Equipments/EquipmentReports/components/ReportsViewList';

// // Define the type for the component's props (if any)
// interface RequestsProps {
//   // Add any props here if needed
// }

// const Requests: React.FC<RequestsProps> = () => {
//   const { t } = useTranslation();
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView>
//       <MainHeader title={t('requests')} />
//       {/* <TabView onSelected={(tab) => { setSelectedTab(tab) }} /> */}
//       <ReportsViewList
//         data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
//       />
//     </SafeAreaView>
//   );
// };

// export default Requests;
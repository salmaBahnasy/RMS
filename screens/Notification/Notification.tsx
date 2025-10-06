import React, { useEffect, useState } from 'react';
import { Text, TextStyle, I18nManager, View } from 'react-native';
import { FONTS } from '../../constants';
import { useTranslation } from 'react-i18next';
import ReportsViewList from './components/ReportsViewList';
import TabView from './components/TabView';
import { getNote, getTasks } from './services/services';
import MainHeader from '../common/components/MainHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';


// Define the type for the component's props (if any)
interface NotificationProps {
  // Add any props here if needed
}

const Notification: React.FC<NotificationProps> = (props) => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState<string>('task');
  const [nots, setnotes] = useState<any>([]);
  const [tasks, settasks] = useState<any>([]);

  useEffect(() => {
    const getNotifications = async () => {
      const notList = await getNote()
      setnotes(notList)
    }
    const getTasksFunc = async () => {
      const notList = await getTasks()
      settasks(notList)
    }
    getTasksFunc()
    getNotifications()
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
        title={t('notifications')}
      />
      {/* <Text style={{ ...FONTS?.h2, marginVertical: 8, marginHorizontal: 12 } as TextStyle}>{t('notifications')}</Text> */}
      {/* <TabView
        onSelected={(tab: string) => { setSelectedTab(tab); }} /> */}
        <View style={styles.centerWrap}>
      <ReportsViewList
        data={nots}
        // selectedTab === 'task' ? tasks :
      />
      </View>
      {/* <View  style = {{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style = {{fontSize: 25, fontWeight: '800', color : 'black' , paddingHorizontal: 5}}>
           جاري  العمل علي صفحة الاشعارات ...
        </Text>
      </View> */}

    </SafeAreaView>
    // <SafeAreaView>
    //   <Text style={{ ...FONTS?.h2, marginVertical: 8, marginHorizontal: 12 } as TextStyle}>{t('notifications')}</Text>
    //   <TabView
    //     onSelected={(tab: string) => { setSelectedTab(tab); }} />
    //   <ReportsViewList
    //     data={selectedTab === 'task' ? tasks : nots}
    //   />
    // </SafeAreaView>
  );
};

export default Notification;
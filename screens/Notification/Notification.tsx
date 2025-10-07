import React, { useEffect, useState } from 'react';
import { Text, TextStyle, I18nManager, View } from 'react-native';
import { COLORS, FONTS } from '../../constants';
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
    
      <ReportsViewList
        data={nots}
      />
   

    </SafeAreaView>
  );
};

export default Notification;
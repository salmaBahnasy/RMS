import React, {useState} from 'react';
import {I18nManager, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import MainHeader from '../common/components/MainHeader';
import TabView from './Component/TabView';
import Equipment from './Component/Equipment';
import Employees from './Component/Employees';
import OutDatedVersion from '../common/components/OutDatedVersion';
import UseFakeLocationDetection from '../common/components/UseFakeLocationDetection';
import FeedBackModal from '../common/components/FeedBackModal';
import {COLORS, images} from '../../constants';

const Home: React.FC = () => {
  const {t} = useTranslation();

  // State hooks with explicit types
  const [selectedTab, setSelectedTab] = useState<'employees' | 'equipment'>(
    'employees',
  );
  const [versionOutDated, setVersionOutDated] = useState<boolean>(false);
  const isFake = UseFakeLocationDetection();
  console.log('isFake', isFake);
  const [isVisible, setisVisible] = useState(false); //(isFake ? isFake : false)

  return versionOutDated ? (
    <OutDatedVersion
      updated={(val: boolean) => {
        setVersionOutDated(val);
      }}
    />
  ) : (
    <View style={{flex: 1,backgroundColor:"red"}}>
      <FeedBackModal
        isVisible={isVisible}
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
          setisVisible(val);
        }}
        description={t('fakelocation')}
        Image={images?.fakelocation}
      />
      <MainHeader
        labelStyle={{
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontWeight: 'bold',
          fontSize: 18,
          //lineHeight: 32
        }}
        title={t('home')}
      />
      <TabView
        onSelected={(tab: 'employees' | 'equipment') => setSelectedTab(tab)}
      />
      {selectedTab === 'employees' ? <Employees /> : <Equipment />}
    </View>
  );
};

export default Home;

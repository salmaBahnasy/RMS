import React, { useState } from 'react';
import { SafeAreaView, I18nManager } from "react-native";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import { icons } from '../../../constants';
import TabView from './components/TabView';
import ReportsViewList from './components/ReportsViewList';

interface EmployeesReportsProps {}

const EmployeesReports: React.FC<EmployeesReportsProps> = (props) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<string>('employees');

    return (
        <SafeAreaView>
            <MainHeader 
                leftIconAction={() => navigation.goBack()} 
                leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack} 
                title={t('employee_transfer_requests')} 
            />
            <TabView onSelected={(tab: string) => { setSelectedTab(tab); }} />
            <ReportsViewList
                data={selectedTab === 'awaitingApproval' ? [1, 1, 1] : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
            />
        </SafeAreaView>
    );
}

export default EmployeesReports;

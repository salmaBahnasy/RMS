import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../constants';
import ContractDataView from './Component/ContractData';
import Allowances from './Component/Allowances';
import ContractTerms from './Component/ContractTerms';
import Insurances from './Component/Insurances';
import {ContractDataScreenNavigationProp} from '../../navigation/types';
import {formatDate, getDataEmpDetails} from './Services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubHeader from '../common/components/SubHeader';

const ContractData: React.FC = () => {
  const navigation = useNavigation<ContractDataScreenNavigationProp>();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [empId, setEmpId] = useState<number | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);

  useEffect(() => {
    fetchContractData();
  }, []);

  const fetchContractData = async () => {
    setLoading(true);
    try {
      const storedEmpId = await AsyncStorage.getItem('empId');
      const empIdValue = storedEmpId ? JSON.parse(storedEmpId) : 0;
      setEmpId(empIdValue);

      const data = await getDataEmpDetails();
      if (data?.result?.returnData) {
        setEmployeeData(data.result.returnData);
        console.log('Employee Data ===>', data?.result?.returnData);

        
      }
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{marginTop: '20%'}} />;
  }

  // if (employeeData?.city?.id === 2) {
  //   return (
  //     <SafeAreaView>
  //       <SubHeader
  //         leftIconAction={() => navigation.goBack()}
  //         leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
  //         title={t('contractData')}
  //       />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('contractData')}
      />

      <ScrollView>
        {/* 📌 هنا نعمل ماب على العقود */}
       {employeeData?.empContract?.length > 0 && (
      <ContractDataView
      contractType={employeeData.empContract[0]?.contractType?.name ?? '-'}
      contractStatusInQiwa={employeeData.empContract[0]?.contractStatus?.name ?? '-'}
      contractStartDate={formatDate(employeeData.empContract[0]?.creationTime) ?? '-'}
      contractEndDate={employeeData.empContract[0]?.contractPeriod?.name ?? '-'}
      appointmentDate={formatDate(employeeData.empContract[0]?.startWorkDate) ?? '-'}
       overtimePerHour={employeeData?.overTime?.name ?? '-'}
    />
  )}

        <View style={{height: 8}} />
        
  {/* <Allowances
    overtimePerHour={employeeData?.overtimePerHour ?? '-'}
    overtimePerHourOnHolidays={employeeData?.overtimePerHourOnHolidays ?? '-'}
    numberOfLeaveDays={employeeData?.numberOfLeaveDays ?? '-'}
  /> */}
        <View style={{height: 8}} />
        {/* <ContractTerms terms={employeeData?.contractTerms ?? []} /> */}
        <View style={{height: 8}} />
{/*        
  <Insurances
    healthInsuranceCost={employeeData?.healthInsuranceCost ?? '-'}
    insuranceCategory={employeeData?.insuranceCategory ?? '-'}
    membershipExpiryDate={employeeData?.membershipExpiryDate ?? '-'}
    insuranceSubscriptionNumber={employeeData?.insuranceSubscriptionNumber ?? '-'}
  /> */}
        <View style={{height: 180}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContractData;

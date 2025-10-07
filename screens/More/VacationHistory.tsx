import React, { useEffect, useState } from 'react';
import { Text, I18nManager, View, Image, TouchableOpacity, TextStyle, Platform, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types'; 
import { SafeAreaView } from 'react-native-safe-area-context';
// Define this type based on your navigation structure

// -------------------------------------------------------------------------------------------------------
import { icons, FONTS, COLORS, SIZES, images } from '../../constants';
import DateTimePickerModalView from '../common/components/DateTimePickerModalView';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import MainHeader from '../common/components/MainHeader';
import ChooseDateNum from './Component/ChooseDateNum';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { approveVacEmp, getAllRequests, searchInAllRequestes } from './services/services';
import Loader from '../common/components/Loader';
import moment from 'moment';
import { dateNumber } from '../../constants/dateFormate';
import MainButton from '../common/components/MainButton';
import FeedBackModal from '../common/components/FeedBackModal';
import SubHeader from '../common/components/SubHeader';
// Define the type for the component's props (if any)
interface VacationHistoryProps {
  // Add any props here if needed
}
type VacationItem = {
  id: any;
  statusName: string;
  empContractVacationName: string;
  startDate: string;
  endDate: string;
  vacationDuration: string;
  notes?: string;
};

const VacationHistory: React.FC<VacationHistoryProps> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [dateShowModal, setDateShowModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateType, setDateType] = useState<string>('start');
  const [isVisible, setisVisible] = useState(false);
  const [vacationList, setvacationList] = useState([]);
  const [EmpId, setEmpId] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setisloading] = useState(true);
  const [feedBackModal, setFeedBackModal] = useState(false);
  const [feedBackTitle, setFeedBackTitle] = useState<string>();
  const [feedBackImg, setFeedBackImg] = useState();
  // Get the first day of the current year
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);

  useEffect(() => {
    const getUserData = async () => {
      const storedEmpId = await AsyncStorage.getItem('empId');
      const empId = storedEmpId ? JSON.parse(storedEmpId) : 0;
      setEmpId(empId)
      const allrequests = await getAllRequests(empId, page, pageSize)
      console.log({ allrequests })
      console.log("allrequests?.result?.returnData?.vacation", allrequests?.result?.returnData?.vacations)
      Array.isArray(allrequests?.result?.returnData?.vacations) ? setvacationList(allrequests?.result?.returnData?.vacations) : setvacationList([])
      setisloading(false)

    }
    getUserData()
  }, [])


  const FilterView = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginVertical: 8 }}>
        <ChooseDateNum
          title={t('startvdate')}
          date={startDate}
          onPress={(val: boolean) => {
            Platform.OS == 'ios' && setisVisible(true)
            setStartDate(null);
            setDateType('start');
            setDateShowModal(val);
          }}
          containerStyle={{ flex: 1, marginHorizontal: 8 }}
          valueStyle={{
            fontSize: 9
          }}
        />
        {/* ................................ */}
        <ChooseDateNum
          title={t('endvdate')}
          date={endDate}
          onPress={(val: boolean) => {
            Platform.OS == 'ios' && setisVisible(true)
            setEndDate(null);
            setDateType('end');
            setDateShowModal(val);
          }}
          containerStyle={{ flex: 1, marginHorizontal: 8 }}
          valueStyle={{
            fontSize: 9
          }}
        />
        <TouchableOpacity
          onPress={async () => {
            const filteredData = await searchInAllRequestes(EmpId, startDate?.toISOString(), endDate?.toISOString(), 1, 10);
            console.log({ filteredData })
            Array.isArray(filteredData?.result?.returnData?.vacations) ? setvacationList(filteredData?.result?.returnData?.vacations) : setvacationList([])
          }}>
          <Text style={{ ...FONTS.body5, marginBottom: 8, textTransform: 'capitalize' } as TextStyle}>{t('search')}</Text>
          <View
            style={{
              backgroundColor: COLORS?.white,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              padding: 8,
              borderRadius: 10
            }}
          >
            <Image
              source={icons?.search}
              style={{
                width: 20, height: 20, tintColor: COLORS?.black
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  const VacationGridView = (data: any) => {
    const renderItem = ({ item, index }: { item: VacationItem, index: number }) => {
      return (<View style={{ backgroundColor: COLORS?.white, borderRadius: 10, padding: 8, flex: 1, marginHorizontal: 8, marginVertical: 4 }}>
        <Text style={{
          ...FONTS?.body4, textTransform: 'capitalize', marginVertical: 2,
          backgroundColor: COLORS?.Warningbg, color: COLORS?.Warningtxt, alignSelf: 'flex-end'
        } as TextStyle}>{item?.statusName}</Text>

        <Text style={{ ...FONTS?.h3, textTransform: 'capitalize', marginVertical: 2, } as TextStyle}>{item?.empContractVacationName}</Text>
        <Text style={{ ...FONTS?.h4, textTransform: 'capitalize', marginVertical: 2, } as TextStyle}>{t('startDate')} : {moment(item.startDate).format(dateNumber)}</Text>
        <Text style={{ ...FONTS?.h4, textTransform: 'capitalize', marginVertical: 2, } as TextStyle}>{t('endDate')} : {moment(item.endDate).format(dateNumber)}</Text>
        <Text style={{ ...FONTS?.h4, textTransform: 'capitalize', marginVertical: 2, } as TextStyle}>{t('vduration')} : {item?.vacationDuration}</Text>
        {item?.notes ? <Text style={{ ...FONTS?.h4 } as TextStyle}>{item?.notes}</Text> : null}
        <MainButton
          onPress={async () => {
            const userData = await AsyncStorage.getItem('userId');
            const userId: number = JSON.parse(userData || '0');
            data = {
              "processActionID": 1,
              "recordID": item?.id,
              "CreatedBy": userId,
              "describtion": `${item?.empContractVacationName} ${t('from')} ${moment(item.startDate).format(dateNumber)} ${t('to')} ${moment(item.endDate).format(dateNumber)}`,
              "actionName": "Approval"
            }
            console.log(data)
            let sendToApproval = await approveVacEmp(data)
            console.log("sendToApproval", sendToApproval)
            if (sendToApproval?.success == true) {
              setFeedBackModal(true)
              setFeedBackImg(images?.success)
              setFeedBackTitle(`${t('sendforapprove')}\n${item?.empContractVacationName} \n ${t('from')} ${moment(item.startDate).format(dateNumber)} ${t('to')} ${moment(item.endDate).format(dateNumber)}`)
            } else {
              setFeedBackModal(true)
              setFeedBackImg(images?.fail)
              setFeedBackTitle(sendToApproval?.error?.message || t('somethingerror'))
            }
          }}
          containerStyle={{ paddingVertical: 2, height: 30, marginTop: 20 }} label={t('sendforapprove')} />
      </View>)
    }
    return <FlatList
      data={vacationList}
      renderItem={renderItem}
      numColumns={2}
      style={{
        marginHorizontal: 8,
      }}
      contentContainerStyle={{
        paddingBottom: 300
      }}
      ListEmptyComponent={() => {
        return <View style={{ width: 'auto', height: SIZES.height / 3, justifyContent: 'center', alignContent: 'center', alignItems: "center" }}>
          <Image source={icons?.vacc} style={{ width: 100, height: 100, tintColor: COLORS?.lightGray2 }} />
          <Text style={{ ...FONTS?.h4, alignSelf: 'center', color: COLORS?.lightGray2 } as TextStyle}>{t('nodataAva')}</Text>
        </View>
      }}
    />
  }
  return (
    <SafeAreaView>
      <DateTimePickerModalView
        isVisible={isVisible}
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => { setisVisible(val); }}
        dateValue={dateType === 'start' ? startDate : endDate}
        show={dateShowModal}
        selectedDate={(val: Date) => {
          console.log('val', val, val.toString());
          setDateShowModal(false);
          if (dateType === 'start') {
            setStartDate(val);
            setDateType('');
            setDateShowModal(false);
            Platform.OS == 'ios' && setisVisible(false);

          } else if (dateType === 'end') {
            setEndDate(val);
            setDateType('');
            setDateShowModal(false);
            Platform.OS == 'ios' && setisVisible(false);
          }
        }}
        minval={firstDayOfYear} mode={'date'} />
      <FeedBackModal
        isVisible={feedBackModal}
        description={feedBackTitle}
        Image={feedBackImg}
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
          setFeedBackModal(val);
        }}
      />

      {/* ..................................... */}
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('leave_request')}
      />
      {loading ?
        <Loader style={{ marginTop: 100 }} />
        : <>
          <FilterView />
          <VacationGridView data={vacationList} />
          <View style={{ height: 300 }} />
        </>}

    </SafeAreaView>
  );
};

export default VacationHistory;
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Image,
  FlatList,
  Alert,
  TextStyle,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MainHeader from '../../common/components/MainHeader';
import {useTranslation} from 'react-i18next';
import {COLORS, SIZES, icons, FONTS, images} from '../../../constants';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CalendarHeader from './components/CalendarHeader';

import {
  dateNumber,
  daysAr,
  daysEn,
  fulldateFormate,
  monthsAr,
  monthsEn,
} from '../../../constants/dateFormate';
import EmptyView from '../../common/components/EmptyView';
import Loader from '../../common/components/Loader';
import {formatDate, formatDayName} from '../../Profile/Services/services';
import JustificationsForAbsence from './components/JustificationsForAbsence';
import {RootStackParamList} from '../../../navigation/types';
import MainButton from '../../common/components/MainButton';
import moment from 'moment';
moment.locale('en');
import CheckBoxComp from '../../common/components/CheckBoxComp';
import {
  approveJustifications,
  getEmployeeAttendanceStatus,
} from './services/services';
import ChoosesDay from './components/ChoosesDay';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedBackModal from '../../common/components/FeedBackModal';
import SubHeader from '../../common/components/SubHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import { use } from 'i18next';

// Define the type for shift items
interface AttendanceRecord {
  justificationReason: any;
  date?: string; // يمكنك تحويلها إلى Date إذا كنت تحتاج إلى التعامل معها ككائن Date
  justificationTypeId?: number;
  shiftName?: string;
  shiftId?: number;
  attendanceId?: number;
  empId?: number;
  hasRequest?: boolean;
  justifiedData?: any | undefined;
  notes?: string | null;
  isApproved?: boolean;
}

const DaysWithoutFingerprinting: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showCalenderForDownload, setShowCalenderForDownload] =
    useState<boolean>(false);
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [pdfLoader, setPdfLoader] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [feedBack, setfeedBack] = useState<boolean>(false);
  const [feedBackmsg, setfeedBackmsg] = useState<boolean | string>(false);
  const [feedBackImage, setFeedBackImage] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [justifiedPayload, setJustifiedPayload] = useState<any>(null);
  const [isJustified, setIsJustified] = useState(false);
  const route = useRoute<any>();

  const months = I18nManager?.isRTL ? monthsAr : monthsEn;
  const days = I18nManager?.isRTL ? daysAr : daysEn;

  // const { justifiedData } = route.params as { justifiedData: AttendanceRecord } || {};
  const justifiedData = route?.params?.justifiedData as {
    attendanceData: any[];
    justificationReason: string;
    notes?: string;
    selectedFile?: any;
  };

  useEffect(() => {
    if (justifiedData) {
      console.log('📩 بيانات التبرير المستلمة:', justifiedData);
      setJustifiedPayload(justifiedData);

      // مثال: دمج التبرير الجديد مع قائمة الأيام الموجودة
      // أو ممكن تعيد تحميل البيانات أو تحدث UI
    }
  }, [justifiedData]);


  useEffect(() => {
    
  }, [])
  const handleJustificationApproval = async (
    justification: AttendanceRecord,
  ) => {
    setLoading(true);

    const payload = {
      excutedProcessID: 3,
      recoredId: justification.attendanceId,
      personId: justification.empId,
      describtion:
        justification.justificationReason ?? justification.justificationReason,
      actionName: 'Approval',
    };

    try {
      console.log('Request Data:', payload);
      const res = await approveJustifications(payload);
      console.log('Response data:', res);

      // ✅ بدل if(res?.success)
      if (res && Object.keys(res).length > 0) {
        // عدل العنصر نفسه فقط
        setAttendanceData(prev =>
          prev.map(item =>
            item.attendanceId === justification.attendanceId
              ? {...item, isApproved: true}
              : item,
          ),
        );

        setfeedBack(true);
        setfeedBackmsg(t('approvalSentSuccessfully'));
        setFeedBackImage(images?.success);
      } else {
        setfeedBack(true);
        setfeedBackmsg(t('approvalFailed'));
        setFeedBackImage(images?.fail);
      }
    } catch (error) {
      console.error('Error:', error);
      setfeedBack(true);
      setfeedBackmsg(t('somethingWentWrong'));
      setFeedBackImage(images?.fail);
    } finally {
      setLoading(false);
    }
  };
  const getCurrentDate = () => {
  const now = new Date();

  // أول يوم في الشهر
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  // آخر يوم في الشهر
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  return { startDate, endDate };
};

  const fetchNotAttendanceData = async () => {
    setLoading(true);
    const {startDate, endDate} = getCurrentDate();
    const data = await getEmployeeAttendanceStatus(startDate, endDate, 1, 100);
    console.log('data?.returnData', data?.returnData);
    setAttendanceData(data?.returnData);
    setLoading(false);
  };

  const getNotAttendanceData = async (startDate: string, endDate: string) => {
    setLoading(true);
    const data = await getEmployeeAttendanceStatus(startDate, endDate, 1, 31);
    console.log('data?.returnData', data?.returnData);
    setAttendanceData(data?.returnData);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotAttendanceData();
  }, []);

  const handleDayPress = (day: {dateString: string}): void => {
    const {dateString} = day;

    if (!startDate) {
      setStartDate(dateString);
      setMarkedDates({
        [dateString]: {startingDay: true, color: '#70d7c7', textColor: 'white'},
      });
    } else if (startDate && !endDate) {
      if (dateString <= startDate) {
        setStartDate(dateString);
        setEndDate(null);
        setMarkedDates({
          [dateString]: {
            startingDay: true,
            color: '#70d7c7',
            textColor: 'white',
          },
        });
      } else {
        setEndDate(dateString);
        const range = getDatesInRange(startDate, dateString);
        const newMarkedDates: Record<string, any> = {};
        range.forEach((date, index) => {
          newMarkedDates[date] = {
            color: '#70d7c7',
            textColor: 'white',
            startingDay: index === 0,
            endingDay: index === range.length - 1,
          };
        });
        setMarkedDates(newMarkedDates);
      }
    } else {
      setStartDate(dateString);
      setEndDate(null);
      setMarkedDates({
        [dateString]: {startingDay: true, color: '#70d7c7', textColor: 'white'},
      });
    }
  };

  const getDatesInRange = (start: string, end: string): string[] => {
    let dates: string[] = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const renderCalendar = (): JSX.Element => (
    <View style={styles.calendar}>
      <Calendar
        markingType={'period'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: 'orange',
          monthTextColor: 'blue',
          indicatorColor: 'blue',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        monthNames={months}
        dayNames={days}
        firstDay={7}
      />
      <View style={{...styles?.row, ...styles?.cfooter}}>
        <TouchableOpacity
          onPress={async () => {
            if (startDate && endDate) {
              console.log('startDate', startDate);
              console.log('endDate', endDate);

              await getNotAttendanceData(startDate, endDate);
              setShowCalenderForDownload(false);
              setShowCalender(false);
              setStartDate(null);
              setEndDate(null);
              setMarkedDates({});
            } else {
              console.warn('Please select both start and end dates.');
            }
          }}
          style={styles?.db}>
          <Text style={{...FONTS?.h3, color: COLORS?.white} as TextStyle}>
            {t('choose')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowCalenderForDownload(false);
            setShowCalender(false);
            setStartDate(null);
            setEndDate(null);
            setMarkedDates({});
          }}
          style={{
            borderColor: COLORS?.primary,
            padding: SIZES?.Mpading,
            borderRadius: SIZES?.radius,
          }}>
          <Text style={{...FONTS?.h3, color: COLORS?.primary} as TextStyle}>
            {t('cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getAttendanceStatus = (id: number) => {
    if (id === 1) return t('found');
    if (id === 2 || id === 3) return t('notFound');
    return;
  };

  const CardsList = () => {
    const renderItem = ({
      item,
      index,
    }: {
      item: AttendanceRecord;
      index: number;
    }) => {
      return (
        <View style={styles.missingDayDetails}>
          <View>
            <Text style={styles.missingDayDetailsDate}>
              {formatDayName(item?.date)}
            </Text>
          </View>

          <Text style={styles.missingDayDetailsTitle}>
            {formatDate(item?.date)}
          </Text>

          <View
            style={[
              styles.missingDayDetailsItem,
              {borderBottomWidth:1, paddingBottom: 0},
            ]}>
            <Text style={styles.missingDayDetailsLabel}>{t('shift')} :</Text>
            <Text style={styles.missingDayDetailsValue}>{item?.shiftName}</Text>
          </View>

          <View style={[styles.missingDayDetailsItem]}>
            <View style={{width: '50%', flexDirection: 'row'}}>
              <Text style={styles.missingDayDetailsLabel}>
                {t('attendance')}:
              </Text>
              <Text style={styles.missingDayDetailsValue}>
                {item?.justificationTypeId !== undefined &&
                  getAttendanceStatus(item.justificationTypeId)}
              </Text>
            </View>
            <View style={{width: '50%', flexDirection: 'row'}}>
              <Text style={styles.missingDayDetailsLabel}>
                {t('departure')}:
              </Text>
              <Text style={styles.missingDayDetailsValue}>
                {item?.justificationTypeId !== undefined &&
                  getAttendanceStatus(item.justificationTypeId)}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* { */}
   
            {/* // !item.hasRequest &&  ( */}
              <TouchableOpacity
                onPress={() => {
                  if (!item.hasRequest) {
                    // مفيش تبرير → روح اعمل تبرير
                    navigation.navigate('JustificationsForAbsence', {
                      attendanceId: item.attendanceId!,
                      date: item.date!,
                      justificationTypeId: item.justificationTypeId!,
                      onSubmit: (justification: any) => {
                        setAttendanceData(prev =>
                          prev.map(record =>
                            record.attendanceId === item.attendanceId
                              ? {
                                  ...record,
                                  hasRequest: true,
                                  justifiedData: justification,
                                }
                              : record,
                          ),
                        );
                      },
                    });
                  } else if (!item.isApproved) {
                    // فيه تبرير ولسه مش معتمد → ابعت للاعتماد
                    handleJustificationApproval(item);
                  }
                }}
                style={{flexDirection: 'row', marginHorizontal: 10}}>
                <Image source={icons?.justifications} />
                <View style={{paddingHorizontal: 5}} />
                <Text style={styles.requestForJustification}>
                  {!item.hasRequest
                    ? t('requestForJustification') // طلب تبرير
                    : !item.isApproved
                    ? t('sendforApproval') // ارسال اعتماد
                    : t('sentForApproval')}
                </Text>
              </TouchableOpacity>
            {/* // )} */}
          </View>
        </View>
      );
    };
    const Header = () => {
      return (
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.missingDayTitle}>{t('dayoff')}</Text>
          </View>
        </View>
      );
    };
    return (
      <View>
        <Header />
        {/* {showCalender ? renderCalendar() : <ChoosesDay setShowCalender={setShowCalender}/> }  */}
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          // ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 200,
          }}
          ListEmptyComponent={
            <EmptyView
              style={{marginTop: 100}}
              image={icons?.daysWithoutFingerprint}
              label={t('nodays')}
            />
          }
        />
      </View>
    );
  };
  const ChooseDay = () => {
    return (
      <View
        style={{backgroundColor: COLORS?.white, borderRadius: SIZES?.radius}}>
        <View style={{...styles?.row, ...styles?.daysyw}}>
          <Image source={icons?.Calendar} style={{...styles?.icons}} />
          <Text>{t('daysyw')}</Text>
          <TouchableOpacity
            onPress={() => {
              setShowCalenderForDownload(true);
            }}
            style={{
              ...styles?.cday,
            }}>
            <Text style={styles?.chosseDay}>{t('chooseDays')}</Text>
          </TouchableOpacity>
        </View>
        {pdfLink ? (
          <TouchableOpacity
            onPress={async () => {}}
            style={{
              ...styles?.row,
              ...styles?.df,
            }}>
            <Image source={icons?.dwonload} style={{...styles?.di}} />
            <Text
              style={{
                ...FONTS?.body4,
                color: COLORS?.primary,
                alignSelf: 'center',
              }}>
              {t('upload_file')}
            </Text>
          </TouchableOpacity>
        ) : pdfLoader ? (
          <Loader style={{margin: 5}} color={COLORS?.primary} />
        ) : null}
      </View>
    );
  };

 const getFormattedDates = (year: number, month: number) => {
  const formattedStartDate = moment(
    `${year}-${month.toString().padStart(2, '0')}-01`
  ).format('YYYY-MM-DD');

  const formattedEndDate = moment(
    `${year}-${month.toString().padStart(2, '0')}-01`
  )
    .endOf('month')
    .format('YYYY-MM-DD');
    console.log("month from calendar:", month, "year:", year);

  return { formattedStartDate, formattedEndDate };
};

  return (
    <SafeAreaView style={styles.container}>
      <SubHeader
        leftIconAction={() => navigation.navigate('Home')}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        containerStyle={{backgroundColor: COLORS?.white}}
        title={t('daysWithoutFingerprint')}
      />
      <FeedBackModal
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
          setfeedBack(val);
        }}
        isVisible={feedBack}
        description={feedBackmsg}
        Image={feedBackImage}
      />
      <CalendarHeader
        onChange={(month, year) => {
          moment.locale('en');

          const {formattedStartDate, formattedEndDate} = getFormattedDates(
            year,
            month,
          );
       
          console.log('Formatted Start Date:', formattedStartDate);
          console.log('Formatted End Date:', formattedEndDate);

          getNotAttendanceData(formattedStartDate, formattedEndDate);
        }}
      />

      {loader ? (
        <Loader
          size={'large'}
          color={COLORS?.primary}
          style={{marginTop: SIZES?.padding}}
        />
      ) : (
        <View style={styles.content}>
          {showCalenderForDownload ? renderCalendar() : ChooseDay()}

          {CardsList()}
        </View>
      )}
    </SafeAreaView>
  );
};

export default DaysWithoutFingerprinting;



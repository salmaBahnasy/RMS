import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  TextStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackActions, useNavigation} from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import {COLORS, FONTS, icons, images} from '../../../constants';
import styles from './styles';
import MainButton from '../../common/components/MainButton';
import {approveTranEmp, getAllVacationRequests} from './services/services';
import EmptyView from '../../common/components/EmptyView';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedBackModal from '../../common/components/FeedBackModal';
import FilterView from '../../common/components/FilterView';
import SubHeader from '../../common/components/SubHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import { approveVacEmp } from '../../More/services/services';
import { dateNumber } from '../../../constants/dateFormate';

const VacationApprovalRequest: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [requests, setRequests] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(false);

  const [feedbackModal, setFeedBackModal] = useState(false);
  const [feedbackBackTitle, setFeedBackTitle] = useState<string>('');
  const [feedbackBackImg, setFeedBackImg] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [loadingItems, setLoadingItems] = useState<{[key: number]: boolean}>(
    {},
  );

  const filterData = [
    {name: t('all'), value: null},
    {name: t('Pending1'), value: 1},
    {name: t('Approved1'), value: 2},
    {name: t('Rejected1'), value: 3},
    {name: t('NotSent1'), value: 4},
  ];

  useEffect(() => {
    getRequests(1);
  }, []);

  useEffect(() => {
    filterRequests();
  }, [selectedType, allRequests]);

  const getRequests = async (page = 1) => {
    console.log(pageLoading,hasMore)
    if (pageLoading || !hasMore) return;
    setPageLoading(true);
    try {
      console.log("try again")
      const resList = await getAllVacationRequests(page);
      if (resList.length === 0) {
        setHasMore(false);
        setLoading(false)
      } else {
        console.log(resList)
        setAllRequests(prev => [...prev, ...resList]);
        setPageNumber(prev => prev + 1);
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (selectedType === null) {
      setRequests(allRequests);
    } else {
      const filtered = allRequests.filter(
        item => item.approvalStatusId === selectedType,
      );
      setRequests(filtered);
    }
  };

  const statusName = (status: number) => {
    switch (status) {
      case 1:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS?.Warningbg,
              borderColor: COLORS.Warningtxt,
            }}>
            <Text
              style={{...FONTS.body6, color: COLORS.Warningtxt} as TextStyle}>
              {t('Pending')}
            </Text>
          </View>
        );
      case 2:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS?.lightbgGreen,
              borderColor: COLORS.darkGreen,
            }}>
            <Text
              style={{...FONTS.body6, color: COLORS.darkGreen} as TextStyle}>
              {t('Approved')}
            </Text>
          </View>
        );
      case 3:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS?.redOpacity,
              borderColor: COLORS.lightRed,
            }}>
            <Text style={{...FONTS.body6, color: COLORS.lightRed} as TextStyle}>
              {t('Rejected')}
            </Text>
          </View>
        );
      case 4:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS?.darkgray,
              borderColor: COLORS.lightGray4,
            }}>
            <Text
              style={{...FONTS.body6, color: COLORS.lightGray4} as TextStyle}>
              {t('NotSent')}
            </Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS?.redOpacity,
              borderColor: COLORS.lightRed,
            }}>
            <Text style={{...FONTS.body6, color: COLORS.lightRed} as TextStyle}>
              ---
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('vacationRequest')}
      />
      <FeedBackModal
        isVisible={feedbackModal}
        description={feedbackBackTitle}
        Image={feedbackBackImg}
        onDismiss={(val: boolean) => {
          setFeedBackModal(val);
          console.log(val)

          if (!val) {
            console.log(val)

            // إعادة تهيئة البيانات
            setAllRequests([]);
            setHasMore(true);
            setPageNumber(1);
            setLoading(true);

            // استدعاء API مرة أخرى
            getRequests(1);
          }
          // navigation.dispatch(StackActions.pop());
        }}
      />

      {/* ✅ أول شرط: لو لسه بيحمل */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{marginTop: 100}}
        />
      ) : requests.length > 0 ? (
        // ✅ لو خلص تحميل وفيه داتا
        <FlatList
          data={requests}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={{position: 'absolute', right: 10, top: 10}}>
                {statusName(item.approvalStatusId)}
              </View>
              <Text style={{...FONTS.body5} as TextStyle}>
                {I18nManager.isRTL ? item.employeeName : item.employeeNameEn}
              </Text>
            
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('vacationType')}:{' '}
                {item.empContractVacationName ?? item.empContractVacationName}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('startvdate')}{" "}:{" "}{moment(item.startDate).format('DD-MM-YYYY')}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('endvdate')}{" "}:{' '}{moment(item.endDate).format('DD-MM-YYYY')}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('vduration')}:{' '}
                {item.vacationDuration ?? item.vacationDuration}
              </Text>

              {item?.note ? (
                <Text style={{...FONTS.body5} as TextStyle}>
                  {t('note')} :{'\n'} {item?.note}
                </Text>
              ) : null}

              {item?.approvalStatusId === 4 ? (
                <MainButton
                onPress={async () => {
                  const userData = await AsyncStorage.getItem('userId');
                  const userId: number = JSON.parse(userData || '0');
                  let  data = {
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
                    setHasMore(true);

                    setFeedBackModal(true)
                    setFeedBackImg(images?.success)
                    setFeedBackTitle(`${t('sendforapprove')}\n${item?.empContractVacationName} \n ${t('from')} ${moment(item.startDate).format(dateNumber)} ${t('to')} ${moment(item.endDate).format(dateNumber)}`)
                  } else {
                    setHasMore(true);

                    setFeedBackModal(true)
                    setFeedBackImg(images?.fail)
                    setFeedBackTitle(sendToApproval?.error?.message || t('somethingerror'))
                  }
                }}
                label={t('sendforapprove')}
                />
              ) : null}
            </View>
          )}
          onEndReached={() => getRequests(pageNumber)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            pageLoading ? (
              <ActivityIndicator style={{marginVertical: 20}} />
            ) : null
          }
        />
      ) : (
        // ✅ لو خلص تحميل ومفيش داتا
        <EmptyView
          style={{marginVertical: 100}}
          image={icons.approveRejectWorkerRequest}
          label={t('noreq')}
        />
      )}
    </SafeAreaView>
  );
};

export default VacationApprovalRequest;

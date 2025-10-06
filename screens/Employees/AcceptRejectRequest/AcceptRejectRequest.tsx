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
import {approveTranEmp, getAllEmpTransferRequests} from './services/services';
import EmptyView from '../../common/components/EmptyView';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedBackModal from '../../common/components/FeedBackModal';
import FilterView from '../../common/components/FilterView';
import SubHeader from '../../common/components/SubHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

const AcceptRejectRequest: React.FC = () => {
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
    if (pageLoading || !hasMore) return;
    setPageLoading(true);
    try {
      const resList = await getAllEmpTransferRequests(page);
      if (resList.length === 0) {
        setHasMore(false);
      } else {
        setAllRequests(prev => [...prev, ...resList]);
        setPageNumber(prev => prev + 1);
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
        title={t('approveRejectWorkerRequest')}
      />
      <FeedBackModal
        isVisible={feedbackModal}
        description={feedbackBackTitle}
        Image={feedbackBackImg}
        onDismiss={(val: boolean) => {
          setFeedBackModal(val);

          if (!val) {
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
                {I18nManager.isRTL ? item.employeeNameAr : item.employeeNameEn}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('date')}: {moment(item.date).format('YYYY-MM-DD')}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('CurrentTeamAndProject')}:{' '}
                {item.currentTeamAndProject ?? item.CurrentTeamAndProject}
              </Text>
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('NewTeamAndProject')}:{' '}
                {item.newTeamAndProject ?? item.NewTeamAndProject}
              </Text>

              {item?.note ? (
                <Text style={{...FONTS.body5} as TextStyle}>
                  {t('note')} :{'\n'} {item?.note}
                </Text>
              ) : null}

              {item?.approvalStatusId === 4 ? (
                <MainButton
                  onPress={async () => {
                    console.log("BTN pressed ✅");
                    try {
                      console.log("BTN pressed ✅");
                      // 👈 تشغيل اللودينج لهذا الـ item فقط
                      setLoadingItems(prev => ({...prev, [item.id]: true}));

                      // جلب الـ userId
                      const userData = await AsyncStorage.getItem('userId');
                      const userId: number = JSON.parse(userData || '0');

                      // تحديد الاسم حسب اللغة
                      const employeeName = I18nManager?.isRTL
                        ? item.employeeNameAr
                        : item.employeeNameEn;

                      // تكوين الوصف
                      const description = `${t('transfer')} ${employeeName} ${t(
                        'from',
                      )} ${item.currentTeamAndProject || t('undefined')} ${t(
                        'to',
                      )} ${item.newTeamAndProject || t('undefined')}`;

                      // إعداد البيانات للإرسال
                      const payload = {
                        processActionID: 4,
                        recordID: item.id,
                        createdBy: userId,
                        description,
                        actionName: 'Approval',
                      };

                      console.log('Sent data:', payload);

                      // استدعاء API
                      const sendToApproval = await approveTranEmp(payload);
                      console.log('API response:', sendToApproval);

                      // عرض المودال
                      setFeedBackModal(true);

                      if (sendToApproval?.success) {
                        setFeedBackImg(images.success);
                        setFeedBackTitle(
                          sendToApproval?.result?.message?.content ||
                            t('approvedSuccessfully'),
                        );
                      } else {
                        setFeedBackImg(images.fail);
                        setFeedBackTitle(
                          sendToApproval?.error?.message || t('somethingerror'),
                        );
                      }
                    } catch (error) {
                      console.error('Approval Error:', error);
                      setFeedBackModal(true);
                      setFeedBackImg(images.fail);
                      setFeedBackTitle(t('somethingerror'));
                    } finally {
                      // 👈 إيقاف اللودينج لهذا الـ item فقط
                      setLoadingItems(prev => ({...prev, [item.id]: false}));
                    }
                  }}
                  containerStyle={{
                    paddingVertical: 2,
                    height: 30,
                    marginTop: 20,
                  }}
                  label={
                    loadingItems[item.id] ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      t('sendforapprove')
                    )
                  }
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

export default AcceptRejectRequest;

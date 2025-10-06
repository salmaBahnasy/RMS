import React, {useEffect, useState} from 'react';
import {
  Text,
  I18nManager,
  View,
  ScrollView,
  FlatList,
  Image,
  ListRenderItemInfo,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import {COLORS, icons, FONTS, images} from '../../../constants';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import styles from './styles';
import MainTextInput from '../../common/components/MainTextInput';
import CheckBoxComp from '../../common/components/CheckBoxComp';
import MainButton from '../../common/components/MainButton';
import SubHeader from '../../common/components/SubHeader';
import EmptyView from '../../common/components/EmptyView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import FeedBackModal from '../../common/components/FeedBackModal';
import {
  approveTranEmp,
  getAllEmpTransferRequests,
} from '../../Employees/AcceptRejectRequest/services/services';
import {getEquipmentTransferRequests} from './services/services';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Item {
  id: string;
  name: string;
}

const AcceptRejectEquipmentRequest: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(t('choose'));
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [requests, setRequests] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedBackModal] = useState(false);
  const [feedbackBackTitle, setFeedBackTitle] = useState<string>('');
  const [feedbackBackImg, setFeedBackImg] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [feedBack, setfeedBack] = useState<boolean>(false);
  const [feedBackmsg, setfeedBackmsg] = useState<boolean | string>(false);
  const [feedBackImage, setFeedBackImage] = useState<any>(null);
  const [loadingItems, setLoadingItems] = useState<{[key: number]: boolean}>(
    {},
  );
  const [updatedId, setUpdatedId] = useState<number | null>(null);


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
      const resList = await getEquipmentTransferRequests(page); // 🟢 معدات
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
        item => item.approvalStatusId === selectedType, // 🟢 نفس الـ status للعمال والمعدات
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
        title={t('accept_reject_equipment_request')}
      />

      <FeedBackModal
        isVisible={feedbackModal}
        description={feedbackBackTitle}
        Image={feedbackBackImg}
       onDismiss={(val: boolean) => {
    setFeedBackModal(val);

    if (!val && updatedId) {
      // ✅ تحديث الطلب بعد ما يتقفل المودال
      setRequests(prev =>
        prev.map(req =>
          req.id === updatedId ? {...req, approvalStatusId: 1} : req,
        ),
      );
      setAllRequests(prev =>
        prev.map(req =>
          req.id === updatedId ? {...req, approvalStatusId: 1} : req,
        ),
      );

      setUpdatedId(null); // reset
    }
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

              {/* 🟢 اسم المعدة */}
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('equipmentName')}: {item.equipmentName}
              </Text>

              {/* 🟢 السائق */}
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('driverName')}: {item.driverName}
              </Text>

              {/* 🟢 المشروع الحالي */}
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('CurrentTeamAndProject')}: {item.currentProjectTeam}
              </Text>

              {/* 🟢 المشروع الجديد */}
              <Text style={{...FONTS.body5} as TextStyle}>
                {t('NewTeamAndProject')}: {item.newProjectTeam}
              </Text>

              {/* ✅ زرار إرسال للموافقة في حالة NotSent (id = 4) */}
              {item?.approvalStatusId === 4 ? (
                <MainButton
                  onPress={async () => {
                    try {
                      // جلب الـ userId
                      setLoadingItems(prev => ({...prev, [item.id]: true}));
                      const userData = await AsyncStorage.getItem('userId');
                      const userId: number = JSON.parse(userData || '0');

                      // إنشاء الوصف
                      const description = `${t('transfer')} ${
                        item?.equipmentName
                      } ${t('from')} ${
                        item?.currentProjectTeam || 'غير محدد'
                      } ${t('to')} ${item?.newProjectTeam || 'غير محدد'}`;

                      // إعداد البيانات للإرسال
                      const data = {
                        processActionID: 26,
                        recordID: item?.id,
                        createdBy: userId,
                        description: description,
                        actionName: 'Approval',
                      };

                      // استدعاء API
                      const sendToApproval = await approveTranEmp(data);

                      console.log('Sent data:', data);
                      console.log('API response:', sendToApproval);

                      // عرض المودال
                      setFeedBackModal(true);
                      console.log('sendToApproval', sendToApproval);

                      const response = Array.isArray(sendToApproval)
                        ? sendToApproval[0] || {}
                        : sendToApproval;
                      console.log('response', response?.success);
                      // التعامل مع الـ success
                      // بعد ما تتأكد إن الإرسال نجح
                      if (
                        sendToApproval &&
                        Object.keys(sendToApproval).length > 0
                      ) {
                        setFeedBackImg(images.success);
                        setFeedBackTitle(
                          sendToApproval?.result?.describtion || description,
                        );
                         setUpdatedId(item.id);
                        // 🟢 تحديث حالة العنصر في الـ state
                        setRequests(prev =>
                          prev.map(req =>
                            req.id === item.id
                              ? {...req, approvalStatusId: 1} // نخليه Pending
                              : req,
                          ),
                        );
                      } else {
                        setFeedBackImg(images.fail);
                        setFeedBackTitle(
                          response?.error?.message || t('somethingerror'),
                        );
                      }
                    } catch (error) {
                      console.error('Error in approval process:', error);
                      setFeedBackModal(true);
                      setFeedBackImg(images.fail);
                      setFeedBackTitle(t('somethingerror'));
                    } finally {
                      setLoadingItems(prev => ({...prev, [item.id]: false}));
                    }
                  }}
                  label={
                    loadingItems[item.id] ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      t('sendforapprove')
                    )
                  }
                  containerStyle={{
                    paddingVertical: 2,
                    height: 30,
                    marginTop: 20,
                  }}
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

export default AcceptRejectEquipmentRequest;

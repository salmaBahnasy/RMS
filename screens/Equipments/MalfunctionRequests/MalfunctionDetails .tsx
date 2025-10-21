import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  I18nManager,
  TextStyle,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../../../constants';
import SubHeader from '../../common/components/SubHeader';
import MainTextInput from '../../common/components/MainTextInput';
import { t } from 'i18next';
import MainButton from '../../common/components/MainButton';
import navigation from '../../../navigation/navigation';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import {
  createEquipmentFixedRequest,
  EquipmentFixedRequestFunction,
  getEquipmentMalfunctionDetailsById,
} from './services/services';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../../Profile/Services/services';
import { launchCamera } from 'react-native-image-picker';
import { CheckCameraPermission } from '../../common/services/services';
import RNFS from 'react-native-fs';
import { getAllworkshop } from '../ReportMalfunction/services/Services';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import CameraModal from '../../common/components/CameraModal';
import { addAttachment } from '../../More/services/services';
import OverLoader from '../../common/components/OverLoader';


const MalfunctionDetailsUI: React.FC = () => {
  const [faultDetails, setFaultDetails] = useState<string>('');
  const navigation = useNavigation<any>();
  const [details, setDetails] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const route = useRoute<any>();
  const { id, isFixed } = route.params as { id: number; isFixed: boolean };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [workshops, setworkshops] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [workshopsid, setworkshopsid] = useState(false)
  const [workshopsname, setworkshopsname] = useState(false)
  const [attachmentuploadedUri, setAttachmentuploadedUri] = useState<string>('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [attachment, setAttachment] = useState<{ uri: string; name: string; type: string }>({ uri: '', name: '', type: '' });
  const [loader, setloader] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      console.log('isFixed', isFixed)
      try {
        setLoading(true);
        const result = await getEquipmentMalfunctionDetailsById(id);
        setDetails(result?.result?.returnData);
        getWorkshop(result?.result?.returnData)
      } catch (e) {
        Alert.alert('خطأ', 'فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);


  // const handleFixed = async () => {
  //   // if (!details?.id) {
  //   //   Alert.alert('خطأ', 'لا يوجد ID للعطل');
  //   //   return;
  //   // }

  //   // let photoBase64 = '';
  //   // if (selectedImage) {
  //   //   photoBase64 = await convertToBase64(selectedImage);
  //   // }

  //   const data = {
  //     id: details.id,
  //     note: faultDetails || '',
  //     photo:attachmentuploadedUri  || '',

  //   };

  //   try {
  //     setButtonLoading(true); // 👈 بدء تحميل الزر
  //     const result = await createEquipmentFixedRequest(data);

  //     const messageType = result?.result?.message?.type;
  //     console.log('messageType', messageType); // 👈 lowercase عشان يبقى مضمون
  //     const messageContent =
  //       result?.result?.message?.content

  //     if (result?.success) {
  //       console.log('esult?.success', result?.success)
  //       setDetails((prev: any) => ({ ...prev, isFixed: true }));
  //       navigation.navigate('FeedBackScreen', {
  //         // header: 'تم الإصلاح بنجاح',
  //         image: images?.success,
  //         buttonText: 'رجوع',
  //         description: messageContent,
  //         onPress: () => {
  //           navigation.dispatch(StackActions.pop(3));
  //         },
  //       });
  //     } else {
  //       navigation.navigate('FeedBackScreen', {
  //         header: 'فشل الإصلاح',
  //         image: images?.fail,
  //         buttonText: 'رجوع',
  //         description: 'لم يتم تسجيل الإصلاح',
  //         onPress: () => {
  //           navigation.goBack();
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     navigation.navigate('FeedBackScreen', {
  //       header: 'خطأ في الشبكة',
  //       image: images?.fail,
  //       buttonText: 'رجوع',
  //       description: 'تأكد من اتصال الإنترنت ثم أعد المحاولة',
  //       onPress: () => {
  //         navigation.goBack();
  //       },
  //     });
  //   } finally {
  //     setButtonLoading(false); // 👈 إيقاف تحميل الزر
  //   }
  // };

  const handleFixed = async () => {
    try {
      let data={
        statusId:details.id,
        note:faultDetails,
        malfunctionId:details.equipmentNumber,
        workshopId:workshopsid
      }
      console.log(data)
      let reponseFixedRequest = await EquipmentFixedRequestFunction(data)
      console.log("reponseFixedRequest",reponseFixedRequest)
    } catch (error) {

    }
  }
  const handlePickImage = async () => {
    const hasPermission = await CheckCameraPermission();
    if (!hasPermission) {
      Alert.alert('لا يوجد إذن لاستخدام الكاميرا');
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('حدث خطأ أثناء التقاط الصورة');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0].uri || null);
        }
      },
    );
  };
  const getWorkshop = (data: any) => {
    if (data?.cycleStatusId == 2) {
      getAllworkshop(data?.malFunctionTypeId).then(res => {
        setworkshops(res?.result?.returnData)
      })
    } else {

    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('malfunctionDetails')}
      />
      <OverLoader isVisible={loader} />
      <CameraModal
        isVisible={showCameraModal}
        onDismiss={(val) => { setShowCameraModal(val); }}
        onSelectedItem={async (val) => {
          setloader(true);
          let attachments = await addAttachment(val);
          setAttachmentuploadedUri(attachments?.result);
          setShowCameraModal(false);
          setAttachment(val);
          setloader(false);
        }}
      />
      <BottomDropdownModal
        isVisible={isVisible}
        onDismiss={val => setIsVisible(val)}
        data={workshops}
        // type={''}
        onSelectedItem={(item: any, selectedType: string) => {
          setworkshopsid(item?.id)
          setworkshopsname(item?.name || I18nManager?.isRTL ? item?.nameAr : item?.nameEn)
          setIsVisible(false);
        }}
      />


      {loading ? (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text
            style={[
              styles.label,
              {
                paddingBottom: 8,
                paddingHorizontal: 10,
                fontWeight: '500',
                fontSize: 16,
              },
            ]}>
            {t('equipmentDetails')}
          </Text>

          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.padding,
            }}>

            {/* الصف الأول: رقم المعدة + نوع الماكينة */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('equipmentNumber')}:</Text>
                <Text style={styles.value}>{details?.equipmentNumber}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{t('machineType')}:</Text>
                <Text style={styles.value}>{details?.machineType}</Text>
              </View>
            </View>

            {/* الصف الثاني: المشروع + الفريق */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('project')}:</Text>
                <Text style={styles.value}>{details?.projectName}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{t('team')}:</Text>
                <Text style={styles.value}>{details?.teamName}</Text>
              </View>
            </View>

            {/* الصف الثالث: السائق + نوع العطل */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('driver')}:</Text>
                <Text style={styles.value}>{details?.driverName}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{t('malfunctionType')}:</Text>
                <Text style={styles.value}>{details?.malfunctionType}</Text>
              </View>
            </View>

            {/* الصف الرابع: تاريخ العطل + تفاصيل العطل */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('malfunctionDate')}:</Text>
                <Text style={styles.value}>{formatDate(details?.date)}</Text>
              </View>
              <View style={[styles.col, { flex: 1 }]}>
                <Text style={styles.label}>{t('malfunctionDetails')}:</Text>
                <Text
                  numberOfLines={expanded ? undefined : 3}
                  style={[
                    styles.value,
                    {
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      lineHeight: 22,
                    },
                  ]}>
                  {details?.malfunctionDetails}
                </Text>
                {details?.malfunctionDetails?.length > 100 && (
                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={{ color: COLORS.primaryColor, marginTop: 5 }}>
                      {expanded ? t('showLess') : t('showMore')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* الصف الخامس: الصورة */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('image')}:</Text>
                {details?.photo && details?.photo !== 'string' ? (
                  <Image
                    source={{ uri: details.photo }}
                    style={{
                      width: 120,
                      height: 100,
                      borderRadius: SIZES.radius,
                      marginTop: 8
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[styles.value, { flex: 1 }]}>{t('noImage')}</Text>
                )}
              </View>
            </View>
          </View>
          {details?.cycleStatusId == 2 ?
          <DropDownButton
            dropdownContainer={{
              backgroundColor: COLORS?.white,
              marginTop: 16,
              padding: 16
            }}
            onIsVisible={() => {
              console.log("opened..")
              setIsVisible(true)
            }}
            label={t('workshop')}
          />
          : null} 
          <View style={{ marginTop: 16 }} />


          {/* ملاحظات */}
          {!isFixed && (
            <>
              <Text
                style={[
                  styles.label,
                  {
                    paddingBottom: 5,
                    paddingHorizontal: 5,
                    fontWeight: '500',
                    fontSize: 16,
                  },
                ]}>
                {t('notes')}
              </Text>
              <MainTextInput
                value={faultDetails}
                multiline
                numberOfLines={5}
                //label={t('notes')}
                placeholder={t('notesR')}
                onChangeText={setFaultDetails}
                // inputContainer={{ marginTop: 15, height: 200 , width: 150}}
                inputContainer={[styles.textArea, {}]}
              />

              {/* <TouchableOpacity
                style={{ marginTop: 20, alignItems: 'center', paddingBottom: 30 }}
                onPress={handlePickImage}>
                <Image source={icons.camera} style={{ width: 40, height: 40 }} />
                <Text>{t('addPhoto')}</Text>
              </TouchableOpacity>
              {selectedImage && (
                <View style={{ marginBottom: 12, alignItems: 'center' }}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
                  />
                </View>
              )} */}
            </>
          )}

          {/* زر الإصلاح */}
          <View style={{ marginTop: 30 }} />
          {!isFixed && (
            <MainButton
              label={t('faultRepaired')}
              onPress={handleFixed}
              disabled={buttonLoading}
            />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    ...FONTS.body4,
    color: COLORS.primaryColor,
    minWidth: 100,
  } as TextStyle,
  value: {
    ...FONTS.body3,
    color: COLORS.lightGray2,
    fontWeight: 'bold',
  } as TextStyle,
  textArea: {
    height: 200,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  col: {
    flex: 1,
    marginRight: 10,
  },
  // label: {
  //   fontWeight: 'bold',
  //   marginBottom: 4,
  // },
  // value: {
  //   color: COLORS.darkGray,
  // },
});

export default MalfunctionDetailsUI;

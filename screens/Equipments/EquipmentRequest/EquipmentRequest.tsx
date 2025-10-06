// .....................................................
// interfaces

import {SafeAreaView} from 'react-native-safe-area-context';
import MainButton from '../../common/components/MainButton';
import DropDownButton from '../../common/components/DropDownButton';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MainTextInput from '../../common/components/MainTextInput';
import SubHeader from '../../common/components/SubHeader';
import {COLORS, FONTS, icons, images} from '../../../constants';
import {
  getEquipmentDetailsByNumber,
  getEquipmentDetailsByNumberQr,
} from '../ReportMalfunction/services/Services';
import {useCallback, useEffect, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import styles from '../ReportMalfunction/styles';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import {
  getAllProjectsforemployeerequest,
  getAllSite,
  getShiftById,
} from '../../Employees/AttendanceAllEmployee/services/Services';
import {DropdownItem} from '../../../navigation/types';
import {
  getAllDriversByTeamId,
  sendEquipmentTransferRequest,
} from './services/services';

// .....................................................
interface Equipment {
  id: number;
  equipmentNumber: string;
  machineType: string;
  projectName?: string;
  teamName?: string;
  driverName?: string;
}

type NavigationProps = {
  [x: string]: any;
  navigate: (screen: string, params?: object) => void;
  goBack: () => void;
};
// .....................................................
// component
// .....................................................
const EquipmentRequest: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const {t} = useTranslation();

  // .....................................................
  // states
  // .....................................................
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [type, setType] = useState('');
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>(t('choose'));
  const [loader, setloader] = useState(true);
  const [allprojects, setAllprojects] = useState([]);
  const [projectLabel, setProjectLabel] = useState<string>(t('choose'));
  const [projectID, setProjectID] = useState<string>('');
  const [allSites, setAllSites] = useState([]);
  const [siteLabel, setSiteLabel] = useState(t('choose'));

  const [allShift, setAllShift] = useState([]);
  const [shiftLabel, setshiftLabel] = useState(t('choose'));

  const [siteId, setSiteId] = useState<string>('');
  const [siteId2, setSiteId2] = useState<string>('');

  const [shiftId, setShiftId] = useState<any>();

  const [feedBackModal, setFeedBackModal] = useState(false);
  const [feedBackTitle, setFeedBackTitle] = useState<string>();
  const [feedBackImg, setFeedBackImg] = useState();
  const [fetchedEquipment, setFetchedEquipment] = useState<any>(null);

  const [fetchedEquipmentQr, setFetchedEquipmentQr] = useState<any>(null);
  const [showQrDetails, setShowQrDetails] = useState(false);
  const [driverOptionModal, setDriverOptionModal] = useState(false);
  const [driversList, setDriversList] = useState<any[]>([]);
  const [driversModal, setDriversModal] = useState(false);

  useEffect(() => {
    const getprojects = async () => {
      let projects = await getAllProjectsforemployeerequest();
      console.log('projects', projects);
      setAllprojects(projects?.result?.returnData);
      setloader(false);
    };
    getprojects();
  }, []);

  const fetchEquipmentData = async (number: string) => {
    if (!number) return;

    const apiResponse = await getEquipmentDetailsByNumberQr(number);

    if (typeof apiResponse === 'string') {
      // في حالة error message string
      setFetchedEquipment(null);
      setShowDetails(false);
      return;
    }

    const result = apiResponse?.result?.returnData;

    if (result) {
      console.log('Equipment result:', result);
      setFetchedEquipment(result);
      setShowDetails(true);
    } else {
      setFetchedEquipment(null);
      setShowDetails(false);
    }
  };

  const handleScan = useCallback(
    (e: BarCodeReadEvent) => {
      const data = e.data.trim();
      setScannedData(data);
      setScannerVisible(false);

      if (data.startsWith('http')) {
        Linking.openURL(data).catch(err =>
          console.error('An error occurred', err),
        );
      } else {
        const match = data.match(/\d+/); // أول رقم يظهر في النص
        if (match) {
          const equipmentNum = match[0]; // مثلاً "34"
          setEquipmentNumber(equipmentNum);

          console.log('equipmentNumber', equipmentNum);
          // هنا نستخدم الدالة الجديدة
          fetchEquipmentData(equipmentNum);
        } else {
          console.warn('QR code does not contain a valid equipment number');
        }
      }
    },
    [fetchEquipmentData],
  );

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const debouncedFetch = useCallback(
    debounce((val: string) => {
      fetchEquipmentData(val);
    }, 500),
    [],
  );

  // const handleSubmit = async () => {
  //   console.log('=== start handleSubmit ===');

  //   if (!equipmentNumber || !projectID || !siteId || !shiftId) {
  //     console.log('Missing fields =>', {
  //       equipmentId,
  //       projectID,
  //       siteId,
  //       shiftId,
  //     });
  //     setFeedBackTitle('يرجى اختيار كل الحقول المطلوبة');
  //     setFeedBackImg(icons?.warning);
  //     setFeedBackModal(true);
  //     return;
  //   }

  //   const payload = {
  //     equipmentId : equipmentNumber,
  //     projectId: Number(projectID),
  //     teamId: Number(siteId),
  //     shiftId: Number(shiftId),
  //     driverId: withDriver ? driverId : undefined,
  //     isSameDriver: true,
  //     hasDriver: withDriver,
  //     isForEquipment: true,
  //     createdById: 0,
  //   };

  //   console.log('Payload =>', payload);

  //   setIsLoading(true);

  //   try {
  //     console.log('=== inside try before request ===');
  //     const response = await sendEquipmentTransferRequest(payload);
  //     console.log('=== after request ===', response);

  //     const messageType = response?.result?.message?.type;
  //     const messageContent =
  //       response?.result?.message?.content || 'تم إرسال الطلب';

  //     if (messageType === 'Error') {
  //       setFeedBackTitle(messageContent);
  //       setFeedBackImg(images?.fail);
  //     } else {
  //       setFeedBackTitle(messageContent);
  //       setFeedBackImg(images?.success);
  //     }

  //     setFeedBackModal(true);
  //   } catch (error) {
  //     console.log('=== inside catch ===', error);
  //     setFeedBackTitle('حدث خطأ أثناء الإرسال');
  //     setFeedBackImg(icons?.warning);
  //     setFeedBackModal(true);
  //   } finally {
  //     console.log('=== finally ===');
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = () => {
    if (!equipmentNumber || !projectID || !siteId || !shiftId) {
      setFeedBackTitle(t('field_required'));
      setFeedBackImg(icons?.warning);
      setFeedBackModal(true);
      return;
    }

    // 👇 نفتح المودال بتاع اختيار السواق
    setDriverOptionModal(true);
  };
  // const fetchDriversByTeam = async (teamId: number) => {
  //   try {
  //     const res = await getAllDriversByTeamId(teamId);
  //     if (res.success) {
  //       setDriversList(res.result?.returnData || []);
  //       setDriversModal(true);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching drivers:', err);
  //   }
  // };
  const fetchDriversByTeam = async (teamId: number) => {
    try {
      const res = await getAllDriversByTeamId(teamId);

      if (!res.success) {
        Alert.alert('خطأ', 'تعذر جلب قائمة السائقين');
        return;
      }

      const drivers = res.result?.returnData || [];

      if (drivers.length === 0) {
        Alert.alert('لا يوجد سائقين', 'لم يتم العثور على سائقين لهذا الفريق');
        return;
      }

      // ✅ فلترة السواقين غير المربوطين على معدات
      const unassignedDrivers = drivers.filter(
        (driver: any) =>
          !driver.equipmentId && driver.isAssignedToEquipment !== true,
      );

      if (unassignedDrivers.length === 0) {
        Alert.alert('لا يوجد سائقين متاحين', 'كل السائقين مربوطين على معدات');
        return;
      }

      setDriversList(unassignedDrivers);
      setDriversModal(true);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل السائقين');
    }
  };

  const sendFinalRequest = async (
    driverIdValue?: number,
    isSameDriver = false,
  ) => {
    const payload = {
      equipmentId: fetchedEquipment?.id,
      projectId: Number(projectID),
      teamId: Number(siteId),
      shiftId: Number(shiftId),
      driverId: driverIdValue ?? fetchedEquipment?.driverId, // ✅ ياخد الجديد لو اتبعت
      isSameDriver,
      hasDriver: (driverIdValue ?? fetchedEquipment?.driverId) !== undefined, // ✅ يعتمد على الموجود
      isForEquipment: true,
      createdById: 0,
    };

    try {
      setIsLoading(true);
      const response = await sendEquipmentTransferRequest(payload);

      const messageType = response?.result?.message?.type ?? 'Success'; // لو مفيش هاعتبرها Success
      const messageContent = response?.result?.message?.content || ''; //t('request_sent')

      navigation.navigate('FeedBackScreen', {
        header: messageType === 'Error' ? '' : 'تم ارسال الطلب',
        images: messageType === 'Error' ? images?.fail : images?.success,
        buttonText: t('back'),
        description: messageContent,
        onPress: () => navigation.dispatch(StackActions.pop(2)),
      });
    } catch (error) {
      navigation.navigate('FeedBackScreen', {
        header: t('request_error'),
        images: icons?.warning,
        buttonText: t('back'),
        description: t('request_error'),
        onPress: () => navigation.goBack(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectedItem = async (item: DropdownItem, type: string) => {
    console.log('selected_proj', item);

    try {
      switch (type) {
        case 'project':
          setProjectLabel(item.projectName);
          setProjectID(item.id);
          const sites = await getAllSite(item.id);
          setAllSites(sites?.result?.returnData || []);

          break;

        case 'sites':
          if ('teamName' in item) {
            setSiteLabel(item.teamName);
            setSiteId(item.id);
            const shift = await getShiftById(item.id);
            setAllShift(shift?.result?.returnData || []);
          }
          break;

        case 'shift':
          if ('shiftName' in item) {
            setshiftLabel(item.shiftName);
            setShiftId(item.id);
          }
          break;

        default:
          console.warn(`Unhandled type: ${type}`);
      }
    } catch (error) {
      console.error('Error in onSelectedItem:', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('equipment_request')}
      />
      <Modal visible={scannerVisible} animationType="slide">
        <QRCodeScanner
          onRead={handleScan}
          flashMode={RNCamera.Constants.FlashMode.auto}
          reactivate
          reactivateTimeout={2000}
          topContent={
            <Text style={styles.centerText}>
              وجه الكاميرا ناحية QR Code للمسح
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setScannerVisible(false)}>
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>
          }
        />
      </Modal>
      <Modal visible={driverOptionModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000088',
          }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 12,
              width: '80%',
            }}>
            <Text style={{...FONTS.h3, marginBottom: 15}}>
              {t('choose_driver_option')}
            </Text>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                setDriverOptionModal(false);
                sendFinalRequest(undefined, false); // بدون سائق
              }}>
              <Text>{t('without_driver')}</Text>
            </TouchableOpacity>

            {fetchedEquipment?.driverId && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => {
                  setDriverOptionModal(false);
                  sendFinalRequest(fetchedEquipment?.driverId, true); // بالسواق الحالي
                }}>
                <Text>{t('with_current_driver')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                setDriverOptionModal(false);
                fetchDriversByTeam(Number(siteId)); // يجيب قايمة السواقين
              }}>
              <Text>{t('choose_another_driver')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={driversModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setDriversModal(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000088',
            }}>
            <TouchableWithoutFeedback>
              {/* محتوى المودال نفسه */}
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 12,
                  width: '80%',
                  maxHeight: '70%',
                }}>
                <Text style={{...FONTS.h3, marginBottom: 15}}>
                  {t('select_driver')}
                </Text>

                {driversList.length === 0 ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 30,
                    }}>
                    <Text style={{...FONTS.body4, color: COLORS.gray}}>
                      {t('no_drivers')}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={driversList}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.optionBtn}
                        onPress={() => {
                          setDriversModal(false);
                          sendFinalRequest(item.id, false);
                        }}>
                        <Text style={styles.optionText}>
                          {I18nManager.isRTL
                            ? item.employeeNameAr
                            : item.employeeNameEn}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BottomDropdownModal
        isVisible={isVisible}
        onDismiss={val => setIsVisible(val)}
        data={dropDownData}
        type={type}
        onSelectedItem={onSelectedItem}
      />

      <ScrollView
        style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 50}}>
        {/* إدخال رقم المعدة */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MainTextInput
            value={equipmentNumber}
            onChangeText={val => {
              setEquipmentNumber(val);

              // في أي تغيير → اخفي الكونتينر الأول
              setFetchedEquipment(null);
              setShowDetails(false);

              // لو الطول 2 أو أكتر → هات داتا جديدة
              if (val.trim().length >= 2) {
                debouncedFetch(val);
              }
            }}
            containerStyle={{flex: 1}}
            placeholder={t('enterEquipmentNumber')}
            inputContainer={{backgroundColor: COLORS?.white}}
          />

          <TouchableOpacity
            style={{...styles?.scanbtn}}
            onPress={() => {
              setScannerVisible(true);
            }}>
            <Image source={icons?.scan} style={{...styles?.icon}} />
          </TouchableOpacity>
        </View>
        {showDetails && fetchedEquipment && equipmentNumber.trim() !== '' && (
          <View style={styles.equipmentContainer}>
            {/* row 1 */}
            <View style={styles.equipmentRow}>
              <View style={{width: '50%', alignItems: 'flex-start'}}>
                <Text style={styles.equipmentLabel}>
                  {t('equipmentNumber')}
                </Text>
                <Text style={styles.equipmentValue}>
                  {fetchedEquipment.number}
                </Text>
              </View>
              <View style={{width: '50%', alignItems: 'flex-start'}}>
                <Text style={styles.equipmentLabel}>{t('machineType')}</Text>
                <Text style={styles.equipmentValue}>
                  {fetchedEquipment.machineType}
                </Text>
              </View>
            </View>

            {/* row 2 */}
            <View style={styles.equipmentRow}>
              <View style={{width: '50%', alignItems: 'flex-start'}}>
                <Text style={styles.equipmentLabel}>{t('project')}</Text>
                <Text style={styles.equipmentValue}>
                  {fetchedEquipment.project || t('not_specified')}
                </Text>
              </View>
              <View style={{width: '50%', alignItems: 'flex-start'}}>
                <Text style={styles.equipmentLabel}>{t('team')}</Text>
                <Text style={styles.equipmentValue}>
                  {fetchedEquipment.team || t('not_specified')}
                </Text>
              </View>
            </View>

            {/* row 3 */}
            <View style={styles.equipmentRow}>
              <View style={{width: '50%', alignItems: 'flex-start'}}>
                <Text style={styles.equipmentLabel}>{t('driver')}</Text>
                <Text style={styles.equipmentValue}>
                  {fetchedEquipment.driver || t('not_specified')}
                </Text>
              </View>
            </View>
          </View>
        )}
        {/* اختيار المشروع الجديد */}
        <View style={{marginTop: 12}} />
        <DropDownButton
          onIsVisible={val => {
            setSiteLabel(t('choose'));
            setSiteId('');
            setshiftLabel(t('choose'));
            setShiftId('');
            // setEmployList([]);
            // setSelectedEmployees([]);
            setSelectedItem('');
            //
            setIsVisible(true);
            setDropDownData(allprojects);
            setType('project');
          }}
          selectedItem={projectLabel}
          label={t('project')}
          dropdownContainer={{marginBottom: 0}}
          labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          dropdownView={{backgroundColor: COLORS?.white}}
        />

        {/* اختيار الفريق الجديد */}
        <DropDownButton
          onIsVisible={val => {
            setshiftLabel(t('choose'));
            setShiftId('');
            // setEmployList([]);
            //  setSelectedEmployees([]);
            setSelectedItem(t('choose'));
            if (projectID) {
              setIsVisible(true);
              setDropDownData(allSites);
              setType('sites');
            } else {
              setFeedBackModal(true);
              setFeedBackTitle(t('pleaseselectproject'));
              setFeedBackImg(icons?.warning);
            }
          }}
          selectedItem={siteLabel}
          label={t('site')}
          dropdownContainer={{marginBottom: 0}}
          labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          dropdownView={{backgroundColor: COLORS?.white}}
        />
        <DropDownButton
          onIsVisible={val => {
            //setEmployList([]);
            //  setSelectedEmployees([]);
            setSelectedItem(t('choose'));
            if (siteId) {
              setIsVisible(true);
              setDropDownData(allShift);
              setType('shift');
            } else {
              setFeedBackModal(true);
              setFeedBackTitle(t('pleaseselectSite'));
              setFeedBackImg(icons?.warning);
            }
          }}
          selectedItem={shiftLabel}
          label={t('shift')}
          dropdownContainer={{marginBottom: 0}}
          labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          dropdownView={{backgroundColor: COLORS?.white}}
        />
        {/* اختيار مع/بدون سائق */}
        {/* <DropDownButton
          onIsVisible={() => setIsVisible(true)}
          selectedItem={withDriver ? t('with_driver') : t('without_driver')}
          label={t('driver_option')}
          dropdownView={{backgroundColor: COLORS?.white}}
        /> */}
      </ScrollView>
      <View style={{paddingHorizontal: 20, paddingBottom: 8}}>
        <MainButton label={t('sendRequest')} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};
export default EquipmentRequest;

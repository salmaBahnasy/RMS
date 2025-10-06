import React, {useCallback, useEffect, useState} from 'react';
import {
  I18nManager,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import RNFS from 'react-native-fs';

import {useTranslation} from 'react-i18next';
import {StackActions, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MainTextInput from '../../common/components/MainTextInput';
import MainButton from '../../common/components/MainButton';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import SubHeader from '../../common/components/SubHeader';
import {COLORS, FONTS, icons, images} from '../../../constants';
import {
  createMalfunctionRequest,
  getAllMalfunctionTypes,
  getEquipmentDetailsByNumber,
  getEquipmentDetailsByNumberForDiesel,
  getEquipmentDetailsByNumberQr,
} from './services/Services';

// Vision Camera imports
import {launchCamera} from 'react-native-image-picker';
import styles from './styles';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {CheckCameraPermission} from '../../common/services/services';

type NavigationProps = {
  [x: string]: any;
  navigate: (screen: string, params?: object) => void;
  goBack: () => void;
};

const ReportMalfunction: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const {t} = useTranslation();

  const [showDetails, setShowDetails] = useState(false);
  const [faultLabel, setFaultLabel] = useState<string>('اختر نوع العطل');
  const [faultId, setFaultId] = useState<string | undefined>();
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const [faultDetails, setFaultDetails] = useState('');
  const [equipmentId, setEquipmentId] = useState<number | undefined>();
  const [equipmentNumber, setEquipmentNumber] = useState<string>('');
  const [machineType, setMachineType] = useState<string>('');
  const [machineTypeId, setMachineTypeId] = useState<number | undefined>();
  const [projectName, setProjectName] = useState<string>('');
  const [projectId, setProjectId] = useState<number | undefined>();
  const [teamName, setTeamName] = useState<string>('');
  const [teamId, setTeamId] = useState<number | undefined>();
  const [driverName, setDriverName] = useState<string>('');
  const [driverId, setDriverId] = useState<number | undefined>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [fetchedEquipment, setFetchedEquipment] = useState<any>(null);

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

  useEffect(() => {
    (async () => {
      const data = await getAllMalfunctionTypes();
      setDropDownData(data);
    })();
  }, []);

  const convertToBase64 = async (uri: string) => {
    try {
      const base64 = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return '';
    }
  };

  const handleSubmit = async () => {
    if (!equipmentNumber || !faultId) {
      Alert.alert('من فضلك اكمل البيانات');
      return;
    }

    const missingData: string[] = [];

    if (!fetchedEquipment?.id) missingData.push('المعدة');
    if (!fetchedEquipment?.projectId) missingData.push('المشروع');
    if (!fetchedEquipment?.teamId) missingData.push('الفريق');
    if (!fetchedEquipment?.driverId) missingData.push('السائق');
    if (!faultId) missingData.push('العطل');
    if (!fetchedEquipment?.machineTypeId) missingData.push('نوع المعدة');

    if (missingData.length > 0) {
      Alert.alert(
        'بيانات غير مكتملة',
        `لا توجد بيانات مرتبطة: ${missingData.join(' - ')}`,
      );
      return; // ✅ مهم جدا عشان ما يكملش ويبني payload
    }

    let photoBase64 = '';
    if (selectedImage) {
      photoBase64 = await convertToBase64(selectedImage);
    }

    const payload = {
      id: 0,
      equipmentId: fetchedEquipment.id,
      equipmentNumber: Number(equipmentNumber),
      photo: photoBase64 || '',
      malfunctionDetails: faultDetails,
      malfunctionTypeId: Number(faultId),
      projectId: fetchedEquipment?.projectId,
      teamId: fetchedEquipment?.teamId,
      driverId: fetchedEquipment?.driverId,
      machineTypeId: fetchedEquipment?.machineTypeId,
      isFixed: true,
    };

    try {
      setIsLoading(true);
      const result = await createMalfunctionRequest(payload);
      console.log('Payload report Request', payload);
      console.log('MalfunctionRequestResponse', result);

      const messageType = result?.result?.message?.type;
      const messageContent =
        result?.result?.message?.content ||
        (messageType === 'Success'
          ? 'تم تسجيل البلاغ بنجاح'
          : 'فشل في إرسال البلاغ');

      navigation.navigate('FeedBackScreen', {
        images: messageType === 'Success' ? images?.success : images?.fail,
        buttonText: 'رجوع',
        description: messageContent,
        onPress: () => navigation.dispatch(StackActions.pop(2)),
      });
    } catch (error) {
      navigation.navigate('FeedBackScreen', {
        header: 'خطأ',
        image: images?.fail,
        buttonText: 'رجوع',
        description: 'حدث خطأ، حاول مرة أخرى',
        onPress: () => navigation.dispatch(StackActions.pop(2)),
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('report_malfunction')}
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

      <BottomDropdownModal
        isVisible={isVisible}
        onDismiss={val => setIsVisible(val)}
        data={dropDownData}
        type={type}
        onSelectedItem={(item: any, selectedType: string) => {
          if (selectedType === 'fault') {
            setFaultLabel(item.name);
            setFaultId(item.id);
          }
          setIsVisible(false);
        }}
      />

      <ScrollView
        style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 50}}>
        <Text style={{...FONTS.h4, marginBottom: 8, paddingHorizontal: 8}}>
          {t('equipmentNumber')}
        </Text>
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
      <Text style={styles.equipmentLabel}>{t('equipmentNumber')}</Text>
      <Text style={styles.equipmentValue}>{fetchedEquipment.number}</Text>
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

        <DropDownButton
          label={t('malfunctionType')}
          selectedItem={faultLabel}
          onIsVisible={() => {
            getAllMalfunctionTypes().then(data => {
              setDropDownData(data?.result?.returnData || []);
              setType('fault');
              setIsVisible(true);
            });
          }}
          dropdownView={{backgroundColor: COLORS?.white}}
          dropdownContainer={{paddingTop: 12}}
        />

        <MainTextInput
          value={faultDetails}
          multiline
          numberOfLines={5}
          label={t('malfunctionDetails')}
          placeholder={t('enterDetails')}
          onChangeText={setFaultDetails}
          inputContainer={[styles?.textArea, {marginTop: 12}]}
          labelStyle={{paddingTop: 8}}
        />

        <TouchableOpacity
          style={{marginTop: 20, alignItems: 'center', paddingBottom: 20}}
          onPress={handlePickImage}>
          <Image source={icons.camera} style={{width: 40, height: 40}} />
          <Text>{t('addPhoto')}</Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={{marginBottom: 30, alignItems: 'center'}}>
            <Image
              source={{uri: selectedImage}}
              style={{width: 100, height: 100, marginTop: 10, borderRadius: 8}}
            />
          </View>
        )}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <MainButton
          label={t('submit')}
          onPress={handleSubmit}
          containerStyle={{margin: 20}}
        />
      )}
    </SafeAreaView>
  );
};

export default ReportMalfunction;

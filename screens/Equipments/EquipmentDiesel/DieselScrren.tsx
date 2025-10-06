import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  I18nManager,
  ScrollView,
  Alert,
  Text,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import MainTextInput from '../../common/components/MainTextInput';
import MainButton from '../../common/components/MainButton';
import {COLORS, icons, images} from '../../../constants';
import {BaseURL} from '../../../constants/BaseUrl';
import styles from '../ReportMalfunction/styles';
import {
  createDieselRequest,
  getEquipmentDetailsByNumber,
  getEquipmentDetailsByNumberForDiesel,
  getEquipmentDetailsByNumberQr,
} from '../ReportMalfunction/services/Services';
import {t} from 'i18next';
import SubHeader from '../../common/components/SubHeader';
import {launchCamera} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';
import RNFS from 'react-native-fs';
import {CheckCameraPermission} from '../../common/services/services';

const DieselScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [equipmentNumberId, setEquipmentNumberId] = useState('');

  const [equipmentDetails, setEquipmentDetails] = useState<any>(null);
  const [beforeQty, setBeforeQty] = useState('');
  const [afterQty, setAfterQty] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string>('');

  const [faultDetails, setFaultDetails] = useState('');
  const [equipmentId, setEquipmentId] = useState<number | undefined>();
  const [machineType, setMachineType] = useState<string>('');
  const [machineTypeId, setMachineTypeId] = useState<number | undefined>();
  const [projectName, setProjectName] = useState<string>('');
  const [projectId, setProjectId] = useState<number | undefined>();
  const [teamName, setTeamName] = useState<string>('');
  const [teamId, setTeamId] = useState<number | undefined>();
  const [driverName, setDriverName] = useState<string>('');
  const [driverId, setDriverId] = useState<number | undefined>();
  const [showDetails, setShowDetails] = useState(false);
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

  const convertToBase64 = async (uri: string) => {
    try {
      const base64 = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return '';
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

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  // Debounced version
  const debouncedFetch = useCallback(
    debounce((val: string) => {
      fetchEquipmentData(val);
    }, 500),
    [],
  );

  const handleSubmit = async () => {
    if (!equipmentNumber || !beforeQty || !afterQty) {
      Alert.alert('من فضلك اكمل البيانات');
      return;
    }

    if (Number(afterQty) < Number(beforeQty)) {
      Alert.alert(
        'خطأ',
        'كمية الديزل بعد التزويد يجب أن تكون أكبر أو مساوية للكمية السابقة',
      );
      return;
    }
    let photoBase64 = '';
    if (selectedImage) {
      photoBase64 = await convertToBase64(selectedImage);
    }

    const payload = {
      id: 0,
      equipmentId: fetchedEquipment?.id,
      equipmentNumber: Number(equipmentNumber),
      driverId: fetchedEquipment?.driverId,
      projectId: fetchedEquipment?.projectId,
      teamId: fetchedEquipment?.teamId,
      machineTypeId: fetchedEquipment?.machineTypeId,
      currentAmountOfDiesel: Number(beforeQty),
      newAmountOfDiesel: Number(afterQty),
      equipmentConsumption: Number(afterQty) - Number(beforeQty),
      photo: photoBase64 || '',
    };

    try {
      setIsLoading(true);

      const result = await createDieselRequest(payload);
      console.log('Payload Diesel Request:', payload);
      console.log('Diesel Response:', result);

      const messageType = result?.result?.message?.type || 'Error';
      const messageContent =
        result?.result?.message?.content || 'حدث خطأ غير متوقع';

      if (result?.result?.message?.type === 'Success') {
        console.log(
          'result?.result?.message?.type',
          result?.result?.message?.type,
        );
        navigation.navigate('FeedBackScreen', {
          // header: 'تم تسجيل الاستهلاك',
          images: images?.success,
          buttonText: 'رجوع',
          description: result?.result?.message?.content,
          onPress: () => {
            navigation.dispatch(StackActions.pop(2));
          },
        });
      } else {
        navigation.navigate('FeedBackScreen', {
          //  header: 'فشل في التسجيل',
          images: images?.fail,
          buttonText: 'رجوع',
          description:
            result?.result?.message?.content ||
            result?.result?.message?.log ||
            'حدث خطأ غير متوقع',
          onPress: () => {
            navigation.goBack();
          },
        });
      }
    } catch (error) {
      navigation.navigate('FeedBackScreen', {
        header: 'فشل في الإرسال',
        images: images?.fail,
        buttonText: 'رجوع',
        description: 'حدث خطأ أثناء الإرسال، حاول مرة أخرى',
        onPress: () => navigation.dispatch(StackActions.pop()),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        title={t('equipmentConsumption')}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        leftIconAction={() => navigation.goBack()}
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

      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={styles.label}>{t('equipmentNumber')}</Text>

        <View style={{...styles?.row}}>
          <MainTextInput
            value={equipmentNumber}
            onChangeText={val => {
              setEquipmentNumber(val);

              if (val.trim() === '') {
                // لو فاضي → شيل الكونتينر
                setFetchedEquipment(null);
                setShowDetails(false);
                return;
              }

              if (val.length >= 2) debouncedFetch(val);
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

        {/* تفاصيل */}
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

        <View style={{marginVertical: 5}} />
        {/* الكميات */}
        <MainTextInput
          label={t('dieselBefore')}
          placeholder={t('enterAmount')}
          keyboardType="numeric"
          value={beforeQty}
          onChangeText={setBeforeQty}
          inputContainer={{backgroundColor: COLORS?.white}}
          containerStyle={{flex: 1}}
        />
        <View style={{marginVertical: 5}} />

        <Text style={styles.label}>{t('dieselAfter')}</Text>
        <View style={{...styles?.row}}>
          <MainTextInput
            // label={t('dieselAfter')}
            keyboardType="numeric"
            value={afterQty}
            onChangeText={setAfterQty}
            inputContainer={{backgroundColor: COLORS?.white}}
            containerStyle={{flex: 1}}
            placeholder={t('enterAmount')}
          />
          <TouchableOpacity
            style={{...styles?.scanbtn}}
            onPress={handlePickImage}>
            <Image source={icons.camera} style={{width: 35, height: 35}} />
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 50,
              paddingTop: 25,
            }}>
            <Image
              source={{uri: selectedImage}}
              style={{width: 150, height: 150, marginTop: 10, borderRadius: 8}}
            />
          </View>
        )}

        {/* صورة */}
        {/* <TouchableOpacity onPress={handlePickImage} style={{ marginVertical: 12 }}>
          <Image source={icons.camera} style={{ width: 30, height: 30 }} />
        </TouchableOpacity> */}
      </ScrollView>
      {isLoading ? (
        <View
          style={{
            height: 48,
            borderRadius: 10,
            backgroundColor: COLORS.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={COLORS.white} />
        </View>
      ) : (
        <View
          style={{
            padding: 20,
            // borderTopWidth: 1,
            borderColor: '#ccc',
            //backgroundColor: '#fff',
          }}>
          <MainButton
            label={t('submit')}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      )}
      {/* <View
  style={{
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  }}>
  <MainButton label="إضافة" onPress={handleSubmit} />
</View> */}
    </SafeAreaView>
  );
};

export default DieselScreen;

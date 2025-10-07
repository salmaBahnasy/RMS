import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  I18nManager,
  TextStyle,
  Image,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import {t} from 'i18next';
import MainButton from '../../common/components/MainButton';
import SubHeader from '../../common/components/SubHeader';
import MainTextInput from '../../common/components/MainTextInput';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getEquipmentMalfunctionGrid} from './services/services';
import {getEquipmentDetailsByNumber} from '../ReportMalfunction/services/Services';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface EquipmentDetails {
  id: any;
  equipmentNumber: string;
  machineType: string;
  projectName: string;
  teamName: string;
  isFixed: boolean;
}

const MalfunctionRequests: React.FC = () => {
  const navigation = useNavigation<any>();

  // States
  const [driverLabel, setDriverLabel] = useState<string>('اختر السائق');
  const [faultId, setFaultId] = useState<number | null>(null);
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
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
  const [malfunctionTypes, setMalfunctionTypes] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [equipmentDetails, setEquipmentDetails] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  // مثال بيانات معدات

  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [equipments, setEquipments] = useState<EquipmentDetails[]>([]);

  const handleSearch = async (val: string) => {
    setEquipmentNumber(val);

    if (val.trim().length > 0) {
      try {
        setLoading(true);

        const data = await getEquipmentMalfunctionGrid(val);
        const result = data?.result;

        // ✅ لو السيرفر رجع Error message
        if (result?.message?.type === 'Error') {
          const errorMsg =
            result?.message?.content ||
            result?.message?.log ||
            'حدث خطأ أثناء جلب البيانات';
          Alert.alert('تنبيه', errorMsg);
          setEquipments([]);
          return;
        }

        // ✅ لو مفيش داتا
        const items = result?.returnData || [];
        if (!items.length) {
          Alert.alert('تنبيه', 'لم يتم العثور على بيانات للمعدة');
        }
        console.log('items from API:', items);
        const mapped: EquipmentDetails[] = items.map((item: any) => ({
          id: item.id,
          equipmentNumber: item.equipmentNumber,
          machineType: item.machineType,
          projectName: item.projectName,
          teamName: item.teamName,
          isFixed: item.isFixed,
        }));
        setEquipments(mapped);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        Alert.alert('خطأ', 'فشل الاتصال بالخادم، حاول لاحقاً');
        setEquipments([]);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('تنبيه', 'من فضلك أدخل رقم المعدة أولاً');
    }
  };

  function debounceAndThrottle<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRun = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();

      // لو مر delay من آخر تنفيذ، شغّل على طول (throttle)
      if (now - lastRun >= delay) {
        func(...args);
        lastRun = now;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      } else {
        // غير كده استنى (debounce)
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastRun = Date.now();
        }, delay);
      }
    };
  }
  const debouncedAndThrottledFetch = useCallback(
    debounceAndThrottle((val: string) => {
      handleSearch(val);
    }, 500),
    [],
  );
  // const handleScan = useCallback((e: BarCodeReadEvent) => {
  //   const data = e.data.trim();
  //   setScannerVisible(false);

  //   // لو لينك افتحه
  //   if (data.startsWith('http')) {
  //     Linking.openURL(data).catch(err =>
  //       console.error('An error occurred', err),
  //     );
  //   } else {
  //     // استخرج أول رقم من النص
  //     const match = data.match(/\d+/);
  //     if (match) {
  //       const equipmentNum = match[0]; // رقم المعدة
  //       setEquipmentNumber(equipmentNum);
  //       console.log('equipmentNumber', equipmentNum);

  //       // استدعاء البحث بنفس الرقم
  //       getEquipmentMalfunctionGrid(equipmentNum);
  //     } else {
  //       Alert.alert('الكود لا يحتوي على رقم معدة صالح');
  //     }
  //   }
  // }, []);

  const handleDetails = (equipment: EquipmentDetails) => {
    navigation.navigate('MalfunctionDetails', {
      id: equipment.id,
      isFixed: equipment.isFixed ?? false,
    }); // ← نبعت الـ id
    console.log('equipment.id,', equipment.id);
    console.log('equipment.isFixed,', equipment.isFixed);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('malfunctionRequests')}
      />
      {/* <Modal visible={scannerVisible} animationType="slide">
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
      </Modal> */}

      <ScrollView style={{padding: 20}}>
        <View style={{...styles?.row}}>
          <MainTextInput
            value={equipmentNumber}
            onChangeText={val => {
              setEquipmentNumber(val);

              // في أي تغيير → اخفي الكونتينر الأول
              setEquipments([]);
              setShowDetails(false);

              // لو الطول 2 أو أكتر → هات داتا جديدة
              if (val.trim().length >= 2) {
                debouncedAndThrottledFetch(val);
              }
            }}
            containerStyle={{flex: 1}}
            placeholder={t('enterEquipmentNumber')}
            inputContainer={{backgroundColor: COLORS?.white}}
            onSubmitEditing={() => {
              if (equipmentNumber.trim().length > 0) {
                debouncedAndThrottledFetch(equipmentNumber); // 👈 بحث مباشر عند الضغط Enter
              }
            }}
          />
          {/* <TouchableOpacity
            style={{...styles?.scanbtn}}
             onPress={() => {
              setScannerVisible(true);
            }}>
            <Image source={icons?.scan} style={{...styles?.icon}} />
          </TouchableOpacity> */}
        </View>

        {/* Modal */}
        <BottomDropdownModal
          isVisible={isVisible}
          onDismiss={(val: boolean) => setIsVisible(val)}
          data={dropDownData}
          type={type}
          onSelectedItem={(item: any, selectedType: string) => {
            if (selectedType === 'driver') {
              setDriverLabel(item.name);
              setFaultId(item.id);
            }
            setIsVisible(false);
          }}
        />

        {/* Search Button */}
        {/* <MainButton label={t('search')} onPress={handleSearch} /> */}
        <View style={{marginTop: 16}} />

        {/* Equipment Cards */}

{equipments.map((equipment, index) => {
  return (
    <View key={index} style={styles.detailsBox}>
      {/* Row رئيسي فيه عمودين */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* العمود الأول فيه الصف الأول والتاني */}
        <View style={{flex: 1}}>
          {/* الصف الأول */}
          <View style={styles.equipmentRow}>
            <View style={{width: '50%'}}>
              <Text style={styles.detailsLabel}>{t('equipmentNumber')}</Text>
              <Text style={styles.detailsValue}>
                {equipment.equipmentNumber}
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.detailsLabel}>{t('machineType')}</Text>
              <Text style={styles.detailsValue}>
                {equipment?.machineType || '-'}
              </Text>
            </View>
          </View>

          {/* الصف الثاني */}
          <View style={styles.equipmentRow}>
            <View style={{width: '50%'}}>
              <Text style={styles.detailsLabel}>{t('project')}</Text>
              <Text style={styles.detailsValue}>
                {equipment.projectName || '-'}
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.detailsLabel}>{t('team')}</Text>
              <Text style={styles.detailsValue}>
                {equipment.teamName || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* العمود الثاني: الحالة */}
<View
  style={{
    marginLeft: 12,
    ...styles.StatusView,
    backgroundColor:equipment.isFixed ?COLORS?.lightbgGreen: COLORS?.redOpacity,//, COLORS?.lightbgGreen,
    borderColor: equipment.isFixed ? '#07B263' : COLORS?.red,
    paddingHorizontal: 14, // 👈 أوسع
    paddingVertical: 8,    // 👈 أطول
    borderRadius: 999,
    borderWidth: 1.5,        // 👈 عرض أكبر للـborder
    alignSelf: 'center',
  }}>
  <Text
    style={{
      ...FONTS.body5, // 👈 أكبر من body6
      color: equipment.isFixed ? '#0E6D42' : '#EF233C',
      fontWeight: 'bold',
      textAlign: 'center',
    }}>
    {t(equipment.isFixed ? 'fixed' : 'disabled')}
  </Text>
</View>


      </View>

      <MainButton
        label={t('viewdetails')}
        onPress={() => handleDetails(equipment)}
        containerStyle={{height: 40, marginTop: 12}}
      />
    </View>
  );
})}




      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filtersRow: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  detailsBox: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailsLabel: {
    ...FONTS.body4,
    color: COLORS.primaryColor,
    minWidth: 90,
  } as TextStyle,
  detailsValue: {
    ...FONTS.body4,
    color: COLORS.lightGray2,
    fontWeight: 'bold',
    flexShrink: 1,
  } as TextStyle,
  detailsBtn: {
    borderWidth: 1,
    borderColor: COLORS.bluePrimary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  detailsBtnText: {
    ...FONTS.body4,
    color: COLORS.bluePrimary,
  } as TextStyle,
  // زر المسح الضوئي
  scanbtn: {
    width: 52,
    height: 42,
    //marginStart: 8,
    //  backgroundColor: COLORS.bluePrimary,
    borderWidth: 1,

    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.primary,
    marginHorizontal: 8,
  },
  // صف input + زر scan
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // أيقونة المسح
  icon: {
    width: 23,
    height: 23,
  },
  scanText: {color: '#fff', fontSize: 18},
  centerText: {fontSize: 16, padding: 20, color: '#444', textAlign: 'center'},
  closeBtn: {
    backgroundColor: COLORS?.primary,
    padding: 12,
    borderRadius: 8,
  },
  closeText: {color: '#fff', fontSize: 18},
  StatusView: {
    backgroundColor: COLORS?.lightbgGreen,
    borderWidth: 1,
    borderColor: COLORS?.darkGreen,
    padding: 8,
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 8,
  },
    equipmentContainer: {
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  marginVertical: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

equipmentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

equipmentLabel: {
  fontSize: 14,
  color: '#7D7D7D', // ثابت
  marginBottom: 4,
},

equipmentValue: {
  fontSize: 14,
  color: COLORS.black, // أو COLORS.primary لو تحب
  fontWeight: '500',
},

});

export default MalfunctionRequests;

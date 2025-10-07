import React, { useEffect, useState } from 'react';
import { Text, I18nManager, View, Image, TouchableOpacity, ScrollView, ImageStyle, TextStyle, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons, FONTS, COLORS } from '../../constants';
import DateTimePickerModalView from '../common/components/DateTimePickerModalView';
import MainHeader from '../common/components/MainHeader';
import ChooseDateNum from './Component/ChooseDateNum';
import MainTextInput from '../common/components/MainTextInput';
import styles from './styles';
import MainButton from '../common/components/MainButton';
import DropDownButton from '../common/components/DropDownButton';
import BottomDropdownModal from '../common/components/BottomDropdownModal';
import { addAttachment, getDaysBetweenDates, getRestofVacation, getVacationType, submitVacationRequest } from './services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraModal from '../common/components/CameraModal';
import ErrorView from '../common/components/ErrorView';
import OverLoader from '../common/components/OverLoader';
import SubHeader from '../common/components/SubHeader';

interface VacationRequestProps { }

// --- أرقام عربي/إنجليزي + محولات عرض/إدخال ---
// ========== في أعلى الملف ==========
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// حول لأي قيمة لسترينج بأمان
const asStr = (v: unknown) => String(v ?? '');

// عربي → إنجليزي
const toEnDigits = (s: unknown) =>
  asStr(s).replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

// إنجليزي → عربي
const toArDigits = (s: unknown) =>
  asStr(s).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);


const VacationRequest: React.FC<VacationRequestProps> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar') ?? false;

  const [dateShowModal, setDateShowModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateType, setDateType] = useState<string>('start');
  const [isVisible, setisVisible] = useState(false);
  const [vacationType, setvacationType] = useState(false);
  const [vacationTypeList, setvacationTypeList] = useState<any[]>([]);
  const [selectedvacationTypeId, setvacationTypeListId] = useState<string>('');
  const [selectedvacationType, setselectedvacationType] = useState<any>({
    empContractId: 0,
    empId: 0,
    companyVacationId: 0,
    companyVacationName: '',
    vacationDays: 0,
    isDeleted: false,
    id: 0,
  });

  const [restedvacation, setrestedvacation] = useState<number | string>(0);

  // نخزن المدة كـ string بالإنجليزي (canonical)
  const [vacationDuration, setVacationDuration] = useState<string>('');

  const [note, setNote] = useState<string | undefined>();
  const [EmpId, setEmpId] = useState<number>(0);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [attachment, setAttachment] = useState<{ uri: string; name: string; type: string }>({ uri: '', name: '', type: '' });
  const [attachmentuploadedUri, setAttachmentuploadedUri] = useState<string>('');

  const [vactionTypeErr, setvactionTypeErr] = useState('');
  const [vacationDurationErr, setvacationDurationErr] = useState('');
  const [startDateErr, setstartDateErr] = useState('');
  const [endDateErr, setendDateErr] = useState('');
  const [loader, setloader] = useState(false);
  const [disabled, setdisabled] = useState(true);

  useEffect(() => {
    const getvactionType = async () => {
      const storedEmpId = await AsyncStorage.getItem('empId');
      const empId = storedEmpId ? JSON.parse(storedEmpId) : 0;
      setEmpId(empId);
      let vacationTypes = await getVacationType(empId);
      setvacationTypeList(Array.isArray(vacationTypes?.result?.returnData) ? vacationTypes?.result?.returnData : []);
    };
    getvactionType();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      getduration();
    }
  }, [startDate, endDate]);

  const getUserlastvaction = async (id: Number | string) => {
    let lastvaction = await getRestofVacation(EmpId, id);
    setrestedvacation(lastvaction?.result?.returnData ? lastvaction?.result?.returnData : '0');
  };

  const getduration = () => {
    try {
      const days = getDaysBetweenDates(startDate, endDate);
      setVacationDuration(String(days)); // خزّن إنجليزي
      setdisabled(false);
    } catch (error) {
      console.log(error);
    }
  };

  // إدخال المدة: قبول أرقام عربية/إنجليزية، وتخزين إنجليزي فقط
  const handleDurationChange = (raw: any) => {
    const rawStr = asStr(raw);                  // تأمين سترينج
    const en = toEnDigits(rawStr).replace(/[^\d]/g, '');
    setVacationDuration(en);
    setvacationDurationErr('');
  };


  // قيمة العرض حسب اللغة
  const displayDuration = isArabic ? toArDigits(vacationDuration) : asStr(vacationDuration);

  const onSubmitRequest = async () => {
    const vacDays = Number(vacationDuration || 0);
    const restDays = Number(restedvacation || 0);

    let data = {
      empContractVacationId: selectedvacationTypeId,
      employeeId: EmpId,
      lastVacationDays: restDays,
      notes: note,
      attachment: attachmentuploadedUri,
      statusId: 1,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      vacationDuration: vacDays,
    };

    if (selectedvacationTypeId === '') {
      setvactionTypeErr(t('vactionTypeErr'));
      return;
    }
    if (startDate == null) {
      setstartDateErr(t('startDateErr'));
      return;
    }
    if (endDate == null) {
      setendDateErr(t('endDateErr'));
      return;
    }
    if (!vacDays) {
      setvacationDurationErr(t('vacationDurationErr'));
      return;
    }
    if (vacDays > restDays) {
      setvacationDurationErr(t('novaction'));
      return;
    }

    let onSubmitres = await submitVacationRequest(data);
    if (onSubmitres?.result?.message?.type == 'Success') {
      navigation.navigate('FeedBackScreen', {
        header: t('Sentsuccessfully'),
        description: '',
        buttonText: t('back'),
        onPress: () => navigation.navigate('Home'),
        image: null,
      });
    } else {
      Alert.alert(
        ""
      ,onSubmitres?.result?.message?.content || t('somthingwrong'),
      [
        { text: t('ok', { defaultValue: 'OK' }) } // هنا الترجمة
      ],
      { cancelable: true }
    );
    }
  };

  const UploadFilesView = () => {
    return (
      <TouchableOpacity onPress={() => { setShowCameraModal(true); }}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
          <Text style={FONTS.body5 as TextStyle}>{t('files')}</Text>
          <Text style={styles.optiontxt}>{t('optional')}</Text>
        </View>
        <TouchableOpacity onPress={() => { setShowCameraModal(true); }} style={styles.uploadFiles}>
          {attachment?.uri !== '' ? (
            <Image source={{ uri: attachment?.uri }} style={{ width: '100%', height: '100%' } as ImageStyle} />
          ) : (
            <>
              <Image source={icons.clould} style={styles.uploadIcon as ImageStyle} />
              <Text style={styles.uploadFiletxt}>{t('choosefile')}</Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // عرض الأرصدة بالأرقام حسب اللغة (اختياري)
  const restedDisplay = isArabic ? toArDigits(String(restedvacation ?? '0')) : String(restedvacation ?? '0');

  return (
    <SafeAreaView>
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
      <DateTimePickerModalView
        isVisible={isVisible}
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => { setisVisible(val); }}
        dateValue={dateType === 'start' ? startDate : endDate}
        show={dateShowModal}
        selectedDate={(val: Date) => {
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
        mode={'date'}
      />

      <BottomDropdownModal
        data={vacationTypeList}
        isVisible={vacationType}
        onDismiss={(val) => { setvacationType(val); }}
        onSelectedItem={(val) => {
          setselectedvacationType(val);
          setvacationTypeListId(val?.id);
          getUserlastvaction(val?.id);
        }}
      />

      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('leave_request')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {Number(restedvacation) > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS?.Warningbg, padding: 5 }}>
            <Text style={{ ...FONTS?.body3 } as TextStyle}>{t('restedvacation')}</Text>
            <Text style={{ ...FONTS?.h3, marginHorizontal: 4 } as TextStyle}>{restedDisplay}</Text>
            <Text style={{ ...FONTS?.body3 } as TextStyle}>{t('day')}</Text>
          </View>
        ) : null}

        <DropDownButton
          onIsVisible={(val: any) => {
            setvactionTypeErr('');
            setvacationType(val);
          }}
          label={t('vacationType')}
          selectedItem={selectedvacationType?.companyVacationName}
          labelStyle={{ ...FONTS.body5, textTransform: 'capitalize' } as TextStyle}
          dropdownView={{ marginVertical: 0, height: 38, ...styles.choosedatebtn }}
        />
        <ErrorView label={vactionTypeErr} styleContainer={{ marginBottom: 8 }} />

        <ChooseDateNum
          title={t('startvdate')}
          date={startDate}
          onPress={(val: boolean) => {
            setvacationDurationErr('');
            setstartDateErr('');
            setendDateErr('');
            Platform.OS == 'ios' && setisVisible(true);
            setStartDate(null);
            setDateType('start');
            setDateShowModal(val);
          }}
          containerStyle={undefined}
        />
        <ErrorView label={startDateErr} styleContainer={{ marginBottom: 8 }} />

        <ChooseDateNum
          title={t('endvdate')}
          date={endDate}
          onPress={(val: boolean) => {
            setvacationDurationErr('');
            setstartDateErr('');
            setendDateErr('');
            Platform.OS == 'ios' && setisVisible(true);
            setEndDate(null);
            setDateType('end');
            setDateShowModal(val);
          }}
          containerStyle={{ marginVertical: 16 }}
        />
        <ErrorView label={endDateErr} styleContainer={{ marginBottom: 8 }} />

        {/* مدة الإجازة (تعرض حسب اللغة وتُخزّن إنجليزي) */}
        <MainTextInput
          label={t('vduration')}
          placeholder={t('vduration')}
          inputContainer={styles.choosedatebtn}
          value={displayDuration}               // دايمًا سترينج
          onChangeText={handleDurationChange}   // بيستقبل أي نوع وبيحوّله
          keyboardType="number-pad"
          inputMode="numeric"
          returnKeyType="done"
          maxLength={3}
          inputStyle={Platform.OS === 'android' && { height: 50 }}
          onBlur={() => {
            if (!vacationDuration) return;
            const n = Math.max(1, Math.min(365, Number(vacationDuration)));
            setVacationDuration(String(n));     // خزن إنجليزي كسلسلة
          }}
        />
        <ErrorView label={vacationDurationErr} styleContainer={{ marginBottom: 8 }} />

        <MainTextInput
          value={note}
          multiline={true}
          numberOfLines={100}
          onChangeText={(val: any) => { setNote(val); }}
          label={t('note')}
          label2={t('optional')}
          inputContainer={styles.textArea}
        />

        <UploadFilesView />

        <MainButton
          containerStyle={{ marginVertical: 30 }}
          label={t('sendRequest')}
          onPress={() => { onSubmitRequest(); }}
          disabled={disabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VacationRequest;

import {
  View,
  Text,
  I18nManager,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import React, {FC, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MainHeader from '../../../common/components/MainHeader';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../../../navigation/types';
import icons from '../../../../constants/icons';
import {t} from 'i18next';
import DropDownButton from '../../../common/components/DropDownButton';
import BottomDropdownModal from '../../../common/components/BottomDropdownModal';
import {COLORS, FONTS} from '../../../../constants/theme';
import MainTextInput from '../../../common/components/MainTextInput';
import images from '../../../../constants/images';
import MainButton from '../../../common/components/MainButton';
import { pick } from '@react-native-documents/picker';
import {postAbsenceJustification} from '../services/services';
import FeedBackModal from '../../../common/components/FeedBackModal';
import SubHeader from '../../../common/components/SubHeader';

type JustificationsForAbsenceRouteProp = RouteProp<
  RootStackParamList,
  'JustificationsForAbsence'
>;

const JustificationsForAbsence: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [justificationReason, setJustificationReason] = useState<string>('');
  const [notes, setNotes] = useState<string | null>(null);
  const [justificationReasonError, setJustificationReasonError] = useState<
    string | null
  >(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [feedBack, setfeedBack] = useState<boolean>(false);
  const [feedBackmsg, setfeedBackmsg] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedBackImage, setFeedBackImage] = useState<any>(null);
  const [resultData, setResultData] = useState<any>({});
  const route = useRoute<JustificationsForAbsenceRouteProp>();
  const {attendanceId, date, justificationTypeId} = route.params;

  const pickFile = async () => {
    try {
      // مفيش arguments هنا — المكتبة الجديدة بتشتغل كده
      const result = await pick();

      if (result && result[0]) {
        console.log('📁 URI:', result[0].uri);
        console.log('📄 الاسم:', result[0].name);
        setSelectedFile(result[0].name);
      } else {
        console.log('❌ تم إلغاء اختيار الملف');
      }
    } catch (err) {
      console.error('⚠️ خطأ أثناء اختيار الملف:', err);
    }
  };

  const handleSave = async () => {
    setJustificationReasonError('');
    setNotesError('');

    let hasError = false;

    if (!justificationReason) {
      setJustificationReasonError(t('pleaseEnterJustificationReason'));
      hasError = true;
    }
    if (hasError) {
      return; // ❌ لا تكمل التنفيذ إذا فيه خطأ
    }

    // ✅ بدء التحميل
    setLoading(true);

    const attendanceData: any = [
      {
        attendanceId,
        date,
        justificationTypeId,
      },
    ];

    try {
      const result = await postAbsenceJustification(
        justificationReason ?? '',
        notes ?? '',
        selectedFile,
        attendanceData,
      );

      if (result && result?.message?.type === 'Success') {
        console.log('تم إرسال البيانات بنجاح');

        // ✅ رجع البيانات اللي تخص اليوم المختار
        const justificationData = {
          attendanceData,
          justificationReason,
          notes,
          selectedFile,
        };

        // ✅ لو فيه onSubmit مبعوت من الشاشة الأولى، استدعيه
        if (route.params?.onSubmit) {
          route.params.onSubmit(justificationData);
        }

        // ✅ بعد الإرسال ارجع للشاشة السابقة
        navigation.goBack();
      } else {
        console.log('حدث خطأ أثناء إرسال البيانات');
        setfeedBack(true);
        setfeedBackmsg(result?.message?.content);
        setFeedBackImage(images?.fail);
      }
    } catch (error) {
      console.log('Error:', error);
      setfeedBack(true);
      setfeedBackmsg(t('somethingWentWrong'));
    } finally {
      setLoading(false); // ✅ وقف التحميل
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('justificationsForAbsence')}
      />
      <FeedBackModal
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
          setfeedBack(val);
          console.log('result ', resultData);

          navigation.dispatch(
            CommonActions.navigate({
              name: 'DaysWithoutFingerprinting',
              params: {justifiedData: resultData},
            }),
          );
        }}
        isVisible={feedBack}
        description={feedBackmsg}
        Image={feedBackImage}
      />
      <View style={styles?.paddingWhiteView}>
        <MainTextInput
          value={justificationReason}
          multiline
          numberOfLines={100}
          onChangeText={text => {
            setJustificationReason(text);
          }}
          label={t('resonOfJustification')}
          placeholder={t('writeOfJustification')}
          inputContainer={styles?.textArea}
        />
        {justificationReasonError && (
          <Text style={{color: 'red', marginTop: 4}}>
            {justificationReasonError}
          </Text>
        )}
        <View style={{paddingTop: 16}} />

        <MainTextInput
          value={notes}
          multiline
          numberOfLines={100}
          onChangeText={text => {
            setNotes(text);
          }}
          label={t('note')}
          placeholder={t('writeOfJustification')}
          inputContainer={[styles?.textArea, {height: 120}]}
        />
        {notesError && (
          <Text style={{color: 'red', marginTop: 4}}>{notesError}</Text>
        )}
        <TouchableOpacity
          onPress={pickFile}
          style={{...styles.row, marginVertical: 8} as StyleProp<ViewStyle>}>
          <Image
            source={icons.dwonload}
            style={
              {...styles.icons, marginHorizontal: 5} as StyleProp<ImageStyle>
            }
          />
          <Text
            style={
              {...styles.label2, color: COLORS.primary} as StyleProp<TextStyle>
            }>
            {t('uploadFile')}
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', paddingTop: 16}}>
          <MainButton
            label={t('save')}
            containerStyle={{
              flex: 3,
              // width: '90%',
            }}
            onPress={handleSave}
          />
          <View style={{paddingHorizontal: 8}} />
          <MainButton
            label={t('cancel')}
            containerStyle={{
              flex: 1,
              // width: '90%',
            }}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JustificationsForAbsence;

const styles = StyleSheet.create({
  paddingWhiteView: {
    backgroundColor: COLORS?.white,
    margin: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    padding: 24,
  },
  textArea: {
    height: 175,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: COLORS?.white,
    borderRadius: 12,
  },
  selectedFileText: {
    marginTop: 8,
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  label2: {
    ...FONTS?.body5,
    color: COLORS?.gray1,
  } as TextStyle,
});

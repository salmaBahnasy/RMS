import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '../../../constants';

interface DateTimePickerModalViewProps {
  mode: 'date' | 'time' | (() => 'date' | 'time');
  minval?: Date;
  show: boolean;
  dateValue?: Date | null;
  selectedDate: (date: Date) => void;
  isVisible?: boolean;
  onDismiss?: (val: boolean) => void;
}

const DateTimePickerModalView: React.FC<DateTimePickerModalViewProps> = (props) => {
  // ✅ استدعاء كل الـ hooks دائمًا في نفس الترتيب
  const { i18n } = useTranslation();

  // حدد الـ locale حسب لغة التطبيق (بدون useMemo لتجنّب Hook إضافي)
  const isArabic = i18n.language?.startsWith('ar') ?? false;
  const localeTag = isArabic ? 'ar-EG' : 'en-US';

  // ثبّتي المود من الـ props (لو دالة نفّذيها مرة واحدة)
  const resolvedMode: 'date' | 'time' =
    typeof props.mode === 'function' ? props.mode() : props.mode;

  const [date, setDate] = useState<Date>(new Date());
  const minDate = props?.minval ?? new Date();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      props.onDismiss?.(false);
      return;
    }
    if (selectedDate) {
      setDate(selectedDate);
      props.selectedDate(selectedDate);
    }
  };

  // ✅ لا نعمل return مبكر قبل ال-hooks؛ فقط نرندر View فارغ لو show=false
  return (
    <View>
      {props.show &&
        (Platform.OS === 'android' ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={props.dateValue || date}
            mode={resolvedMode}
            is24Hour={true}
            display={resolvedMode === 'time' ? 'clock' : 'calendar'}
            onChange={onChange}
            minimumDate={minDate}
            // Android لا يدعم locale داخل هذا البيكر؛
            // نوفّر ترجمة زر محايد إن كان مدعومًا في نسختك:
            {...(Platform.OS === 'android'
              ? { neutralButtonLabel: isArabic ? 'مسح' : 'Clear' }
              : {})}
          />
        ) : (
          <Modal
            isVisible={props?.isVisible}
            onDismiss={() => props?.onDismiss?.(false)}
            onBackdropPress={() => props?.onDismiss?.(false)}
          >
            <View style={styles.modalCard}>
              <DateTimePicker
                testID="dateTimePicker"
                value={props.dateValue || date}
                mode={resolvedMode}
                is24Hour={true}
                // iOS فقط: تمرير locale ليطابق لغة التطبيق
                locale={localeTag}
                display="spinner"
                onChange={onChange}
                minimumDate={minDate}
                style={styles.iosPicker}
              />
            </View>
          </Modal>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    backgroundColor: COLORS?.white,
    width: '90%',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 100,
    borderRadius: 10,
  },
  iosPicker: { alignSelf: 'center' },
});

export default DateTimePickerModalView;

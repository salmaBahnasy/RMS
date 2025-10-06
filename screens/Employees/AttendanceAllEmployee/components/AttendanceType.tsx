import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { icons, COLORS, FONTS } from '../../../../constants';
import ChooseDateNum from '../../../More/Component/ChooseDateNum';

interface Props {
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  recordAttendance: (type: number) => void;
  arriveTime: string | null;
  leaveTime: string | null;
  setarriveTime: (time: string | null) => void;
  setleaveTime: (time: string | null) => void;
  setDateType: (type: 'arrive' | 'leave') => void;
  setDateShowModal: (value: boolean) => void;
  setisVisible: (visible: boolean) => void;
  companySittings: 'shifts' | string;
}

const AttendanceType: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={() => props.onDismiss(false)}
      onBackdropPress={() => props.onDismiss(false)}
    >
      <View style={styles.view}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 10 }]}>
          <Text style={[FONTS.h2, { color: COLORS.primary }]as TextStyle}>{t('prepare')}</Text>
          <TouchableOpacity onPress={() => props.onDismiss(false)}>
            <Image source={icons?.clear} style={styles.clearIcon} />
          </TouchableOpacity>
        </View>

        <Text onPress={() => props.recordAttendance(1)} style={styles.desc}>
          {t('attend')}
        </Text>
        <Text onPress={() => props.recordAttendance(3)} style={styles.desc}>
          {t('absent_with_permission')}
        </Text>
        <Text onPress={() => props.recordAttendance(2)} style={styles.desc}>
          {t('absent')}
        </Text>

        <View style={styles.separator} />

        <View style={[styles.row, { marginRight: 10, marginVertical: 16 }]}>
          <Text style={[FONTS.h3, { color: COLORS.primary }]as TextStyle}>
            {t('youcanaddtimeofattend')}
          </Text>
          {props.companySittings === 'shifts' ? (
            <Text style={FONTS.h3 as TextStyle}>{t('arriveTime')} / {t('LeaveTime')}</Text>
          ) : (
            <Text style={FONTS.h3 as TextStyle}>{t('LeaveTime')}</Text>
          )}

          <View>
            <ChooseDateNum
              title={t('arriveTime')}
              date={props.arriveTime}
              onPress={(val) => {
                if (Platform.OS === 'ios') props.setisVisible(true);
                props.setarriveTime(null);
                props.setDateType('arrive');
                props.setDateShowModal(val);
              }}
              containerStyle={{ flex: 1, marginHorizontal: 8 }}
              valueStyle={{ fontSize: 9 }}
            />
            {props.companySittings === 'shifts' && (
              <ChooseDateNum
                title={t('LeaveTime')}
                date={props.leaveTime}
                onPress={(val) => {
                  if (Platform.OS === 'ios') props.setisVisible(true);
                  props.setleaveTime(null);
                  props.setDateType('leave');
                  props.setDateShowModal(val);
                }}
                containerStyle={{ flex: 1, marginHorizontal: 8 }}
                valueStyle={{ fontSize: 9 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface Style {
  row: ViewStyle;
  img: ImageStyle;
  view: ViewStyle;
  desc: TextStyle;
  clearIcon: ImageStyle;
  separator: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  view: {
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,
  },
  desc: {
    ...FONTS.h4,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray3,
    width: '100%',
    paddingHorizontal: 5,
  }as TextStyle,
  clearIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.primary,
  },
  separator: {
    backgroundColor: COLORS.lightGray,
    width: '90%',
    alignSelf: 'center',
    height: 2,
  },
});

export default AttendanceType;

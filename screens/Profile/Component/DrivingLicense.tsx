import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | number | undefined;
  secTitle?: string;
  secValue?: string | number | (() => JSX.Element);
}

interface DrivingLicenseProps {
  drivingLicenseType? : string | number | undefined;
  drivingLicenseExpiryHijri? : string | number;
  drivingLicenseExpiryGregorian? : string | number;
}
const DrivingLicense: React.FC<DrivingLicenseProps> = ({drivingLicenseType, drivingLicenseExpiryHijri, drivingLicenseExpiryGregorian}) => {
  const { t } = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle, secValue }) => {
    const isSecValueString = typeof secValue === 'string';
    const isSecValueFunction = typeof secValue === 'function';

    const renderSecValue = () => {
      if (isSecValueString) {
        return <Text style={styles.val as StyleProp<TextStyle>}>{secValue}</Text>;
      } else if (isSecValueFunction) {
        return secValue();
      }
      return null;
    };

    return (
      <View style={{ ...styles.row, marginVertical: 8 } as StyleProp<ViewStyle>}>
        <View style={{ width: '50%' }}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
          <Text style={styles.val as StyleProp<TextStyle>}>{fstValue}</Text>
        </View>
        <View style={{ width: '50%' }}>
          {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
          {renderSecValue()}
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('drivingLicense')}</Text>
       
      </View>
      <View>
        <ListViewItem fstTitle={t('drivingLicenseType')} fstValue={drivingLicenseType} />
        <ListViewItem fstTitle={t('drivingLicenseExpiryHijri')} fstValue={drivingLicenseExpiryHijri} />
        <ListViewItem fstTitle={t('drivingLicenseExpiryGregorian')} fstValue={drivingLicenseExpiryGregorian} />
      </View>
    </View>
  );
};

export default DrivingLicense;
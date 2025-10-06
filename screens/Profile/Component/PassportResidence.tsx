import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  ImageSourcePropType,
  ImageProps,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styles} from '../styles';
import {COLORS, FONTS, SIZES, icons, images} from '../../../constants';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | number | undefined;
  secTitle?: string;
  secValue?: string | (() => JSX.Element);
}

interface PassportResidenceProps {
  passportNumber?: string | number | undefined;
  exitReentryIssueDateGregorian?: string | number;
  exitReentryIssueDateHijri?: string | number;
  passportReentryIssueDateGregorian?: string | number;
  passportReentryIssueDateHijri?: string | number;
  professionArabic?: string | number;
  professionInPassport?: string | number;
  image? : ImageSourcePropType | ImageProps;
}

const PassportResidence: React.FC<PassportResidenceProps> = ({
  passportNumber,
  exitReentryIssueDateGregorian,
  exitReentryIssueDateHijri,
  passportReentryIssueDateGregorian,
  passportReentryIssueDateHijri,
  professionArabic,
  professionInPassport,
  image
  
}) => {
  const {t} = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({
    fstTitle,
    fstValue,
    secTitle,
    secValue,
  }) => {
    const isSecValueString = typeof secValue === 'string';
    const isSecValueFunction = typeof secValue === 'function';

    const renderSecValue = () => {
      if (isSecValueString) {
        return (
          <Text style={styles.val as StyleProp<TextStyle>}>{secValue}</Text>
        );
      } else if (isSecValueFunction) {
        return secValue();
      }
      return null;
    };

    return (
      <View style={{...styles.row, marginVertical: 8} as StyleProp<ViewStyle>}>
        <View style={{width: '50%'}}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
          <Text style={styles.val as StyleProp<TextStyle>}>{fstValue}</Text>
        </View>
        <View style={{width: '50%'}}>
          {secTitle && (
            <Text style={styles.label2 as StyleProp<TextStyle>}>
              {secTitle}
            </Text>
          )}
          {renderSecValue()}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        margin: 20,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: 16,
      }}>
      <View
        style={
          {
            ...styles.row,
            justifyContent: 'space-between',
          } as StyleProp<ViewStyle>
        }>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>
          {t('passport_residence')}
        </Text>
        <TouchableOpacity
          style={{
            width: 52,
            height: 36,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: SIZES.base,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.edit}
            style={{width: 20, height: 20, alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
      <View>
        <ListViewItem
          fstTitle={t('passport_number')}
          fstValue={passportNumber}
        />
        <ListViewItem
          fstTitle={t('exit_reentry_issue_date_gregorian')}
          fstValue={exitReentryIssueDateGregorian}
        />
        <ListViewItem
          fstTitle={t('exit_reentry_issue_date_hijri')}
          fstValue={exitReentryIssueDateHijri}
        />
        <ListViewItem
          fstTitle={t('passport_expiry_date_gregorian')}
          fstValue={passportReentryIssueDateGregorian}
        />
        <ListViewItem
          fstTitle={t('passport_expiry_date_hijri')}
          fstValue={passportReentryIssueDateHijri}
        />
        <ListViewItem
          fstTitle={t('profession_arabic')}
          fstValue={professionArabic}
        />
        <ListViewItem
          fstTitle={t('profession_in_passport')}
          fstValue= {professionInPassport}
        />
        <Text style={styles.val as StyleProp<TextStyle>}>
          {t('passport_image')}
        </Text>
        <Image
          source={image}
          style={{width: 303, height: 253, resizeMode: 'contain', backgroundColor : COLORS?.lightGray3, borderRadius: 12}}
        />
      </View>
    </View>
  );
};

export default PassportResidence;

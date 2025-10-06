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
  secValue?: string | number | (() => JSX.Element);
}

interface ResidenceDetailsProps {
  arrivalStatus?: string | number | undefined;
  category?: string | number;
  residenceNumber?: string | number;
  workPermitCostSar?: string | number;
  entryDateKsaGregorian?: string | number;
  entryDateKsaHijri?: string | number;
  nationalAddress?: string | number;
  borderNumber? : string | number;
    image? : ImageSourcePropType | ImageProps;
  

}

const ResidenceDetails: React.FC<ResidenceDetailsProps> = ({
  arrivalStatus,
  category,
  residenceNumber,
  workPermitCostSar,
  entryDateKsaGregorian,
  entryDateKsaHijri,
  nationalAddress,
  borderNumber,
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
        marginHorizontal: 20,
        marginBottom: 20,
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
          {t('residence_details')}
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
          fstTitle={t('residence_number')}
          fstValue={residenceNumber}
        />
       
        <ListViewItem
          fstTitle={t('national_address')}
          fstValue={nationalAddress}
          secTitle={t('border_number')}
          secValue= {borderNumber}
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

export default ResidenceDetails;

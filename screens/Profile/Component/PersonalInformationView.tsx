import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons, images } from '../../../constants';
import { BaseURL } from '../../../constants/BaseUrl';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | number  | undefined;
  secTitle?: string;
  secValue?: string | number | (() => JSX.Element) | undefined;
}


interface PersonalDataProps {
  id? : string | number | undefined;
  nationality? : string | number;
  nameArb? : string | number;
  nameEng? : string | number;
  dateHijri? :  string | number;
  dateBirth? :  string | number | undefined;
  religion? : string | number;
  userName? : string | number | undefined;
  phone? :  string | number;
  source? :  undefined | ImageSourcePropType | string;

}
const PersonalInformationView: React.FC<PersonalDataProps> = ({id, source,nationality, nameArb, nameEng, dateHijri, dateBirth, religion, userName, phone}) => {
  const { t } = useTranslation();
    const [error, setError] = useState(false);


  useEffect (() => {

  },[]);

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
    <View style={{ margin: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('personal_data')}</Text>
        {/* <TouchableOpacity
          style={{
            width: 52,
            height: 36,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: SIZES.base,
            justifyContent: 'center',
          }}
        >
          <Image source={icons?.edit} style={{ width: 20, height: 20, alignSelf: 'center' }} />
        </TouchableOpacity> */}
      </View>
      <View>
        <Text style={{ ...FONTS.body4, marginBottom: 8, marginTop: 16, color: '#5F5F6A' } as StyleProp<TextStyle>}>
          {t('profilePicture')}
        </Text>
    <Image
      source={
        error || !source
          ? (images?.userImage as ImageSourcePropType) // الصورة الافتراضية
          : typeof source === "string"
          ? { uri: `${BaseURL}${source}` } // رابط الصورة من الباك اند
          : source
      }
      style={{ width: 96, height: 96, borderRadius: 96, marginBottom: 8 }}
      onError={() => setError(true)} // لو حصل خطأ، يبدل على طول للصورة الافتراضية
    />
        <ListViewItem fstTitle={t('idNumber')} fstValue={id} secTitle={t('nationality')} secValue= {nationality} />
        <ListViewItem fstTitle={t('nameInArabic')} fstValue={nameArb} secTitle={t('nameInEnglish')} secValue= {nameEng} />
        <ListViewItem fstTitle={t('dateOfBirthHijri')} fstValue={dateHijri} secTitle={t('dateOfBirthGregorian')} secValue= {dateBirth} />
        <ListViewItem
          fstTitle={t('religion')}
          fstValue= {religion}
          secTitle={t('email')}
          secValue={() => (
            <View style={styles.row as StyleProp<ViewStyle>}>
              <Image source={icons.incomplete} style={{ width: 20, height: 20 }} />
              <Text style={styles.val as StyleProp<TextStyle>}>{userName}</Text>
            </View>
          )}
        />
        <ListViewItem fstTitle={t('mobileNumber')} fstValue= {phone}/>
      </View>
    </View>
  );
};

export default PersonalInformationView;
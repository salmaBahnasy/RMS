import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons, images } from '../../../constants';

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
const UserInformationView: React.FC<PersonalDataProps> = ({id, source,nationality, nameArb, nameEng, dateHijri, dateBirth, religion, userName, phone}) => {
  const { t } = useTranslation();

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
       
      </View>
      <View>
        <Text style={{ ...FONTS.body4, marginBottom: 8, marginTop: 16, color: '#5F5F6A' } as StyleProp<TextStyle>}>
          {t('profilePicture')}
        </Text>
        <Image source={images?.userImage as ImageSourcePropType} style={{ width: 96, height: 96, borderRadius: 96, marginBottom: 8 }} />
        <ListViewItem fstTitle={t('idNumber')} fstValue={id} 
         />
         <ListViewItem fstTitle={t('nameInArabic')} fstValue= {nameArb} />
         
        <ListViewItem
          fstTitle={t('mobileNumber')}
          fstValue= {phone}
          secTitle={t('email')}
          secValue={() => (
            <View style={styles.row as StyleProp<ViewStyle>}>
              <Image source={icons.incomplete} style={{ width: 20, height: 20 }} />
              <Text style={styles.val as StyleProp<TextStyle>}>{userName}</Text>
            </View>
          )}
          
        />
      </View>
    </View>
  );
};

export default UserInformationView;
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
  StyleProp,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { COLORS, icons, images, FONTS } from '../../../constants';
import { ProfileScreenNavigationProp } from '../../../navigation/types';
import { getDataEmpDetails } from '../../Profile/Services/services';

const UserInfoCard: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { t, i18n } = useTranslation();
  const [employeeName, setEmployeeName] = useState<string>('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const data = await getDataEmpDetails();
        const result = data?.result?.returnData;

        if (result) {
          const name = i18n.language === 'ar' ? result.nameAr : result.nameEn;
          setEmployeeName(name);
        }
      } catch (err) {
        console.error('Error fetching name:', err);
      }
    };

    fetchName();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile')}
      style={styles.container}
    >
      <Image source={images.userImage} style={{ width: 40, height: 40 }} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={FONTS.h4 as StyleProp<TextStyle>}>
          {employeeName || t('unknown_user')}
        </Text>
        <Text style={{ ...FONTS.h5, color: COLORS.lightGray2 } as StyleProp<TextStyle>}>
          {t('more_subtitle')}
        </Text>
      </View>
      <TouchableOpacity>
        <Image
          source={I18nManager.isRTL ? icons.leftBack : icons.rightBack}
          style={styles.icons as StyleProp<ImageStyle>}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  icons: ImageStyle;
}>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  icons: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: COLORS.gray,
  },
});

export default UserInfoCard;

import React, { useState } from 'react';
import { View, Text, StyleProp, TextStyle, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { styles } from '../styles';
import { FONTS, SIZES, COLORS, images } from '../../../constants';
import { BaseURL } from '../../../constants/BaseUrl';
import { t } from 'i18next';

interface IdentityInfoProps {
  nationalId?: string | number;
  nationalAddress?: string;
  expiryDate?: string; // ISO date string
  identityPic?: string | ImageSourcePropType;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const IdentityInfo: React.FC<IdentityInfoProps> = ({ nationalId, nationalAddress, expiryDate, identityPic }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={{ margin: 16, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <Text style={{ ...FONTS.h2,  }}>الهوية</Text>
<Text style={{ ...FONTS.body4, marginBottom: 8, marginTop: 16, color: '#5F5F6A' } as StyleProp<TextStyle>}>
          {t('profilePicture')}
        </Text>
      {/* 👇 صورة الهوية */}
      <Image
        source={
          imageError || !identityPic
            ? (images?.userImage as ImageSourcePropType)
            : typeof identityPic === 'string'
              ? { uri: `${BaseURL}${identityPic}` }
              : identityPic
        }
        onError={() => setImageError(true)}
        style={{ width: 96, height: 96, borderRadius: 96, marginBottom: 12,  }}
      />

      {/* 👇 صف فيه رقم الهوية + العنوان الوطني */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 12 }}>
        <View style={{ flex: 1, marginRight: 8 } as StyleProp<ViewStyle>}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>رقم الهوية</Text>
          <Text style={styles.val as StyleProp<TextStyle>}>{nationalId}</Text>
        </View>

        <View style={{ flex: 1 } as StyleProp<ViewStyle>}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>العنوان الوطني</Text>
          <Text style={styles.val as StyleProp<TextStyle>}>{nationalAddress}</Text>
        </View>
      </View>

      {/* 👇 تاريخ الانتهاء تحتهم */}
      <View>
        <Text style={styles.label2 as StyleProp<TextStyle>}>تاريخ الانتهاء</Text>
        <Text style={styles.val as StyleProp<TextStyle>}>{formatDate(expiryDate)}</Text>
      </View>
    </View>
  );
};

export default IdentityInfo;

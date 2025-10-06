import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle, ImageStyle, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons, images } from '../../../constants';
import { BaseURL } from '../../../constants/BaseUrl';


interface CertificateItem {
  certificatePhoto: string;
 
}

interface ListViewItemProps {
  item: CertificateItem;
  index: number;
}



interface QualificationsAndCertificates { 
  data : any;
}

const QualificationsAndCertificates: React.FC<QualificationsAndCertificates> = (props) => {
  const { t } = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({ item, index, }) => {
    return (
      <View style={{ marginVertical: 8, ...styles.row, marginLeft: index % 2 === 0 ? 8 : 16 } as StyleProp<ViewStyle>}>
        <View>
          <Image source={  item?.certificatePhoto ?  {uri : BaseURL + item?.certificatePhoto } : images.certificates} style={{ width: 143, height: 156, backgroundColor : COLORS?.lightGray, borderRadius : 12 }} />
          <TouchableOpacity onPress={ () => {
            const link = BaseURL + item?.certificatePhoto; 
            Linking.openURL(link);
            console.log('link', link);
          }} style={{ ...styles.row, marginVertical: 8 } as StyleProp<ViewStyle>}>
            <Image source={icons.dwonload} style={{ ...styles.icons, marginHorizontal: 5 } as StyleProp<ImageStyle>} />
            <Text style={{ ...styles.label2, color: COLORS.primary } as StyleProp<TextStyle>}>{t('uploadFile')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between', marginBottom: 8 } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('qualificationsAndCertificates')}</Text>
        
      </View>
      <View>
        <FlatList
          data={props?.data} // Replace with your actual data
          renderItem={({ item, index }) => <ListViewItem item={item} index={index}  />} // Fix: Pass ListViewItem as a function
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          nestedScrollEnabled={true}

        />
      </View>
    </View>
  );
};

export default QualificationsAndCertificates;
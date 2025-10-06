import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';

interface ExperienceItem {
  id: string;
  title: string | undefined;
  company: string | undefined;
  duration: string;
}

interface ListViewItemProps {
  item: any | ExperienceItem | undefined;
  index: number;

}

interface PreviousExperiencesProps {
  jobName?: string | number | undefined;
  companyName?: string | number | undefined ;
  firstDate?: string | number | undefined;
  endDate?: string | number | undefined;
}





const PreviousExperiences: React.FC<PreviousExperiencesProps>= ({jobName, companyName, firstDate, endDate}) => {
  const { t } = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({ item, index,   }) => {
    return (
      <View style={{ marginVertical: 8, borderWidth: 1, borderRadius: 12, borderColor: COLORS.gray1, padding: 16 }}>
        <Text style={{ ...styles.label, marginVertical: 2 } as StyleProp<TextStyle>}>{jobName}</Text>
        <Text style={styles.label2 as StyleProp<TextStyle>}>{companyName}</Text>
        <Text style={styles.label2 as StyleProp<TextStyle>}>{firstDate}{endDate}</Text>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between', marginBottom: 8 } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('previousExperiences')}</Text>
        <TouchableOpacity
          style={{
            width: 52,
            height: 36,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: SIZES.base,
            justifyContent: 'center',
          }}
        >
          <Image source={icons.edit} style={{ width: 20, height: 20, alignSelf: 'center' }} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={[1, 1]} // Replace with your actual data
          renderItem={(props) => <ListViewItem {...props} />}
           keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default PreviousExperiences;
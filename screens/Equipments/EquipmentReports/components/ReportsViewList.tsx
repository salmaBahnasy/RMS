import React from 'react';
import { FlatList, Text, View, StyleProp, ViewStyle, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// ............................................
import styles from '../styles';
import { COLORS, FONTS } from '../../../../constants';

// Define the type for the component's props
interface ReportsViewListProps {
  data: any[]; // Replace `any` with a more specific type if possible
}

const ReportsViewList: React.FC<ReportsViewListProps> = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <View key={`reports:${index}`} style={styles.ReportsViewStyle}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View>
            <Text style={{...styles?.name}}>{`${index + 1}- اسم العدة`}</Text>
            <Text style={styles?.date}>
              27 Oct 2022 2:45 PM
            </Text>
          </View>
          <View style={styles.warningStatusView}>
            <Text style={styles.warningtxt}>{t('awaitingApproval')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={props.data}
      extraData={props.data}
      renderItem={renderItem}
      style={{ padding: 20 }}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ReportsViewList;
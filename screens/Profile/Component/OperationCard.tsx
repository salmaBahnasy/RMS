import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle, Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';
import { BaseURL } from '../../../constants/BaseUrl';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | (() => JSX.Element) | undefined;
  secTitle?: string;
  secValue?: string | (() => JSX.Element) | undefined;
}

interface OperationCardProps {
  operationCardExpiry?: string | (() => JSX.Element);
  operationCardAttachment?: string | null; // يمكن يكون null
}

const OperationCard: React.FC<OperationCardProps> = ({ operationCardExpiry, operationCardAttachment }) => {
  const { t } = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle, secValue }) => {
    const renderValue = (value: any) => {
      if (typeof value === 'string') return <Text style={styles.val as StyleProp<TextStyle>}>{value}</Text>;
      if (typeof value === 'function') return value();
      return null;
    };

    return (
      <View style={{ ...styles.row, marginVertical: 8 } as StyleProp<ViewStyle>}>
        <View style={{ width: '50%' }}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
          {renderValue(fstValue)}
        </View>
        <View style={{ width: '50%' }}>
          {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
          {renderValue(secValue)}
        </View>
      </View>
    );
  };

  return (
    <View style={{ margin: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('operationCard')}</Text>
      </View>

      <View>
        <ListViewItem
          fstTitle={t('operationCardExpiry')}
          fstValue={operationCardExpiry || t('noData')}
        />

     <ListViewItem
  fstTitle={t('operationCardAttachment')}
  fstValue={() => (
    <TouchableOpacity
      onPress={() => {
        if (!operationCardAttachment || operationCardAttachment === t('noAttachment')) {
          Alert.alert(t('noAttachment'));
          return;
        }
        const link = BaseURL + operationCardAttachment;
        Linking.openURL(link);
      }}
      style={styles.row as StyleProp<ViewStyle>}
    >
      <Image source={icons?.clould} style={{ width: 20, height: 20, marginHorizontal:5 }} />
      <Text style={styles.val as StyleProp<TextStyle>}>
        {operationCardAttachment || t('noAttachment')}
      </Text>
    </TouchableOpacity>
  )}
/>
      </View>
    </View>
  );
};

export default OperationCard;

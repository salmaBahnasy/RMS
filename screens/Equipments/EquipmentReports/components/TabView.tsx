import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// ............................................
import styles from '../styles';
import { COLORS } from '../../../../constants';

// Define the type for the component's props
interface TabViewProps {
  onSelected: (tab: string) => void;
}

// Define the type for the internal Tab component's props
interface TabProps {
  label: string;
  onPress: () => void;
  select: string;
}

const TabView: React.FC<TabViewProps> = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>('awaitingApproval');

  const Tab: React.FC<TabProps> = ({ label, onPress, select }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.tab,
          borderBottomWidth: select === selected ? 2 : 0,
          borderBottomColor: COLORS.primary,
        }}
      >
        <Text
          style={{
            ...styles.tabText,
            color: select === selected ? COLORS.primary : COLORS.black,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.row, styles.container]}>
      <Tab
        label={t('awaitingApproval')}
        onPress={() => {
          props.onSelected('awaitingApproval');
          setSelected('awaitingApproval');
        }}
        select={'awaitingApproval'}
      />
      <Tab
        label={t('previousTransferRequests')}
        onPress={() => {
          props.onSelected('previousTransferRequests');
          setSelected('previousTransferRequests');
        }}
        select={'previousTransferRequests'}
      />
    </View>
  );
};

export default TabView;
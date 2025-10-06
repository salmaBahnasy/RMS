import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from '../styles'; // Adjust the import path as needed
import { COLORS } from '../../../constants'; // Adjust the import path as needed

interface TabViewProps {
  onSelected: (tab: 'employees' | 'equipment') => void;
}

const TabView: React.FC<TabViewProps> = (props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<'employees' | 'equipment'>('employees');

  const Tab: React.FC<{ label: string; onPress: () => void; select: 'employees' | 'equipment' }> = ({ label, onPress, select }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.tab}>
        <Text style={{ ...styles.tabText, color: select === selected ? COLORS.primary : COLORS.black }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.row}>
      <Tab
        label={t('employees')}
        onPress={() => {
          props.onSelected('employees');
          setSelected('employees');
        }}
        select={'employees'}
      />
      <Tab
        label={t('equipment')}
        onPress={() => {
          props.onSelected('equipment');
          setSelected('equipment');
        }}
        select={'equipment'}
      />
    </View>
  );
};

export default TabView;
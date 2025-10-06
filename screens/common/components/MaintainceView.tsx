import React from 'react';
import { View, StyleSheet, ViewStyle, Image, Text, TextStyle } from 'react-native';
import { COLORS, FONTS, icons } from '../../../constants';
import { useTranslation } from 'react-i18next';

// Define the props interface
interface MaintainceViewProps {
  style?: ViewStyle; // Optional style prop
  color?: string; // Optional color prop
  size?: string;
}

const MaintainceView: React.FC<MaintainceViewProps> = ({ style, color }) => {
  const { t } = useTranslation()

  return (
    <View style={{ ...styles?.View }}>
      <Image source={icons?.maintain} style={{ ...styles?.img }} />
      <Text style={{ ...styles?.txt } as TextStyle}>{t('somethingerror')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  View: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  txt: {
    ...FONTS?.h3,
    color: COLORS?.lightGray3,
    alignSelf: 'center'
  }
});

export default MaintainceView;

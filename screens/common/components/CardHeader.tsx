import React from 'react';
import { View, StyleSheet, ViewStyle, Text, TextStyle, Image } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { COLORS, FONTS } from '../../../constants';

// Define the props interface
interface CardHeaderProps {
  style?: ViewStyle; // Optional style prop
  name?: string;
  icon: any
}

const CardHeader: React.FC<CardHeaderProps> = ({ icon, name }) => {
  return (
    <View style={{ ...styles?.row, marginBottom: 20 }}>
      <Image source={icon} style={{ ...styles?.icon }} />
      <Text style={{ ...FONTS?.h3 } as TextStyle}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label2: {
    ...FONTS?.body5,
    color: COLORS?.lightGray4,
    textTransform: 'uppercase'
  } as TextStyle,
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 5
  }
});

export default CardHeader;

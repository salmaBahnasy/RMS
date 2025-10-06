import React from 'react';
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { COLORS, FONTS } from '../../../constants';

// Define the props interface
interface CardRowProps {
  style?: ViewStyle; // Optional style prop
  label?: string; // Optional color prop
  value?: string;
}

const CardRow: React.FC<CardRowProps> = ({ label, value }) => {
  return (
    <View style={{ ...styles?.row }}>
      <Text style={{ ...styles?.label2 } as TextStyle}>
        {label} 
      </Text>
      <Text style={{ ...styles?.label2 } as TextStyle}>: {"  "}</Text>
      <Text style={{ ...FONTS?.h4 } as TextStyle}>
        {value}
      </Text>
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
});

export default CardRow;

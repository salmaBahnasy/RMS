import React from 'react';
import { Text, View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { COLORS, FONTS } from '../../../constants';

interface CheckBoxCompProps {
  value?: boolean;
  onValueChange?: (newValue: boolean) => void;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const CheckBoxComp: React.FC<CheckBoxCompProps> = (props) => {
  return (
    <View style={[styles.row, props.containerStyle,]}>
      <CheckBox
        disabled={false}
        value={props.value}
        onValueChange={props.onValueChange}
      />
      <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...FONTS.h3,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CheckBoxComp;
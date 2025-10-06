import React from 'react';
import { Text, View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS } from '../../../constants';

interface DropdownListProps {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onValueChange: (value: any) => void; // Replace `any` with a more specific type if needed
  items: { label: string; value: any }[]; // Replace `any` with a more specific type if needed
}

const DropdownList: React.FC<DropdownListProps> = (props) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
      <View style={styles.dropdownView}>
        <RNPickerSelect
          onValueChange={(value) => props.onValueChange(value)}
          items={props.items}
          style={pickerSelectStyles}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    borderRadius: 8,
    marginBottom: 16,
    zIndex: 0,
  },
  label: {
    padding: 8,
    fontSize: 16,
    color: '#666',
  },
  dropdownView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.gray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    borderWidth: 1,
  },
});

export default DropdownList;
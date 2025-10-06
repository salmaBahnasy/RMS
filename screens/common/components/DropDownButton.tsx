import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {COLORS, FONTS, icons} from '../../../constants';

interface DropDownButtonProps {
  label?: any;
  labelStyle?: StyleProp<TextStyle>;
  dropdownContainer?: StyleProp<ViewStyle>;
  dropdownView?: StyleProp<ViewStyle>;
  selectedItem?: string;
  onIsVisible: (visible: boolean) => void;
  multi?: boolean;
}

const DropDownButton: React.FC<DropDownButtonProps> = props => {
  return (
    <View style={[styles.dropdownContainer, props.dropdownContainer]}>
      <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
      <TouchableOpacity
        onPress={() => props.onIsVisible(true)}
        style={[styles.dropdownView, props.dropdownView]}>
        {props.selectedItem ? (
          <Text
            style={[{...FONTS.body5, alignSelf: 'center'}, props.labelStyle]}>
            {props?.selectedItem}
          </Text>
        ) : (
          <Text
            style={{...FONTS?.body5, color: COLORS?.lightGray2} as TextStyle}>
            {props?.label}
          </Text>
        )}
        <Image
          source={icons.dwonArrow}
          style={styles.icons as StyleProp<ImageStyle>}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    borderRadius: 8,
    marginBottom: 8,
    zIndex: 0,
  },
  label: {
    paddingHorizontal: 8,
    paddingBottom:6,
    ...FONTS?.h3,
    textTransform: 'capitalize',
    color: '#666',
  } as TextStyle,
  dropdownView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.gray,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    width: 20,
    height: 20,
  },
});

export default DropDownButton;

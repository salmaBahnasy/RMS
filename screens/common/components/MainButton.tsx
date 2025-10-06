import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

interface MainButtonProps {
  disabled?: boolean | undefined;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string | (() => string) | React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
}

const MainButton: React.FC<MainButtonProps> = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.container,
        {
          backgroundColor: props?.disabled
            ? COLORS?.lightGray2
            : COLORS.primary,
        },
        props.containerStyle,
      ]}
      disabled={props?.disabled ? props?.disabled : false}>
      <Text style={[styles.label, props.labelStyle]}>
        {typeof props.label === 'function' ? props.label() : props.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
  },
  label: {
    ...FONTS.h3,
    color: COLORS.white,
    alignSelf: 'center',
    flexShrink:1,
    lineHeight: 22,
    fontFamily: "Dubai-Bold"
    
  },
});

export default MainButton;

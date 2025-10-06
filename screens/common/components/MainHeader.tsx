import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

// Define the type for the component's props
interface MainHeaderProps {
  title: string;
  leftIcon?: ImageSourcePropType;
  leftIconAction?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  containerLabelStyle? :  ViewStyle;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  return (
    <View style={{ ...styles.container, ...props.containerStyle }}>
      {props.leftIcon && (
        <TouchableOpacity onPress={props.leftIconAction}>
          <Image source={props.leftIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
      <View style={{ ...props?.containerLabelStyle }}>
      <Text style={{ ...styles.label, ...props.labelStyle }}>{props.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...FONTS.h3,
    alignSelf: 'center',
    textAlign: 'center',
  // flex: 1,
  marginHorizontal : 10
   
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});

export default MainHeader;
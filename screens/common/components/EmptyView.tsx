import React from 'react';
import { Text, View, StyleSheet, Image, ImageSourcePropType, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

// Define the props interface
interface EmptyViewProps {
  style?: ViewStyle; // Optional style for container
  image?: ImageSourcePropType; // Image source
  ImgStyle?: ImageStyle; // Optional image style
  label?: string; // Optional text label
  labelStyle?: TextStyle; // Optional text style
}

const EmptyView: React.FC<EmptyViewProps> = ({ style, image, ImgStyle, label, labelStyle }) => {
  return (
    <View style={[styles.view, style]}>
      {image && <Image source={image} style={[styles.img, ImgStyle]} />}
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...FONTS.body3,
    alignSelf: 'center',
    marginHorizontal: 10,
    textAlign: 'center',
    color: COLORS.lightGray4,
    marginTop: 10,
  } as TextStyle, // Explicit type for text style

  img: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  } as ImageStyle, // Explicit type for image style

  view: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  } as ViewStyle, // Explicit type for view style
});

export default EmptyView;

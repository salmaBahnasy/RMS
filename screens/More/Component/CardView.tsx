import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

interface CardViewProps {
  onPress?: () => void;
  image: ImageSourcePropType;
  label: string;
}

const CardView: React.FC<CardViewProps> = (props) => {
  return (
    <TouchableOpacity onPress={props?.onPress} style={styles.container}>
      <Image source={props.image} style={{ width: 40, height: 40 }} />
      <Text style={{ ...FONTS.h4, alignSelf: 'center', textAlign: 'center' } as StyleProp<TextStyle>}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 7.5,
    height: 107,
  },
  icons: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: COLORS.gray,
  },
});

export default CardView;
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle, ImageSourcePropType, ImageStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS } from '../../../constants';

interface OptionsViewProps {
  onPress?: () => void;
  leftIcon: ImageSourcePropType;
  label: string;
  rightIcon?: ImageSourcePropType;
  labelStyle?: StyleProp<TextStyle>;
}

const OptionsView: React.FC<OptionsViewProps> = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>('employees');

  return (
    <TouchableOpacity onPress={props.onPress} style={{ ...styles.row, ...styles.optionRowStyle } as StyleProp<ViewStyle>}>
      <View style={{ ...styles.row, flex: 1 } as StyleProp<ViewStyle>}>
        <Image source={props.leftIcon} style={styles.icons as StyleProp<ImageStyle>} />
        <Text style={[styles.label as StyleProp<TextStyle>, props.labelStyle]}>{props.label}</Text>
      </View>
      {props.rightIcon && (
        <Image source={props.rightIcon} style={[styles.icons as StyleProp<ImageStyle>, { tintColor: COLORS.primary }]} />
      )}
    </TouchableOpacity>
  );
};

export default OptionsView;
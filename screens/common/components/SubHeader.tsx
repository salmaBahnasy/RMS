import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

// Define the type for the component's props
interface SubHeaderProps {
  title: string;
  leftIcon?: ImageSourcePropType;
  leftIconAction?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  containerLabelStyle?: ViewStyle;
}

const SubHeader: React.FC<SubHeaderProps> = props => {
  return (
    <View style={{...styles.container, ...props.containerStyle}}>
      {props.leftIcon && (
        <TouchableOpacity
          onPress={props.leftIconAction}
          style={styles.iconContainer}>
          <Image source={props.leftIcon} style={styles.icon} />
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        <Text style={{...styles.label, ...props.labelStyle}}>
          {props.title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: 60,
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    ...FONTS.h3,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
    fontFamily: 'Dubai-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
  },
  iconContainer: {
    position: 'absolute',
    left: 18, // أو right: 18 لو RTL
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});

export default SubHeader;

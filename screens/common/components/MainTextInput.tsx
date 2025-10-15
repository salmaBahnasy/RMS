import React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, StyleProp, ViewStyle, TextStyle, ImageStyle, I18nManager } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

interface MainTextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  label2?: string;
  labelStyle2?: StyleProp<TextStyle>;
  leftIcon?: any; // Replace `any` with a more specific type if needed
  leftIconStyle?: StyleProp<ImageStyle>;
  leftIconAction?: () => void;
  rightIcon?: any; // Replace `any` with a more specific type if needed
  rightIconStyle?: StyleProp<ImageStyle>;
  rightIconAction?: () => void;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  inputStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  editable?: boolean;
  selectTextOnFocus?: boolean;
  multiline?: boolean;
  inputContainer?: StyleProp<ViewStyle>;
  focused?: boolean;
  onFocus?: (focused: boolean) => void;
  value?: string | null ;
  textContentType?: string
  autoComplete?: string,
  onSubmitEditing? : () => void;
}

const MainTextInput: React.FC<MainTextInputProps> = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        {props.label && <Text style={[styles.label, props.labelStyle, ]}>{props.label}</Text>}
        {props.label2 && <Text style={[styles.label, { color: '#93949D' }, props.labelStyle2]}>{props.label2}</Text>}
      </View>
      <View
        style={[
          styles.row,
          styles.inputContainer,
          { borderColor: props.focused ? COLORS.primary : COLORS.gray },
          props.inputContainer,
        ]}
      >
        {props.leftIcon && (
          <TouchableOpacity onPress={props.leftIconAction}>
            <Image source={props.leftIcon} style={[styles.icon, props.leftIconStyle] as ImageStyle} />
          </TouchableOpacity>
        )}

        <TextInput
          numberOfLines={props.numberOfLines || 1}
          keyboardType={props.keyboardType}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          style={[styles.input, props.inputStyle,props.multiline &&{ textAlignVertical: 'top'}]}
          placeholder={props.placeholder}
          placeholderTextColor={COLORS.gray}
          editable={props.editable !== undefined ? props.editable : true}
          selectTextOnFocus={props.selectTextOnFocus !== undefined ? props.selectTextOnFocus : true}
          multiline={props.multiline || false}
          textAlignVertical="top"
          onFocus={() => props.onFocus && props.onFocus(true)}
          onBlur={() => props.onFocus && props.onFocus(false)}
          value={props?.value ?? ''}
          textContentType={
            props?.keyboardType === 'numeric'
              ? (props?.textContentType as
                | "none"
                | "oneTimeCode"
                | "creditCardNumber"
                | "postalCode"
                | undefined)
              : undefined
          }
          autoComplete={
            props?.keyboardType === 'numeric'
              ? (props?.autoComplete as
                | "one-time-code"
                | "postal-code"
                | "tel"
                | undefined)
              : undefined
          }
          onSubmitEditing = {() => props.onSubmitEditing }
        />




        {props.rightIcon && (
          <TouchableOpacity onPress={props.rightIconAction}>
            <Image source={props.rightIcon} style={[styles.icon, props.rightIconStyle] as ImageStyle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...FONTS.body3,
    flex: 1,
    width: '100%',
   alignSelf: 'center',
    textAlign: I18nManager.isRTL ? "right" : "left",

    // height:50
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 8,
  },
  container: {
   // marginVertical: 12,
  },
  label: {
    ...FONTS.body5,
    textTransform: 'capitalize',
    paddingHorizontal: 8,
   // paddingBottom: 4,
  } as TextStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 48,
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
  },
});

export default MainTextInput;
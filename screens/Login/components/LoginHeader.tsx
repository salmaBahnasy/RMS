import React from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View, ImageSourcePropType, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { images, FONTS, COLORS, icons } from '../../../constants';
import styles from '../styles';
// Define the type for the component's props
interface LoginHeaderProps {
  back?: ImageSourcePropType; // Optional back button icon
  backAction?: () => void; // Optional function to handle back button press
  header?: string; // Optional header text
  description?: string; // Optional description text
  txtView?: StyleProp<ViewStyle>; // Optional style for the text container
  changelng: () => void;
  showchangelng: boolean
}

const LoginHeader: React.FC<LoginHeaderProps> = (props) => {
  return (
    <ImageBackground
      source={images.loginHeader}
      style={{ height: 240, width: '100%' }}
    >
      <View style={{ padding: 20, marginTop: 55 }}>
        {props?.back ?
          <TouchableOpacity onPress={props?.backAction}>
            <Image source={props?.back} style={{ height: 24, width: 24, marginVertical: 8, tintColor: COLORS?.white }} />
          </TouchableOpacity>
          : null}
        <View style={props?.txtView as TextStyle}>
          {props?.showchangelng ? <TouchableOpacity
            onPress={() => {
              props?.changelng()
            }}
            style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}
          >
            <Image style={{ width: 20, height: 20, tintColor: COLORS?.white }} source={icons?.lng} />
          </TouchableOpacity> : null}
          <Text style={{ ...FONTS?.h3, fontSize: 20, color: COLORS?.white, marginVertical: 8, textAlign: "right" , fontWeight: '700', lineHeight: 32, fontFamily : 'Dubai-Bold'} as TextStyle}>{props?.header}</Text>
          <Text style={{ ...FONTS?.h3, fontSize: 13, color: COLORS?.white, textAlign: "right", fontWeight: '400', lineHeight: 19, fontFamily : "Dubai-Regular" } as TextStyle}>{props?.description}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export { LoginHeader };
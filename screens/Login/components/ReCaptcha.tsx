import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import { BaseURL } from '../../../constants/BaseUrl';
import CheckBox from '@react-native-community/checkbox';
import { COLORS, FONTS, icons, images, SIZES } from '../../../constants';
import { t } from 'i18next';

interface ReCaptchaProps {
  siteKey?: string | undefined;
  BaseURL?: string | undefined;
  styleView?: ViewStyle;
  getrecapchaToken?:any;
  isCheckedvalue?:boolean
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ styleView,getrecapchaToken ,isCheckedvalue}) => {
  const captchaFormRef = useRef<ConfirmGoogleCaptcha | null>(null);
  const [isChecked, setIsChecked] = useState<boolean|any>(isCheckedvalue);

  const siteKey = ' 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';



  const showRecaptcha = () => {
    captchaFormRef.current?.show();
  };

  const onMessage = (token: any) => {
    console.log('Verified code from Google:', token?.nativeEvent?.data);
      if(token){
        getrecapchaToken(token?.nativeEvent?.data)
        setIsChecked(true)
      }
    if (['cancel', 'error', 'expired'].includes(token)) {
      captchaFormRef.current?.hide();
      return;
    }

    setTimeout(() => {
      captchaFormRef.current?.hide();
    }, 1500);
  };

  return (
    <View style={[styles?.containerRobot, styleView]}>
      <ConfirmGoogleCaptcha
        ref={captchaFormRef}
        baseUrl={BaseURL}
        onMessage={onMessage}
        siteKey={siteKey}
      />
      <View style={{margin: 20, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{}} onPress={showRecaptcha}>
          <Image source={!isChecked ? icons?.checkBox : icons?.checkboxDone} />
        </TouchableOpacity>
        <Text
          style={styles?.textRobot}>
          {t('robot')}
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', margin: 12}}>
        <Image
          source={images?.recaptchFrame}
          resizeMode="contain"
          style={{width: 50, height: 50}}
        />
      </View>
    </View>
  );
};

export default ReCaptcha;

const styles = StyleSheet.create({
  containerRobot: {
    marginTop: 12,
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    borderRadius: SIZES?.base,
    borderWidth: 0.5,
    borderColor: '#D6D6D6',
  },
  textRobot: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS?.black
  }
});
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// .......................................................
import { COLORS, FONTS, SIZES, images } from '../../../constants';
import MainButton from './MainButton';

// Define the type for the component's props
interface OutDatedVersionProps {
  updated: (value: boolean) => void; // Callback function to handle update
}

// Define the type for the route params (if any)
type RootStackParamList = {
  // Add other screen params here if needed
  OutDatedVersion: { someParam?: string }; // Example route param
};

const OutDatedVersion: React.FC<OutDatedVersionProps> = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'OutDatedVersion'>>();

  console.log('route?.params', route?.params);

  return (
    <View style={{ ...styles.container }}>
      <Image source={images.outDatedVersion} style={{ ...styles.img }} />
      <Text style={{ ...styles.label }}>{t('update_required')}</Text>
      <Text style={{ ...styles.desc }}>{t('update_message')}</Text>
      <MainButton
        onPress={() => props.updated(true)}
        label={'Update app'}
        containerStyle={{ ...styles.btn }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: SIZES.height,
    backgroundColor: COLORS.white,
  },
  label: {
    ...FONTS.h2,
    alignSelf: 'center',
    marginVertical: 4,
    textAlign: 'center',
  },
  desc: {
    ...FONTS.body4,
    alignSelf: 'center',
    marginVertical: 4,
    textAlign: 'center',
  },
  img: {
    width: 192,
    height: 192,
  },
  btn: {
    marginVertical: 13,
    paddingVertical: 13,
    paddingHorizontal: 24,
    marginTop: 24,
  },
});

export default OutDatedVersion;
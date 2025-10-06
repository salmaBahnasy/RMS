import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS, FONTS, images } from '../../../constants';

type RootStackParamList = {
  FeedBackScreen: {
    images?: any; // Replace `any` with a more specific type if needed
    header?: string;
    description?: string;
    buttonText?: string;
    onPress?: () => void;
  };
};

type FeedBackScreenRouteProp = RouteProp<RootStackParamList, 'FeedBackScreen'>;

const FeedBackScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<FeedBackScreenRouteProp>();

  console.log('route.params', route.params);

  return (
    <View style={styles.container}>
      <Image
        source={route.params?.images ? route.params.images : images.success}
        style={styles.img as StyleProp<ImageStyle>}
      />
      <Text style={{ ...FONTS.h2, alignSelf: 'center', marginVertical: 4 } as StyleProp<TextStyle>}>
        {route.params?.header}
      </Text>
      {route.params?.description && (
        <Text style={styles.desc as StyleProp<TextStyle>}>{route.params.description}</Text>
      )}
      <TouchableOpacity style={styles.btn} onPress={route.params?.onPress}>
        <Text style={{ ...FONTS.body5, color: COLORS.primary } as StyleProp<TextStyle>}>
          {route.params?.buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    ...FONTS.h3,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 112,
    height: 112,
  },
  btn: {
    marginVertical: 24,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderColor: COLORS.primary,
  },
  desc: {
    ...FONTS.body5,
    alignSelf: 'center',
    marginVertical: 4,
    textAlign: 'center',
  },
});

export default FeedBackScreen;
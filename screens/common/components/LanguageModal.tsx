import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, I18nManager, TextStyle } from "react-native";
import Modal from "react-native-modal";
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../../../constants';

interface LanguageModalProps {
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  changeLanguage: (language: 'ar' | 'en') => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isVisible, onDismiss, changeLanguage }) => {
  const { t } = useTranslation();
console.log("isVisible",isVisible)
  return (
    <Modal
      isVisible={isVisible}
      onDismiss={() => onDismiss(false)}
      onBackdropPress={() => onDismiss(false)}
      coverScreen
      statusBarTranslucent
      useNativeDriver
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={styles.view}>
        <Text style={styles.header}>{t('changelanguage')}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: I18nManager.isRTL ? COLORS.bgGreen : COLORS.white }]}
          onPress={() => changeLanguage('ar')}
        >
          <Text style={styles.label}>{t('ar')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: I18nManager.isRTL ? COLORS.white : COLORS.bgGreen }]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={styles.label}>{t('en')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 24,
  },
  header: {
    ...FONTS.h2,
  } as TextStyle,
  label: {
    ...FONTS.h4,
    marginVertical: 8,
  } as TextStyle,
  btn: {
    padding: SIZES.Mpading,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray3,
  },
});

export default LanguageModal;
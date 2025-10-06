import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextStyle } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, SIZES, icons, FONTS } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { takePicture, selectImage } from '../services/services';

interface CameraModalProps {
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  listHeader?: string;
  onSelectedItem: (item: any) => void; // Replace `any` with a more specific type if needed
  data?: any[]; // Replace `any` with a more specific type if needed
}

const CameraModal: React.FC<CameraModalProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Modal
      isVisible={props.isVisible}
      style={{
        width: SIZES.width,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
      }}
      coverScreen={false}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          height: 312,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          padding: 24,
        }}
      >
        <TouchableOpacity onPress={() => props.onDismiss(false)} style={styles.drag} />
        <TouchableOpacity onPress={() => props.onDismiss(false)}>
          <Image style={{ width: 30, height: 30 }} source={icons.closeModal} />
        </TouchableOpacity>
        {/* ......................................................... */}
        <TouchableOpacity
          onPress={() => {
            takePicture().then((res :any) => {
              console.log({res})
              props?.onSelectedItem(res)
            })
          }}
          style={{ padding: 10, ...styles?.row }}>
          <Image source={icons?.uploadPhoto} style={{ width: 30, height: 30 }} />
          <Text style={{ ...FONTS?.h3 } as TextStyle}>{t('takephoto')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectImage().then((res :any) => {
              console.log({res})
              props?.onSelectedItem(res)
            })
          }}
          style={{ padding: 10, ...styles?.row }}>
          <Image source={icons?.uploadPhoto} style={{ width: 30, height: 30 }} />
          <Text style={{ ...FONTS?.h3 } as TextStyle}>{t('uploadphoto')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    width: 20,
    height: 20,
  },
  drag: {
    width: 36,
    height: 5,
    backgroundColor: COLORS.gray,
    alignSelf: 'center',
    borderRadius: 8,
  },
});

export default CameraModal;
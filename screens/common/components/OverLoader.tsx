import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Modal from "react-native-modal";
//......
import { Chase } from 'react-native-animated-spinkit';
import { COLORS, SIZES } from '../../../constants';

// Define the props interface
interface LoaderProps {
  style?: ViewStyle; // Optional style prop
  color?: string; // Optional color prop
  size?:string;
  isVisible:boolean,
  // onDismiss?:any;
}

const OverLoader: React.FC<LoaderProps> = ({ style, color,isVisible }) => {
  return (
    <Modal
      isVisible={isVisible}
      // onDismiss={() => onDismiss(false)}
      // onBackdropPress={() => onDismiss(false)}
      style={styles.modal}
    >
    <View style={[styles.view, style]}>
      <Chase color={color || COLORS.primary} />
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle, // Explicitly defining as ViewStyle
  modal:{
    width:'100%',
    height:SIZES?.height,
    alignSelf:'center',
    backgroundColor:"#00000099"
  }
});

export default OverLoader;

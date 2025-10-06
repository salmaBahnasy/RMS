import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { COLORS } from '../../../constants';

// Define the props interface
interface LoaderProps {
  style?: ViewStyle; // Optional style prop
  color?: string; // Optional color prop
  size?:string;
}

const Loader: React.FC<LoaderProps> = ({ style, color }) => {
  return (
    <View style={[styles.view, style]}>
      <Chase color={color || COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle, // Explicitly defining as ViewStyle
});

export default Loader;

import React, { useState } from 'react';
import {  StyleSheet} from 'react-native';
import { COLORS,FONTS } from '../../constants';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      color: COLORS?.white,
    },
    containerchild: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      label: {
        ...FONTS.h3,
        alignSelf: 'center'
      },
      forgotPassword: {
        // marginTop: 10,
      },
      forgotPasswordText: {
        ...FONTS?.h4,
        color: COLORS?.primary, // blue color for the link
      },
      row:{
        flexDirection:'row',
        alignItems:'center'
      }
  });
  export default styles
import React, { useState } from 'react';
import {  StyleSheet, TextStyle} from 'react-native';
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
        alignSelf: 'center',
        marginHorizontal:10
      },
      forgotPassword: {
        // marginTop: 10,
      },
      forgotPasswordText: {
        ...FONTS?.h4,
        color: COLORS?.primary, // blue color for the link
      } as TextStyle,
      row:{
        flexDirection:'row',
        alignItems:'center'
      },
      lhheader:{
        ...FONTS.h3, fontSize: 20, color: COLORS.white, marginVertical: 8 
      }as TextStyle,
      lhdesc:{
        ...FONTS.h3, fontSize: 13, color: COLORS.white
      }as TextStyle,
      buttonContainer: {
        backgroundColor: 'orange',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 4,
      },
      txt: {
        fontSize: 15,
        fontWeight: '600',
      },
  });
  export default styles
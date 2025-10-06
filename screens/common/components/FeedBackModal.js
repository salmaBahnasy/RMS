import React, { useState } from 'react';
import { Text, View, StyleSheet, Image } from "react-native"
import Modal from "react-native-modal";
import { COLORS, FONTS } from '../../../constants';

const FeedBackModal = (props) => {

  return (
    <Modal
      isVisible={props?.isVisible}
      onDismiss={() => { props?.onDismiss(false) }}
      onBackdropPress={() => { props?.onDismiss(false) }}
    >
      <View style={{
        ...styles?.view
      }}>
        <Image source={props?.Image} style={{ ...styles?.img }} />
        <Text style={{ ...styles?.desc}}>{props?.description}</Text>
      </View>
    </Modal>


  )
}
const styles = StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  img: {
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  view: {
    backgroundColor: COLORS?.white,
    borderRadius: 32,
    padding: 24,
  },
  desc:{
    ...FONTS?.h4, 
    textAlign: 'center', 
    marginVertical: 16 ,
    alignSelf:'center'
  }

})

export default FeedBackModal
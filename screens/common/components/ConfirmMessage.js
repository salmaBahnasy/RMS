import React, { useState } from 'react';
import { Text, View, StyleSheet, Image } from "react-native"
import { useTranslation } from 'react-i18next';

import Modal from "react-native-modal";
import { COLORS, FONTS } from '../../../constants';
import MainButton from './MainButton';

const ConfirmMessage = (props) => {
  const { t } = useTranslation();

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
        <Text style={{ ...styles?.desc }}>{props?.description}</Text>
       {props?.showBtn? <View style={{ ...styles?.row, justifyContent: 'center' }}>
          <MainButton
            containerStyle={{ flex: 1 }}
            onPress={() => { props?.confirem() }} label={t('confirm')} />
          <MainButton
            containerStyle={{ flex: 1, backgroundColor: "transparent" }}
            labelStyle={{ color: COLORS?.primary }}
            onPress={() => { props?.cancel(false) }} label={t('cancel')} />

        </View>:null}
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
  desc: {
    ...FONTS?.h4,
    textAlign: 'center',
    marginVertical: 16,
    alignSelf: 'center'
  }

})

export default ConfirmMessage
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Text, TouchableOpacity, Image, View} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme';

const ShowAuthenticationModal = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={() => {
        props.onClose(false);
      }}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          width: 312,
          backgroundColor: COLORS?.white,
          padding: 24,
          borderRadius: 8,
        }}>
        <Text style={{...FONTS?.h2, color: COLORS?.primary}}>
          {t('usephinger')}
        </Text>
        <Text style={{...FONTS?.body5, marginTop: 16}}>
          {t('usephingerdes')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '50%',
            alignSelf: 'flex-end',
            marginTop: 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              props.Action();
            }}>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS?.lightBlue,
                marginHorizontal: 8,
              }}>
              {t('ok')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.cancel(false);
            }}>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS?.lightBlue,
              }}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {};

export default ShowAuthenticationModal;
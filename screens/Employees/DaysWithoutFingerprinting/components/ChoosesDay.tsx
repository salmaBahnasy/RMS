import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../styles';
import icons from '../../../../constants/icons';
import { t } from 'i18next';

interface ChooseDayProps {
    setShowCalender: React.Dispatch<React.SetStateAction<boolean>>;
  }

const ChoosesDay : React.FC<ChooseDayProps> = ({setShowCalender}) => {
  

  return (
    <View>
      <View style={{...styles?.row, ...styles?.daysyw}}>
               <Image source={icons?.Calendar} style={{...styles?.icons}} />
               <Text>{t('daysyws')}</Text>
               <TouchableOpacity
                 onPress={() => {
                   setShowCalender(true);
                 }}
                 style={{
                   ...styles?.cday,
                 }}>
                 <Text style={styles?.chosseDay}>{t('chooseDays')}</Text>
               </TouchableOpacity>
             </View>
    </View>
  )
}

export default ChoosesDay
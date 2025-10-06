import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONTS, icons } from '../../../constants';
import styles from '../styles';
import { fulldateFormate } from '../../../constants/dateFormate';
import moment from 'moment';

interface ChooseDateNumProps {
  date?: Date | string | null; // Date, string, or null (optional)
  title: string; // Required title
  containerStyle?: StyleProp<ViewStyle>; // Optional custom container style
  onPress: (value: boolean) => void; // Required function with a boolean parameter
  valueStyle?: object;
  formate?:string
}

const ChooseDateNum: React.FC<ChooseDateNumProps> = ({ date, title, containerStyle, onPress, valueStyle,formate }) => {
  return (
    <View style={containerStyle}>
      <Text style={{ ...FONTS.body5, marginBottom: 8, textTransform: 'capitalize' } as TextStyle}>{title}</Text>
      <TouchableOpacity
        onPress={() => onPress(true)}
        style={styles.choosedatebtn}
      >
        {date ? <Text style={{
          ...FONTS.body3,
          flex: 1,
          marginHorizontal: 5,
          textAlign: 'left',
          ...valueStyle
        } as StyleProp<TextStyle>}>{
            //date.toString()
            moment(date).format(formate?formate:fulldateFormate)
          }</Text> : <Text style={{
            ...FONTS.h3,
            flex: 1, marginHorizontal: 5,
            color: COLORS?.lightGray,
            textAlign: 'left',
            ...valueStyle
          } as StyleProp<TextStyle>}>{title}</Text>}
        <Image source={icons.calender} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
    </View>
  );
};

export default ChooseDateNum;
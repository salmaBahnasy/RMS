import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: COLORS?.white,
    },

    row: {
        flexDirection: 'row',
      alignItems: 'center',
    },
    label:{
        ...FONTS?.body5,
        fontWeight: '500',
        lineHeight: 19
       // marginHorizontal:8
    } as TextStyle,
    icons:{
        width:18,
        height:18,
        marginRight:10
    },
    optionRowStyle:{
        height:51,
        backgroundColor:COLORS?.white,
        margin:8,
        borderRadius:16,
        padding:16
    },
    userImage:{
        height:88,
        width:88,
        borderRadius:88,
        alignSelf:'center'
    },
    xicon:{
        width:34,height:34,
        position:'absolute',
        right:0,
        top:60

    },
    label2:{
        ...FONTS?.body5,
        color:COLORS?.gray1
    }as TextStyle,
    val:{
        ...FONTS?.body4,
    }as TextStyle,
    
   
});
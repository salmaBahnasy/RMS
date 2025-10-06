import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

const styles = StyleSheet.create({
    paddingWhiteView: {
        // padding: 24,
        backgroundColor: COLORS?.white,
        margin: 20,
        borderRadius: 12,
        paddingHorizontal: 16,
        padding: 24
    },
    icon: {
        width: 20,
        height: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    padding: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 12
    },
    labeltxt: {
        ...FONTS?.h5, 
        color: COLORS?.black, 
        marginHorizontal: 2
    } as TextStyle,
    numtxt: {
        ...FONTS?.h5,
         color: COLORS?.primary, 
         marginHorizontal: 2
    } as TextStyle,
    card:{
        padding:10,
        marginHorizontal:20,
        marginVertical:8,
        backgroundColor:COLORS?.white,
        borderRadius:10
    },
    StatusView: {
        backgroundColor: COLORS?.lightbgGreen,
        borderWidth: 1,
        borderColor: COLORS?.darkGreen,
        padding: 8,
        justifyContent: 'center',
        borderRadius:20,
        marginRight:8

    }

})

export default styles
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

const styles = StyleSheet.create({
    scanbtn: {
        width: 52,
        height: 51,
        borderRadius: 8,
        borderColor: COLORS?.primary,
        borderWidth: 1, marginHorizontal: 8,
        backgroundColor: COLORS?.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    icon:{
        width: 20, 
        height: 20
    },
    row:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    padding:{
        paddingTop: 20, 
        paddingLeft: 20, 
        paddingRight: 12 
    },
    textArea: {
        height: 175,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        backgroundColor:COLORS?.white,
        borderRadius:12
      },

})

export default styles
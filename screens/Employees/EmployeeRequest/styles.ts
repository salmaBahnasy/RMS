import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

const styles = StyleSheet.create({
    scanbtn: {
        width: 84,
        height: 45,
        borderRadius: 8,
        borderColor: COLORS?.primary,
        borderWidth: 1, marginHorizontal: 8,
        backgroundColor: COLORS?.white,
        justifyContent: 'center',
        alignItems: 'center',

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
    textArea: {
        height: 175,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        backgroundColor: COLORS?.white,
        borderRadius: 12
    },
    line: {
        width: '100%', 
        height: 1, 
        backgroundColor: COLORS?.lightGray, 
        marginTop: 40, 
        marginBottom: 10, 
        alignSelf: 'center'
    }

})

export default styles
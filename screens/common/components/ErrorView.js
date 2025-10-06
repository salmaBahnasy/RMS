import React from 'react';
import { Text, View, StyleSheet } from "react-native"
import { COLORS, FONTS } from '../../../constants';

const ErrorView = (props) => {
    return (
        <View style={{...props?.styleContainer}}>
            <Text style={{ ...styles?.label }}>{props?.label}</Text>
        </View>
    )
}
const styles = StyleSheet.create({

    label: {
        ...FONTS?.body3,
        // alignSelf:'center',
        marginHorizontal:10,
        color:COLORS?.red,
    },


})
export default ErrorView
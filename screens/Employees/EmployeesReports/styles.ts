import React, { useState } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

const styles = StyleSheet.create({
    container: {
        borderTopWidth: .3,
        borderTopColor: COLORS?.lightGray3,
        borderBottomWidth: .3,
        borderBottomColor: COLORS?.lightGray3
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: "center",
        backgroundColor: COLORS?.white,


        padding: 11,
        height: 41,
    },
    tabText: {
        ...FONTS?.body5,
        alignSelf: 'center'
    },
    ReportsViewStyle: {
        height: 102,
        borderRadius: 16,
        backgroundColor: COLORS?.white,
        marginVertical: 4,
        paddingHorizontal: 24,
        paddingVertical: 28
    },
    warningStatusView: {
        paddingHorizontal: 10,
        paddingVertical: 4, backgroundColor: COLORS?.Warningbg,
        borderWidth: 1, borderColor: COLORS?.Warningtxt,
        borderRadius: 16
    },
    warningtxt: {
        ...FONTS?.body5, 
        color: COLORS?.Warningtxt
    }as TextStyle


});
export default styles
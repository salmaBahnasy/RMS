import React, { useState } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../constants';

const styles = StyleSheet.create({
    container: {
        borderTopWidth: .3,
        borderTopColor: COLORS?.lightGray3,
        borderBottomWidth: .3,
        borderBottomColor: COLORS?.lightGray3
    },
    centerWrap: {
        flex:1,
        alignSelf: 'center',
        width: '92%',           // عدّليها حسب ذوقك (مثلاً 90–94%)
        maxWidth: 480,          // اختيارى: يخليها لطيفة على الآيباد
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
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
        // height: 102,
        borderRadius: 16,
        backgroundColor: COLORS?.white,
        marginVertical: 4,
        paddingHorizontal: 24,
        paddingVertical: 28,
        width: '100%',
        alignSelf: 'center',
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
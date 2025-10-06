import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: COLORS?.white,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tab:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignItems:"center",
        backgroundColor:COLORS?.white,
        borderWidth:0.3,
        borderColor:COLORS?.lightGray2,
        padding:11,
        height:41,
    },
    tabText:{
        ...FONTS?.body5,
        alignSelf:'center'
    },
    optionItem:{
        backgroundColor:COLORS?.white,
        flex:1,
        height:144,
        margin:8,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        borderRadius:12
    },
    listViewStyle:{
        padding:8,
        margin:14, 
        flex: 1,
        // backgroundColor: 'red'
    },
    optionImage:{
        width:48,
        height:48,
        resizeMode:'contain',
        marginBottom: 25
    },
    optionText:{
        ...FONTS?.body5,
        alignSelf:'center',
        textAlign:'center',
        lineHeight:  19,
        
    }
});
export default styles
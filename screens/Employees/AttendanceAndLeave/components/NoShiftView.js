import React from 'react';
import { Image, Text, View } from "react-native"
import { useTranslation } from 'react-i18next';
// ................................................................
import {FONTS, icons,images,SIZES } from "../../../../constants"

const NoShiftView = (props) => {
    const { t } = useTranslation();


    return (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: 'center', height: SIZES.height / 2 }}>
            <View style={{flexDirection:'row',alignItems:'center' ,marginBottom:SIZES?.padding}}>
                <Image source={images?.evening} style={{ width: 100, height: 100 }} />
                <Image source={images?.morning} style={{ width: 100, height: 100 }} />
            </View>
            <Text style={{ ...FONTS?.h4, alignSelf: 'center' }}>{t('noshift')}</Text>
        </View>
    )
}
export default NoShiftView
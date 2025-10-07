import React from 'react';
import { FlatList, Text, View, ListRenderItem, TextStyle, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, icons, images } from '../../../constants';
import styles from '../styles';
import moment from 'moment';
import { fulldateFormate } from '../../../constants/dateFormate';
// ............................................


interface ReportsViewListProps {
    data: any[]; // Replace `any` with a more specific type if available
}

const ReportsViewList: React.FC<ReportsViewListProps> = ({ data }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const renderItem: ListRenderItem<any> = ({ item, index }) => {
        return (
            <View key={"reports:" + index} style={{ ...styles?.ReportsViewStyle }}>
                <View style={{ ...styles?.row, justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ ...FONTS?.h3 }as TextStyle}>{item?.name}</Text>
                        <Text style={{ ...FONTS?.body3 }as TextStyle}>{item?.describtion}</Text>

                        <Text style={{ ...FONTS?.body5, color: COLORS?.gray1, marginVertical: 8 }as TextStyle}>
                           {moment(item?.createDate).format(fulldateFormate)}
                        </Text>
                    </View>
                    
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            extraData={data}
            renderItem={renderItem}
            style={{
                padding: 20,
                // paddingLeft:20,
                // paddingRight:20,
                width: '100%',
                alignSelf: 'center',
               
            }}
            contentContainerStyle={{
                paddingBottom: 100,
                // paddingLeft:20,
                // paddingRight:20,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center' ,marginTop:100}}>
                        <Image source={icons?.notification} style={{ width: 50, height: 50 }} />
                        <Text style={{ ...FONTS?.body3, color: COLORS?.gray1,alignSelf:"center",marginTop:10 } as TextStyle}>{t('noData')}</Text>
                    </View>
                )
            }}
        />

    );
};

export default ReportsViewList;

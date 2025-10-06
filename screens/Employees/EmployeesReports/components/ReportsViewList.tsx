import React from 'react';
import { FlatList, Text, View, ListRenderItem, TextStyle } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// ............................................
import styles from '../styles';
import { COLORS, FONTS } from '../../../../constants';

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
                        <Text style={{ ...FONTS?.body5 }as TextStyle}>{`${index + 1}- عبدالعزيز عبد السلام`}</Text>
                        <Text style={{ ...FONTS?.body5, color: COLORS?.gray1, marginVertical: 8 }as TextStyle}>
                            27 Oct 2022 2:45 PM
                        </Text>
                    </View>
                    <View style={{ ...styles?.warningStatusView }}>
                        <Text style={{ ...styles?.warningtxt }}>{t('awaitingApproval')}</Text>
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
                padding: 20
            }}
            contentContainerStyle={{
                paddingBottom: 200
            }}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default ReportsViewList;

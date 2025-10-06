import React, { useState } from 'react';
import { Text, SafeAreaView, I18nManager, View, Image, TouchableOpacity, FlatList, ListRenderItemInfo, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import { COLORS, icons, FONTS, images } from '../../../constants';
import styles from './styles';
import MainTextInput from '../../common/components/MainTextInput';
import CheckBoxComp from '../../common/components/CheckBoxComp';
import MainButton from '../../common/components/MainButton';
import SubHeader from '../../common/components/SubHeader';

interface Item {
    id: number; // Unique identifier for each item
}

const EquipmentPreparation: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [equipmentNumber, setequipmentNumber] = useState<string | undefined>(undefined);

    const renderItem = ({ item }: ListRenderItemInfo<Item>) => {
        return (
            <View>
                <CheckBoxComp
                    label={t('checkName')}  // Dynamically set label if needed
                    onValueChange={() => {}}
                    value={true}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: COLORS?.white }}>
            <SubHeader
                leftIconAction={() => navigation.goBack()}
                leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
                title={t('equipment_preparation')}
            />
            <View style={{ ...styles?.row, ...styles?.padding }}>
                <MainTextInput
                    onChangeText={(val: string) => setequipmentNumber(val)}
                    label={t('equipmentNumber')}
                    containerStyle={{ flex: 1 }}
                    placeholder={t('enterEquipmentNumber')}
                    inputContainer={{ backgroundColor: COLORS?.white }}
                />
                <TouchableOpacity style={{ ...styles?.scanbtn }}>
                    <Image source={icons?.scan} style={{ ...styles?.icon }} />
                </TouchableOpacity>
            </View>

            {equipmentNumber ? null : (
                <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                    <Image source={icons?.information_circle} style={{ width: 20, height: 20 }} />
                    <Text style={{ ...FONTS?.body5, marginHorizontal: 8, color: COLORS?.gray1 }as TextStyle}>
                        {t('checkList')}
                    </Text>
                </View>
            )}

            {equipmentNumber && (
                <FlatList
                    data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]}
                    extraData={[1, 1, 1, 1, 1]}
                    ListHeaderComponent={() => (
                        <View>
                            <Text style={{ ...FONTS?.h3 }as TextStyle}>{t('seleequi')}</Text>
                        </View>
                    )}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                    }}
                />
            )}

            <MainButton
                // onPress={() => {
                //     navigation?.navigate('FeedBackScreen', {
                //         header: t('inspectionSentSuccessfully'),
                //         image: images?.success,
                //         buttonText: t('back'),
                //         description: t('inspectionSentForEquipment'),
                //         onPress: () => {
                //             navigation.navigate('Home');
                //         },
                //     });
                // }}
                containerStyle={{
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: equipmentNumber ? COLORS.primary : COLORS?.gray,
                    marginTop: 55,
                }}
                label={t('sendtocheck')} onPress={function (): void {
                    throw new Error('Function not implemented.');
                } }            />
        </SafeAreaView>
    );
};

export default EquipmentPreparation;

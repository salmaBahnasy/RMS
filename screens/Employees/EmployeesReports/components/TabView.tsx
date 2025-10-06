import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
// ............................................
import styles from '../styles';
import { COLORS } from '../../../../constants';

// Define type for the props of TabView
interface TabViewProps {
    onSelected: (tab: string) => void;
}

interface TabProps {
    label: string;
    onPress: () => void;
    select: string;
}

const TabView: React.FC<TabViewProps> = (props) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [selected, setSelected] = useState<string>('awaitingApproval');

    // Tab component
    const Tab: React.FC<TabProps> = ({ label, onPress, select }) => {
        return (
            <TouchableOpacity 
                onPress={() => { onPress(); }} 
                style={{
                    ...styles?.tab, 
                    borderBottomWidth: select === selected ? 2 : 0, 
                    borderBottomColor: COLORS?.primary
                }}>
                <Text style={{
                    ...styles?.tabText, 
                    color: select === selected ? COLORS?.primary : COLORS?.black
                }}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ ...styles.row, ...styles?.container }}>
            <Tab 
                label={t('awaitingApproval')} 
                onPress={() => { props?.onSelected('awaitingApproval'); setSelected('awaitingApproval'); }} 
                select={'awaitingApproval'} 
            />
            <Tab 
                label={t('previousTransferRequests')} 
                onPress={() => { props?.onSelected('previousTransferRequests'); setSelected('previousTransferRequests'); }} 
                select={'previousTransferRequests'} 
            />
        </View>
    );
}

export default TabView;

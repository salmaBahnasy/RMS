import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import icons from "../constants/icons";
import { COLORS, FONTS } from "../constants";
import Home from "../screens/Home/Home";
import Requests from "../screens/Requests/Requests";
import Notification from "../screens/Notification/Notification";
// import Chat from "../screens/Chat/Chat";
import More from "../screens/More/More";
import TopTabBar from "./TopTabBar";

// تعريف نوع لكل شاشة
type TabParamList = {
    Home: undefined;
    Requests: undefined;
    Notification: undefined;
    Chat: undefined;
    More: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();



const Tabs: React.FC = () => {
    const { t } = useTranslation();
    const [focusedTab, setFocusedTab] = useState<string | null>(null);

    const dot = (): JSX.Element => {
        return <View style={styles.dot} />;
    };

     const renderIcon = (icon: any, focused: boolean) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={icon}
                                resizeMode="contain"
                                style={[styles.img, { tintColor: focused ? COLORS.primary : COLORS.offWhite }]}
                            />
                        </View>
                    );


                    const getIcon = (routeName: string, focused: boolean): any => {
        switch (routeName) {
            case "Home":
                return focused ? icons.home: icons.homeOutline;
            case "Requests":
                return focused ? icons.requestSelect : icons.requests;
            case "Notification":
                return focused ?  icons.notificationSelect : icons.notification;
            // case "Chat":
            //     return focused ? icons.chatSelect : icons.chat ;
            case "More":
                return focused ? icons.more: icons.more;
            default:
                return null;
        }
    };

      const getLabel = (routeName: string): string => {
        switch (routeName) {
            case "Home":
                return 'home';
            case "Requests":
                return 'requests';
            case "Notification":
                return 'notifications';
            // case "Chat":
            //     return 'messages';
            case "More":
                return 'more';
            default:
                return '';
        }
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: styles.tabstyle,
                tabBarIcon: ({ focused }) => renderIcon(getIcon(route.name, focused), focused),
                 tabBarLabel: ({ focused }) => (
                    <>
                        <Text
                        numberOfLines={1}
                        style={[styles.txt, { color: focused ? COLORS.primary : COLORS.offWhite }]}>
                            {t(getLabel(route.name))}
                        </Text>
                        {focused && dot()}
                    </>
                ),
                 headerShown: false,
            })}
             safeAreaInsets={{ bottom: 0 }} 
        >
            <Tab.Screen name="Home" component={TopTabBar} />
            <Tab.Screen name="Requests" component={Requests} />
            <Tab.Screen name="Notification" component={Notification} />
            {/* <Tab.Screen name="Chat" component={Chat} /> */}
            <Tab.Screen name="More" component={More} />
        </Tab.Navigator>
    );
};

export default Tabs;

const styles = StyleSheet.create<{
    txt: TextStyle;
    img: ImageStyle;
    tabstyle: ViewStyle;
    dot: ViewStyle;
}>({

    txt: {
        ...FONTS.body6,
        textTransform: 'capitalize',
        flexShrink: 1,
        alignSelf: "center",
        fontFamily: "Dubai-Regular",
        fontWeight: '400',
        lineHeight: 19,

    },
    img: {
        width: 20,
        height: 20,
        alignSelf: 'center',

    },
    tabstyle: {
        backgroundColor: COLORS.white,
        height: 80,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 7
        
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        alignSelf: 'center',
    },
});

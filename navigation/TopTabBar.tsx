// import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { I18nManager, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from 'i18next';
import MainHeader from '../screens/common/components/MainHeader';
import Employees from '../screens/Home/Component/Employees';
import Equipment from '../screens/Home/Component/Equipment';
import { COLORS } from '../constants';



const TopTab = createMaterialTopTabNavigator();

const TopTabBar: React.FC <any>= ({route , navigation}) => {

    const initialTab = route.params?.initialTab || 'employees';
    const tabRef = useRef<any>(null);

 useEffect(() => {
    if (route.params?.jumpToTab) {
      navigation.jumpTo(route.params.jumpToTab);
    }
  }, [route.params?.jumpToTab]);


  return (
    <SafeAreaView style={{ flex: 1, }}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
      <MainHeader title={t('home')}  labelStyle={{
                writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                fontWeight: 'bold',
                fontSize: 20,
                lineHeight: 32
              }}/>
      <View style={{ borderWidth: 0.5, borderColor: '#EEEEF0' , }} />
      <TopTab.Navigator
       initialRouteName={initialTab}
        screenOptions={{}}
        tabBar={({ state, descriptors, navigation }) => (
          <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              const onPress = () => {
                console.log('route.name', route.name)
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true
                });

                if (!event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const backgroundColor = isFocused ? '#E0F7FA' : 'white';
              const borderColor = isFocused ? '#1D60F3' : '#EEEEF0';
              const borderWidth = isFocused ? 2.5 : 1;
              const textColor = isFocused ? '#1D60F3' : '#000';


              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={[styles.tabItem, { backgroundColor, borderColor, borderBottomWidth: borderWidth }]}
                >
                  <Text style={{ color: textColor, fontWeight: isFocused ? '500' : 'normal' , fontSize: 13, lineHeight: 19,fontFamily: "Dubai-Medium", }}>
                    {t(route.name)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      >
        <TopTab.Screen name='employees' component={Employees}  />
        <TopTab.Screen name='equipment' component={Equipment} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

export default TopTabBar;


const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FBFF',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    height: 41
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,

  },
})

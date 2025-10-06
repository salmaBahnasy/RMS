import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    SafeAreaView,
    TextStyle,
    Platform,
    I18nManager,
    ScrollView,
    Image
} from "react-native"
import { useTranslation } from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import MainHeader from '../../common/components/MainHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    COLORS,
    FONTS,
    icons,
    images
} from '../../../constants';
import ChooseDateNum from '../../More/Component/ChooseDateNum';
import DateTimePickerModalView from '../../common/components/DateTimePickerModalView';
import MainButton from '../../common/components/MainButton';
import { attendanceEmployeesData, recoredAttendanceForAllEmp } from './services/Services';
import { hours } from '../../../constants/dateFormate';
import { BaseURL } from '../../../constants/BaseUrl';
import FeedBackModal from '../../common/components/FeedBackModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmployeeItem, RootStackParamList } from '../../../navigation/types';
import SubHeader from '../../common/components/SubHeader';
interface EmployeeDetailsProps {

}
const EmployeeDetails: React.FC<EmployeeDetailsProps> = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'EmployeeDetails'>>();
    const [isVisibleData, setisVisible] = useState(false)
    const [leaveTime, setleaveTime] = useState(null)
    const [arriveTime, setarriveTime] = useState(null)
    const [dateType, setDateType] = useState<string | null>('arrive')
    const [dateShowModal, setDateShowModal] = useState(false)
    // Initialize with proper type
    const [selectedEmployees, setSelectedEmployees] = useState<EmployeeItem[]>(
        route.params?.item ? [route.params.item] : []
    );
    const [status, setstatus] = useState(1)
    const [feedBackModal, setFeedBackModal] = useState(false);
    const [feedBackTitle, setFeedBackTitle] = useState();
    const [feedBackImg, setFeedBackImg] = useState();

    return (
        <SafeAreaView>
            <SubHeader
                leftIconAction={() => navigation.goBack()}
                leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack} title={t('details')} />
            <DateTimePickerModalView
                isVisible={isVisibleData}
                onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => { 
                    setisVisible(val);
                    setDateShowModal(false);
                }}
                dateValue={dateType === 'arrive' ? arriveTime : leaveTime}
                show={dateShowModal}
                selectedDate={(val: any) => {
                    console.log('val', val, val.toString());
                    setDateShowModal(false);
                    if (dateType === 'arrive') {
                        setarriveTime(val);
                        setDateType('');
                        setDateShowModal(false);
                        Platform.OS == 'ios' && setisVisible(false)

                    } else if (dateType === 'leave') {
                        setleaveTime(val);
                        setDateType('');
                        setDateShowModal(false);
                        Platform.OS == 'ios' && setisVisible(false)
                    }
                }}
                mode={'time'}
            // minval={firstDayOfYear}
            />
            <FeedBackModal
                isVisible={feedBackModal}
                description={feedBackTitle}
                Image={feedBackImg}
                onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
                    setFeedBackModal(val);
                    navigation.navigate('AttendanceAllEmployee', {
                        data: {
                            item: {
                                image: route.params?.item?.image || 'default_image.jpg',
                                employeeName: route.params?.item?.employeeName || 'Unknown',
                                employeeId: route.params?.item?.employeeId || '000',
                            },
                            isEnterLeaveSetting: route.params?.isEnterLeaveSetting ?? false,
                            shiftId: route.params?.shiftId ?? '',
                            lat: route.params?.lat ?? 0,
                            long: route.params?.long ?? 0
                        }
                    });
                }}
            />
            <ScrollView>
                <View style={{ paddingHorizontal: 22, paddingVertical: 16 }}>
                    {/* emp details....... */}
                    <Text style={{ ...FONTS?.h3, color: COLORS?.primary, marginBottom: 16 } as TextStyle} >{t('empdetails')}</Text>
                    <View style={{ ...styles?.row }}>
                        <Image source={{ uri: `${BaseURL}${route?.params?.item?.image}` }}
                            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 5, backgroundColor: COLORS?.lightGray }} />
                        <View>
                            <Text style={{ ...styles?.title }}>{route?.params?.item?.employeeName}</Text>
                            <Text style={{ ...styles?.title }}>{route?.params?.item?.employeeId}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: COLORS?.lightGray, width: '90%', alignSelf: 'center', height: 2 }} />

                <View style={{ paddingHorizontal: 22, paddingVertical: 22 }}>
                    {/* change attend status */}

                    <Text style={{ ...FONTS?.h3, color: COLORS?.primary, marginBottom: 16 } as TextStyle} >{t('prepare')}</Text>
                    <View style={{ ...styles?.row, marginVertical: 8 }}>
                        <CheckBox
                            value={status == 1 ? true : false}
                            onValueChange={(newValue: boolean | ((prevState: boolean) => boolean)) => {
                                setstatus(1)
                            }}
                        />
                        <Text onPress={() => { setstatus(1) }} style={{ ...styles?.desc }}>{t('attend')}</Text>
                    </View>
                    <View style={{ ...styles?.row, marginVertical: 8 }}>
                        <CheckBox
                            value={status == 3 ? true : false}
                            onValueChange={(newValue: boolean | ((prevState: boolean) => boolean)) => {
                                setstatus(3)
                            }}
                        />
                        <Text onPress={() => { setstatus(3) }} style={{ ...styles?.desc }}>{t('absent_with_permission')}</Text>
                    </View>
                    {/* <View style={{ ...styles?.row, marginVertical: 8 }}>
                        <CheckBox
                            value={status == 2 ? true : false}
                            onValueChange={(newValue: boolean | ((prevState: boolean) => boolean)) => {
                                setstatus(2)
                            }}
                        />
                        <Text onPress={() => { setstatus(2) }} style={{ ...styles?.desc }}>{t('absent')}</Text>
                    </View> */}
                    <View style={{ ...styles?.row, marginVertical: 8 }}>
                        <CheckBox
                            value={status == 4 ? true : false}
                            onValueChange={(newValue: boolean | ((prevState: boolean) => boolean)) => {
                                setstatus(4)
                            }}
                        />
                        <Text onPress={() => { setstatus(4) }} style={{ ...styles?.desc }}>{t('absent_without_permission')}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: COLORS?.lightGray, width: '90%', alignSelf: 'center', height: 2 }} />
                <View style={{ ...styles?.row, marginRight: 10, marginVertical: 16, paddingHorizontal: 22 }}>
                    <Text style={{ ...FONTS?.h3, color: COLORS?.primary, } as TextStyle}>{t("youcanaddtimeofattend")}</Text>
                </View>
                {
                    route?.params?.isEnterLeaveSetting ?
                        <View style={{ paddingHorizontal: 22 }}>
                            <ChooseDateNum
                                title={t('arriveTime')}
                                date={arriveTime}
                                onPress={(val) => {
                                    Platform.OS == 'ios' && setisVisible(true)
                                    setarriveTime(null);
                                    setDateType('arrive');
                                    setDateShowModal(val);
                                }}
                                valueStyle={{
                                    fontSize: 9
                                }}
                                formate={hours}
                            />
                            <ChooseDateNum
                                title={t('LeaveTime')}
                                date={leaveTime}
                                onPress={(val) => {
                                    Platform.OS == 'ios' && setisVisible(true)
                                    setleaveTime(null);
                                    setDateType('leave');
                                    setDateShowModal(val);
                                }}
                                valueStyle={{
                                    fontSize: 9
                                }}
                                formate={hours}
                            />
                        </View>
                        :
                        <View style={{ paddingHorizontal: 22 }}>
                            <ChooseDateNum
                                title={t('arriveTime')}
                                date={arriveTime}
                                onPress={(val) => {
                                    Platform.OS == 'ios' && setisVisible(true)
                                    setarriveTime(null);
                                    setDateType('arrive');
                                    setDateShowModal(val);
                                }}
                                containerStyle={{ flex: 1, marginHorizontal: 8 }}
                                valueStyle={{
                                    fontSize: 9
                                }}
                                formate={hours}

                            />

                        </View>
                }
                <MainButton
                    onPress={async () => {
                        const selectedEmployeesid = selectedEmployees.map(item => item.employeeId);

                        let data = await attendanceEmployeesData(
                            status,
                            route?.params?.shiftId,
                            selectedEmployeesid,
                            selectedEmployees,
                            route?.params?.isEnterLeaveSetting,
                            route?.params?.lat,
                            route?.params?.long, arriveTime, leaveTime)
                        console.log("attendanceEmployeesData...", data)
                        let postData = await recoredAttendanceForAllEmp(data)
                        console.log("postData", postData)
                        if (postData?.result?.message.type == 'Success') {
                            setFeedBackModal(true);
                            setFeedBackTitle(postData?.result?.message?.content || t('successfully'));
                            setFeedBackImg(images?.success);
                            //reload data
                        } else {
                            setFeedBackModal(true);
                            setFeedBackTitle(postData?.result?.message?.content || t('failed'));
                            setFeedBackImg(images?.fail);
                        }
                    }}
                    label={t('confirm')}
                    containerStyle={{ marginVertical: 16, marginHorizontal: 22 }}
                />
            </ScrollView>
        </SafeAreaView>


    )
}
const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    img: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    title: {
        ...FONTS.h4,

    } as TextStyle,

    desc: {
        ...FONTS?.h4,
        // textAlign: 'center',
        marginVertical: 4,
        borderBottomWidth: 1,
        borderColor: COLORS?.lightGray3,
        width: '100%',
        paddingHorizontal: 5,
        textAlign:'left'
        // alignSelf: 'center'
    } as TextStyle

})

export default EmployeeDetails

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {  I18nManager, ScrollView } from "react-native"
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import MainHeader from '../../common/components/MainHeader';
import { icons } from '../../../constants';
import { getUserShift } from './services/services';
import ShiftDetails from './components/ShiftDetails';
import NoShiftView from './components/NoShiftView';
import Loader from '../../common/components/Loader';
import { getDataEmpDetails } from '../../Profile/Services/services';
import SubHeader from '../../common/components/SubHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const AttendanceAndLeave = (props) => {
  const navigation = useNavigation()
  const { t } = useTranslation();
  const isfocus = useIsFocused()
  const [currentShift, setCurrentShift] = useState();
  const [isloading, setIsloading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getuseerData = async () => {
      const data = await getDataEmpDetails();
      setUserData(data.result.returnData)
    }
    getuseerData()
    getCurrentShift()
  }, [isfocus])

  const getMinutesFromTime = (dateString) => {
    const date = dayjs(dateString);
    if (!date.isValid()) {
      console.warn('Invalid date:', dateString);
      return null;
    }
    console.log("getMinutesFromTime",date.hour() * 60 + date.minute())
    return date.hour() * 60 + date.minute();
  };
  
  const isWithinShift = (current, start, end) => {
    if (start <= end) {
      return current >= start && current <= end;
    } else {
      // لحالة الشيفت اللي بيعدي منتصف الليل
      return current >= start || current <= end;
    }
  };


  const getCurrentShift = async () => {
    const shifts = await getUserShift();
  
    const now = dayjs();
    const currentMinutes = now.hour() * 60 + now.minute();
  
    let currentShift = null;
    let nextShift = null;
  
    shifts?.result.returnData.forEach(({ shiftDetails, attendanceTime, leaveTime ,attendanceId}) => {
      const arriveMinutes = getMinutesFromTime(shiftDetails.shiftAttendanceTime);
      const leaveMinutes = getMinutesFromTime(shiftDetails.shiftLeaveTime);
  
      if (arriveMinutes === null || leaveMinutes === null) return;
  
      // ✅ هل الآن داخل الشيفت؟
      if (isWithinShift(currentMinutes, arriveMinutes, leaveMinutes)) {
        currentShift = {
          ...shiftDetails,
          attendanceTime,
          leaveTime,
          attendanceId
        };
      }
  
      // ✅ لو مفيش شيفت حالي، نجيب أقرب شيفت جاي
      if (!currentShift && currentMinutes < arriveMinutes) {
        if (!nextShift || arriveMinutes < getMinutesFromTime(nextShift.shiftAttendanceTime)) {
          nextShift = {
            ...shiftDetails,
            attendanceTime,
            leaveTime,
            attendanceId
          };
        }
      }
    });
  
    setCurrentShift(currentShift || nextShift || null);
  
    console.log("currentShift", currentShift, "nextShift", nextShift);
    setIsloading(false)
    return { currentShift, nextShift };
  };
  



  return (
    <SafeAreaView >
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('attendanceAndLeave')} />
      {isloading ? <Loader /> : <ScrollView showsVerticalScrollIndicator={false}>
        {currentShift == null ?
          <NoShiftView />
          : <ShiftDetails
            reloadAgain={() => {
              console.log("reloadAgain")
              getCurrentShift();
            }}
            data={currentShift}
            userData={userData}
          />}
      </ScrollView>}
      {/* ................................ */}
    </SafeAreaView>
  )
}

export default AttendanceAndLeave
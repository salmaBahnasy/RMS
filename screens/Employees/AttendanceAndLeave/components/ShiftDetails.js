import React, { useEffect, useState } from 'react';
import {
  Image,
  Alert,
  Platform,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
// ................................................................
import { COLORS, images, FONTS, icons } from '../../../../constants';
import MainButton from '../../../common/components/MainButton';
import {
  RecordShiftAttendances,
  calculateDistance,
  formatDate,
  formatDayName,
  formatTime,
  getShiftType,
  handleBiometricAuth,
} from '../services/services';
import {
  getLocation,
  requestLocationPermissionAndroid,
  requestLocationPermissionIOS,
} from '../../../common/services/services';
import BottomDropdownModal from '../../../common/components/BottomDropdownModal';
import styles from '../styles';
import FeedBackModal from '../../../common/components/FeedBackModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShiftDetails = props => {
  const { t } = useTranslation();
  const [isEvening, setIsEvening] = useState();
  const [lat, setlat] = useState();
  const [long, setlong] = useState();
  const [selectedAreaId, setSelectedAreaId] = useState(
    props?.data?.attendanceTime == null
      ? props?.data?.locationAttendDetails?.length == 1
        ? props?.data?.locationAttendDetails[0]?.locationId
        : null
      : props?.data?.locationLeaveDetails?.length == 1
      ? props?.data?.locationLeaveDetails[0]?.locationId
      : null,
  );
  const [selectedAreaLabel, setSelectedAreaLabel] = useState(t('selectarea'));
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreaError, setSelectedAreaError] = useState();
  const [attendImage, setAttendImage] = useState('');
  const [FeedBack, setFeedBack] = useState(false);
  const [feedbackDescription, setfeedbackDescription] = useState('');
  const [feedbackImage, setfeedbackImage] = useState('');
  const [distance, setDistance] = useState(0);
  const [locationLat, setlocationLat] = useState(
    props?.data?.attendanceTime == null
      ? props?.data?.locationAttendDetails?.length == 1
        ? props?.data?.locationAttendDetails[0]?.lat
        : null
      : props?.data?.locationLeaveDetails?.length == 1
      ? props?.data?.locationLeaveDetails[0]?.lat
      : null,
  );
  const [locationlong, setlocationlong] = useState(
    props?.data?.attendanceTime == null
      ? props?.data?.locationAttendDetails?.length == 1
        ? props?.data?.locationAttendDetails[0]?.longitude
        : null
      : props?.data?.locationLeaveDetails?.length == 1
      ? props?.data?.locationLeaveDetails[0]?.longitude
      : null,
  );
  // alert(JSON.stringify(props?.data?.shiftDetails))
  const currentDate = new Date();
  useEffect(() => {
    getCurrentLocation();
  }, [showSelectArea]);
  useEffect(() => {
    if (props?.data) {
      const shiftTypeFunction = async () => {
        const shiftType = getShiftType(props?.data?.shiftAttendanceTime);
        console.log('shiftType....>', shiftType);
        setIsEvening(shiftType);
      };
      shiftTypeFunction();
    }
    getCurrentLocation();
  }, [props, FeedBack]);
  const getCurrentLocation = () => {
    const platformSpecificValue = Platform.select({
      ios: 'ios',
      android: 'android',
      default: 'Default value',
    });
    console.log('platformSpecificValue', platformSpecificValue);
    let permission =
      platformSpecificValue == 'android'
        ? requestLocationPermissionAndroid()
        : requestLocationPermissionIOS();
    console.log('permission', permission);
    getLocation().then(res => {
      if (res?.coords) {
        console.log('...location...', res);
        setlat(res?.coords?.latitude);
        setlong(res?.coords?.longitude);
        console.log(
          'locationLat',
          res?.coords?.latitude,
          res?.coords?.longitude,
          locationLat,
          locationlong,
        );
        const distance = calculateDistance(
          res?.coords?.latitude,
          res?.coords?.longitude,
          locationLat,
          locationlong,
        );
        console.log(`Distance: ${distance} km`);
        setDistance(distance);
      } else {
        setfeedbackDescription(t('locationError'));
        setfeedbackImage(icons?.location);
        setFeedBack(true);
      }
    });
  };

  const get_Location = () => {
    const platformSpecificValue = Platform.select({
      ios: 'ios',
      android: 'android',
      default: 'Default value',
    });
    console.log('platformSpecificValue', platformSpecificValue);
    let permission =
      platformSpecificValue == 'android'
        ? requestLocationPermissionAndroid()
        : requestLocationPermissionIOS();
    console.log('permission', permission);
    getLocation().then(res => {
      if (res?.coords) {
        console.log('...location...', res);
        setlat(res?.coords?.latitude);
        setlong(res?.coords?.longitude);
        const distance = calculateDistance(
          res?.coords?.latitude,
          res?.coords?.longitude,
          locationLat,
          locationlong,
        );
        console.log(`Distance: ${distance} km`);
        setDistance(distance);
        recordEmployeeAttendance(
          distance,
          res?.coords?.latitude,
          res?.coords?.longitude,
        );
        console.log(
          '......',
          res?.coords?.latitude,
          res?.coords?.longitude,
          locationLat,
          locationlong,
        );
      } else {
        setfeedbackDescription(t('locationError'));
        setfeedbackImage(icons?.location);
        setFeedBack(true);
      }
    });
  };
  const AttentanceTime = ({ data }) => {
    return data?.attendanceTime || data?.leaveTime ? (
      <View style={{ marginTop: 16, marginHorizontal: 8 }}>
        {data?.attendanceTime ? (
          <View style={{ ...styles?.row, justifyContent: 'space-between' }}>
            <Text style={{ ...FONTS?.h3 }}>{t('arriveTime')}</Text>
            <Text style={{ ...FONTS?.h3, color: COLORS?.darkGreen }}>
              {formatTime(data?.attendanceTime)}
            </Text>
          </View>
        ) : null}
        {data?.leaveTime ? (
          <View style={{ ...styles?.row, justifyContent: 'space-between' }}>
            <Text style={{ ...FONTS?.h3 }}>{t('LeaveTime')}</Text>
            <Text style={{ ...FONTS?.h3, color: COLORS?.red }}>
              {formatTime(data?.leaveTime)}
            </Text>
          </View>
        ) : null}
      </View>
    ) : null;
  };
  const recordEmployeeAttendance = async (radius, Lat, Long) => {
    console.log('props?.data?.attendanceId', props?.data?.attendanceId);
    let recordShiftAttendances = await RecordShiftAttendances(
      props?.data?.attendanceId,
      props?.data?.attendanceTime == null ? 1 : 2,
      props?.data?.shiftId,
      selectedAreaId,
      radius,
      Lat,
      Long,
    );
    console.log('recordShiftAttendances', recordShiftAttendances);
    if (recordShiftAttendances?.success == true) {
      setfeedbackDescription(
        recordShiftAttendances?.result?.message?.content ==
          'This Fingerprint is not compatible.'
          ? t('Fingerprintnotcompatible')
          : recordShiftAttendances?.result?.message?.content,
      );
      setfeedbackImage(
        recordShiftAttendances?.result?.message?.content ==
          'This Fingerprint is not compatible.'
          ? icons?.daysWithoutFingerprint
          : images?.success,
      );
      setFeedBack(true);
      props?.reloadAgain();
    } else {
      setfeedbackDescription(
        recordShiftAttendances?.result?.message?.content ||
          recordShiftAttendances?.MessageContent,
      );
      setfeedbackImage(images?.fail);
      setFeedBack(true);
    }
  };

  return (
    <View style={styles?.shiftView}>
      {/* // areas dropDown */}
      {/* <LocationTracker/> */}
      <BottomDropdownModal
        data={
          props?.data?.attendanceTime == null
            ? props?.data?.locationAttendDetails
            : props?.data?.locationLeaveDetails
        }
        isVisible={showSelectArea}
        onDismiss={val => {
          setShowSelectArea(val);
          setSelectedAreaError();
        }}
        onSelectedItem={val => {
          setlocationLat(val?.lat);
          setlocationlong(val?.longitude);
          setSelectedAreaId(val.locationId);
          setSelectedAreaLabel(I18nManager.isRTL ? val?.nameAr : val?.name);
        }}
      />
      <FeedBackModal
        isVisible={FeedBack}
        onDismiss={val => {
          setFeedBack(val);
        }}
        description={feedbackDescription}
        Image={feedbackImage}
      />
      {/* ......................................................... */}
      <View
        style={{
          ...styles?.employeeData,
        }}
      >
        <Image source={images?.userImage} style={styles?.userImg} />
        <Text style={{ ...FONTS?.h4, alignSelf: 'center' }}>
          {I18nManager.isRTL
            ? props?.userData?.nameAr
            : props?.userData?.nameEn}
        </Text>
        <Text style={{ ...FONTS?.h5, alignSelf: 'center' }}>
          {props?.data?.shiftName}
        </Text>
        {props?.data?.locationAttendDetails?.length > 1 ? (
          <TouchableOpacity
            onPress={() => {
              setShowSelectArea(true);
            }}
            style={{
              ...styles?.selectAreaBTN,
            }}
          >
            <Text style={{ ...FONTS?.h3 }}>{selectedAreaLabel}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ ...FONTS?.h3, padding: 8, alignSelf: 'center' }}>
            {props?.data?.attendanceTime == null
              ? I18nManager.isRTL
                ? props?.data?.locationAttendDetails[0]?.nameAr
                : props?.data?.locationAttendDetails[0]?.name
              : I18nManager.isRTL
              ? props?.data?.locationLeaveDetails[0]?.nameAr
              : props?.data?.locationLeaveDetails[0]?.name}
          </Text>
        )}
      </View>
      {/* ........................................................... */}
      {selectedAreaError ? (
        <Text style={styles?.selectArealabel}>{selectedAreaError}</Text>
      ) : null}
      {/* ............ */}
      <AttentanceTime data={props?.data} />
      {/* ............ */}

      <View
        style={{
          paddingTop: 20,
          margin: 24,
        }}
      >
        <Text style={{ ...FONTS?.body4, alignSelf: 'center' }}>
          {t('shift1')} {isEvening ? t('evening') : t('morning')}{' '}
        </Text>
        <Text style={{ ...FONTS?.h3, alignSelf: 'center' }}>
          {t('from')} {formatTime(props?.data?.shiftAttendanceTime)} {t('to')}{' '}
          {formatTime(props?.data?.shiftLeaveTime)}
        </Text>
        <Image
          source={isEvening ? images?.evening : images?.morning}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <View style={{ alignSelf: 'center' }}>
          <Text
            style={{
              ...FONTS?.h2,
              alignSelf: 'center',
              color: COLORS?.primary,
            }}
          >
            {formatDayName(currentDate)}
          </Text>
          <Text style={{ ...FONTS?.h3, alignSelf: 'center' }}>
            {formatDate(currentDate)}
          </Text>
        </View>
      </View>
      {/* ---------------------------------------------------------------------------------------------------- */}
      <View
        style={{
          height: 1,
          width: 287,
          backgroundColor: COLORS?.gray,
          alignSelf: 'center',
        }}
      />
      <MainButton
        containerStyle={{
          marginTop: 24,
          backgroundColor:
            props?.data?.attendanceTime == null
              ? COLORS?.darkGreen
              : COLORS?.red,
              justifyContent:'center',
              alignItems:'center'
        }}
        labelStyle={{width:'100%',alignSelf:'center',textAlign:'center'}}
        label={
          props?.data?.attendanceTime == null
            ? t('Recordattendance')
            : t('Recordleave')
        }
        onPress={async () => {
          console.log('selectedAreaId', selectedAreaId);
          if (selectedAreaId) {
            // ....check for boimetric auth
            if (lat & long) {
              let Biometrics = await handleBiometricAuth();
              let fingerPrint = await AsyncStorage.getItem('fingerPrint');
              console.log("fingerPrint",fingerPrint);
              console.log('Biometrics', Biometrics);
              if (Biometrics?.statues == true) {
                console.log('props?.data?.leaveTime', props?.data);
                get_Location();
                // if (props?.data?.leaveTime !== null) {
                //     setfeedbackDescription(t('LeaveTimebefore'))
                //     setfeedbackImage(images?.fail)
                //     setFeedBack(true)
                // } else {

                // }
              } else if (
                Biometrics?.statues == false &&
                Biometrics?.code == 'No fingerprints enrolled'
              ) {
                console.log('Biometrics?.code', Biometrics?.code);
                setfeedbackDescription('No fingerprints enrolled');
                setfeedbackImage(icons?.daysWithoutFingerprint);
                setFeedBack(true);
              } else {
                setfeedbackDescription(t('wrongAuthentication'));
                setfeedbackImage(images?.fail);
                setFeedBack(true);
              }
            } else {
              setfeedbackDescription(t('locationError'));
              setfeedbackImage(icons?.location);
              setFeedBack(true);
            }
          } else {
            setSelectedAreaError(t('pleaseselectArea'));
          }
        }}
      />

      <View style={{ ...styles?.disView }}>
        <Image
          source={icons.information_circle1}
          style={{ width: 20, height: 20 }}
        />
        <Text style={{ marginHorizontal: 8 }}>
          {t('distance_to_fingerprint_point')} {distance} {t('m')}
        </Text>
      </View>
    </View>
  );
};

export default ShiftDetails;

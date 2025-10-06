import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from '../../../../constants/BaseUrl';
import { approveJustification, attendanceStatus, postAbsenceReasons } from '../../../../constants/ServicesNames';



export const getEmployeeAttendanceStatus = async (
  startDate: string,
  endDate: string,
  pageNumber: number = 1,
  pageSize: number = 31
) => {
  try {
    const userData = await AsyncStorage.getItem('empId');
    const empId = JSON.parse(userData || '""');

    const url = `${BaseURL}${attendanceStatus}?empId=${empId}&startDate=${startDate}&endDate=${endDate}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
    console.log('getEmployeeAttendanceStatus:-url', url)
    console.log('empId', empId)


    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    if (response.ok) {
      const data = await response.json();

      console.log('data', data)

      return data?.result || [];
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return [];
    }
  } catch (error) {
    console.error('Network Error:', error);
    return [];
  }
};


export const postAbsenceJustification = async (
  justificationReason: string,
  notes: string,
  attachment: string | null,
  attendanceData: { attendanceId: number; date: string; justificationTypeId: number }[]
) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken);
    const User = await AsyncStorage.getItem('userId');
    const userId = User ? JSON.parse(User) : null;
    const userData = await AsyncStorage.getItem('empId');
    const employeeId = JSON.parse(userData || '""');

    const url = `${BaseURL}${postAbsenceReasons}`;

    const requestData = {

      employeeId,
      justificationReason,
      notes,
      attachment,
      days: attendanceData, // مصفوفة الحضور
    };

    console.log('url', url);
    console.log('Request Data:', requestData);

    const response = await fetch(url, {
      method: 'POST', // تحديد نوع الطلب
      headers: {
        'Content-Type': 'application/json', // تحديد نوع البيانات
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
         'Authorization': `Bearer ${userToken}`, // تحديد اللغة حسب الاتجاه
      },
      body: JSON.stringify(requestData), // إرسال البيانات في الجسم
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      return data?.result || []; // العودة بالنتائج
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return []; // في حال حدوث خطأ
    }
  } catch (error) {
    console.error('Network Error:', error);
    return []; // في حال حدوث خطأ في الشبكة
  }
};


export const approveJustifications = async (data: any) => {
  try {

const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken);
    // URL الخاص بـ API
    const url = `${BaseURL}${approveJustification}`;

    console.log('URL:', url);
    console.log('Request Data:', data);
    console.log('approveJustifications', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),

    });
    console.log("📋 data :", JSON.stringify(data));

    if (response.ok) {
      const data = await response.json();
      console.log(' Data:', data);
      return data?.result ; // العودة بالنتائج
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return []; // في حال حدوث خطأ
    }
  } catch (error) {
    console.error('Network Error:', error);
    return []; // في حال حدوث خطأ في الشبكة
  }
};
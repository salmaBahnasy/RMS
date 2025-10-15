import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../../../../constants/BaseUrl";
import { I18nManager } from "react-native";
import { GetAllEquipmentForAttendance } from "../../../../constants/ServicesNames";

export const getAllEquipmentForAttendance = async (projectId: string | number, teamId: string | number) => {
  // الحصول على التوكن من AsyncStorage
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);

  // تكوين الرابط مع الباراميترات
  const url = `${BaseURL}${GetAllEquipmentForAttendance}?pageNumber=1&pageSize=20&projectId=${projectId}&teamId=${teamId}`;
  console.log("Request URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Equipment Attendance Data:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error fetching equipment attendance data:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("Network error:", error);
    return error?.message || "Network error";
  }
};


export const startEquipmentAttendance  = async (
  attendanceStatusId: number,
  attendanceIds: number[]
) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url =
    BaseURL + '/api/services/app/EquipmentAttendance/StartAttendance';
  console.log('url', url);

    const payload = {
    attendanceStatusId,
    attendanceIds,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('response...', response);
    console.log('payload...', payload);

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.error(
        'Error  :',
        response.status,
        errorData,
      );
      return null;
    }
  } catch (error: any) {
    console.error('Network error:', error);
    return null;
  }
};

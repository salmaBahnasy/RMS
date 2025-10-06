import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import { BaseURL } from "../../../../constants/BaseUrl";
import { EquipmentTransferRequest, GetAllDriversByTeamId, GetAllEquipment } from "../../../../constants/ServicesNames";
  


interface TransferPayload {
  id?: number; // ممكن يكون 0
  equipmentId: number;
  projectId: number;
  teamId: number;
  driverId?: number; 
  createdById?: number; // ممكن يكون 0
  isSameDriver?: boolean;
  hasDriver?: boolean;
  shiftId?: number;
  isForEquipment?: boolean;
}
export const getAllEquipment = async (
  pageNumber: number = 1,
  pageSize: number = 20,
  brandId?: number,
  projectId?: number,
  teamId?: number,
  withDriver?: boolean
) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);

  // تكوين رابط URL مع query parameters ديناميكية
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (brandId !== undefined) queryParams.append('brandId', brandId.toString());
  if (projectId !== undefined) queryParams.append('projectId', projectId.toString());
  if (teamId !== undefined) queryParams.append('teamId', teamId.toString());
  if (withDriver !== undefined) queryParams.append('withDriver', withDriver.toString());

  const url = `${BaseURL}${GetAllEquipment}?${queryParams.toString()}`;
  console.log("Request URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        "Authorization": `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("All Equipment Data:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error fetching all equipment:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("Network error:", error);
    return error?.message || "Network error";
  }
};


export const getAllDriversByTeamId = async (teamId: number) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);

  const url = `${BaseURL}${GetAllDriversByTeamId}?TeamId=${teamId}`;
  console.log('url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,
      },
    });

    console.log('response...', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Drivers Data:', data);
      return data; // فيه result اللي هي قايمة السواقين
    } else {
      console.error(
        'Error fetching drivers:',
        response.status,
        response.statusText,
      );
      const errorData = await response.json();
      console.log(errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error('Network error:', error);
    return error?.message || 'Network error';
  }
}


export const sendEquipmentTransferRequest = async (payload: TransferPayload) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log("userToken", userToken);

    const url = `${BaseURL}${EquipmentTransferRequest}`;
    console.log("Request URL:", url);
    console.log("Payload:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Transfer Request Response:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error sending transfer request:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("Network error:", error);
    return error?.message || "Network error";
  }
};


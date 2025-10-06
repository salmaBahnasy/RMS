import { I18nManager } from "react-native";
import { BaseURL } from "../../../../constants/BaseUrl";
import { GetEquipmentMalfunctionDetailsById, GetEquipmentMalfunctionGrid } from "../../../../constants/ServicesNames";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getEquipmentMalfunctionGrid = async (equipmentNumber: string | number) => {
  // تكوين الرابط مع باراميتر واحد ثابت + pagination ثابت
  const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken)
  const url = `${BaseURL}${GetEquipmentMalfunctionGrid}?equipmentNumber=${equipmentNumber}&pageNumber=1&pageSize=20`;
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
      console.log("Grid Data:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error fetching grid data:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("Network error:", error);
    return error?.message || "Network error";
  }
};

export const getEquipmentMalfunctionDetailsById = async (id: string | number) => {
   const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken)
  const url = `${BaseURL}${GetEquipmentMalfunctionDetailsById}?Id=${id}`;
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
      console.log("Details Data:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error fetching details data:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("Network error:", error);
    return error?.message || "Network error";
  }
};

const CreateEquipmentFixedRequest = "/api/services/app/Malfunction/CreateEquipmentFixedRequest";

// دالة POST باستخدام data object
export const createEquipmentFixedRequest = async (data: { id: number; note: string }) => {
   const userToken = await AsyncStorage.getItem('userToken');
     console.log('userToken', userToken)
  const url = `${BaseURL}${CreateEquipmentFixedRequest}`;
  console.log("Request URL:", url);
  console.log("Request Body:", data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Fixed Request Success:", result);
      return result;
    } else {
      const errorData = await response.json();
      console.error("❌ Fixed Request Error:", errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error("❌ Network error:", error);
    return error?.message || "Network error";
  }
};


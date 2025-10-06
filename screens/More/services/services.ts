import { I18nManager, Platform } from "react-native";
import { BaseURL } from "../../../constants/BaseUrl";
import { addAttachmentapi, allRequstsVacation, approveVavRequest, requstVacation, restofVacation, searchINAllRequstsVacation, typeOfVacation } from "../../../constants/ServicesNames";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getRestofVacation = async (empId: any, empcontractVacationld: any) => {
    const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + restofVacation + `?empId=${empId}&empcontractVacationId=${empcontractVacationld}`;
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        "Authorization": `Bearer ${userToken}`,
      },
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
const getVacationType = async (empld: any) => {
    const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + typeOfVacation + `?empId=${empld}`;
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        "Authorization": `Bearer ${userToken}`,
      },
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
const addAttachment = async (image: any) => {
   const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + addAttachmentapi;
  const data = new FormData();

  // إضافة الملف إلى FormData
  data.append('file', {
    uri: image.uri,
    name: image.fileName || `image_${Date.now()}.jpg`, // تأكد من وجود اسم للملف
    type: image.type || 'image/jpeg', // تأكد من وجود نوع الملف
  });
  console.log({ data })
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
         "Authorization": `Bearer ${userToken}`,

      },
      body: data, // 
    });

    console.log('response...', response);

    if (response.ok) {
      const responseData = await response.json();
      console.log('Data:', responseData);
      return responseData;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData);
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};

const submitVacationRequest = async (data: any) => {
   const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + requstVacation;
  console.log(url, data)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        "Authorization": `Bearer ${userToken}`,

      },
      body: JSON.stringify(data)
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
// ------------------------view vacation-------------------------
const getAllRequests = async (empld: any, pageNumber: any, pageSize: any) => {
     const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + allRequstsVacation + `?empId=${empld}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  console.log({ url })
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
         "Authorization": `Bearer ${userToken}`,
      },
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
const searchInAllRequestes = async (empId: any, startDate: any, endDate: any, pageNumber: any, pageSize: any) => {
  const userToken = await AsyncStorage.getItem('userToken');
  const url = BaseURL + searchINAllRequstsVacation + `?empId=${empId}&startDate=${startDate}&endDate=${endDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
         "Authorization": `Bearer ${userToken}`,
      },
    });
    console.log('response...', response);
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      let error = {
        msg: 'Error fetching data:',
        responseStatus: response.status,
        responseStatusText: response.statusText,
      };
      const errorData = await response.json();
      console.log(errorData)
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error;
  }
};
// ..................................................................
const getDaysBetweenDates = (startDate: any, endDate: any) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // التحقق من أن القيم المُدخَلة صالحة كتواريخ
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD' or a valid Date object.");
  }

  const difference = Math.abs(end.getTime() - start.getTime()); // الفرق بالمللي ثانية
  return Math.ceil(difference / (1000 * 60 * 60 * 24)); // تحويل إلى أيام
};
// ...................................................................
const approveVacEmp = async (data:any): Promise<any> => {
  try {
 
   const userToken = await AsyncStorage.getItem('userToken');
    const url = `${BaseURL}${approveVavRequest}`;
    console.log('url:', url,data,userToken);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
         "Authorization": `Bearer ${userToken}`,
      },
      body:JSON.stringify(data)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data;
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
export {
  getRestofVacation,
  getVacationType,
  submitVacationRequest,
  // 
  getAllRequests,
  searchInAllRequestes,
  addAttachment,
  // ----------
  getDaysBetweenDates,
  approveVacEmp

}
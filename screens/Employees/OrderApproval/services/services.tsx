import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from '../../../../constants/BaseUrl';
import { allApproval, completeTansferEmployee, completeTansferTeam, postApprovalFunction } from '../../../../constants/ServicesNames';
import { I18nManager } from 'react-native';

export interface ApprovalRequest {
  description: string;
  name: string;
  dataURL: string;
  excutedProcessID: number;
  recordID: number;
  createDate: string;
}

const getAllApprovalRequests = async (): Promise<ApprovalRequest[]> => {
  try {
    const userData = await AsyncStorage.getItem('userId');
    const userId: number = JSON.parse(userData || '0');

    const url = `${BaseURL}${allApproval}?userId=${userId}`;
    console.log('url:', url);
    console.log('userId:', userId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

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
const getAllApprovalDetails = async (apiLink: any, id: any): Promise<any> => {
  try {
    const userData = await AsyncStorage.getItem('userId');
    const userId: number = JSON.parse(userData || '0');
    // const fixedUrl = fixUrl(apiLink);
    // console.log(fixedUrl);

    const url = `${BaseURL}${apiLink}?Id=${id}`;
    console.log('getAllApprovalDetails', url);
    console.log('userId:', userId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data?.result || {};
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};
const fixUrl = (url: string) => {
  if (url.includes('&Id=')) {
    // لو موجود &Id= بدله بـ ?Id=
    return url.replace('&Id=', '?Id=');
  } else if (url.endsWith('GetTransferEmployeeRequestById')) {
    // لو ينتهي بـ GetTransferEmployeeRequestById بدون أي Id
    return url + '?Id=';
  } else {
    // في أي حالة ثانية خليه كما هو
    return url;
  }
};


const postApproval = async (excutedProcessID: any, isAccepted: any): Promise<any> => {
  try {
    const userData = await AsyncStorage.getItem('userId');
    const userId: number = JSON.parse(userData || '0');
    let data = {
      "createdBy": userId,
      "excutedProcessID": excutedProcessID,
      "isAccepted": isAccepted
    }
    const url = `${BaseURL}${postApprovalFunction}`;
    console.log('url:', url);
    console.log('postApproval:data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data?.result || {};
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};
// ...........................................
const CompleteTansferEmployee = async (id: any): Promise<any> => {
  try {
    const url = `${BaseURL}${completeTansferEmployee}${id}`;
    console.log('CompleteTansferEmployee', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data?.result || {};
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};
const CompleteTansferTeam = async (id: any): Promise<any> => {
  try {
    const url = `${BaseURL}${completeTansferTeam}${id}`;
    console.log('CompleteTansferTeam', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data?.result || {};
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};
export {
  getAllApprovalRequests,
  getAllApprovalDetails,
  postApproval,
  CompleteTansferEmployee,
  CompleteTansferTeam
};
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../../../../constants/BaseUrl";
import { I18nManager } from "react-native";
import { approveTransferEmp, vacationRequests } from "../../../../constants/ServicesNames";

export interface ApprovalRequest {
  Id: number,
  EmployeeNameAr: string,
  EmployeeNameEn: string,
  Date: Date,
  CurrentTeamAndProject: string,
  NewTeamAndProject: string,
  Status: boolean
}


const getAllVacationRequests = async (pageNumber:number): Promise<ApprovalRequest[]> => {
    const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  try {
    const userData = await AsyncStorage.getItem('userId');
    const userId: number = JSON.parse(userData || '0');

    const url = `${BaseURL}${vacationRequests}?pageNumber=${pageNumber}&pageSize=10`;
    console.log('url:', url);
    console.log('userId:', userId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,

      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);

      return data?.result?.returnData?.requests || [];
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

const approveTranEmp = async (payload:any): Promise<any> => {
   const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  try {
 

    const url = `${BaseURL}${approveTransferEmp}`;
    console.log('url:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,
        
      },
      body:JSON.stringify(payload)
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
  getAllVacationRequests,
  approveTranEmp
}
import { I18nManager } from 'react-native';
import { BaseURL } from '../../../../constants/BaseUrl';
import { transferEquipmentList } from '../../../../constants/ServicesNames';
import AsyncStorage from '@react-native-async-storage/async-storage';



// نوع البيانات اللي بترجع (Equipment Transfer Requests)
export interface EquipmentTransferRequest {
  id: number;
  equipmentName: string;
  driverName: string;
  currentProjectTeam: string;
  newProjectTeam: string;
  approvalStatusId: number;
}

export const getEquipmentTransferRequests = async (
  pageNumber: number,

): Promise<EquipmentTransferRequest[]> => {
  const userToken = await AsyncStorage.getItem('userToken');
       console.log('userToken', userToken)
  try {
    const url = `${BaseURL}${transferEquipmentList}?pageNumber=${pageNumber}&pageSize=10`;
    console.log('url:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return [];
    }

    const data = await response.json();
    console.log('data:', data);

    return data?.result?.returnData?.requests || [];
  } catch (error) {
    console.error('Network Error:', error);
    return [];
  }
};
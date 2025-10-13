import {I18nManager} from 'react-native';
import {BaseURL} from '../../../../constants/BaseUrl';
import {
  GetEquipmentDetailsByNumber,
  GetEquipmentDetailsByNumberForDisesl,
  GetEquipmentDetailsByNumberQr,
  GetMalfunctionTypes,
  GetMalfunctionworkshop
} from '../../../../constants/ServicesNames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getEquipmentDetailsByNumber = async (number: string) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = `${BaseURL}${GetEquipmentDetailsByNumber}?id=${number}`;
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
      console.log('Data:', data);
      return data;
    } else {
      console.error(
        'Error fetching data:',
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
};



const getEquipmentDetailsByNumberQr = async (number: string) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = `${BaseURL}${GetEquipmentDetailsByNumberQr}?number=${number}`;
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

    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.error('Error fetching data:', response.status, errorData);
      return errorData;
    }
  } catch (error: any) {
    console.error('Network error:', error);
    return error?.message || 'Network error';
  }
};

const getEquipmentDetailsByNumberForDiesel = async (number: string) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = `${BaseURL}${GetEquipmentDetailsByNumberForDisesl}?number=${number}`;
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
      console.log('Data:', data);
      return data;
    } else {
      console.error(
        'Error fetching data:',
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
};

const getAllMalfunctionTypes = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = BaseURL + GetMalfunctionTypes;
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
      console.log('Malfunction Types:', data);
      return data;
    } else {
      console.error(
        'Error fetching malfunction types:',
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
};
const getAllworkshop = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = BaseURL + GetMalfunctionworkshop;
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
      console.log('Malfunction Types:', data);
      return data;
    } else {
      console.error(
        'Error fetching malfunction types:',
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
};

const createMalfunctionRequest = async (payload: {
  id: number;
  equipmentId: number;
  equipmentNumber: number;
  photo: string;
  malfunctionDetails: string;
  malfunctionTypeId: number;
  projectId?: number;
  teamId?: number;
  driverId?: number;
  machineTypeId: number;
  isFixed: boolean;
}) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url =
    BaseURL + '/api/services/app/Malfunction/CreateMalfunctionRequest';
  console.log('url', url);

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

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
      return data;
    } else {
      const errorData = await response.json();
      console.error(
        'Error submitting malfunction:',
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

const createDieselRequest = async (payload: any) => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  const url = `${BaseURL}/api/services/app/EquipmentDiesel/CreateDieselRequest`;
  console.log('url', url);

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

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error('❌ Error sending diesel request:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};




export {
  getEquipmentDetailsByNumberQr,
  getAllMalfunctionTypes,
  createMalfunctionRequest,
  createDieselRequest,
  getEquipmentDetailsByNumber,
  getEquipmentDetailsByNumberForDiesel,
  getAllworkshop
};

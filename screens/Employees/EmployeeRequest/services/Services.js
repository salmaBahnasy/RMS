import {I18nManager} from 'react-native';
import {BaseURL} from '../../../../constants/BaseUrl';
import {
  getEmployeesbyShift,
  transferEmployee,
} from '../../../../constants/ServicesNames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransferEmployee = async data => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  let url = BaseURL + transferEmployee;
  console.log('TransferEmployee', data, I18nManager.isRTL ? 'ar' : 'en');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
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
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
const getEmps = async shfitId => {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
  let url = BaseURL + getEmployeesbyShift +`shiftId=${shfitId}`;
  console.log('getEmps', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        Authorization: `Bearer ${userToken}`,
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
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
export {TransferEmployee, getEmps};

import { I18nManager } from 'react-native';
import {BaseURL} from '../../../constants/BaseUrl';
import {
  GenerateAndSendEmailOtP,
  GenerateAndSendMobileOtp,
  forgetPassword
} from '../../../constants/ServicesNames';

const sendemailForOTP = async email => {
  const url = BaseURL + GenerateAndSendEmailOtP + `?email=${email}`;
  console.log('data', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language":I18nManager.isRTL?"ar":"en"

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
const sendphoneForOTP = async phoneNumber => {
  const url =
    BaseURL + GenerateAndSendMobileOtp + `?phoneNumber=${phoneNumber}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language":I18nManager.isRTL?"ar":"en"
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

const resetPassword = async (
  newPassword,
  newPasswordConfirm,
  mobileNum,
  email,
) => {
  const url = BaseURL + forgetPassword;
  const data = {
    newPassword,
    newPasswordConfirm,
    mobileNum,
    email,
  };
  console.log('data', data, url);
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language":I18nManager.isRTL?"ar":"en"
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
      return error;
    }
  } catch (error) {
    console.error('Network error:', error);
    return error?.join(', ');
  }
};
export {sendemailForOTP, resetPassword, sendphoneForOTP};

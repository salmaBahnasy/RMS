import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import { decode } from 'base-64';
global.atob = decode;
// ......check if token is expired........................................
const isTokenExpired = async () => {
    const token  = await AsyncStorage.getItem('userToken');
    console.log('token', token);
    try {
      const decoded = jwtDecode(token);
      console.log(decoded, decoded.exp);
      const currentTime = Date.now() / 1000; // تحويل الوقت الحالي إلى ثواني
      return decoded.exp < currentTime; // إذا كان الوقت الحالي أكبر من exp فهذا يعني أن التوكن منتهي
    } catch (error) {
      console.error('Invalid token or error decoding', error);
    }
  };

  export{
    isTokenExpired
  }


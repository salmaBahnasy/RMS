import { I18nManager } from "react-native";
import { BaseURL } from "../../../constants/BaseUrl";
import { notification, tasks } from "../../../constants/ServicesNames";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getNote = async () => {
    const data = await AsyncStorage.getItem('userId')
    let userId = JSON.parse(data)
    let url = BaseURL + notification + `?userId=${userId}`
    console.log("getEmps", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Language": I18nManager.isRTL ? "ar" : "en"
            },
        });
        console.log('response...', response);
        if (response.ok) {
            const data = await response.json();
            console.log('Data:', data);
            return data?.result || [];
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return [] ;
        }
    } catch (error) {
        console.error('Network error:', error);
        return [] //error?.join(', ');
    }
};
const getTasks = async () => {
    const data = await AsyncStorage.getItem('userId')
    let userId = JSON.parse(data)
    let url = BaseURL + tasks + `?UserID=${userId}`
    console.log("getEmps", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Language": I18nManager.isRTL ? "ar" : "en"
            },
        });
        console.log('response...', response);
        if (response.ok) {
            const data = await response.json();
            console.log('Data:', data);
            return data?.result|| [];
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return []//error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return []//error?.join(', ');
    }
};

export{
    getNote,
    getTasks
}
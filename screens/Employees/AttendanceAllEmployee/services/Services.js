import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../../../../constants/BaseUrl";
import {
    GetAllEmployees,
    GetSiteByProjectID,
    EmployeesBasedOnShift,
    GetProjectsByEmpID,
    companySettings,
    GetShiftsByTeamId,
    recordAttendance,
    GetAllLkpProjects,
} from "../../../../constants/ServicesNames";
import { I18nManager } from "react-native";

// const companySettingsApi = async (id) => {
//     const userToken = await AsyncStorage.getItem('userToken');
//     console.log('userToken', userToken)
//     const data = await AsyncStorage.getItem('userId')
//     let userId = JSON.parse(data)
//     let url = BaseURL + companySettings + `?userId=${userId}`
//      console.log("userId", userId)
//     console.log("url", url)
//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json; charset=utf-8',
//                 "Accept-Language": I18nManager.isRTL ? "ar" : "en",
//                 'Authorization': `Bearer ${userToken}`,
//             },
//         });
//         console.log('response...', response);
//         if (response.ok) {
//             const data = await response.json();
//             console.log('Data:', data);
//             return data;
//         } else {
//             console.error(
//                 'Error fetching data:',
//                 response.status,
//                 response.statusText,
//             );
//             const errorData = await response.json();
//             console.log(errorData)
//             return error;
//         }
//     } catch (error) {
//         console.error('Network error:', error);
//         return error?.join(', ');
//     }
// };

const companySettingsApi = async () => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    const data = await AsyncStorage.getItem("userId");
    const userId = JSON.parse(data || "null");

    const url = `${BaseURL}${companySettings}?userId=${userId}`;
    console.log("🌍 url:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", response.status, errorData);
      return { success: false, status: response.status, error: errorData };
    }

    const json = await response.json();
    console.log("✅ Parsed JSON:", json);
    return { success: true, data: json?.result };
  } catch (err) {
    console.error("⚠️ Network error:", err);
    return { success: false, error: err?.message || "Network error" };
  }
};


const getAllProjects = async () => {
  try {
     const userToken = await AsyncStorage.getItem("userToken");
    const data = await AsyncStorage.getItem("empId");
    const empId = JSON.parse(data || "null");

    const url = `${BaseURL}${GetProjectsByEmpID}?empId=${empId}`;
    console.log("🌍 url:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": I18nManager.isRTL ? "ar" : "en",
         Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", response.status, errorData);
      return { success: false, status: response.status, error: errorData };
    }

    const json = await response.json();
    console.log("✅ Parsed JSON:", json);
    return { success: true, data: json?.result?.returnData || [] };
  } catch (err) {
    console.error("⚠️ Network error:", err);
    return { success: false, error: err?.message || "Network error" };
  }
};
const getAllProjectsforemployeerequest = async () => {

    let url = BaseURL + GetAllLkpProjects   
    console.log("url", url)
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
            return data;
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};
const getAllEmployees = async () => {
    let url = BaseURL + GetAllEmployees
    console.log("getAllEmployees", url)
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
            return data;
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};
const searchEmployeebyNumber = async (id) => {
    let url = BaseURL + GetAllEmployees + `?jobNumber=${id}`
    console.log("url", url)
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
            return data;
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};
const getAllSite = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
    let url = BaseURL + GetSiteByProjectID + `?projectId=${id}`
    console.log("getAllSite", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Language": I18nManager.isRTL ? "ar" : "en",
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
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};

const getShiftById = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);
    let url = BaseURL + GetShiftsByTeamId + `?teamId=${id}`
    console.log("getShiftById", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Language": I18nManager.isRTL ? "ar" : "en",
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
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};
const getAttendanceByShiftId = async (shfitId) => {
    let url = BaseURL + EmployeesBasedOnShift + `?shiftId=${shfitId}`
    console.log("url", url)
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
            return data;
        } else {
            console.error(
                'Error fetching data:',
                response.status,
                response.statusText,
            );
            const errorData = await response.json();
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};

// ...............................................................................................
//post recored attendance for all emp
const attendanceEmployeesData = async (
    AttendanceStatus,
    shiftId, selectedEmployees,
    employList, isEnterLeaveSetting,
    lat, long, attendaceTime,
    leaveTime) => {
    const data = await AsyncStorage.getItem('empId')
    let empId = JSON.parse(data)
    // get currntTime
    let date = new Date();
    let time = new Date();
    console.log("selectedEmployees, employList", selectedEmployees, employList)
    try {
        const attendanceData = selectedEmployees.map((employeeId) => {
            const employee = employList.find(emp => emp.employeeId === employeeId);
            console.log("employee", employee?.id, employee?.employeeId)
            return {
                id: employee?.id,
                empId: employee?.employeeId, // Assuming you have a function to generate unique Ids
                mentorId: empId,
                status: AttendanceStatus, // or any status you need to set
                attendanceTime: attendaceTime ? attendaceTime : AttendanceStatus == 1 || AttendanceStatus == 5 ? time.toISOString() : null,
                leaveTime: leaveTime ? leaveTime : AttendanceStatus == 2 ? time.toISOString() : null,
                date: date.toISOString(),
                shiftId,
                isEnterLeaveSetting,
                lat,
                long
            };
        });

        console.log('Attendance Data:', attendanceData);
        return attendanceData; // Ensure that the data is returned
    } catch (error) {
        console.log("error", error);
        throw error; // Rethrow the error so it can be caught outside the function
    }
}
const recoredAttendanceForAllEmp = async (data) => {
    let url = BaseURL + recordAttendance;
    console.log(url)
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Language": I18nManager.isRTL ? "ar" : "en"
            },
            body: JSON.stringify(data)
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
            console.log(errorData)
            return error;
        }
    } catch (error) {
        console.error('Network error:', error);
        return error?.join(', ');
    }
};
export {
    getAllProjects,
    getAllSite,
    getShiftById,
    getAttendanceByShiftId,
    companySettingsApi,
    recoredAttendanceForAllEmp,
    attendanceEmployeesData,
    getAllEmployees,
    searchEmployeebyNumber,
    getAllProjectsforemployeerequest
}
// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash/Splash';
import Login from '../screens/Login/Login';
import ForgetPassword from '../screens/ForgetPassword/ForgetPassword';
import EquipmentSearch from '../screens/Equipments/EquipmentSearch/EquipmentSearch';
import EquipmentRequest from '../screens/Equipments/EquipmentRequest/EquipmentRequest';
import Profile from '../screens/Profile/Profile';
import PersonalData from '../screens/Profile/PersonalData';
import ChangePassword from '../screens/Profile/ChangePassword';
import ContractData from '../screens/Profile/ContractData';
import VacationRequest from '../screens/More/VacationRequest';
import EquipmentReports from '../screens/Equipments/EquipmentReports/EquipmentReports';
import AcceptRejectEquipmentRequest from '../screens/Equipments/AcceptRejectEquipmentRequest/AcceptRejectEquipmentRequest';
import EquipmentPreparation from '../screens/Equipments/EquipmentPreparation/EquipmentPreparation';
import ReportMalfunction from '../screens/Equipments/ReportMalfunction/ReportMalfunction';
import FeedBackScreen from '../screens/common/components/FeedBackScreen';
import SendOtp from '../screens/ForgetPassword/SendOtp';
import ResetPassword from '../screens/ForgetPassword/ResetPassword';
import EmployeesSearch from '../screens/Employees/EmployeesSearch/EmployeesSearch';
import EmployeeRequest from '../screens/Employees/EmployeeRequest/EmployeeRequest';
import EmployeesReports from '../screens/Employees/EmployeesReports/EmployeesReports';
import AcceptRejectRequest from '../screens/Employees/AcceptRejectRequest/AcceptRejectRequest';
import DaysWithoutFingerprinting from '../screens/Employees/DaysWithoutFingerprinting/DaysWithoutFingerprinting';
import AttendanceAndLeave from '../screens/Employees/AttendanceAndLeave/AttendanceAndLeave';
import FastLogin from '../screens/Login/FastLogin';
import Tabs from './tabs';
import VacationHistory from '../screens/More/VacationHistory';
import JustificationsForAbsence from '../screens/Employees/DaysWithoutFingerprinting/components/JustificationsForAbsence';
import AttendanceAllEmployee from '../screens/Employees/AttendanceAllEmployee/AttendanceAllEmployee';
import EmployeeDetails from '../screens/Employees/AttendanceAllEmployee/EmployeeDetails';
import OrderApproval from '../screens/Employees/OrderApproval/OrderApproval';
import OrderDetails from '../screens/Employees/OrderDetails/OrderDetails';
import DieselScreen from '../screens/Equipments/EquipmentDiesel/DieselScrren';
import MalfunctionRequests from '../screens/Equipments/MalfunctionRequests/MalfunctionRequests';
import MalfunctionDetails from '../screens/Equipments/MalfunctionRequests/MalfunctionDetails ';
import VacationApprovalRequest from '../screens/Employees/VacationApprovalRequest/VacationApprovalRequest';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen}  />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="FastLogin" component={FastLogin} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="Home" component={Tabs} />
        {/* .............................start Equipment.............................. */}
        <Stack.Screen name="EquipmentSearch" component={EquipmentSearch} />
        <Stack.Screen name="EquipmentRequest" component={EquipmentRequest} />
        <Stack.Screen name="EquipmentReports" component={EquipmentReports} />
        <Stack.Screen
          name="AcceptRejectEquipmentRequest"
          component={AcceptRejectEquipmentRequest}
        />
        <Stack.Screen
          name="EquipmentPreparation"
          component={EquipmentPreparation}
        />
        <Stack.Screen name="ReportMalfunction" component={ReportMalfunction} />
        <Stack.Screen name="DieselScreen" component={DieselScreen} />
        <Stack.Screen
          name="MalfunctionRequests"
          component={MalfunctionRequests}
        />
        <Stack.Screen
          name="MalfunctionDetails"
          component={MalfunctionDetails}
        />
        {/* ............................end Equipment............................... */}
        {/* .............................start employee.............................. */}
        <Stack.Screen name="EmployeesSearch" component={EmployeesSearch} />
        <Stack.Screen name="EmployeeRequest" component={EmployeeRequest} />
        <Stack.Screen name="EmployeesReports" component={EmployeesReports} />
        <Stack.Screen
          name="AcceptRejectRequest"
          component={AcceptRejectRequest}
        />
        <Stack.Screen
          name="DaysWithoutFingerprinting"
          component={DaysWithoutFingerprinting}
        />
        <Stack.Screen
          name="JustificationsForAbsence"
          component={JustificationsForAbsence}
        />

        <Stack.Screen
          name="AttendanceAndLeave"
          component={AttendanceAndLeave}
        />
        <Stack.Screen
          name="AttendanceAllEmployee"
          component={AttendanceAllEmployee}
        />
        <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} />
        <Stack.Screen name="OrderApproval" component={OrderApproval} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="VacationApprovalRequest" component={VacationApprovalRequest} />


        {/* .............................end employee.............................. */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PersonalData" component={PersonalData} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ContractData" component={ContractData} />
        <Stack.Screen name="VacationRequest" component={VacationRequest} />
        <Stack.Screen name="VacationHistory" component={VacationHistory} />
        <Stack.Screen name="FeedBackScreen" component={FeedBackScreen} />
        <Stack.Screen name="SendOtp" component={SendOtp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;

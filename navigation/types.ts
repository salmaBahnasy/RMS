import { StackNavigationProp } from '@react-navigation/stack';

// 1. First define strict types for your navigation
export interface EmployeeItem {
  image: string;
  employeeName: string;
  employeeId: string;
};

type AttendanceAllEmployeeParams = {
  data: {
    item: EmployeeItem;  // Made required here
    isEnterLeaveSetting: boolean;
    shiftId: string | number;
    lat: string | number;
    long: string | number;
  };
};

type MalfunctionDetailsParms = { 
  equipment : string | number;
}

export type RootStackParamList = {
  TabNavigator: undefined;
  Home: undefined;
  Settings: undefined;
  Login: undefined,
  SplashScreen: undefined,
  Employees: undefined;
  Equipment: undefined;
  EmployeesSearch: undefined;
  EmployeeRequest: undefined;
  AcceptRejectRequest: undefined;
  DieselScreen :  undefined;
  EmployeesReports: undefined;
  AttendanceAndLeave: undefined;
  MalfunctionRequests: undefined;
  // MalfunctionDetails: { equipment: MalfunctionDetailsParms };
  DaysWithoutFingerprinting: { justifiedData: any | undefined};
  JustificationsForAbsence: {
    attendanceId: number  ;
    date: number | string;
    justificationTypeId: number | string;
      onSubmit?: any;
       isApproved?: boolean; 
  };
  OrderApproval: undefined;
  OrderDetails: { order: any };
  EquipmentSearch: undefined;
  EquipmentRequest: undefined;
  AcceptRejectEquipmentRequest: undefined;
  EquipmentReports: undefined;
  EquipmentPreparation: undefined;
  ReportMalfunction: undefined;
  ForgetPassword: undefined;
  SendOtp: { data: string };
  ResetPassword: {data:string};
  FeedBackScreen: {
    header: string;
    image: any; // Use ImageSourcePropType if images are imported
    buttonText: string;
    onPress: () => void;
    description: string;

  };
  VacationApprovalRequest:undefined,
  More: undefined;
  VacationRequest: undefined;
  Profile: undefined; // Define the 'Profile' route with no parameters
  PersonalData: undefined;
  ChangePassword: undefined;
  ContractData: undefined;
  FastLogin:undefined;
  VacationHistory:undefined;
  AttendanceAllEmployee:AttendanceAllEmployeeParams
  EmployeeDetails: {
    item?: EmployeeItem;
    // Other possible params
    isEnterLeaveSetting?: boolean;
    shiftId?: string | number;
    lat: string | number;
    long: string | number;
};
  // Add other screens here
};
export interface ProjectItem {
  projectName: string;
  id: string;
  name: string;
  type: 'project' | 'project2';
}

export interface SiteItem {
  id: string;
  teamName: string;
  type: 'sites' | 'sites2';
}

export interface ShiftItem {
  id: string;
  shiftName: string;
  type: 'shift' | 'shift2';
}

export type DropdownItem = ProjectItem | SiteItem | ShiftItem;


export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
export type PersonalDataScreenNavigationProp = StackNavigationProp<RootStackParamList>;
export type ContractDataScreenNavigationProp = StackNavigationProp<RootStackParamList>;
export type ChangePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList>;
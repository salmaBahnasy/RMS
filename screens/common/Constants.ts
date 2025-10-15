import { icons } from "../../constants"
import { ImageSourcePropType } from 'react-native';
import { RootStackParamList } from '../../navigation/types';

interface EmployeeItem {
    label: string;
    image: ImageSourcePropType;
    onPress: keyof RootStackParamList;
  }
  

const employeesList: EmployeeItem[] =  [
       {
        label:'approveRejectWorkerRequest',
        image: icons?.approveRejectWorkerRequest,
        onPress:'AcceptRejectRequest'


    },

    {
        label:'workerRequest',
        image: icons?.workerRequest,
        onPress:'EmployeeRequest'


    },
 
        {
        label: 'AttendanceAllEmployee',
        image: icons?.attendanceWorker,
        onPress:'AttendanceAllEmployee'

    },
    // {
    //     label:'employeeReports',
    //     image: icons?.employeeReports,
    //     onPress:'EmployeesReports'


    // },
     {
        label:'orderApproval',
        image: icons?.approve,
        onPress:'OrderApproval'


    },
    {
        label:'attendanceAndLeave',
        image: icons?.attendanceAndLeave,
        onPress:'AttendanceAndLeave'


    },
    {
        label:'daysWithoutFingerprint',
        image: icons?.daysWithoutFingerprint,
        onPress:'DaysWithoutFingerprinting'


    },
    {
        label:'vacationRequest',
        image: icons?.vacc,
        onPress:"VacationApprovalRequest"


    },
   
]
interface EquipmentItem {
    label: string;
    image: ImageSourcePropType;
    onPress: keyof RootStackParamList;
  }
const equipmentList :EquipmentItem[] = [
    
    {
        label:'equipment_request',
        image: icons?.equipment_request,
        onPress:'EquipmentRequest'

    },
    {
        label:'accept_reject_equipment_request',
        image: icons?.accept_reject_equipment_request,
        onPress:'AcceptRejectEquipmentRequest'


    },
    // {
    //     label:'equipment_reports',
    //     image: icons?.equipment_reports,
    //     onPress:'EquipmentReports'


    // },
    {
        label:'MalfunctionRequests',
        image: icons?.malfunctionRequests,
        onPress:'MalfunctionRequests'


    },
    {
        label:'report_malfunction',
        image: icons?.report_malfunction,
        onPress:'ReportMalfunction'


    },
    
    {
        label:'equipment_preparation',
        image: icons?.equipment_preparation,
        onPress:'EquipmentPreparation'
    },
     {
        label:'diesel_consumption',
        image: icons?.diesel,
        onPress:'DieselScreen'


    },
]


export {
    employeesList,
    equipmentList
}
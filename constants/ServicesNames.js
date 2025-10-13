const login = '/api/TokenAuth/Authenticate';
const GenerateAndSendMobileOtp = '/api/services/app/Otp/GenerateAndSendMobileOtp';
const GenerateAndSendEmailOtP = "/api/services/app/Otp/GenerateAndSendEmailOtP";
const verifyOtp = "/api/services/app/Otp/VerifyOtp";
const AuthenticateOtp = "/api/TokenAuth/AuthenticateOtp";
const changePassword = "/api/services/app/User/ChangePassword";
const forgetPassword = "/api/services/app/User/ForgetPassword";
const SendHaskKey = '/api/services/app/User/GenerateAndSendMobileOtpForMobile/'
const saveFingerPrint = '/api/services/app/EmployeeService/UpdateEmpFingerPrint'

// ...............................................................
const requests = "/api/TransferRequests/GetMobileTransferRequests/";
const GenerateReport = "/api/Attendance/GenerateReport/";
const UserDevices = "/api/UserDevices/POST";
const GetFCMForUser = "/api/Users/GetFCMForUser/";
const UpdateFCMForUser = "/api/User/UpdateFCMForUser";
const saveWorkerAttendance = "/api/Attendance/attendAllEMp";
const dayOffShiftByMonth = '/api/Attendance/GetUserNotSign/';
const getAllAreaByShfit = '/api/ShiftArea/GetAreasByIdAndUserIdMob/';
// .............................profile api.........................................
const getEmpDetails = "/api/services/app/EmployeeService/GetEmpByIdDetails"
const getUserDetails = "/api/services/app/User/GetUserDataById";
// ---------------------------vacation requests-------------------------------------
const restofVacation = "/api/services/app/EmpVacation/GetEmpLastVacationDays";
const requstVacation = "/api/services/app/EmpVacation/CreateOrUpdate";
const typeOfVacation = "/api/services/app/EmpVacation/GetAllContractVacationsType";
const addAttachmentapi = "/api/services/app/Upload/UploadFile2";

// 
const allRequstsVacation = "/api/services/app/EmpVacation/GetAllVacationsForEmpPaged";
const searchINAllRequstsVacation = "/api/services/app/EmpVacation/GetSearchAllVacationsForEmp";
// attendance screen api
const ShiftAttendances = "/api/services/app/Attendance/PutAttendanceStatusByFingerPrint";
const userShift = '/api/services/app/Shift/GetShiftAttendanceDetails';
const EmployeesBasedOnShift = '/api/services/app/EmployeeShift/GetEmployeeShiftDetails';
const companySettings = '/api/services/app/Company/GetCompanyAttendanceSettingByUser';

//filter api
const GetSiteByProjectID = '/api/services/app/Teams/GetTeamsByProjectId';
const GetProjectsByEmpID='/api/services/app/Project/GetProjectByEmpId'
const GetShiftsByTeamId = "/api/services/app/Shift/GetShiftsByTeamId";
//record attendance 
const recordAttendance ="/api/services/app/Attendance/PutAttendanceStatus"
// transferEmployee
const transferEmployee ="/api/services/app/EmployeeService/TransferEmployee";
const GetAllEmployees ="/api/services/app/EmployeeService/GetEmployeesbyJobNumber"


// JustificationsForAbsence
const attendanceStatus = "/api/services/app/Attendance/GetEmployeeAttendanceStatus";
const postAbsenceReasons = "/api/services/app/AbsenceJustification/PostAbsenceReasons";

// approval

const  allApproval = "/api/services/app/Task/GetAllCurrentTaskForUser";
const postApprovalFunction='/api/services/app/ExcutedApproval/InsertExcutedApproval';
const transferRequests='/api/services/app/EmployeeService/GetTransferEmployeeRequests';
const approveTransferEmp='/api/services/app/ExcutedProcess/InsertExcutedProcs';
const completeTansferEmployee='/api/services/app/EmployeeService/TransferApprovedEmployee?id=';
const completeTansferTeam='/api/services/app/Teams/TransferApprovedTeam?id=';
const approveVavRequest='/api/services/app/ExcutedProcess/InsertExcutedProcs';
const  getEmployeesbyShift = '/api/services/app/Shift/GetEmployeeByShiftId?';
const notification='/api/services/app/Notification/GetAllCurrentNotificationForUser';
const tasks='/api/services/app/Task/GetAllCurrentTaskForUser' //need to check;
const  approveJustification ='/api/services/app/ExcutedProcess/InsertExcutedProcs';
const GetAllLkpProjects='/api/services/app/Project/GetAllLkpProjects';


const GetEquipmentDetailsByNumberForDisesl = '/api/services/app/EquipmentDiesel/GetByEquipmentNmuber';

const GetEquipmentDetailsByNumber = '/api/services/app/Equipment/GetEquipmentDetailsById';
const GetMalfunctionTypes = '/api/services/app/Malfunction/GetMalfunctionType';
const transferEquipmentList  = '/api/services/app/Equipment/GetTransferEquipmentList';
const GetEquipmentMalfunctionGrid = '/api/services/app/Malfunction/GetEquipmentMalfunctionGridMob'
const GetAllDriversByTeamId = '/api/services/app/Equipment/GetNotAssignedDriverByTeamId';
const GetEquipmentMalfunctionDetailsById = '/api/services/app/Malfunction/GetEquipmentMalfunctionDetailsById';
const GetEquipmentDetailsByNumberQr = '/api/services/app/Equipment/GetEquipmentDetailsByEquipmentNumber';
 const GetAllEquipment = '/api/services/app/Equipment/GetAllEquipment';
 const EquipmentTransferRequest = '/api/services/app/Equipment/EquipmentTransferRequest';
 const GetAllEquipmentForAttendance = "/api/services/app/EquipmentAttendance/GetAllEquipmentForAttendance";
 const GetMalfunctionworkshop = "/api/services/app/Equipment/GetWorkshopByMalfunctionTypeId";






export {
    login,
    GenerateAndSendMobileOtp,
    GenerateAndSendEmailOtP,
    verifyOtp,
    AuthenticateOtp,
    forgetPassword,
    SendHaskKey,
    saveFingerPrint,
    // ...........
    requests,
    GenerateReport,
    userShift,
    UserDevices,
    ShiftAttendances,
    GetFCMForUser,
    UpdateFCMForUser,
    GetSiteByProjectID,
    
    saveWorkerAttendance,
    dayOffShiftByMonth,
    getAllAreaByShfit,
    changePassword,
    getEmpDetails,
    getUserDetails,
    // vacation requests
    restofVacation,
    requstVacation,
    typeOfVacation,
    allRequstsVacation,
    searchINAllRequstsVacation,
    addAttachmentapi,
    EmployeesBasedOnShift,
    companySettings,
    GetProjectsByEmpID,
    GetShiftsByTeamId,
    // .transferEmployee
    transferEmployee,
    GetAllEmployees,
    attendanceStatus,
    postAbsenceReasons,
    recordAttendance,

    allApproval,
    postApprovalFunction,
    transferRequests,
    approveTransferEmp,
    completeTansferEmployee,
    completeTansferTeam,
    approveVavRequest,
    getEmployeesbyShift,
    notification,
    tasks,
    approveJustification,
    GetAllLkpProjects,



    GetEquipmentDetailsByNumberForDisesl,
    GetMalfunctionTypes,
    transferEquipmentList,
    GetEquipmentMalfunctionGrid,
    GetAllDriversByTeamId,
    GetEquipmentMalfunctionDetailsById,
    GetEquipmentDetailsByNumber,
    GetAllEquipment,
    EquipmentTransferRequest,
    GetEquipmentDetailsByNumberQr,
    GetAllEquipmentForAttendance,
    GetMalfunctionworkshop

}
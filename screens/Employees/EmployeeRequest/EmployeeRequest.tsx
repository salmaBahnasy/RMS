import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  I18nManager,
  View,
  TextStyle,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import {COLORS, icons, FONTS, SIZES, images} from '../../../constants';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import MainButton from '../../common/components/MainButton';
import {
  getAllProjects,
  getAllProjectsforemployeerequest,
  getAllSite,
  getShiftById,
} from '../AttendanceAllEmployee/services/Services';
import EmployeesDropdownModal from '../../common/components/EmployeesDropdownModal';
import styles from './styles';
import ErrorView from '../../common/components/ErrorView';
import FeedBackModal from '../../common/components/FeedBackModal';
import ConfirmMessage from '../../common/components/ConfirmMessage';
import {getEmps, TransferEmployee} from './services/Services';
import MainTextInput from '../../common/components/MainTextInput';
import {DropdownItem} from '../../../navigation/types';
import Loader from '../../common/components/Loader';
import SubHeader from '../../common/components/SubHeader';

interface Shift {
  id: string;
  shiftName: string;
}

interface Employee {
  empId: any;
  nameAr: any;
  nameEn: any;
  id: number;
  employeeName: string;
  employeeNameEn: string;
  projectName?: string;
}
interface ItemType {
  id: string;
  name?: string;
  teamName?: string;
  shiftName?: string;
  projectName?: string;
}

interface EmployeeRequestProps {}

const EmployeeRequest: React.FC<EmployeeRequestProps> = props => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(t('choose'));
  const [selectedShifts, setSelectedShifts] = useState<string>(t('choose'));

  const [loader, setloader] = useState(true);
  const [allprojects, setAllprojects] = useState([]);
  const [projectLabel, setProjectLabel] = useState<string>(t('choose'));
  const [projectID, setProjectID] = useState<string>('');
  const [projectLabel2, setProjectLabel2] = useState(t('choose'));
  const [projectID2, setProjectID2] = useState<string>('');
  const [allSites, setAllSites] = useState([]);
  const [siteLabel, setSiteLabel] = useState(t('choose'));
  const [siteLabel2, setSiteLabel2] = useState(t('choose'));

  const [allShift, setAllShift] = useState([]);
  const [allShift2, setAllShift2] = useState([]);
  const [shiftLabel, setshiftLabel] = useState(t('choose'));
  const [shiftLabel2, setshiftLabel2] = useState(t('choose'));

  const [siteId, setSiteId] = useState<string>('');
  const [siteId2, setSiteId2] = useState<string>('');

  const [shiftId, setShiftId] = useState<any>();
  const [shiftId2, setShiftId2] = useState<Shift[]>([]);

  const [employList, setEmployList] = useState([]);
  const [feedBackModal, setFeedBackModal] = useState(false);
  const [feedBackTitle, setFeedBackTitle] = useState<string>();
  const [feedBackImg, setFeedBackImg] = useState();
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const [dropDownData, setdropDownData] = useState([]);
  const [type, setType] = useState('project');
  const [showEmpList, setShowEmpList] = useState(false);
  const [employeeError, setemployeeError] = useState<null | String>(null);
  const [shiftError, setShiftError] = useState<null | String>(null);
  const [siteError, setsiteError] = useState<null | String>(null);

  const [showConfirmMessage, setShowConfirmMessage] = useState<boolean>(false);
  const [transferData, settransferData] = useState<any>();
  const [note, setNote] = useState('');
  const [showBtn, setShowBtn] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);


  useEffect(() => {
    const getprojects = async () => {
      let projects = await getAllProjectsforemployeerequest();
      console.log(projects);
      setAllprojects(projects?.result?.returnData);
      setloader(false);
    };
    getprojects();
  }, []);
 useEffect(() => {
  if (selectedEmployee) {
    setSelectedItem(I18nManager.isRTL ? selectedEmployee.nameAr : selectedEmployee.nameEn);
  } else {
    setSelectedItem(t('choose'));
  }
}, [selectedEmployee]);
  useEffect(() => {
    if (shiftId2?.length > 0) {
      setSelectedShiftNames();
    } else {
      setSelectedShifts(t('choose'));
    }
  }, [shiftId2]);

  const getAttendance = async (shift_Id: string) => {

    let employees = await getEmps(shift_Id);
    setEmployList(employees?.result?.returnData);
  };
  // ........................................
  // const toggleSelection = (item: Employee) => {
  //   const exists = selectedEmployees.some(emp => emp.id === item.id);

  //   if (exists) {
  //     setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== item.id));
  //   } else {
  //     setSelectedEmployees([...selectedEmployees, item]);
  //   }
  // };
const toggleSelection = (item: Employee) => {
  setSelectedEmployee(item); // يحفظ موظف واحد بس
  setSelectedItem(I18nManager.isRTL ? item.nameAr : item.nameEn); // يعرض الاسم في الـ DropDownButton
};


  const setSelectedNames = () => {
    if (selectedEmployees?.length > 0) {
      const selectedNames = selectedEmployees
        .map(item => (I18nManager.isRTL ? item.nameAr : item.nameEn))
        .join(', ');
      setSelectedItem(selectedNames);
    } else {
      setSelectedItem(t('choose'));
    }
  };
  const selectShifts = (item: Shift) => {
    const exists = shiftId2.some(shift => shift.id === item.id);

    if (exists) {
      setShiftId2(shiftId2.filter(shift => shift.id !== item.id));
    } else {
      setShiftId2([...shiftId2, item]);
    }
  };
  const setSelectedShiftNames = () => {
    const selectedNames = shiftId2.map(item => item?.shiftName).join(', ');
    setSelectedShifts(selectedNames);
  };
  // .........................................
 function SubmitTransfirRequest(): void {
  const empIds = selectedEmployee ? [selectedEmployee.empId] : []; 
  const shiftIds = shiftId2.map(item => item.id);

  if (empIds.length === 0) {
    setemployeeError(t('pleasechooseemp'));
    return;
  }
  if (shiftIds.length === 0) {
    setShiftError(t('pleasechooseoneormoreShift'));
    return;
  }
  if (siteId2 === siteId) {
    setsiteError(t('sitestheSame'));
    return;
  }

  let data = {
    empIds,
    shiftIds,
    teamId: siteId2,
    note,
  };
  setShowBtn(true);
  settransferData(data);
  setShowConfirmMessage(true);
  setFeedBackTitle(`${t('areyousuretransfer')} ${t('emp')} \n ${selectedItem}`);
  setFeedBackImg(icons?.workerRequest);
}
  // ..............................................................
  const Line = () => {
    return <View style={{...styles?.line}} />;
  };
  // ............................conditions to get Modal_Data...........
  const onSelectedItem = async (item: DropdownItem, type: string) => {
    console.log('selected_proj', item);

    try {
      switch (type) {
        case 'project':
          setProjectLabel(item.projectName);
          setProjectID(item.id);
          const sites = await getAllSite(item.id);
          setAllSites(sites?.result?.returnData || []);

          break;

        case 'sites':
          if ('teamName' in item) {
            setSiteLabel(item.teamName);
            setSiteId(item.id);
            const shift = await getShiftById(item.id);
            setAllShift(shift?.result?.returnData || []);
          }
          break;

        case 'shift':
          if ('shiftName' in item) {
            setshiftLabel(item.shiftName);
            setShiftId(item.id);
            await getAttendance(item.id);
          }
          break;

        case 'project2':
          // if ('name' in item) {
          setProjectLabel2(item.projectName);
          setProjectID2(item.id);
          const sites2 = await getAllSite(item.id);
          setAllSites(sites2?.result?.returnData || []);
          // }
          break;

        case 'sites2':
          if ('teamName' in item) {
            setSiteLabel2(item.teamName);
            setSiteId2(item.id);
            const shift2 = await getShiftById(item.id);
            setAllShift2(shift2?.result?.returnData || []);
          }
          break;
        case 'shift2':
          if ('shiftName' in item) {
            setshiftLabel2(item.shiftName);
            selectShifts(item);
          }
          break;
        default:
          console.warn(`Unhandled type: ${type}`);
      }
    } catch (error) {
      console.error('Error in onSelectedItem:', error);
    }
  };
  return (
    <SafeAreaView
      style={{
        height: SIZES?.height,
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar
        barStyle="dark-content" // لون الأيقونات (dark-content أو light-content)
        backgroundColor="white" // لون خلفية الـ StatusBar
        translucent={false} // مهم عشان يبان فوق
        hidden={false} // يضمن إنه ظاهر
      />
      <SubHeader
        leftIconAction={() => {
          navigation.goBack();
        }}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('transfer_of_employees')}
      />
      <FeedBackModal
        isVisible={feedBackModal}
        description={feedBackTitle}
        Image={feedBackImg}
        onDismiss={(val: boolean) => {
          setFeedBackModal(val);
        }}
      />
      <ConfirmMessage
        isVisible={showConfirmMessage}
        description={feedBackTitle}
        Image={feedBackImg}
        onDismiss={(val: boolean) => {
          setShowConfirmMessage(val);
        }}
        cancel={(val: any) => {
          setShowConfirmMessage(val);
        }}
        showBtn={showBtn}
        confirem={async () => {
          let confirm = await TransferEmployee(transferData);
          console.log({confirm});
          const messageType = confirm?.result?.message?.type;
          const messageContent = confirm?.result?.message?.content;
          if (messageType == 'Success') {
            setFeedBackTitle(
              confirm?.result?.message?.content || t('successfully'),
            );
            setFeedBackImg(images?.success);
            setShowBtn(false);
            setTimeout(() => {
              setShowConfirmMessage(false);
              navigation.goBack();
            }, 300);
          } else {
            setFeedBackTitle(messageContent || t('failed'));
            setFeedBackImg(images?.fail);
            setShowBtn(false);
            setTimeout(() => {
              setShowConfirmMessage(false);
              navigation.goBack();
            }, 3000);
          }
        }}
      />
      <BottomDropdownModal
        isVisible={isVisible}
        onDismiss={val => {
          setIsVisible(val);
        }}
        onSelectedItem={onSelectedItem}
        // listHeader={t('select_department')}
        data={dropDownData}
        type={type}
      />
      <EmployeesDropdownModal
        isVisible={showEmpList}
        onDismiss={function (visible: boolean): void {
          setShowEmpList(visible);
        }}
        selectedEmployees={selectedEmployees}
        toggleSelection={val => {
          toggleSelection(val);
        }}
        data={dropDownData}
      />

      {loader ? (
        <Loader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
          style={{
            backgroundColor: COLORS?.white,
            borderRadius: 16,
            margin: 10,
          }}>
          <DropDownButton
            onIsVisible={val => {
              setSiteLabel(t('choose'));
              setSiteId('');
              setshiftLabel(t('choose'));
              setShiftId('');
              setEmployList([]);
              setSelectedEmployees([]);
              setSelectedItem('');
              //
              setIsVisible(true);
              setdropDownData(allprojects);
              setType('project');
            }}
            selectedItem={projectLabel}
            label={t('project')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          <DropDownButton
            onIsVisible={val => {
              setshiftLabel(t('choose'));
              setShiftId('');
              setEmployList([]);
              setSelectedEmployees([]);
              setSelectedItem(t('choose'));
              if (projectID) {
                setIsVisible(true);
                setdropDownData(allSites);
                setType('sites');
              } else {
                setFeedBackModal(true);
                setFeedBackTitle(t('pleaseselectproject'));
                setFeedBackImg(icons?.warning);
              }
            }}
            selectedItem={siteLabel}
            label={t('site')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          <DropDownButton
            onIsVisible={val => {
              setEmployList([]);
              setSelectedEmployees([]);
              setSelectedItem(t('choose'));
              if (siteId) {
                setIsVisible(true);
                setdropDownData(allShift);
                setType('shift');
              } else {
                setFeedBackModal(true);
                setFeedBackTitle(t('pleaseselectSite'));
                setFeedBackImg(icons?.warning);
              }
            }}
            selectedItem={shiftLabel}
            label={t('shift')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          {/* عرض العمال  */}
          <DropDownButton
            onIsVisible={val => {
              setemployeeError(null);
              if (shiftId) {
                setShowEmpList(true);
                setdropDownData(employList);
                setType('emp');
              } else {
                setFeedBackModal(true);
                setFeedBackTitle(t('pleaseselectSite'));
                setFeedBackImg(icons?.warning);
              }
            }}
            selectedItem={selectedItem}
            label={t('emp')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          {employeeError ? <ErrorView label={employeeError} /> : null}
          <Line />
          {/* ---------------break line---------------- */}
          <DropDownButton
            onIsVisible={val => {
              setSiteLabel2(t('choose'));
              setSiteId2('');
              setshiftLabel2(t('choose'));
              setShiftId2([]);
              // ..........
              setIsVisible(true);
              setdropDownData(allprojects);
              setType('project2');
            }}
            selectedItem={projectLabel2}
            label={t('project')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          {/* نقل عامل الي فرقه كذا */}
          <DropDownButton
            onIsVisible={val => {
              setShiftId2([]);
              // ................
              setsiteError(null);
              setshiftLabel2(t('choose'));
              setShiftId2([]);
              setSelectedShifts(t('choose'));
              if (projectID2) {
                setIsVisible(true);
                setdropDownData(allSites);
                setType('sites2');
              } else {
                setFeedBackModal(true);
                setFeedBackTitle(t('pleaseselectproject'));
                setFeedBackImg(icons?.warning);
              }
            }}
            selectedItem={siteLabel2}
            label={t('teamToTransferEmployee')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          {siteError ? <ErrorView label={siteError} /> : null}

          {/* نقل عامل الي shift كذا */}
          <DropDownButton
            onIsVisible={val => {
              setShiftError(null);
              if (siteId2) {
                setIsVisible(true);
                setdropDownData(allShift2);
                setType('shift2');
              } else {
                setFeedBackModal(true);
                setFeedBackTitle(t('pleaseselectSite'));
                setFeedBackImg(icons?.warning);
              }
            }}
            selectedItem={selectedShifts}
            label={t('shift_for_transfer')}
            dropdownContainer={{marginBottom: 0}}
            labelStyle={{...FONTS?.h4, padding: 4} as TextStyle}
          />
          {shiftError ? <ErrorView label={shiftError} /> : null}
          <MainTextInput
            multiline={true}
            numberOfLines={100}
            onChangeText={(val: any) => {
              setNote(val);
            }}
            label={t('note')}
            label2={t('optional')}
            // placeholder={t('detailsforleave')}
            inputContainer={styles.textArea}
            value={note}
          />
          <MainButton
            containerStyle={{marginVertical: 24}}
            label={t('sendRequest')}
            onPress={SubmitTransfirRequest}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EmployeeRequest;

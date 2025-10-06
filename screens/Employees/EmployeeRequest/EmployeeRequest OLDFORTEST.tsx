import React, { useEffect, useState } from 'react';
import { SafeAreaView, I18nManager, View, TextStyle, FlatList, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../common/components/MainHeader';
import { COLORS, icons, FONTS, SIZES } from '../../../constants';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import MainButton from '../../common/components/MainButton';
import { getAllEmployees, getAllProjects, getAllSite, getAttendanceByShiftId, getShiftById, searchEmployeebyNumber } from '../AttendanceAllEmployee/services/Services';
import EmployeesDropdownModal from '../../common/components/EmployeesDropdownModal';
import styles from './styles';
import ErrorView from '../../common/components/ErrorView';
import FeedBackModal from '../../common/components/FeedBackModal';
import Loader from '../../common/components/Loader';
import TabView from '../../Home/Component/TabView';
import TransferTabView from '../../Home/Component/TransferTabView';
import MainTextInput from '../../common/components/MainTextInput';

interface EmployeeRequestProps { }

const EmployeeRequest: React.FC<EmployeeRequestProps> = (props) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string>(t('choose'));
    const [loader, setloader] = useState(true);
    const [allprojects, setAllprojects] = useState([]);
    const [projectLabel, setProjectLabel] = useState(t('choose'));
    const [projectID, setProjectID] = useState();
    const [allSites, setAllSites] = useState([]);
    const [siteLabel, setSiteLabel] = useState(t('choose'));
    const [siteLabel2, setSiteLabel2] = useState(t('choose'));


    const [allShift, setAllShift] = useState([]);
    const [shiftLabel, setshiftLabel] = useState(t('choose'));
    const [shiftLabel2, setshiftLabel2] = useState(t('choose'));

    const [siteId, setSiteId] = useState();
    const [siteId2, setSiteId2] = useState();

    const [shiftId, setShiftId] = useState();
    const [shiftId2, setShiftId2] = useState([]);

    const [employList, setEmployList] = useState([]);
    const [feedBackModal, setFeedBackModal] = useState(false);
    const [feedBackTitle, setFeedBackTitle] = useState();
    const [feedBackImg, setFeedBackImg] = useState();
    // const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dropDownData, setdropDownData] = useState([]);
    const [type, setType] = useState('project');
    const [showEmpList, setShowEmpList] = useState(false);
    const [employeeError, setemployeeError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('employees');


    useEffect(() => {
        const getprojects = async () => {
            let projects = await getAllProjects();
            console.log(projects);
            setAllprojects(projects?.result?.returnData);
            let AllEmployees = await getAllEmployees()
            console.log(AllEmployees.result?.returnData)
            setEmployList(AllEmployees.result?.returnData)
            setloader(false);
        };
        getprojects()
    }, [])
    useEffect(() => {
        if (selectedEmployees?.length > 0) {
            setSelectedNames()
        } else {
            setSelectedItem(t('choose'))
        }
    }, [selectedEmployees])
    useEffect(() => {
        if (shiftId2?.length > 0) {
            setSelectedShiftNames()
        } else {
            setSelectedItem(t('choose'))
        }
    }, [shiftId2])
    const searchByNumber = async (id: any) => {
        let emplist = await searchEmployeebyNumber(id)
        console.log(emplist?.result?.returnData)
    }
    const getAttendance = async (shift_Id: React.SetStateAction<undefined> | React.SetStateAction<number>) => {
        let employees = await getAttendanceByShiftId(shift_Id);
        setEmployList(employees?.result?.returnData);
    };
    // .....
    // const toggleSelection = (item: any) => {
    //     const exists = selectedEmployees.some(emp => emp.id === item.id);

    //     if (exists) {
    //         setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== item.id));

    //     } else {
    //         setSelectedEmployees([...selectedEmployees, item]);

    //     }
    // };
    // const setSelectedNames = () => {
    //     if (selectedEmployees?.length > 0) {
    //         const selectedNames = selectedEmployees
    //             .map(item => I18nManager.isRTL ? item.employeeName : item.employeeNameEn)
    //             .join(', ');
    //         setSelectedItem(selectedNames)
    //     } else {
    //         setSelectedItem(t('choose'))
    //     }
    // }
    const selectShifts = (id: any) => {
        if (shiftId2.includes(id)) {
            setShiftId2(shiftId2.filter(shiftId => shiftId !== id));
        } else {
            setShiftId2([...shiftId2, id]);
        }
    };
    const setSelectedShiftNames = () => {
        if (shiftId2?.length > 0) {
            const selectedNames = selectedEmployees
                .map(item => item.shiftName)
                .join(', ');
            setSelectedItem(selectedNames)
        } else {
            setSelectedItem(t('choose'))
        }
    }
    // ..............................................................
    const Line = () => {
        return <View style={{ ...styles?.line }} />
    }
    const transferTeam = () => {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    padding: 20,
                    backgroundColor: COLORS?.white,
                    borderRadius: 16,
                    margin: 10
                }}>

                <DropDownButton
                    onIsVisible={val => {
                        setIsVisible(true);
                        setdropDownData(allprojects);
                        setType('project');
                    }}
                    selectedItem={projectLabel}
                    label={t('project')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />
                <DropDownButton
                    onIsVisible={val => {
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
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />
                <Line />
                {/* ---------------break line---------------- */}
                <DropDownButton
                    onIsVisible={val => {
                        setIsVisible(true);
                        setdropDownData(allprojects);
                        setType('project');
                    }}
                    selectedItem={projectLabel}
                    label={t('projectToTransferproject')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />
                {/* نقل فرقه الي فرقه كذا */}
                <DropDownButton
                    onIsVisible={val => {
                        if (projectID) {
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
                    label={t('teamToTransferteam')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />

                <MainButton
                    containerStyle={{ marginVertical: 24 }}
                    label={t('sendRequest')}
                    onPress={function (): void {
                        console.log("empIds", selectedEmployees)
                        const empIds = selectedEmployees.map(item => item.employeeId);
                        let data = {
                            empIds,
                            "shiftIds": shiftId2,
                            "teamId": siteId2
                        }
                        console.log("data", data)
                        // validation methods-------
                        if (!empIds || empIds?.length == 0) {
                            setemployeeError(t('pleasechooseemp'))
                        }

                    }} />
            </ScrollView>
        )
    }

    const transferEmployees = () => {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    padding: 20,
                    backgroundColor: COLORS?.white,
                    borderRadius: 16,
                    margin: 10
                }}
            >
                <View style={{ ...styles?.row }}>
                    <MainTextInput
                        onChangeText={(val) => {
                            if (val?.length > 2) {
                                searchByNumber(val)
                            }
                        }}
                        containerStyle={{
                            flex: 1,
                        }}
                        placeholder={t('employee_job_number')}
                        inputContainer={{ backgroundColor: COLORS?.white }}
                        inputStyle={{ ...FONTS?.body6 } as TextStyle}
                        keyboardType={'numeric'}
                    />
                    <TouchableOpacity style={{
                        ...styles?.scanbtn, ...styles?.row
                    }}>
                        <Image
                            source={icons?.search}
                            style={{ ...styles?.icon }}
                        />
                        <Text>{t('search')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                        setShowEmpList(true)
                    }}
                    style={{
                        ...styles?.scanbtn, ...styles?.row
                    }}>
                    
                        <Text>{t('show')}</Text>
                    </TouchableOpacity>
                </View>
                <DropDownButton
                    onIsVisible={val => {
                        setIsVisible(true);
                        setdropDownData(allprojects);
                        setType('project');
                    }}
                    selectedItem={projectLabel}
                    label={t('projectToTransferproject')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />
                {/* نقل فرقه الي فرقه كذا */}
                <DropDownButton
                    onIsVisible={val => {
                        if (projectID) {
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
                    label={t('teamToTransferteam')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}

                />
                {/* نقل عامل الي دوام كذا */}
                <DropDownButton
                    onIsVisible={val => {
                        if (siteId) {
                            setIsVisible(true);
                            setdropDownData(allShift);
                            setType('shift2');
                        } else {
                            setFeedBackModal(true);
                            setFeedBackTitle(t('pleaseselectSite'));
                            setFeedBackImg(icons?.warning);
                        }
                    }}
                    selectedItem={shiftLabel2}
                    label={t('shift_for_transfer')}
                    dropdownContainer={{ marginBottom: 0 }}
                    labelStyle={{ ...FONTS?.h4, padding: 4 } as TextStyle}
                />
                <MainButton
                    containerStyle={{ marginVertical: 24 }}
                    label={t('sendRequest')}
                    onPress={function (): void {
                        console.log("empIds", selectedEmployees)
                        // const empIds = selectedEmployees.map(item => item.employeeId);
                        const empIds = selectedEmployee ? [selectedEmployee.id] : [];
                        let data = {
                            empIds,
                            "shiftIds": shiftId2,
                            "teamId": siteId2
                        }
                        console.log("data", data)
                        // validation methods-------
                        if (!empIds || empIds?.length == 0) {
                            setemployeeError(t('pleasechooseemp'))
                        }

                    }} />
            </ScrollView>
        )
    }
    return (
        <SafeAreaView style={{ height: SIZES?.height }}>
            <MainHeader
                leftIconAction={() => navigation.goBack()}
                leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
                title={t('transfer_of_employees')}
            />
            <FeedBackModal
                isVisible={feedBackModal}
                description={feedBackTitle}
                Image={feedBackImg}
                onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
                    setFeedBackModal(val);
                }}
            />

            <BottomDropdownModal
                isVisible={isVisible}
                onDismiss={val => {
                    setIsVisible(val);
                }}
                onSelectedItem={async (item: object, type: string) => {
                    console.log('selected_project......', item, type);
                    if (type === 'project') {
                        setProjectLabel(item?.name);
                        setProjectID(item?.id);
                        let sites = await getAllSite(item?.id);
                        console.log('sites', sites);
                        setAllSites(sites?.result?.returnData);
                    }
                    if (type === 'sites') {
                        setSiteLabel(item?.teamName);
                        setSiteId(item?.id);
                        let shift = await getShiftById(item?.id);
                        console.log('shift', shift?.result?.returnData);
                        setAllShift(shift?.result?.returnData);
                    }
                    if (type === 'shift') {
                        setshiftLabel(item?.shiftName);
                        setShiftId(item?.id);
                        getAttendance(item?.id);
                    }
                    // .......................................
                    if (type === 'sites2') {
                        setSiteLabel2(item?.teamName);
                        setSiteId2(item?.id);
                    }
                    if (type === 'shift2') {
                        if (allShift?.length > 1) {
                            selectShifts(item?.id)
                        } else {
                            setshiftLabel2(item?.shiftName);
                            setShiftId2(shiftId2.concat(item?.id));
                        }
                    }
                }}
                // listHeader={t('select_department')}
                data={dropDownData}
                type={type}
            />
            <EmployeesDropdownModal
                isVisible={showEmpList}
                onDismiss={function (visible: boolean): void {
                    setShowEmpList(visible)
                }}
                selectedEmployees={selectedEmployees}
                toggleSelection={val => {
                    toggleSelection(val);
                }}
                data={dropDownData}
            />
            <TransferTabView onSelected={(tab: 'employees' | 'Team') => setSelectedTab(tab)} />

            {loader ? <Loader /> :
                selectedTab === 'employees' ? transferEmployees() : transferTeam()

            }
        </SafeAreaView >
    );
}

export default EmployeeRequest;

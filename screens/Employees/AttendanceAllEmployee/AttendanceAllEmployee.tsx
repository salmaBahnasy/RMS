import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
// ..................................................................................
import MainHeader from '../../common/components/MainHeader';
import {COLORS, icons, images} from '../../../constants';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import styles from './styles';
import {
  attendanceEmployeesData,
  companySettingsApi,
  getAllProjects,
  getAllSite,
  getAttendanceByShiftId,
  getShiftById,
  recoredAttendanceForAllEmp,
} from './services/Services';
import ShortReport from './components/ShortReport';
import EmployeesList from './components/EmployeesList';
import EmptyView from '../../common/components/EmptyView';
import FeedBackModal from '../../common/components/FeedBackModal';
import {
  getLocation,
  requestLocationPermissionAndroid,
  requestLocationPermissionIOS,
} from '../../common/services/services';
import SubHeader from '../../common/components/SubHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define types
type Employee = {
  employeeId: string;
  name?: string;
  employeeName: string;
  employeeNameEn: string;
  status?: number;
  image?: string;
  // Add other employee properties as needed
};

type Project = {
  id: string;
  name: string;
  // Add other project properties as needed
};

type Site = {
  id: string;
  teamName: string;
  // Add other site properties as needed
};

type Shift = {
  id: string;
  shiftName: string;
  // Add other shift properties as needed
};

type RouteParams = {
  data?: {
    shiftId?: string | number;
    // Add other route params as needed
  };
};

const AttendanceAllEmployee: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  // State with proper typing
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const [type, setType] = useState<string>('project');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectLabel, setProjectLabel] = useState<string>(t('choose'));
  const [projectID, setProjectID] = useState<string | undefined>();
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [siteLabel, setSiteLabel] = useState<string>(t('choose'));
  const [allShift, setAllShift] = useState<Shift[]>([]);
  const [shiftLabel, setShiftLabel] = useState<string>(t('choose'));
  const [siteId, setSiteId] = useState<string | undefined>();
  const [shiftId, setShiftId] = useState<string | number>(
    route.params?.data?.shiftId ? route.params?.data?.shiftId : '',
  );
  const [employList, setEmployList] = useState<Employee[]>([]);
  const [feedBackModal, setFeedBackModal] = useState<boolean>(false);
  const [feedBackTitle, setFeedBackTitle] = useState<string | undefined>();
  const [feedBackImg, setFeedBackImg] = useState<any>();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Employee[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [employStatues, setEmployStatues] = useState<string>('');
  const [isEnterLeaveSetting, setIsEnterLeaveSetting] = useState<boolean>(true);
  const [lat, setLat] = useState<string | number>('');
  const [long, setLong] = useState<string | number>('');
  const [shiftLoading, setShiftLoading] = useState<boolean>(false);

  useEffect(() => {
  const getCompanySettings = async () => {
    const res = await companySettingsApi();
    if (res.success) {
      setIsEnterLeaveSetting(res.data?.returnData ?? true);
    } else {
      setIsEnterLeaveSetting(true); // fallback
    }
  };

  const getProjects = async () => {
    setLoader(true);
    const res = await getAllProjects();
    if (res.success) {
      setAllProjects(res.data);
    } else {
      setAllProjects([]);
    }
    setLoader(false);
  };

  getCurrentLocation();
  getCompanySettings();
  getProjects();
}, []);

  useEffect(() => {
    if (route.params?.data?.shiftId) {
      console.log('route.params.data.shiftId', route.params.data.shiftId);
      getAttendance(route.params.data.shiftId ?? shiftId);
    }
  }, [isFocused]);

  const getCurrentLocation = () => {
    const platformSpecificValue = Platform.select({
      ios: 'ios',
      android: 'android',
      default: 'Default value',
    });

    const permission =
      platformSpecificValue === 'android'
        ? requestLocationPermissionAndroid()
        : requestLocationPermissionIOS();
    console.log(permission);
    getLocation().then(res => {
      if (res?.coords) {
        setLat(res.coords.latitude);
        setLong(res.coords.longitude);
      }
    });
  };

  const getAttendance = async (shift_Id: string | number) => {
    try {
      setShiftLoading(true);
      const employees = await getAttendanceByShiftId(shift_Id);
      setEmployList(employees?.result?.returnData ?? []);
    } finally {
      setShiftLoading(false);
    }
  };

  const recordAttendance = async (AttendanceStatus: string) => {
    const data = await attendanceEmployeesData(
      AttendanceStatus,
      shiftId,
      selectedEmployees,
      employList,
      isEnterLeaveSetting,
      lat,
      long,
    );
    if (selectedEmployees?.length > 0) {
      const postData = await recoredAttendanceForAllEmp(data);
      if (postData?.result?.message?.type === 'Success') {
        setSearchResult([]);
        setFeedBackModal(true);
        setFeedBackTitle(postData.result.message.content || t('successfully'));
        setFeedBackImg(images.success);
        getAttendance(shiftId);
        setSelectedEmployees([]);
        setSelectAll(false);
      } else {
        setFeedBackModal(true);
        setFeedBackTitle(postData?.result?.message?.content || t('failed'));
        setFeedBackImg(images.fail);
      }
    } else {
      setFeedBackModal(true);
      setFeedBackTitle(t('pleaseSelectEmp'));
      setFeedBackImg(images.fail);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedEmployees(
      selectAll ? [] : employList.map(emp => emp.employeeId),
    );
  };

  const toggleSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id],
    );
  };

  return (
  <SafeAreaView style={{flex: 1, }}>
    <SubHeader
      leftIconAction={() => navigation.navigate('Home')}
      leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
      title={t('AttendanceAllEmployee')}
    />

    <FeedBackModal
      isVisible={feedBackModal}
      description={feedBackTitle}
      Image={feedBackImg}
      onDismiss={(val: boolean) => setFeedBackModal(val)}
    />

    <BottomDropdownModal
      isVisible={isVisible}
      onDismiss={(val: boolean) => setIsVisible(val)}
      onSelectedItem={async (item: any, type: string) => {
        if (loader) return; // منع أي اختيار أثناء تحميل المشاريع
        if (type === 'project') {
          setProjectLabel(item?.name);
          setProjectID(item?.id);
          const sites = await getAllSite(item?.id);
          setAllSites(sites?.result?.returnData ?? []);
        }
        if (type === 'sites') {
          setSiteLabel(item?.teamName);
          setSiteId(item?.id);
          const shift = await getShiftById(item?.id);
          setAllShift(shift?.result?.returnData ?? []);
        }
        if (type === 'shift') {
          setShiftLabel(item?.shiftName);
          setShiftId(item?.id);
          setShiftLoading(true);
          await getAttendance(item?.id);
          setShiftLoading(false);
        }
      }}
      data={dropDownData}
      type={type}
    />

    <ScrollView
      contentContainerStyle={{paddingBottom: 100}}
      showsVerticalScrollIndicator={false}>

      {loader ? (
        // ✅ اللودينج الأساسي عند فتح الصفحة
        <ActivityIndicator
          size="large"
          color="blue"
          style={{marginVertical: 20}}
        />
      ) : allProjects.length === 0 ? (
        // ✅ لو مفيش مشاريع
        <EmptyView
         style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          image={images?.project}
          label={t('noProjectsFound')}
          ImgStyle={{width: 100, height: 100}}
        />
      ) : (
        <>
          {/* ✅ الدروب داونز بعد تحميل المشاريع */}
          <View style={styles.paddingWhiteView}>
            <DropDownButton
              onIsVisible={() => {
                setSiteLabel(t('choose'));
                setSiteId(undefined);
                setShiftLabel(t('choose'));
                setShiftId('');
                setEmployList([]);
                setIsVisible(true);
                setDropDownData(allProjects);
                setType('project');
              }}
              selectedItem={projectLabel}
              label={t('project')}
              dropdownContainer={{marginBottom: 4}}
              labelStyle={{paddingVertical: 2}}
            />

            <DropDownButton
              onIsVisible={() => {
                setShiftLabel(t('choose'));
                setShiftId('');
                setEmployList([]);
                setSelectedEmployees([]);
                if (projectID) {
                  setIsVisible(true);
                  setDropDownData(allSites);
                  setType('sites');
                } else {
                  setFeedBackModal(true);
                  setFeedBackTitle(t('pleaseselectproject'));
                  setFeedBackImg(icons.warning);
                }
              }}
              selectedItem={siteLabel}
              label={t('site')}
              dropdownContainer={{marginBottom: 4}}
              labelStyle={{paddingVertical: 2}}
            />

            <DropDownButton
              onIsVisible={() => {
                setEmployList([]);
                setSelectedEmployees([]);
                if (siteId) {
                  setIsVisible(true);
                  setDropDownData(allShift);
                  setType('shift');
                } else {
                  setFeedBackModal(true);
                  setFeedBackTitle(t('pleaseselectSite'));
                  setFeedBackImg(icons.warning);
                }
              }}
              selectedItem={shiftLabel}
              label={t('shift')}
              dropdownContainer={{marginBottom: 4}}
              labelStyle={{paddingVertical: 2}}
            />
          </View>

          {/* ✅ التحكم في عرض البيانات بعد الدروب داونز */}
          {shiftLoading ? (
            // لودينج خاص بالشيفت فقط
            <View style={{marginTop: 30, alignItems: 'center'}}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : searchResult?.length > 0 ? (
            // لو في نتائج بحث
            <EmployeesList
              data={searchResult}
              toggleSelectAll={toggleSelectAll}
              selectAll={selectAll}
              selectedEmployees={selectedEmployees}
              toggleSelection={toggleSelection}
              recordAttendance={recordAttendance}
              searchResult={true}
              selectedOneEmployee={(employeeID: string) =>
                setSelectedEmployees([employeeID])
              }
              isEnterLeaveSetting={isEnterLeaveSetting}
              shiftId={shiftId}
              lat={lat}
              long={long}
            />
          ) : !projectID ? (
            // بعد اللودينج الأساسي → لسه مختارش مشروع
            <EmptyView
             // image={images?.project}
              label={t('pleaseSelectProjectFirst')}
              ImgStyle={{width: 100, height: 100}}
            />
          ) : !siteId ? (
            <EmptyView
             // image={images?.sites}
              label={t('pleaseSelectSiteFirst')}
              ImgStyle={{width: 100, height: 100}}
            />
          ) : !shiftId ? (
            <EmptyView
            //  image={images?.shfit}
              label={t('pleaseSelectShiftFirst')}
              ImgStyle={{width: 100, height: 100}}
            />
          ) : employList?.length === 0 ? (
            // ✅ لو مفيش موظفين في الشيفت
            <EmptyView
              image={images?.sites}
              label={t('noworkers')}
              ImgStyle={{width: 100, height: 100}}
            />
          ) : (
            <>
              <ShortReport
                searchResult={(val: Employee[]) => setSearchResult(val)}
                data={employList}
                setemployStatues={setEmployStatues}
              />
              <EmployeesList
                data={employList}
                toggleSelectAll={toggleSelectAll}
                selectAll={selectAll}
                selectedEmployees={selectedEmployees}
                toggleSelection={toggleSelection}
                recordAttendance={recordAttendance}
                selectedOneEmployee={(employeeID: string) =>
                  setSelectedEmployees([employeeID])
                }
                isEnterLeaveSetting={isEnterLeaveSetting}
                shiftId={shiftId}
                lat={lat}
                long={long}
              />
            </>
          )}
        </>
      )}
    </ScrollView>
  </SafeAreaView>
);

};

export default AttendanceAllEmployee;

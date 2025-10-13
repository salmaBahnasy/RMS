import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
// ..................................................................................
import {COLORS, icons, images} from '../../../constants';
import DropDownButton from '../../common/components/DropDownButton';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import styles from './styles';

import EmptyView from '../../common/components/EmptyView';
import FeedBackModal from '../../common/components/FeedBackModal';
import {
  getLocation,
  requestLocationPermissionAndroid,
  requestLocationPermissionIOS,
} from '../../common/services/services';
import SubHeader from '../../common/components/SubHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getAllProjects,
  getAllSite,
} from '../../Employees/AttendanceAllEmployee/services/Services';
import {getAllEquipmentForAttendance, startEquipmentAttendance} from './services/services';
import EquipmentList from './EquipmentList';
import EmployeesList from '../../Employees/AttendanceAllEmployee/components/EmployeesList';
import ShortReport from '../../Employees/AttendanceAllEmployee/components/ShortReport';
import ShortReportEquipment from './components/ShortReportEquipment';

//Define types based on the API response
type Equipment = {
  // id: number;
  // number: number;
  // name: string;
  // brand: string;
  // attendanceStatusId: number | null;
  // dateOnly: string;
  // status: number | null;
  // // يمكن إضافة equipmentId إذا كان مطلوبًا
  // equipmentId?: string;
  // equipmentName?: string;
  // equipmentNameEn?: string;
  equipmentId: string;
  equipmentName: string;
  equipmentNameEn: string;
  status?: number | null;
  image?: string;
};

type Project = {
  id: string;
  name: string;
  projectName?: string;
};

type Site = {
  id: string;
  teamName: string;
};

const EquipmentPreparation: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
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
  const [siteId, setSiteId] = useState<string | undefined>();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [feedBackModal, setFeedBackModal] = useState<boolean>(false);
  const [feedBackTitle, setFeedBackTitle] = useState<string | undefined>();
  const [feedBackImg, setFeedBackImg] = useState<any>();
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]); // تغيير إلى number[] لأن id من نوع number
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Equipment[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [equipmentStatus, setEquipmentStatus] = useState<string>('');
  const [lat, setLat] = useState<string | number>('');
  const [long, setLong] = useState<string | number>('');
  const [equipmentLoading, setEquipmentLoading] = useState<boolean>(false);

  useEffect(() => {
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
    getProjects();
  }, []);

  useEffect(() => {
    if (isFocused && siteId) {
      getEquipmentList();
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

  const getEquipmentList = async () => {
    if (!projectID || !siteId) return;

    try {
      setEquipmentLoading(true);
      const equipmentData = await getAllEquipmentForAttendance(
        projectID,
        siteId,
      );
      console.log('equipmentData', equipmentData);

      if (equipmentData.result?.message?.type === 'Success') {
        console.log(
          'equipmentData.result?.message?.type',
          equipmentData.result?.message?.type,
        );
        const equipmentRecords =
          equipmentData.result?.returnData?.records || [];
        setEquipmentList(equipmentRecords);
      } else {
        console.log('equipmentData.type', equipmentData.type);

        setEquipmentList([]);
        setFeedBackModal(true);
        setFeedBackTitle(t('failedToLoadEquipment'));
        setFeedBackImg(images.fail);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setEquipmentList([]);
    } finally {
      setEquipmentLoading(false);
    }
  };

  const recordEquipmentPrep = async (preparationStatus: string) => {
    if (selectedEquipments?.length > 0) {
      const postData = await startEquipmentAttendance( 1,[407] );

      if (postData?.result?.message?.type === 'Success') {
        setSearchResult([]);
        setFeedBackModal(true);
        setFeedBackTitle(postData.result.message.content || t('successfully'));
        setFeedBackImg(images.success);
        getEquipmentList(); // إعادة تحميل البيانات
        setSelectedEquipments([]);
        setSelectAll(false);
      } else {
        setFeedBackModal(true);
        setFeedBackTitle(postData?.result?.message?.content || t('failed'));
        setFeedBackImg(images.fail);
      }
    } else {
      setFeedBackModal(true);
      setFeedBackTitle(t('pleaseSelectEquipment'));
      setFeedBackImg(images.fail);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedEquipments(
      selectAll ? [] : equipmentList.map(equip => equip.equipmentId), // استخدام id بدلاً من equipmentId
    );
  };

  const toggleSelection = (id: string) => {
    // تغيير إلى number
    setSelectedEquipments(prev =>
      prev.includes(id)
        ? prev.filter(equipId => equipId !== id)
        : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SubHeader
        leftIconAction={() => navigation.navigate('Home')}
        leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
        title={t('equipmentPreparation')}
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
          if (loader) return;

          if (type === 'project') {
            setProjectLabel(item?.name || item?.projectName);
            setProjectID(item?.id);
            setSiteLabel(t('choose'));
            setSiteId(undefined);
            setEquipmentList([]);
            setSelectedEquipments([]);

            const sites = await getAllSite(item?.id);
            setAllSites(sites?.result?.returnData ?? []);
          }

          if (type === 'sites') {
            setSiteLabel(item?.teamName);
            setSiteId(item?.id);
            setEquipmentList([]);
            setSelectedEquipments([]);

            // استدعاء API المعدات مباشرة بعد اختيار الفرقة
            setEquipmentLoading(true);
            await getEquipmentList();
            setEquipmentLoading(false);
          }
        }}
        data={dropDownData}
        type={type}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        {loader ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{marginVertical: 20}}
          />
        ) : allProjects.length === 0 ? (
          <EmptyView
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
            // image={images?.project}
            label={t('noProjectsFound')}
            ImgStyle={{width: 100, height: 100}}
          />
        ) : (
          <>
            {/* Dropdowns */}
            <View style={styles.paddingWhiteView}>
              <DropDownButton
                onIsVisible={() => {
                  setSiteLabel(t('choose'));
                  setSiteId(undefined);
                  setEquipmentList([]);
                  setSelectedEquipments([]);
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
                  setEquipmentList([]);
                  setSelectedEquipments([]);
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
            </View>

            {/* التحكم في عرض البيانات */}
            {equipmentLoading ? (
              <View style={{marginTop: 30, alignItems: 'center'}}>
                <ActivityIndicator size="large" color="blue" />
              </View>
            ) : searchResult?.length > 0 ? (
              <EquipmentList
                data={equipmentList}
                toggleSelectAll={toggleSelectAll}
                selectAll={selectAll}
                selectedEquipments={selectedEquipments}
                toggleSelection={toggleSelection}
                 recordAttendance={recordEquipmentPrep}
                selectedOneEquipment={(employeeID: string) =>
                  setSelectedEquipments([])
                }
                lat={lat}
                long={long}
              />
            ) : !projectID ? (
              <EmptyView
                label={t('pleaseSelectProjectFirst')}
                ImgStyle={{width: 100, height: 100}}
              />
            ) : !siteId ? (
              <EmptyView
                label={t('pleaseSelectSiteFirst')}
                ImgStyle={{width: 100, height: 100}}
              />
            ) : equipmentList?.length === 0 ? (
              <EmptyView
                //  image={images?.equipment}
                label={t('noEquipmentFound')}
                ImgStyle={{width: 100, height: 100}}
              />
            ) : (
              <>
                <ShortReportEquipment
                  searchResult={(val: Equipment[]) => setSearchResult(val)}
                  data={equipmentList}
                />
                <EquipmentList
                  data={equipmentList}
                  toggleSelectAll={toggleSelectAll}
                  selectAll={selectAll}
                  selectedEquipments={selectedEquipments}
                  toggleSelection={toggleSelection}
                  recordAttendance={recordEquipmentPrep}
                  selectedOneEquipment={(employeeID: string) =>
                    setSelectedEquipments([])
                  }
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

export default EquipmentPreparation;

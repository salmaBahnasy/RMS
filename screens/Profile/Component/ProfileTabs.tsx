import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  TextStyle,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styles} from '../styles';
import {COLORS, FONTS} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataEmpDetails} from '../Services/services';

interface ProfileTabsProps {
  selectedTab: (selected: string) => void;
}

interface TabProps {
  title: string;
  selected: string;
  onPress?: () => void;
}
interface EmployeeDataByUserId {
  name: string;
  surname: string;
  emailAddress: string;
  isActive: boolean;
  fullName: string;
  phoneNumber: string;
  personalImg: string | null;
  empId: number | null;
  userTypeId: number;
  id: number;
}
interface EmployeeDataByEmpId {
  id: number;
  nameAr: string;
  nameEn: string;
  birthDate: string;
  hijriBirthDate: string;
  nationality: {name: string; id: number};
  mobile: string;
  phone: string;
  personalEmail: string;
  companyEmail?: string | null;
  photo: string;
  empOfficeNO: number;

  jobId: number;
  jobNumber?: number;
  jobs: {jobName: string};
  workOwnerName?: string;
  workOwnerNumber?: string;
  project?: string;

  licenceId?: number;
  licenceExpiryDateH?: string;
  licenceExpiryDateM?: string;
  license?: {name: string};
  licnesePic?: string;

  city: {name: string; id?: number};
  religion: {name: string};
  country: {name: string};
  streetName: string;
  buildingNo: number;
  appartmentNo: number;
  roomNo: number;
  accomodationPhotoCopy: string;

  employeeAffiliatedAuthority?: string;
  membershipExpiryGregorian?: string;

  academicQualification: {
    name: string;
    certificatePhoto: string;
    data: [];
  }[];

  previousExperiences: {
    jobName: string;
    companyName: string;
    firstDate: string;
    endDate: string;
  }[];

  cardWorkExpiryDate: string;
  cardWorkPic: string;

  passports: {
    empId: number;
    passportNo: string;
    passportExpiryDateH: string;
    passportExpiryDate: string;
    passportJob: string;
    passportJobAr: string;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string | null;
    lastModifierUserId: number | null;
    creationTime: string;
    creatorUserId: number;
  }[];

  identityData: {
    empId: number;
    identityNo: string;
    identityPic: string;
    nationalAddress: string;
    residentNo: string;
    identityNoExpiryDate: string;
    cost: number;
    costlicense: number;
    residencePermitNo: number;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string | null;
    lastModifierUserId: number | null;
    creationTime: string;
    creatorUserId: number;
    id: number;
  };
}

const ProfileTabs: React.FC<ProfileTabsProps> = props => {
  const {t} = useTranslation();
  const [select, setSelect] = useState<string>('');
  const [employeeDataByUserId, setEmployeeDataByUserId] =
    useState<EmployeeDataByUserId | null>();
  const [employeeDataByEmpId, setEmployeeDataByEmpId] =
    useState<EmployeeDataByEmpId | null>(null);
  const [empId, setEmpId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    const User = await AsyncStorage.getItem('userId');
    const userId = User ? JSON.parse(User) : null;
    const storedEmpId = await AsyncStorage.getItem('empId');
    const empId = storedEmpId ? JSON.parse(storedEmpId) : 0;
    setEmpId(empId);
    setLoading(true);

    try {
      const data = await getDataEmpDetails();

      if (data?.result?.returnData) {
        if (empId !== 0) {
          setEmployeeDataByEmpId(data.result.returnData);
          console.log('Fetched Employee Data:', data.result.returnData);
          console.log('empId', empId);
        } else {
          setEmployeeDataByUserId(data.result.returnData);
          console.log('Fetched User Data:', data.result.returnData);
          console.log('empId', empId);
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const Tab: React.FC<TabProps> = ({title, selected}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelect(selected);
          props.selectedTab(selected);
        }}
        style={{
          paddingVertical: 11,
          paddingHorizontal: 15,
          borderBottomWidth: selected === select ? 2 : 0,
          borderColor: COLORS.primary,
        }}>
        <Text
          style={
            {
              ...FONTS.body5,
              color: selected === select ? COLORS.primary : '#434349',
            //  backgroundColor: selected === select ? '#E0F7FA' : 'white',
              textAlign: 'right', // ✅ النص لليمين
              writingDirection: 'rtl',
            } as StyleProp<TextStyle>
          }>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderColor: COLORS.lightGray2,
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          flex:1,
          paddingHorizontal: 8,
        }}>
        <Tab title={t('employee_data')} selected="employee_data" />
        <Tab
          title={
            employeeDataByEmpId?.city?.id !== 2
              ? t('passport_residence')
              : t('identity')
          }
          selected="passport_residence"
        />
        {/* ممكن تزود Tabs زيادة هنا */}
      </ScrollView>
    </View>
  );
};

export default ProfileTabs;

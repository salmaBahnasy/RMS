import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  I18nManager,
  ImageProps,
  ImageSourcePropType,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../constants';
import MainHeader from '../common/components/MainHeader';
import ProfileTabs from './Component/ProfileTabs';
import PersonalInformationView from './Component/PersonalInformationView';
import ProfessionAndproject from './Component/ProfessionAndproject';
import DrivingLicense from './Component/DrivingLicense';
import OperationCard from './Component/OperationCard';
import ResidenceInformation from './Component/ResidenceInformation';
import SubscriptionsAndMemberships from './Component/SubscriptionsAndMemberships';
import QualificationsAndCertificates from './Component/QualificationsAndCertificates';
import PreviousExperiences from './Component/PreviousExperiences';
import PassportResidence from './Component/PassportResidence';
import ResidenceDetails from './Component/ResidenceDetails';
import {PersonalDataScreenNavigationProp} from '../../navigation/types';
import ContractData from './ContractData';
import {
  formatDate,
  formatDateHijri,
  getDataEmpDetails,
} from './Services/services';
import {dateNumber, fulldateFormate} from '../../constants/dateFormate';
import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInformationView from './Component/UserInformationView';
import SubHeader from '../common/components/SubHeader';
import ContractDataView from './Component/ContractData';
import IdentityInfo from './Component/IdentityInfo';

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

interface Council {
  name: string;
}

interface EmpCouncil {
  empId: number;
  councilId: number;
  memberShipExpiryDate: string;
  council: Council;
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
  empCouncils: EmpCouncil[];

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
    passportPic: ImageSourcePropType | ImageProps;
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

const PersonalData: React.FC = () => {
  const navigation = useNavigation<PersonalDataScreenNavigationProp>();
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('');
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

  const renderView = (key: string) => {
    switch (key) {
      case 'employee_data':
        return <EmployeeData />;
      case 'passport_residence':
        return <PassportResidenceView />;
      case 'bank_account':
        return null; // Return null or a placeholder component
      case 'contract_data':
        return <ContractData />; // Return null or a placeholder component
      default:
        return <EmployeeData />;
    }
  };

  const EmployeeData: React.FC = () => {
      console.log('photo....',employeeDataByEmpId?.photo)
    if (loading)
      return <ActivityIndicator size={'small'} style={{marginTop: '15%'}} />;
    return (
    
      <>
        {empId !== 0 ? (
          
          <>
            <PersonalInformationView
              source={employeeDataByEmpId?.photo}
              id={employeeDataByEmpId?.id}
              nationality={employeeDataByEmpId?.nationality.name}
              nameArb={employeeDataByEmpId?.nameAr}
              nameEng={employeeDataByEmpId?.nameEn}
              dateBirth={formatDate(employeeDataByEmpId?.birthDate)}
              dateHijri={employeeDataByEmpId?.hijriBirthDate}
              religion={employeeDataByEmpId?.religion?.name}
              userName={employeeDataByEmpId?.personalEmail}
              phone={employeeDataByEmpId?.mobile}
            />
            {employeeDataByEmpId && (
              <ProfessionAndproject
                jobNumber={employeeDataByEmpId?.jobNumber}
                jobTitle={employeeDataByEmpId?.jobs.jobName}
                {...(employeeDataByEmpId?.city?.id !== 2
                  ? {
                      directManager: employeeDataByEmpId?.workOwnerName,
                      employerNumber: employeeDataByEmpId?.workOwnerNumber,
                      employeeNumberInLaborOffice: JSON.stringify(
                        employeeDataByEmpId?.empOfficeNO,
                      ),
                    }
                  : {})}
              />
            )}

            <DrivingLicense
              drivingLicenseType={employeeDataByEmpId?.license?.name}
              drivingLicenseExpiryHijri={
                employeeDataByEmpId?.licenceExpiryDateH
              }
              drivingLicenseExpiryGregorian={formatDate(
                employeeDataByEmpId?.licenceExpiryDateM,
              )}
            />

            <OperationCard
              operationCardExpiry={
                employeeDataByEmpId?.cardWorkExpiryDate
                  ? formatDate(employeeDataByEmpId?.cardWorkExpiryDate)
                  : 'لايوجد بيانات'
              }
              operationCardAttachment={
                employeeDataByEmpId?.cardWorkPic
                  ? employeeDataByEmpId.cardWorkPic.split('/').pop()
                  : 'لايوجد مرفق'
              }
            />
            <ResidenceInformation
              residenceAddress={employeeDataByEmpId?.streetName}
              apartmentNumber={employeeDataByEmpId?.appartmentNo}
              roomNumber={JSON.stringify(employeeDataByEmpId?.roomNo)}
            />

            <SubscriptionsAndMemberships
              employeeAffiliatedAuthority={
                employeeDataByEmpId?.empCouncils?.[0]?.council?.name
                  ? employeeDataByEmpId?.empCouncils?.[0]?.council?.name
                  : 'لايوجد بيانات'
              }
              membershipExpiryGregorian={
                employeeDataByEmpId?.empCouncils?.[0]?.memberShipExpiryDate
                  ? formatDate(
                      employeeDataByEmpId?.empCouncils?.[0]
                        ?.memberShipExpiryDate,
                    )
                  : 'لايوجد بيانات'
              }
            />

            <QualificationsAndCertificates
              data={employeeDataByEmpId?.academicQualification}
            />

            {/* <PreviousExperiences
          jobName={employeeDataByEmpId?.previousExperiences[0].jobName ?? ''}
          companyName={employeeDataByEmpId?.previousExperiences[0].companyName ?? ''}
          firstDate={employeeDataByEmpId?.previousExperiences[0].firstDate ?? ''}
          endDate={employeeDataByEmpId?.previousExperiences[0].endDate ?? ''}
        /> */}
          </>
        ) : (
          <UserInformationView
            id={employeeDataByUserId?.id}
            nameArb={employeeDataByUserId?.name}
            userName={employeeDataByUserId?.emailAddress}
            phone={employeeDataByUserId?.phoneNumber}
          />
        )}
      </>
    );
  };

  function PassportResidenceView() {
    if (loading)
      return <ActivityIndicator size={'small'} style={{marginTop: '15%'}} />;

    return (
      <>
        {empId !== 0 && employeeDataByEmpId?.city?.id !== 2 ? (
          <>
            <PassportResidence
              passportNumber={employeeDataByEmpId?.passports[0]?.passportNo}
              passportReentryIssueDateGregorian={formatDate(
                employeeDataByEmpId?.passports[0]?.passportExpiryDate,
              )}
              exitReentryIssueDateHijri={
                employeeDataByEmpId?.passports[0]?.passportExpiryDateH
              }
              exitReentryIssueDateGregorian={formatDate(
                employeeDataByEmpId?.passports[0]?.creationTime,
              )}
              passportReentryIssueDateHijri={
                employeeDataByEmpId?.passports[0]?.passportExpiryDateH
              }
              professionArabic={
                employeeDataByEmpId?.passports[0]?.passportJobAr ?? ''
              }
              professionInPassport={
                employeeDataByEmpId?.passports[0]?.passportJob ?? ''
              }
              image={employeeDataByEmpId?.passports[0]?.passportPic}
            />
            <ResidenceDetails
              residenceNumber={employeeDataByEmpId?.identityData?.residentNo}
              nationalAddress={
                employeeDataByEmpId?.identityData?.nationalAddress
              }
              borderNumber={JSON.stringify(
                employeeDataByEmpId?.identityData?.residencePermitNo,
              )}
              image={employeeDataByEmpId?.passports[0]?.passportPic}
            />
          </>
        ) : (
          <IdentityInfo
           identityPic={employeeDataByEmpId?.identityData?.identityPic}
            nationalId={employeeDataByEmpId?.identityData?.identityNo}
            nationalAddress={employeeDataByEmpId?.identityData?.nationalAddress}
            expiryDate={employeeDataByEmpId?.identityData?.identityNoExpiryDate}
          />
        )}
      </>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <SubHeader
          leftIconAction={() => navigation.goBack()}
          leftIcon={I18nManager.isRTL ? icons.rightBack : icons.leftBack}
          title={t('personalData')}
        />
        <ProfileTabs
          selectedTab={(val: string) => {
            console.log('.......val', val);
            setSelectedTab(val);
          }}
        />
        {renderView(selectedTab)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalData;

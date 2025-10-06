import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  I18nManager,
  TextStyle,
  Image,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, icons, images, SIZES } from '../../../constants';
import MainHeader from '../../common/components/MainHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../OrderApproval/styles';
import OrderDetailsCard from './componets/OrderDetailsCard';
import FeedBackModal from '../../common/components/FeedBackModal';
import { CompleteTansferEmployee, CompleteTansferTeam, getAllApprovalDetails, postApproval } from '../OrderApproval/services/services';
import MainButton from '../../common/components/MainButton';
import moment from 'moment';
import { fulldateFormate } from '../../../constants/dateFormate';
import MaintainceView from '../../common/components/MaintainceView';
import { useTranslation } from 'react-i18next';
import CardRow from '../../common/components/CardRow';
import CardHeader from '../../common/components/CardHeader';
import { BaseURL } from '../../../constants/BaseUrl';
import Loader from '../../common/components/Loader';
import SubHeader from '../../common/components/SubHeader';

type OrderDetailsParams = {
  order: {
    number: string;
    type: string;
    date: string;
    status: string;
    employeeName: string;
    managerName: string;
    notes: string;
    description: string,
    name: string,
    dataURL: string,
    excutedProcessID: number,
    recordID: number,
    createDate: Date,
    processActionId: number
  };
  lang?: string; // lang يمكن أن يكون موجودًا أو لا
};

// نوع الـ props الخاصة بالشاشة التي تحتوي على الـ route
type OrderDetailsScreenProps = {
  route: {
    params: OrderDetailsParams;
  };
};

const OrderDetails = ({ route }: OrderDetailsScreenProps) => {
  const { t } = useTranslation()
  const navigation = useNavigation();
  // ...............................................
  const [feedBack, setfeedBack] = useState<boolean>(false);
  const [feedBackmsg, setfeedBackmsg] = useState<boolean | string>(false);
  const [feedBackImage, setFeedBackImage] = useState<any>(null);
  const [details, setdetails] = useState<any>(null);
  const { order } = route.params;
  const [viewType, setViewType] = useState<number>(order?.processActionId)
  const [isloading, setIsloading] = useState<boolean>(true)


  useEffect(() => {
    getDetails();
  }, [])

  const getDetails = async () => {
    console.log("order?.dataURL, order?.recordID", order?.dataURL, order?.recordID)
    const detailsData = await getAllApprovalDetails(order?.dataURL, order?.recordID);
    console.log("detailsData...", detailsData)
    setdetails(Array.isArray(detailsData?.returnData) ? detailsData?.returnData[0] : detailsData?.returnData)
    setIsloading(false)
  }


  const handleApprove = async () => {
    const approve = await postApproval(order?.excutedProcessID, true)
    console.log(approve)
    if (approve?.message?.type === 'Success') {
      setfeedBack(true)
      setfeedBackmsg(t('approvalsuccess'));
      setFeedBackImage(images?.success)
      
    } else {
      Alert.alert(approve?.message?.content || 'somthing wrong !')
    }
    setTimeout(() => {
      setfeedBack(false);
      navigation.goBack()
    }, 300);
  }

  const handleReject = async () => {
    const approve = await postApproval(order?.excutedProcessID, false)
    console.log(approve)
    if (approve?.message?.type === 'Success') {
      setfeedBack(true)
      setfeedBackmsg(t('approvalrejectsuccess'));
      setFeedBackImage(images?.fail)
    } else {
      Alert.alert(approve?.message?.content || 'somthing wrong !')
    }
    setTimeout(() => {
      setfeedBack(false);
      navigation.goBack()
    }, 300);
  };
  // .....................................................................................
  const EmployeeDetailsForApproval = () => {
    return <View style={{ ...styles?.card }}>
      <CardHeader icon={icons?.workerRequest} name={t('Addemployee')} />
      <CardRow label={t('nameInArabic')} value={details?.nameAr} />
      <CardRow label={t('nameInEnglish')} value={details?.nameEn} />
      <CardRow label={t('jobTitle')} value={details?.jobs?.jobName} />
      <CardRow label={t('phone')} value={details?.phone} />
      <CardRow label={t('email1')} value={details?.personalEmail} />
      <CardRow label={t('religion')} value={details?.religion?.name} />
      <CardRow label={t('nationality')} value={details?.nationality?.name} />
      <CardRow label={t('dateOfBirthHijri')} value={details?.hijriBirthDate} />
      <CardRow label={t('dateOfBirthGregorian')} value={moment(details?.birthDate).format(fulldateFormate)} />
    </View>
  }
  const EmployeeAbsenceApproval = () => {
    const parts = details?.attachment ? details.attachment.split('/') : [];
    const fileName = parts.length > 0 ? parts[parts.length - 1] : '';
    return <View style={{ ...styles?.card }}>
      <CardHeader icon={icons?.daysWithoutFingerprint} name={t('justificationsForAbsence')} />
      <CardRow label={t('nameInArabic')} value={details?.employeeName} />
      <CardRow label={t('nameInEnglish')} value={details?.employeeNameEn} />
      <CardRow label={t('date')} value={moment(details?.date).format(fulldateFormate)} />
      <CardRow label={t('JustificationReason')} value={details?.justificationReason} />
      <CardRow label={t('notes')} value={details?.notes} />
     { details?.attachment?<TouchableOpacity onPress={() => { Linking.openURL(BaseURL + "/" + details?.attachment) }} style={{ ...styles?.row }}>
        <Image source={icons?.clould} style={{ ...styles?.icon }} />
        <Text>{fileName || "name"}</Text>
      </TouchableOpacity>:null}
    </View>
  }

  const VacationsDetails = () => {
    const parts = details?.attachment ? details.attachment.split('/') : [];
    const fileName = parts.length > 0 ? parts[parts.length - 1] : '';
    return <View style={{ ...styles?.card }}>
      <CardHeader icon={icons?.vacc} name={t('leave_request')} />
      <CardRow label={t("name")} value={I18nManager?.isRTL ? details?.employeeName : details?.employeeNameEn} />
      <CardRow label={t("EmpContractVacationName")} value={details?.empContractVacationName} />
      <CardRow label={t("StartDate")} value={moment(details?.data).format(fulldateFormate)} />
      <CardRow label={t("EndDate")} value={moment(details?.endDate).format(fulldateFormate)} />
      <CardRow label={t("vduration")} value={JSON.stringify(details?.vacationDuration)} />
      <CardRow label={t("LastVacationDays")} value={JSON.stringify(details?.lastVacationDays)} />
      <CardRow label={t("notes")} value={JSON.stringify(details?.notes)} />
      {details?.attachment?<TouchableOpacity onPress={() => { Linking.openURL(BaseURL + "/" + details?.attachment) }} style={{ ...styles?.row }}>
        <Image source={icons?.clould} style={{ ...styles?.icon }} />
        <Text style={{ ...FONTS?.body5 } as TextStyle}>{fileName || "name"}</Text>
      </TouchableOpacity>:null}
    </View>
  }

  const EmployeeTransfer = () => {
    return (
      <View style={{ ...styles?.card }}>
        <CardHeader icon={icons?.workerRequest} name={t('Employeetransfer')} />
        <CardRow label={t('name')} value={I18nManager?.isRTL ? details?.employeeNameAr : details?.employeeNameEn} />
        <CardRow label={t('date')} value={moment(details?.date).format(fulldateFormate)} />
        <CardRow label={t('CurrentTeamAndProject')} value={details?.currentTeamAndProject} />
        <CardRow label={t('NewTeamAndProject')} value={details?.newTeamAndProject} />
      </View>
    )
  }
  const TeamTransfer = () => {
    // Teamtransfer
    return (
      <View style={{ ...styles?.card }}>
        <CardHeader icon={icons?.report_malfunction} name={t('Teamtransfer')} />
        <CardRow label={t('team')} value={details?.teamName} />
        <CardRow label={t('date')} value={moment(details?.date).format(fulldateFormate)} />
        <CardRow label={t('CurrentProject')} value={details?.currentProject} />
        <CardRow label={t('NewProject')} value={details?.newProject} />
      </View>
    )
  }
  const NewEmployeeRequest = () => {
    return <View style={{ ...styles?.card }}>
      <CardHeader icon={icons?.workerRequest} name={t('Addemployee')} />
      <CardRow label={t('nameInArabic')} value={details?.employeeNameAr} />
      <CardRow label={t('nameInEnglish')} value={details?.employeeNameEn} />
      {/* <CardRow label={t('jobTitle')} value={details?.jobs?.jobName} />
      <CardRow label={t('phone')} value={details?.phone} />
      <CardRow label={t('email1')} value={details?.personalEmail} />
      <CardRow label={t('religion')} value={details?.religion?.name} />
      <CardRow label={t('nationality')} value={details?.nationality?.name} />
      <CardRow label={t('dateOfBirthHijri')} value={details?.hijriBirthDate} />
      <CardRow label={t('dateOfBirthGregorian')} value={moment(details?.birthDate).format(fulldateFormate)} /> */}
    </View>
  }
  const EmployeeVacationApproval = () => {
    return <View style={{ ...styles?.card }}>
      <CardHeader icon={icons?.workerRequest} name={t('Addemployee')} />
      <CardRow label={t('nameInArabic')} value={details?.employeeNameAr} />
      <CardRow label={t('nameInEnglish')} value={details?.employeeNameEn} />
      {/* <CardRow label={t('jobTitle')} value={details?.jobs?.jobName} />
      <CardRow label={t('phone')} value={details?.phone} />
      <CardRow label={t('email1')} value={details?.personalEmail} />
      <CardRow label={t('religion')} value={details?.religion?.name} />
      <CardRow label={t('nationality')} value={details?.nationality?.name} />
      <CardRow label={t('dateOfBirthHijri')} value={details?.hijriBirthDate} />
      <CardRow label={t('dateOfBirthGregorian')} value={moment(details?.birthDate).format(fulldateFormate)} /> */}
    </View>
  }
  // ......................................

  // ....................................
  const renderMainView = (type: number) => {
    switch (type) {
      case 2: return <EmployeeDetailsForApproval />;
      case 1: return <VacationsDetails />;
      case 3: return <EmployeeAbsenceApproval />;
      case 4: return <EmployeeTransfer />;
      case 5: return <TeamTransfer />;
      case 6: return <NewEmployeeRequest />;
      case 7: return <EmployeeVacationApproval />;

      default:
        return <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ ...FONTS?.h2, marginVertical: 16 } as TextStyle}>{t('canotdetectAprovalType')}</Text>
          <View style={{ ...styles?.btnView }}>
            <MainButton
              onPress={() => { setViewType(2) }}
              containerStyle={{ ...styles?.button }} label={t('Addemployee')} />
            <MainButton
              onPress={() => { setViewType(1) }}
              containerStyle={{ ...styles?.button }} label={t('Vacationrequest')} />
          </View>
          <View style={{ ...styles?.btnView }}>
            <MainButton
              onPress={() => { setViewType(3) }}
              containerStyle={{ ...styles?.button }} label={t('justificationreason')} />

            <MainButton
              onPress={() => { setViewType(4) }}
              containerStyle={{ ...styles?.button }} label={t('Employeetransfer')} />
          </View>
          <View style={{ ...styles?.btnView }}>
            <MainButton
              onPress={() => { setViewType(5) }}
              containerStyle={{ ...styles?.button }} label={t('Teamtransfer')} />
          </View>
        </View>;
    }

  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        containerStyle={{ marginBottom: 8 }}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('orderDetails')}
      />
      <FeedBackModal
        onDismiss={(val: boolean | ((prevState: boolean) => boolean)) => {
          setfeedBack(val);
        }}
        isVisible={feedBack}
        description={feedBackmsg}
        Image={feedBackImage}
      />
      {isloading == false && details != null ?
        <>
          <ScrollView>
            {renderMainView(viewType)}

          </ScrollView>
          <View style={{ ...styles?.row, justifyContent: 'center' }}>
            <MainButton onPress={handleApprove} containerStyle={{ ...styles?.approvalbtn }} label={t('approve')} />
            <MainButton onPress={handleReject} containerStyle={{ ...styles?.rejectbtn }} label={t('reject')} />
          </View>
        </> 
        : isloading == false?null:<Loader/>}
        {isloading == false && details == null ?<MaintainceView />:null}

      
    </SafeAreaView>
  );
};

export default OrderDetails;


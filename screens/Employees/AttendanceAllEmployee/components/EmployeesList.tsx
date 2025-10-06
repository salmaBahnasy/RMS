import React from 'react';
import {
  FlatList,
  Image,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
  FlatListProps,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { images, FONTS, icons, COLORS } from '../../../../constants';
import styles from '../styles';
import CheckBoxComp from '../../../common/components/CheckBoxComp';
import MainButton from '../../../common/components/MainButton';
import EmptyView from '../../../common/components/EmptyView';
import { BaseURL } from '../../../../constants/BaseUrl';

// ----------------------------------------------
// Types
interface Employee {
  employeeId: string;
  employeeName: string;
  employeeNameEn: string;
  status?: number;
  image?: string;
}

interface EmployeesListProps {
  data: Employee[];
  selectedEmployees: string[];
  selectAll: boolean;
  isEnterLeaveSetting?: boolean;
  searchResult?: boolean;
  shiftId?: string|any;
  lat?:string |number;
  long?:string |number;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  recordAttendance: (status: string | number |any) => void | Promise<void>;
  selectedOneEmployee:any
}

// ----------------------------------------------
const EmployeesList: React.FC<EmployeesListProps> = props => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<any>>();

  const renderStatus = (item: Employee) => {
    switch (item?.status) {
      case 1:
        return (
          <View style={styles.StatusView}>
            <Text style={{ ...FONTS.body6, color: COLORS.darkGreen } as TextStyle}>
              {t('attend')}
            </Text>
          </View>
        );
      case 2:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS.redOpacity,
              borderColor: COLORS.lightRed,
            }}>
            <Text style={{ ...FONTS.body6, color: COLORS.lightRed } as TextStyle}>
              {t('absent')}
            </Text>
          </View>
        );
      case 3:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS.lightYellow,
              borderColor: COLORS.darkYellow,
            }}>
            <Text style={{ ...FONTS.body6, color: COLORS.darkYellow } as TextStyle}>
              {t('absent_with_permission')}
            </Text>
          </View>
        );
      case 4:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS.lightYellow,
              borderColor: COLORS.darkYellow,
            }}>
            <Text style={{ ...FONTS.body6, color: COLORS.darkYellow } as TextStyle}>
              {t('absent_without_permission')}
            </Text>
          </View>
        );
      case 5:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS.lightYellow,
              borderColor: COLORS.darkYellow,
            }}>
            <Text style={{ ...FONTS.body6, color: COLORS.darkYellow } as TextStyle}>
              {t('attend')}
            </Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              ...styles.StatusView,
              backgroundColor: COLORS.redOpacity,
              borderColor: COLORS.lightRed,
            }}>
            <Text style={{ ...FONTS.body6, color: COLORS.lightRed } as TextStyle}>__</Text>
          </View>
        );
    }
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={{ ...styles.row, ...styles.EmployeeItem }}>
      <CheckBoxComp
        value={props.selectedEmployees.includes(item.employeeId)}
        onValueChange={() => props.toggleSelection(item.employeeId)}
      />
      <Image
        source={item.image ? { uri: BaseURL + item.image } : images.userImage}
        style={styles.empImg}
      />
      <View style={{ flex: 1, marginRight: 4 }}>
        <Text style={FONTS.h4 as TextStyle}>
          {I18nManager.isRTL
            ? item.employeeName?.replace(/[\d-]+/g, '')
            : item.employeeNameEn?.replace(/[\d-]+/g, '')}
        </Text>
        <Text style={FONTS.h4 as TextStyle}> {item.employeeId} </Text>
      </View>
      {renderStatus(item)}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EmployeeDetails', {
            item,
            isEnterLeaveSetting: props.isEnterLeaveSetting,
            shiftId: props.shiftId,
            lat: props.lat,
            long: props.long,
          });
        }}>
        <Image source={icons.moreActions} style={{ width: 28, height: 28 }} />
      </TouchableOpacity>
    </View>
  );

  const Header = () => (
    <View style={{ ...styles.row, ...styles.sb }}>
      {!props.searchResult ? (
        <CheckBoxComp
          onValueChange={props.toggleSelectAll}
          label={t('select_all')}
          value={props.selectAll}
        />
      ) : (
        <View />
      )}
      {props.isEnterLeaveSetting ? (
        <View style={styles.row}>
          <MainButton
            onPress={() => props.recordAttendance(1)}
            label={t('attendance')}
            containerStyle={{
              height: 36,
              paddingHorizontal: 8,
              backgroundColor: COLORS.darkGreen,
              minWidth: 65,
              marginHorizontal: 2,
            }}
            labelStyle={{
              ...FONTS.h5,
              color: COLORS.white,
              alignSelf: 'center',
            }}
          />
          <MainButton
            onPress={() => props.recordAttendance(2)}
            label={t('leave')}
            containerStyle={{
              height: 36,
              paddingHorizontal: 8,
              backgroundColor: COLORS.lightRed,
              width: 65,
              marginHorizontal: 2,
            }}
            labelStyle={{
              ...FONTS.h5,
              color: COLORS.white,
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <MainButton
          onPress={() => props.recordAttendance(5)}
          label={t('prepare')}
          containerStyle={{
            height: 36,
            paddingHorizontal: 8,
            backgroundColor: COLORS.darkGreen,
            width: 65,
          }}
          labelStyle={{
            ...FONTS.h5,
            color: COLORS.white,
            alignSelf: 'center',
          }}
        />
      )}
    </View>
  );

  return (
    <FlatList
      data={props.data}
      extraData={props.data}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      keyExtractor={(item) => item.employeeId}
      ListHeaderComponent={() => props.data.length > 0 ? <Header /> : null}
      ListEmptyComponent={() => (
        <EmptyView
          image={icons?.accept_reject_equipment_request}
          label={t('noworkers')}
          ImgStyle={{ width: 100, height: 100 }}
        />
      )}
    />
  );
};

export default EmployeesList;

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
import { COLORS, FONTS, icons, images } from '../../../constants';
import styles from './styles';
import CheckBoxComp from '../../common/components/CheckBoxComp';
import { BaseURL } from '../../../constants/BaseUrl';
import MainButton from '../../common/components/MainButton';
import EmptyView from '../../common/components/EmptyView';



// ----------------------------------------------
// Types
interface Equipment {
  equipmentId: string;
  equipmentName: string;
  equipmentNameEn: string;
  status?: number ;
  image?: string;
}

interface EquipmentsListProps {
  data: Equipment[];
  selectedEquipments?: string[];
  selectAll?: boolean;
  isEnterLeaveSetting?: boolean;
  searchResult?: boolean;
  shiftId?: string|any;
  lat?:string |number;
  long?:string |number;
  toggleSelection?: (id: string | number | any) => void;
  toggleSelectAll?: () => void;
  recordAttendance?: (status: string | number | any) => void | Promise<void>;
  selectedOneEquipment?: any;
}

// ----------------------------------------------
const EquipmentsList: React.FC<EquipmentsListProps> = props => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<any>>();

  const renderStatus = (item: Equipment) => {
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

  const renderItem = ({ item }: { item: Equipment }) => (
    <View style={{ ...styles.row, ...styles.EmployeeItem }}>
      <CheckBoxComp
        value={props.selectedEquipments.includes(item.equipmentId)}
        onValueChange={() => props.toggleSelection(item.equipmentId)}
      />
      <Image
        source={item.image ? { uri: BaseURL + item.image } : images.userImage}
        style={styles.empImg}
      />
      <View style={{ flex: 1, marginRight: 4 }}>
        <Text style={FONTS.h4 as TextStyle}>
          {I18nManager.isRTL
            ? item.equipmentName?.replace(/[\d-]+/g, '')
            : item.equipmentNameEn?.replace(/[\d-]+/g, '')}
        </Text>
        <Text style={FONTS.h4 as TextStyle}> {item.equipmentId} </Text>
      </View>
      {renderStatus(item)}
    
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
      keyExtractor={(item) => item.equipmentId}
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

export default EquipmentsList;

import React from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, StyleProp, ViewStyle, TextStyle, ListRenderItem, I18nManager, ImageStyle } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, SIZES, icons, FONTS, images } from '../../../constants';
import { useTranslation } from 'react-i18next';
import navigation from '../../../navigation/navigation';
import CheckBoxComp from './CheckBoxComp';

interface EmployeesDropdownModalProps {
  toggleSelection(employeeId: any): void;
  selectedEmployees: any;
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  listHeader?: string;
  data?: any[];
  type?: string;
}

const EmployeesDropdownModal: React.FC<EmployeesDropdownModalProps> = (props) => {
  const { t } = useTranslation()
const renderItem: ListRenderItem<any> = ({ item }) => {
  return (
    <TouchableOpacity
      style={{ ...styles?.row, ...styles?.EmployeeItem }}
      onPress={() => {
        props?.toggleSelection(item); // هنا هتسجل الموظف المختار
        props?.onDismiss(false);      // وهنا يقفل المودال
      }}
    >
      <Image source={images?.userImage} style={{ ...styles?.empImg } as ImageStyle} />
      <View style={{ flex: 1, marginRight: 4 }}>
        <Text style={{ ...FONTS?.h4 } as TextStyle}>
          {I18nManager.isRTL
            ? item?.nameAr?.replace(/[\d-]+/g, '')
            : item?.nameEn.replace(/[\d-]+/g, '')}
        </Text>
        <Text style={{ ...FONTS?.h4 } as TextStyle}> {item?.id} </Text>
      </View>
    </TouchableOpacity>
  );
};


  const ListHeader = () => {
    return (
      <View style={{ ...styles.row, justifyContent: 'space-between', marginBottom: 8 }}>
        <Text>{props.listHeader}</Text>
        <TouchableOpacity onPress={() => props.onDismiss(false)}>
          <Image style={{ width: 30, height: 30 }} source={icons.closeModal} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={props.isVisible}
      style={{
        width: SIZES.width,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
      }}
      coverScreen={false}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          height: 312,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          padding: 24,
        }}
      >
        <TouchableOpacity onPress={() => props.onDismiss(false)} style={styles.drag} />
        <FlatList
          data={props.data} // Use `props.data` if provided, otherwise fallback to default data
          renderItem={renderItem}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={() => {
            return <View style={{ width: 'auto', height: 'auto' }}>
              <Text style={{
                ...styles?.emptytxt
              } as TextStyle}>{t('nodataavailablenow')}</Text>
            </View>
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    width: 20,
    height: 20,
  },
  drag: {
    width: 36,
    height: 5,
    backgroundColor: COLORS.gray,
    alignSelf: 'center',
    borderRadius: 8,
  },
  emptytxt: {
    ...FONTS?.h3, textAlign: 'center',
    backgroundColor: COLORS.Warningbg,
    color: COLORS?.Warningtxt,
    marginVertical: 2,
    alignSelf: 'center'
  },
  EmployeeItem: {
    backgroundColor: COLORS?.white, marginVertical: 4, padding: 16, borderRadius: 16
  },
  empImg: {
    width: 32, height: 32, marginHorizontal: 4
  },
});

export default EmployeesDropdownModal;
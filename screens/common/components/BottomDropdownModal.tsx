import React from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, StyleProp, TextStyle, ListRenderItem, I18nManager } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, SIZES, icons, FONTS } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { DropdownItem } from '../../../navigation/types';

interface BottomDropdownModalProps {
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  listHeader?: string;
  onSelectedItem: (item: DropdownItem, type: string) => void | Promise<void>;
  data?: any[];
  type?: string;
}

const BottomDropdownModal: React.FC<BottomDropdownModalProps> = (props:any) => {
  const { t } = useTranslation()
  const renderItem: ListRenderItem<any> = ({ item }) => {
    let langName=I18nManager?.isRTL? item?.nameAr: item?.nameEn
    return (
      <Text
        style={{ ...FONTS.body5, marginVertical: 8 } as StyleProp<TextStyle>}
        onPress={() => {
          if (props?.type == 'shift2' && props?.data?.length > 1) {
            props.onSelectedItem(item, props?.type);
          } else {
            props.onSelectedItem(item, props?.type);
            props.onDismiss(false);
          }
        }}
      >
        {  item?.label || item?.projectName || item?.companyVacationName || item?.teamName || item?.shiftName || item?.name || langName }
      </Text>
    );
  };
console.log("modal props",props)
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

  if (!props.isVisible) return null;

  return (
    <Modal
      isVisible={true}
      onBackdropPress={() => props.onDismiss(false)}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}
      coverScreen={true}
      useNativeDriver={true}
      backdropTransitionOutTiming={0}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          height: 312,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          padding: 24,
        }}
      >
        <TouchableOpacity onPress={() => props.onDismiss(false)} style={styles.drag} />
        <FlatList
          data={Array.isArray(props.data) ? props.data : []}
          renderItem={renderItem}
          keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={() => (
            <View style={{ width: 'auto', height: 'auto' }}>
              <Text style={styles?.emptytxt as TextStyle}>{t('nodataavailablenow')}</Text>
            </View>
          )}
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
  }
});

export default BottomDropdownModal;
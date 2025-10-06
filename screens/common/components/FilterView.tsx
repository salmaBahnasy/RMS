import React from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, StyleProp, TextStyle, ListRenderItem } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, SIZES, icons, FONTS } from '../../../constants';
import { useTranslation } from 'react-i18next';

interface FilterViewProps {
  isVisible: boolean;
  onDismiss: (visible: boolean) => void;
  listHeader?: string;
  data?: any[];
  type?: string;
  onSelectedItem:any
}

const FilterView: React.FC<FilterViewProps> = (props:any) => {
  const { t } = useTranslation()
  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
      <Text
        style={{ ...FONTS.body5, marginVertical: 8 } as StyleProp<TextStyle>}
        onPress={() => {
          props?.onSelectedItem(item?.value)
        }}
      >
        {item?.name}
      </Text>
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

export default FilterView;
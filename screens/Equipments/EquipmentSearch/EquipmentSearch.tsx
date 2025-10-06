import React, { useState } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainButton from '../../common/components/MainButton';
import { COLORS, icons } from '../../../constants';
import MainHeader from '../../common/components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import CheckBoxComp from '../../common/components/CheckBoxComp';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import DropDownButton from '../../common/components/DropDownButton';
import SubHeader from '../../common/components/SubHeader';

interface EquipmentSearchProps {
  // Define any props here if needed
}

const EquipmentSearch: React.FC<EquipmentSearchProps> = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(t('choose'));

  const handleSelectedItem = (item: string): void => {
    console.log(item);
    setSelectedItem(item);
  };

  const handleDismiss = (val: boolean): void => {
    setIsVisible(val);
  };

  return (
    <View style={styles.container}>
      <SubHeader 
        leftIconAction={() => navigation.goBack()} 
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack} 
        title={t('equipment_search')} 
      />
      <BottomDropdownModal
        isVisible={isVisible} 
        onDismiss={handleDismiss} 
        onSelectedItem={handleSelectedItem} 
        listHeader={t('select_department')}
      />
      <View style={styles.subContainer}>
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('driver')}
        />
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('team')}
        />
        <CheckBoxComp 
          value={toggleCheckBox} 
          onValueChange={(val: boolean) => setToggleCheckBox(val)} 
          label={t('driverless_equipment')} 
        />
        <MainButton containerStyle={{ marginVertical: 8 }} label={t('show_results')} onPress={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    padding: 24,
    backgroundColor: COLORS?.white,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  dropdownContainer: {
    // borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    zIndex: 0,
  },
  label: {
    padding: 8,
    fontSize: 16,
    color: '#666',
  },
  dropdownText: {
    padding: 8,
    // borderTopWidth: 1,
    position: 'relative',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  selectedText: {
    fontSize: 16,
  },
  dropdownItem: {
    padding: 8,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    borderTopWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  dropdownView: {
    borderWidth: 1,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EquipmentSearch;

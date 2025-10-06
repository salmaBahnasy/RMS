import React, { useState } from 'react';
import { View, StyleSheet, I18nManager, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainButton from '../../common/components/MainButton';
import { COLORS, icons } from '../../../constants';
import MainHeader from '../../common/components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import BottomDropdownModal from '../../common/components/BottomDropdownModal';
import DropDownButton from '../../common/components/DropDownButton';

const EmployeesSearch: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(t('choose'));

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader
        leftIconAction={() => navigation.goBack()}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('employeeSearch')}
      />
      <BottomDropdownModal
        isVisible={isVisible}
        onDismiss={(val: boolean) => { setIsVisible(val); }}
        onSelectedItem={(item: string) => { console.log(item); }}
        listHeader={t('select_department')}
      />
      <View style={styles.subContainer}>
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('management')}
          dropdownContainer={{ marginBottom: 0 }}
        />
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('project')}
          dropdownContainer={{ marginBottom: 0 }}
        />
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('team')}
          dropdownContainer={{ marginBottom: 0 }}
        />
        <DropDownButton
          onIsVisible={(val: boolean) => setIsVisible(true)}
          selectedItem={selectedItem}
          label={t('workingHours')}
          dropdownContainer={{ marginBottom: 0 }}
        />
        <MainButton 
        containerStyle={{ marginVertical: 8 }} 
        label={t('show_results')} onPress={function (): void {
          // throw new Error('Function not implemented.');
        } } />
      </View>
    </SafeAreaView>
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

export default EmployeesSearch;

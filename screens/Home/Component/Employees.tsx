import React from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types'; // Define this type based on your navigation structure
// ............................................
import styles from '../styles';
import { employeesList } from '../../common/Constants';

// Define the type for the employee item
interface EmployeeItem {
  label: string;
  image: ImageSourcePropType;
  onPress: keyof RootStackParamList; // Ensure this is a valid key of RootStackParamList
}

// Define the type for the component's props
interface EmployeesProps {
  stylesContainer?: StyleProp<ViewStyle>;
}

const Employees: React.FC<EmployeesProps> = (props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  // Render function for each item in the FlatList
  const renderItem = ({ item, index }: { item: EmployeeItem; index: number }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => navigation.navigate(item?.onPress)}
        style={styles.optionItem}
      >
        <Image source={item.image} style={styles.optionImage} />
        <Text style={styles.optionText}>{t(item.label)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.listViewStyle, props.stylesContainer]}>
      <FlatList
        data={employeesList}
        extraData={employeesList}
        renderItem={renderItem}
        numColumns={2}
      />
      <View style={{marginTop: 12}}/>
    </View>
  );
};

export default Employees;
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types'; // Define this type based on your navigation structure
// ..........................
import styles from '../styles';

// Define the type for the component's props
interface RememberMeProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

const RememberMe: React.FC<RememberMeProps> = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.containerchild}>
      <View style={styles.row}>
        <CheckBox
          value={props.isChecked}
          onValueChange={(newValue) => {
            props.setIsChecked(newValue);
          }}
        />
        <Text style={styles.label}>{t('rememberMe')}</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgetPassword')}
        style={styles.forgotPassword}
      >
        <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RememberMe;
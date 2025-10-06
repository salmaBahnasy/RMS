import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  I18nManager,
  TextStyle,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../common/components/MainHeader';
import icons from '../../../constants/icons';
import { t } from 'i18next';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../../constants';
import { RootStackParamList } from '../../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from '../OrderApproval/styles';
import OrderCard from './componets/OrderCard';
import { getAllApprovalRequests } from './services/services';
import Loader from '../../common/components/Loader';
import EmptyView from '../../common/components/EmptyView';
import SubHeader from '../../common/components/SubHeader';


const OrderItem = ({ order, onDetailsPress, onPress }: any) => {
  return (
    <OrderCard
      onDetailsPress={() => onDetailsPress(order)}
      onPress={() => onPress(order)}
      orderDate={order.createDate}
      orderNotes={order.description}
      orderType={order.name}
    />
  );
};
const OrderApproval: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isfocus = useIsFocused()
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, [isfocus]);



  const fetchOrders = async () => {
    const data = await getAllApprovalRequests();
    console.log('data :::', data);
    setOrders(data);
    setLoading(false);
  };



  const handlePress = (order: any) => {
    console.log('order', order);
    navigation.navigate('OrderDetails', { order });
    // Alert.alert('تفاصيل الطلب', `طلب رقم: ${order.number}`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <SubHeader
        leftIconAction={() => navigation.goBack()}
        containerStyle={{ marginBottom: 8 }}
        leftIcon={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack}
        title={t('orderApproval')}
      />
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onPress={handlePress}
              onDetailsPress={handlePress}
            />
          )}
          ListEmptyComponent={() => {
            return <EmptyView style={{ marginTop: 100 }}
              image={icons?.approve}
              ImgStyle={{ tintColor: COLORS?.lightGray }}
              label={t('noreq')} />
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderApproval;

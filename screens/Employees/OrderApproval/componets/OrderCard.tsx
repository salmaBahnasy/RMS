import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../styles'
import { t } from 'i18next'
import moment from 'moment';
import { dateNumber } from '../../../../constants/dateFormate';
import { formatDate } from '../../AttendanceAndLeave/services/services';
import OrderItem from './OrderItem';
import MainButton from '../../../common/components/MainButton';




interface OrderDetailsProps {
  onPress: () => void; // دالة عند الضغط على الزر
  orderType?: string; // نوع الطلب
  orderDate?: string | Date; // تاريخ الطلب (string أو Date)
  orderNotes?: string;
  onDetailsPress: () => void; // دالة عند الضغط على تفاصيل الطلب
}
const OrderCard: React.FC<OrderDetailsProps> = ({ orderNotes, orderType, orderDate, onDetailsPress }) => {
  return (
    <View style={styles.container}>
      <OrderItem
        lable1={t('requestDate')}
        value1={formatDate(orderDate)}
        lable2={t('requestType')}
        value2={orderType}
      />
      {orderNotes ? <OrderItem
        lable1={t('notes')}
        value1={orderNotes}
      /> : null}
      <MainButton
        containerStyle={styles.detailsButton}
        label={t('orderDetails')}
        onPress={() => onDetailsPress()}
      />

    </View>
  )
}

export default OrderCard
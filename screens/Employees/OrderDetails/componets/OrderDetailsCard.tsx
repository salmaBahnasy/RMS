import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { styles } from '../../OrderApproval/styles';
import { t } from 'i18next';
import moment from 'moment';
import { dateNumber } from '../../../../constants/dateFormate';
import OrderItem from '../../OrderApproval/componets/OrderItem';
import { formatDate } from '../../AttendanceAndLeave/services/services';
import MainButton from '../../../common/components/MainButton';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'مقبول':
      return '#4CAF50'; // أخضر
    case 'مرفوض':
      return '#F44336'; // أحمر
    case 'قيد الانتظار':
    default:
      return '#FF9800'; // برتقالي
  }
};

interface OrderDetailsProps {
  handleApprove: () => void; // دالة عند الضغط على الزر
  orderNumber: string | number; // رقم الطلب يمكن أن يكون string أو number
  orderType: string; // نوع الطلب
  orderDate: string | Date; // تاريخ الطلب (string أو Date)
  orderStatus: string; // حالة الطلب
  orderEmployeeName: string;
  orderNotes: string;
  handleReject: () => void; // دالة عند الضغط على تفاصيل الطلب
}
const OrderDetailsCard: React.FC<OrderDetailsProps> = ({
  handleApprove,
  orderType,
  orderDate,
  handleReject,
  orderNotes
}) => {
  return (
    <View style={styles.container}>
      <OrderItem
        lable1={t('requestDate')}
        value1={formatDate(orderDate)}
        lable2={t('requestType')}
        value2={orderType}
      />
      <OrderItem
        lable1={t('notes')}
        value1={orderNotes}
      />
      <View style={styles.buttonRow}>
        <MainButton
          containerStyle={styles.approveButton}
          onPress={() => handleApprove()}
          label={t('approve')}
        />

        <MainButton
          containerStyle={styles.rejectButton}
          onPress={() => handleReject()}
          label={t('reject')}
        />
      </View>
    </View>
  );
};

export default OrderDetailsCard;

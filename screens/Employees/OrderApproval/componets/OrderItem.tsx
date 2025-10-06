import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../styles'
import { formatDate } from '../../AttendanceAndLeave/services/services'

interface OrderItemProps {
  
    lable1?: string ; 
    value1?: any; 
    lable2?: string ; 
    value2?: any; 
}
 
  

const OrderItem : React.FC <OrderItemProps>= ({lable1, value1 , lable2, value2}) => {
  return (
    <View style={styles.row}>
    <View style={styles.columa}>
      <Text style={styles.label}>{lable1}</Text>
      <Text style={styles.value}>{value1}</Text>
    </View>
    <View style={styles.columa}>
      <Text style={styles.label}>{lable2}</Text>
      <Text style={styles.value}>{value2}</Text>
    </View>
    </View>
  )
}

export default OrderItem
import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | number;
  secTitle?: string;
  secValue?: string | number | (() => JSX.Element);
}

// const ContractDataView: React.FC = () => {
//   const { t } = useTranslation();

//   const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle, secValue }) => {
//     const isSecValueString = typeof secValue === 'string';
//     const isSecValueFunction = typeof secValue === 'function';

//     const renderSecValue = () => {
//       if (isSecValueString) {
//         return <Text style={styles.val as StyleProp<TextStyle>}>{secValue}</Text>;
//       } else if (isSecValueFunction) {
//         return secValue();
//       }
//       return null;
//     };

//     return (
//       <View style={{ ...styles.row, marginVertical: 8 } as StyleProp<ViewStyle>}>
//         <View style={{ width: '50%' }}>
//           <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
//           <Text style={styles.val as StyleProp<TextStyle>}>{fstValue}</Text>
//         </View>
//         <View style={{ width: '50%' }}>
//           {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
//           {renderSecValue()}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ marginHorizontal: 20, marginVertical:20 ,backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
//       <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
//         <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('contractData')}</Text>
//         <TouchableOpacity
//           style={{
//             width: 52,
//             height: 36,
//             borderWidth: 1,
//             borderColor: COLORS.primary,
//             borderRadius: SIZES.base,
//             justifyContent: 'center',
//           }}
//         >
//           <Image source={icons.edit} style={{ width: 20, height: 20, alignSelf: 'center' }} />
//         </TouchableOpacity>
//       </View>
//       <View>
//         <ListViewItem fstTitle={t('contractType')} fstValue={7576463} secTitle={t('contractStatusInQiwa')} secValue="4444444" />
//         <ListViewItem fstTitle={t('contractStartDate')} fstValue={7576463} secTitle={t('contractEndDate')} secValue="4444444" />
//         <ListViewItem fstTitle={t('appointmentDate')} fstValue={7576463} />
//         <ListViewItem fstTitle={t('overtimePerHour')} fstValue={7576463} />
//       </View>
//     </View>
//   );
// };

// export default ContractDataView;



interface ContractDataViewProps {
  contractType?: string;
  contractStatusInQiwa?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  appointmentDate?: string;
  overtimePerHour?: number;
}

const ContractDataView: React.FC<ContractDataViewProps> = ({
  contractType,
  contractStatusInQiwa,
  contractStartDate,
  contractEndDate,
  appointmentDate,
  overtimePerHour
}) => {
  const { t } = useTranslation();

  const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle, secValue }) => {
    const isSecValueString = typeof secValue === 'string';
    const isSecValueFunction = typeof secValue === 'function';

    const renderSecValue = () => {
      if (isSecValueString) {
        return <Text style={styles.val as StyleProp<TextStyle>}>{secValue}</Text>;
      } else if (isSecValueFunction) {
        return secValue();
      }
      return null;
    };

    return (
      <View style={{ ...styles.row, marginVertical: 8 } as StyleProp<ViewStyle>}>
        <View style={{ width: '50%' }}>
          <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
          <Text style={styles.val as StyleProp<TextStyle>}>{fstValue ?? '-'}</Text>
        </View>
        <View style={{ width: '50%' }}>
          {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
          {renderSecValue()}
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: 20, marginVertical: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('contractData')}</Text>
       
      </View>
      <View>
        <ListViewItem fstTitle={t('contractType')} fstValue={contractType ?? '-'} secTitle={t('contractStatusInQiwa')} secValue={contractStatusInQiwa ?? '-'} />
        <ListViewItem fstTitle={t('contractStartDate')} fstValue={contractStartDate ?? '-'} secTitle={t('contractEndDate')} secValue={contractEndDate ?? '-'} />
        <ListViewItem fstTitle={t('appointmentDate')} fstValue={appointmentDate ?? '-'} />
        {/* <ListViewItem fstTitle={t('overtimePerHour')} fstValue={overtimePerHour ?? '-'} /> */}
      </View>
    </View>
  );
};

export default ContractDataView;

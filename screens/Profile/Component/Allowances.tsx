import React, { useState } from 'react';
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

// const Allowances: React.FC = () => {
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
//     <View style={{ marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
//       <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
//         <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('Allowances')}</Text>
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
//         <ListViewItem fstTitle={t('overtimePerHour')} fstValue={7576463} />
//         <ListViewItem fstTitle={t('overtimePerHourOnHolidays')} fstValue={7576463} />
//         <ListViewItem fstTitle={t('numberOfLeaveDays')} fstValue={7576463} />
//       </View>
//     </View>
//   );
// };

// export default Allowances;
interface AllowancesProps {
  overtimePerHour?: number;
  overtimePerHourOnHolidays?: number;
  numberOfLeaveDays?: number;
}

const Allowances: React.FC<AllowancesProps> = ({
  overtimePerHour,
  overtimePerHourOnHolidays,
  numberOfLeaveDays
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
    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('Allowances')}</Text>
        
      </View>
      <View>
        <ListViewItem fstTitle={t('overtimePerHour')} fstValue={overtimePerHour ?? '-'} />
        <ListViewItem fstTitle={t('overtimePerHourOnHolidays')} fstValue={overtimePerHourOnHolidays ?? '-'} />
        <ListViewItem fstTitle={t('numberOfLeaveDays')} fstValue={numberOfLeaveDays ?? '-'} />
      </View>
    </View>
  );
};

export default Allowances;

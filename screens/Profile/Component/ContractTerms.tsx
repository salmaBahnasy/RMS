import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string;
  secTitle?: string;
}

// const ContractTerms: React.FC = () => {
//   const { t } = useTranslation();

//   const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle }) => {
//     return (
//       <View style={{ ...styles.row, marginVertical: 8, borderWidth: 1, borderRadius: 12, padding: 12 } as StyleProp<ViewStyle>}>
//         <View style={{ width: '50%' }}>
//           <Text style={styles.label2 as StyleProp<TextStyle>}>{fstTitle}</Text>
//           <Text style={styles.val as StyleProp<TextStyle>}>{fstValue}</Text>
//         </View>
//         <View style={{ width: '50%' }}>
//           {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
//       <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
//         <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('contractTerms')}</Text>
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
//         <ListViewItem fstTitle={t('firstTerm')} fstValue={'البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا '} />
//         <ListViewItem fstTitle={t('secondTerm')} fstValue={'البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا البيانات هنا '} />
//       </View>
//     </View>
//   );
// };

// export default ContractTerms;
interface ContractTermsProps {
  terms?: { title: string; description: string }[];
}

const ContractTerms: React.FC<ContractTermsProps> = ({ terms = [] }) => {
  const { t } = useTranslation();

  return (
    <View style={{ marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        
      </View>
      <View>
        {terms.map((term, index) => (
          <View key={index} style={{ ...styles.row, marginVertical: 8, borderWidth: 1, borderRadius: 12, padding: 12 } as StyleProp<ViewStyle>}>
            <View style={{ width: '100%' }}>
              <Text style={styles.label2 as StyleProp<TextStyle>}>{term.title}</Text>
              <Text style={styles.val as StyleProp<TextStyle>}>{term.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ContractTerms;

import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {styles} from '../styles';
import { COLORS, FONTS, SIZES, icons } from '../../../constants';

interface ListViewItemProps {
  fstTitle: string;
  fstValue: string | number | undefined;
  secTitle?: string;
  secValue?: string | number | (() => JSX.Element);
}


interface ProfessionAndprojectProps {
  jobNumber? : string | number | undefined;
  jobTitle? : string | number;
  department? : string | number;
  directManager? : string | number;
  project? :  string | number;
  employerNumber? :  string | number;
  employeeNumberInLaborOffice? : string | number;
}

const ProfessionAndproject: React.FC<ProfessionAndprojectProps> = ({jobNumber, jobTitle, department, directManager, project, employerNumber, employeeNumberInLaborOffice}) => {
  const { t } = useTranslation();

const ListViewItem: React.FC<ListViewItemProps> = ({ fstTitle, fstValue, secTitle, secValue }) => {
  // لو مفيش قيمة للـ fstValue والـ secValue مش function أو string، متعرضش العنصر خالص
  if (fstValue === undefined && (secValue === undefined || secValue === null)) return null;

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
        <Text style={styles.val as StyleProp<TextStyle>}>{fstValue}</Text>
      </View>
      <View style={{ width: '50%' }}>
        {secTitle && <Text style={styles.label2 as StyleProp<TextStyle>}>{secTitle}</Text>}
        {renderSecValue()}
      </View>
    </View>
  );
};
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16 }}>
      <View style={{ ...styles.row, justifyContent: 'space-between' } as StyleProp<ViewStyle>}>
        <Text style={FONTS.h2 as StyleProp<TextStyle>}>{t('professionAndProject')}</Text>
        {/* <TouchableOpacity
          style={{
            width: 52,
            height: 36,
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: SIZES.base,
            justifyContent: 'center',
          }}
        >
          <Image source={icons.edit} style={{ width: 20, height: 20, alignSelf: 'center' }} />
        </TouchableOpacity> */}
      </View>
      <View>
        <ListViewItem fstTitle={t('jobNumber')} fstValue={jobNumber} secTitle={t('jobTitle')} secValue= {jobTitle} />
        <ListViewItem fstTitle={t('directManager')} fstValue={directManager} />
        <ListViewItem
          fstTitle={t('employerNumber')}
          fstValue= {employerNumber}
          secTitle={t('employeeNumberInLaborOffice')}
          secValue= {employeeNumberInLaborOffice}
        />
      </View>
    </View>
  );
};

export default ProfessionAndproject;
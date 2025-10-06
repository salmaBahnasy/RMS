import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, I18nManager } from 'react-native';
import { COLORS, icons } from '../../../../constants';

// LocaleConfig setup for Arabic language
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ar'] = {
  monthNames: ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['ينا', 'فبر', 'مار', 'ابر', 'ماي', 'يون', 'يول', 'اغس', 'سبت', 'اكت', 'نوف', 'ديس'],
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خم', 'جم', 'سبت'],
  today: 'اليوم'
};
LocaleConfig.defaultLocale = 'ar';

interface CalendarProps {
  onChange: (month: number, year: number) => void;
}

// Defining the component
const CalendarHeader: React.FC<CalendarProps> = ({onChange}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  const months: string[] = [
    'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو',
    'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Handle Previous Month
  // const handlePrevMonth = (): void => {
  //   if (currentMonth === 0) {
  //     setCurrentMonth(11);
  //     setCurrentYear(currentYear - 1);
  //   } else {
  //     setCurrentMonth(currentMonth - 1);
  //   }
  // };

  // // Handle Next Month
  // const handleNextMonth = (): void => {
  //   if (currentMonth === 11) {
  //     setCurrentMonth(0);
  //     setCurrentYear(currentYear + 1);
  //   } else {
  //     setCurrentMonth(currentMonth + 1);
  //   }
  // };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
        let newMonth = prevMonth - 1;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        setCurrentYear(newYear);
        
        onChange(newMonth + 1, newYear); // ✅ تمرير القيم الجديدة للـ API
        return newMonth;
    });
};

const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
        let newMonth = prevMonth + 1;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        setCurrentYear(newYear);
        onChange(newMonth + 1, newYear); // ✅ تمرير القيم الجديدة للـ API
        return newMonth;
    });
};

  // Header rendering
  const renderHeader = (): JSX.Element => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Image source={I18nManager.isRTL ? icons?.rightBack : icons?.leftBack} style={styles.icons} />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{months[currentMonth]} {currentYear}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Image source={I18nManager.isRTL ? icons?.leftBack : icons?.rightBack} style={styles.icons} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
   // elevation: 2,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icons: {
    width: 24,
    height: 24,
    tintColor: COLORS?.gray
  },
});

export default CalendarHeader;

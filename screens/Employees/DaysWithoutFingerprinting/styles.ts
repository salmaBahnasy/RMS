import { ImageStyle, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants';

const styles = StyleSheet.create({
     container: {
        flex: 1,
        // padding: 16,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icons: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
      } as ImageStyle,
      daysyw: {
        justifyContent: 'space-between',
         marginBottom: 12,
        backgroundColor: COLORS?.white,
        borderRadius: SIZES?.radius,
        padding: 16,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      arrowButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#eee',
      },
      arrowButtonText: {
        fontSize: 18,
      },
      content: {
        flex: 1,
        marginHorizontal: 20,
      },
      calendar: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: COLORS?.white,
      },
      calendarHeader: {
        alignItems: 'center',
        marginBottom: 8,
      },
      calendarHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      calendarDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
      },
      calendarDay: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      calendarCell: {
        width: '14.28%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
      },
      selectedCell: {
        backgroundColor: '#eee',
      },
      calendarCellText: {
        fontSize: 16,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
      },
      button: {
        padding: 12,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        width: '45%',
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
      },
      missingDays: {
        marginBottom: 16,
      },
      missingDay: {
        padding: 16,
        marginBottom: 16,
      },
      missingDayTitle: {
        ...FONTS?.h3,
        marginVertical: 16,
      } as TextStyle,
      missingDayDetails: {
        marginBottom: 8,
        backgroundColor: COLORS?.white,
        borderRadius: 8,
        padding: 16,
      },
      missingDayDetailsTitle: {
        ...FONTS?.h4,
        marginHorizontal: 8,
        color: COLORS?.primary,
      } as TextStyle,
      missingDayDetailsDate: {
        ...FONTS?.h3,
       
        marginHorizontal: 8,
      } as TextStyle,
      missingDayDetailsItem: {
        flexDirection: 'row',
        borderColor: COLORS?.lightGray,
        paddingVertical: 4,
      },
      missingDayDetailsLabel: {
        ...FONTS?.body4,
        marginHorizontal: 8,
      } as TextStyle,
      missingDayDetailsValue: {
        ...FONTS?.h4,
        marginHorizontal: 2,
      } as TextStyle,
      calenderStyle: {
        // textSectionTitleColor: '#b6c1cd',
        // selectedDayBackgroundColor: '#00adf5',
        // todayTextColor: '#00adf5',
        // dayTextColor: '#2d4150',
        // textDisabledColor: '#d9e1e8',
        // arrowColor: 'orange',
        // monthTextColor: 'blue',
        // indicatorColor: 'blue',
        // textDayFontFamily: 'monospace',
        // textMonthFontFamily: 'monospace',
        // textDayHeaderFontFamily: 'monospace',
        // textDayFontWeight: '300',
        // textMonthFontWeight: 'bold',
        // textDayHeaderFontWeight: '300',
        // textDayFontSize: 16,
        // textMonthFontSize: 16,
        // textDayHeaderFontSize: 16
      },
      cfooter: {
        borderTopWidth: 1,
        marginTop: 4,
        paddingTop: 10,
        borderColor: COLORS?.gray1,
      },
      cday: {
        backgroundColor: COLORS?.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      },
      df: {
        paddingVertical: 8,
        width: '90%',
        alignSelf: 'center',
        borderTopWidth: 1,
        borderColor: COLORS?.gray,
        justifyContent: 'center',
      },
      di: {
        width: 30,
        height: 30,
        marginRight: SIZES?.Mpading,
      },
      db: {
        backgroundColor: COLORS?.primary,
        padding: SIZES?.Mpading,
        borderRadius: SIZES?.radius,
        marginHorizontal: 16,
      },
      chosseDay: {
        fontFamily: 'Dubai-Medium',
        fontSize: SIZES.body5,
        alignSelf: 'flex-start',
        color: COLORS?.white,
      },
      requestForJustification: {
        ...FONTS?.body3,
        color: COLORS?.primary,
        
      } as TextStyle,
    scanbtn: {
        width: 52,
        height: 51,
        borderRadius: 8,
        borderColor: COLORS?.primary,
        borderWidth: 1, marginHorizontal: 8,
        backgroundColor: COLORS?.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    icon:{
        width: 20, 
        height: 20
    },
    
    padding:{
        paddingTop: 20, 
        paddingLeft: 20, 
        paddingRight: 12 
    },
    textArea: {
        height: 175,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        backgroundColor:COLORS?.white,
        borderRadius:12
      },
       

})

export default styles
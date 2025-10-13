import { ImageStyle, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../../constants';

const styles = StyleSheet.create({
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
    row:{
        flexDirection: 'row', 
        alignItems: 'center'
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
        container: {
    flex: 1,
    padding: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  employeeName: {
    ...FONTS.h4,
    color: COLORS.darkgray,
    marginBottom: 4,
  } as TextStyle,
  employeeDetails: {
    ...FONTS.body4,
    color: COLORS.gray,
  }as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...FONTS.h5,
    color: COLORS.gray,
  }as TextStyle,
  actionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
  },
  paddingWhiteView: {
   backgroundColor: COLORS?.white,
        margin: 20,
        borderRadius: 12,
        paddingHorizontal: 16,
        padding: 24
  },
   StatusView: {
        backgroundColor: COLORS?.lightbgGreen,
        borderWidth: 1,
        borderColor: COLORS?.darkGreen,
        padding: 8,
        justifyContent: 'center',
        borderRadius:20,
        marginRight:8

    },
     EmployeeItem: {
        backgroundColor: COLORS?.white, marginVertical: 4, padding: 16, borderRadius: 16
    },
 empImg: {
        width: 32, height: 32, marginHorizontal: 4,
        backgroundColor:COLORS?.lightGray,borderRadius:32
    },
    sb: {
        marginHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom:8
    },
     labeltxt: {
            ...FONTS?.h5, color: COLORS?.black, marginHorizontal: 2
        }as TextStyle,
        numtxt: {
            ...FONTS?.h5, color: COLORS?.primary, marginHorizontal: 2
        }as ImageStyle,
})

export default styles
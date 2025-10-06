import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants';

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
  icon: {
    width: 20,
    height: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  padding: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 12
  },
  textArea: {
    height: 175,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: COLORS?.white,
    borderRadius: 12
  },
  employeeData: {
    height: 158,
    backgroundColor: "#F8FBFF",
    borderRadius: 8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  selectAreaBTN: {
    backgroundColor: COLORS?.white,
    borderRadius: SIZES?.radius,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: SIZES?.smallpading,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: SIZES?.padding2,
    marginTop: 8
  },
  selectArealabel: {
    ...FONTS?.body4,
    color: COLORS?.red,
    alignSelf: 'center',
    marginTop: 8,
    lineHeight: 30
  },
  shiftImg: {
    height: 235,
    width: 287,
    paddingTop: 20,
    margin: 24,
    alignSelf: "center"
  },
  shiftView: {
    margin: 20,
    backgroundColor: COLORS?.white,
    padding: 24,
    borderRadius: 12,
    flex:1,
    height: SIZES?.height,
    width: "100%",
    alignSelf:"center"
  },
  userImg: {
    width: 48,
    height: 48
  },
  disView:{
    flexDirection: 'row',
     backgroundColor: "#F8FBFF", 
     padding: 8, 
     borderRadius: 8, 
     marginVertical: 16}

})

export default styles
import { StyleSheet, Text, TextStyle } from "react-native"
import { COLORS, FONTS } from '../../constants';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnView: {
    paddingVertical: 16,
    justifyContent: 'space-between',
    marginHorizontal: -10
  },
  textArea: {
    height: 165,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: COLORS?.white,
    borderRadius: 12
  },
  choosedatebtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "#B9BAC0",
    backgroundColor: COLORS?.white
  },
  uploadFiles: {
    backgroundColor: COLORS?.white,
    height: 165,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS?.primary,
    justifyContent: 'center',
    alignContent: "center",
    alignItems: 'center',
    borderRadius: 8
  },
  uploadFiletxt:{
    ...FONTS?.body5,
    color:COLORS?.primary,
    alignSelf:'center',
    textTransform:'capitalize',
    textDecorationLine:'underline'
  },
  uploadIcon:{
    height:48,width:48
  },
  optiontxt:{
    ...FONTS?.body5,
    textTransform: 'capitalize',
    color: "#93949D"
  } as TextStyle
})


export default styles
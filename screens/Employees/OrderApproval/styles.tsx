import { StyleSheet, TextStyle } from "react-native";
import { COLORS, FONTS, icons } from "../../../constants";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',

  },
  title: {
    ...FONTS.body4,
    textAlign: 'center',
    marginBottom: 16,
  } as TextStyle,
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start'
  },
  columa: {
    alignItems: 'flex-start',
    marginTop: 6,
    width: '50%'

  },
  label: {
    ...FONTS.body5,
    color: COLORS?.gray1,
  } as TextStyle,
  value: {
    ...FONTS.body4
  } as TextStyle,
  detailsButton: {
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    height:30,
    justifyContent:'center',
    alignItems:'center',

  },
  detailsText: {
    ...FONTS.body5,
    textAlign: 'center',
    color: COLORS?.white,

  } as TextStyle,
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "18%",
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    width: "18%",
    borderRadius: 5,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS?.body5,
    color: 'white',
    textAlign: 'center',

  } as TextStyle,
  card: {
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 26,
    backgroundColor: COLORS?.white,
    borderRadius: 12
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  button: {
    marginHorizontal: 5,
    paddingHorizontal: 5
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 5
  },
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',

  },
  label2: {
    ...FONTS?.body5, 
    color: COLORS?.lightGray4, 
    textTransform: 'uppercase'
  }as TextStyle,
  approvalbtn:{
    backgroundColor: COLORS?.darkGreen, padding: 10, marginHorizontal: 10, flex: 1
  },
  rejectbtn:{
   backgroundColor: COLORS?.red, padding: 10, marginHorizontal: 10, flex: 1 
  }
});

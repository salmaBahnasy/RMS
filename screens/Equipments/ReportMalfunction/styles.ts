import { StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants';

const styles = StyleSheet.create({
  // صف input + زر scan
  row: {
    flexDirection: 'row',
    alignItems: 'center',
   
    
  },
    scanText: { color: '#fff', fontSize: 18 },
  centerText: { fontSize: 16, padding: 20, color: '#444', textAlign: 'center' },
  closeBtn: {
    backgroundColor: COLORS?.primary,
    padding: 12,
    borderRadius: 8,
  },
  closeText: { color: '#fff', fontSize: 18 },

  // زر المسح الضوئي
  scanbtn: {
     width: 52,
     height: 42,
    //marginStart: 8,
  //  backgroundColor: COLORS.bluePrimary,
       borderWidth: 1,
      
       borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.primary,
    marginHorizontal: 8
 

  },

  // أيقونة المسح
  icon: {
    width: 23,
    height: 23,
  },

  // تنسيق label مثل: "نوع المعدة", "المشروع", إلخ
  label: {
    ...FONTS.h4,
    fontWeight:'500',
    lineHeight: 19,
    color: COLORS.black,
   // marginBottom: 6,
    marginTop: 5,
    
  }as TextStyle ,

  // TextArea
  textArea: {
    height: 200,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
    
   
  },

  // Padding داخلي للشاشة
  padding: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
    optionBtn: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  equipmentContainer: {
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  marginVertical: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

equipmentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

equipmentLabel: {
  fontSize: 14,
  color: '#7D7D7D', // ثابت
  marginBottom: 4,
},

equipmentValue: {
  fontSize: 14,
  color: COLORS.black, // أو COLORS.primary لو تحب
  fontWeight: '500',
},

});

export default styles;



// import { StyleSheet } from 'react-native';
// import { COLORS, FONTS } from '../../../constants';

// const styles = StyleSheet.create({
//     scanbtn: {
//         width: 52,
//         height: 51,
//         borderRadius: 8,
//         borderColor: COLORS?.primary,
//         borderWidth: 1, marginHorizontal: 8,
//         backgroundColor: COLORS?.white,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20
//     },
//     icon:{
//         width: 20, 
//         height: 20
//     },
//     row:{
//         flexDirection: 'row', 
//         alignItems: 'center'
//     },
//     padding:{
//         paddingTop: 20, 
//         paddingLeft: 20, 
//         paddingRight: 12 
//     },
//     textArea: {
//         height: 175,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         padding: 10,
//         backgroundColor:COLORS?.white,
//         borderRadius:12
//       },

// })

// export default styles
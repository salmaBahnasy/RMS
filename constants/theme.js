import { Dimensions } from "react-native";
import Navigation from "../navigation/navigation";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#1A41C1",
    secondary: "#fff",
    primary_500:"#06b6d4",
    whiteprimary:'#3f82b2',
    appyellow:'#fedd02',
    // colors
    black: "#1E1B26",
    primaryColor:"#1A202E",
    backgroundApp:"#F3F3F3",
    colorButton: "#8CC63F",
    colorForPassword: "#8CC63F",
    colorTextParah: '#5C616B',
    white: "#FFFFFF",
    lightGray: "#C2C2C2",
    lightGray2: "#A3A3A5",
    lightGray3: '#D4D5D6',
    lightGray4: '#7D7E84',
    gray: "#B9BAC0",
    gray1: "#abadac",
    darkgray:'#f0f0f2',
    darkRed: "#31262F",
    lightRed: "#C5505E",
    darkBlue: "#002F88",
    lightBlue: "#424BAF",
    lightBlue2:'#002F88',
    darkGreen: "#07B263",
    lightGreen: "#00da4a",
    darkYellow:'#ffbe26',
    offWhite:'#A3A3A5',
    primary_opacity:'#144f7973',
    secondary_opacity:'#03d0ff3b',
    lightWhite:'#e7e7e7',
    sharebg:'#eceef2',
    graycolor:'#bfbfbf',
    bgGreen:'#9affda',
    lightbgGreen:'#dcfff2',
    orange:'#f99d31',
    textbg:'#d0e8b0',
    yellow:'#efd219',
    Y50:'#F3F2EA',
    Y300:'#8B7C2C',
    Y100:'#BCB385',
    btnY:'#ffd42a',

    B300:'#3F48C6',
    B400:'#5C616B',
    B40:'#E1E2E4',
    B50:'#ECEDF9',
    B20:'#F6F6F7',
    B10:"#FAFBFB",


    G400:'#628B2C',
    G50:'#F4F9EC',

    red:'#F15D1D',
    redOpacity:'#F15D1D66',
    noteBg:'#ebebeb',
    appBlack:'#2a2a2a',
    txtgray:"#8c8c8c",
    bluePrimary:'#00A4F4',
    inputBg:'#EEEEF0',
    Warningbg:"#FEFAEC",
    Warningtxt:'#8C4414',
    lightYellow:"#FEFAEC",



};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    padding2: 36,
    smallpading:5,
    Mpading:10,
    padding20:20,
    padding15:15,

    padding3: 100,


    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 20,
    h3: 16,
    h4: 13,
    h5: 11,

    body1: 27,
    body2: 18,
    body3: 16,
    body4: 14,
    body5: 13,
    body6: 11,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Dubai-Bold", fontSize: SIZES.largeTitle, color:'#000',alignSelf:'flex-start'},
    h1: { fontFamily: "Dubai-Bold", fontSize: SIZES.h1, color:'#000',alignSelf:'flex-start' },
    h2: { fontFamily: "Dubai-Bold", fontSize: SIZES.h2, color:'#1A202E',alignSelf:'flex-start'},
    h3: { fontFamily: "Dubai-Medium", fontSize: SIZES.h3,color:'#000',alignSelf:'flex-start'},
    h4: { fontFamily: "Dubai-Medium", fontSize: SIZES.h4, color:'#000',alignSelf:'flex-start'},
    h5: { fontFamily: "Dubai-Medium", fontSize: SIZES.h5, lineHeight: 22,color:'#000' ,alignSelf:'flex-start'},

    body1: { fontFamily: "Dubai-Regular", fontSize: SIZES.body1,color:'#000',alignSelf:'flex-start'},
    body2: { fontFamily: "Dubai-Regular", fontSize: SIZES.body2, color:'#000',alignSelf:'flex-start' },
    body3: { fontFamily: "Dubai-Regular", fontSize: SIZES.body3 ,color:'#000',alignSelf:'flex-start'},
    body4: { fontFamily: "Dubai-Regular", fontSize: SIZES.body4 ,color:'#1A202E',alignSelf:'flex-start'},
    body5: { fontFamily: "Dubai-Medium", fontSize: SIZES.body5 ,color:'#000',alignSelf:'flex-start'},
    body6: { fontFamily: "Dubai-Light", fontSize: SIZES.body6 ,alignSelf:'flex-start'},

};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
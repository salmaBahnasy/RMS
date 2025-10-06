import { Image, TouchableOpacity, View } from "react-native"
import MainTextInput from "../../common/components/MainTextInput"

const OldProfileView=()=>{
    return(
        <View style={{ margin: 20, height: SIZES?.height - 220 }}>
        <TouchableOpacity style={{ width: 88, alignSelf: 'center' }}>
          <Image source={images?.userImage} style={{ ...styles?.userImage }} />
          <Image style={{ ...styles?.xicon }} source={icons?.uploadPhoto} />
        </TouchableOpacity>
        <MainTextInput containerStyle={{ marginVertical: 8 }} inputContainer={{ backgroundColor: COLORS?.white, }} label={t('firstName')} />
        <MainTextInput containerStyle={{ marginVertical: 8 }} inputContainer={{ backgroundColor: COLORS?.white, }} label={t('lastName')} />
        {/* .......................... */}
        <MainTextInput
          righIconAction={() => { }}
          righIcon={icons?.copyIcon}
          containerStyle={{ marginVertical: 8 }}
          inputContainer={{ backgroundColor: COLORS?.inputBg, }}
          editable={false} selectTextOnFocus={false} label={t('idNumber')} />
        {/* ......................... */}
        <MainTextInput
          containerStyle={{ marginVertical: 8 }}
          inputContainer={{ backgroundColor: COLORS?.inputBg, }}
          editable={false} selectTextOnFocus={false} label={t('jobTitle')} />
      </View>
    )
}

export default OldProfileView
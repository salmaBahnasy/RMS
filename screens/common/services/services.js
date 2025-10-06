import { request, PERMISSIONS } from 'react-native-permissions';
import { PermissionsAndroid, Linking, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// -------------------------ask for permissions-----------------------------

const CheckCameraPermission = async () => {
  return Platform.OS === 'ios'
    ? await requestCameraPermissionIOS()
    : await requestCameraPermissionAndroid();
};
const CheckLocationPermission = async () => {
    Platform.OS == 'ios'
        ? requestLocationPermissionIOS()
        : requestLocationPermissionAndroid();
};
// دوال طلب الإذن لكل نظام
const requestCameraPermissionIOS = async (): Promise<boolean> => {
  const permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
  if (permissionStatus === RESULTS.GRANTED) {
    console.log('Camera permission granted');
    return true;
  } else {
    console.log('Camera permission denied');
    return false;
  }
};

const requestCameraPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera so you can take pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('Camera permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};


const requestLocationPermissionIOS = async () => {
    const permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (permissionStatus === 'granted') {
        console.log('location permission granted');
        return true;
    } else {
        console.log('location permission denied');
        return false;
    }
};
const requestLocationPermissionAndroid = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:
                    'This app needs access to your Location ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            return true;
        } else {
            console.log('location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};
// -------------------------end permissions-----------------------------
// ------------------------- linking to open map-----------------------------

const openMap = (latitude, longitude) => {
    const urlIos = `https://maps.apple.com/?ll=${latitude},${longitude}`;
    const urlAndroid = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(Platform.OS == 'ios' ? urlIos : urlAndroid)
        .then(() => console.log('Map opened'))
        .catch(err => console.error('Failed to open map:', err));
};
// ------------------------- get location-----------------------------

const getLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};
// -------------------------camere services-----------------------------

const selectImage = () => {
    return new Promise((resolve, reject) => {
        const options = {
            title: 'Select an image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response)
                const imagePath = response.assets[0]?.uri;
                let image = {
                    uri: imagePath,
                    name: response.assets[0]?.fileName,
                    type: response.assets[0]?.type,
                }
                resolve(image)
            }
        }).catch(error => {
            console.log(error)
        })
    })

};
const takePicture = () => {
    return new Promise(async (resolve, reject) => {

        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        let permission=await CheckCameraPermission();
        console.log({permission})
        launchCamera(options, async (response) => {
            console.log(response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {

                let imageUri = response.assets[0]?.uri;
                let image = {
                    uri: imageUri,
                    name: response.assets[0]?.fileName,
                    type: response.assets[0]?.type,
                }
                resolve(image)
            }
        }).catch(error => {
            console.log(error)
        })
    })

};

export {
    requestCameraPermissionAndroid,
    requestCameraPermissionIOS,
    CheckCameraPermission,
    requestLocationPermissionIOS,
    requestLocationPermissionAndroid,
    CheckLocationPermission,
    openMap,
    getLocation,
    selectImage,
    takePicture,
};
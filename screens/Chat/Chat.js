import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Platform, PermissionsAndroid } from 'react-native';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { selectImage } from '../common/services/services';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: firebaseData.text || '',
            createdAt: new Date(firebaseData.createdAt.seconds * 1000),
            user: firebaseData.user,
            image: firebaseData.image || '',
            audio: firebaseData.audio || '',
            video: firebaseData.video || '',
          };

          return data;
        });

        setMessages(messagesFirestore);
      });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    const text = messages[0].text;

    firestore()
      .collection('chats')
      .add({
        text,
        createdAt: new Date(),
        user: {
          _id: 1, // Change this to the current user's ID
          name: 'User Test', // Change this to the current user's name
        },
      });
  }, []);
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const { uri, name, size, type } = res;

      const message = {
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User Test',
        },
        text: '',
        document: {
          uri,
          name,
          size,
          type,
        },
      };

      onSend([message]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };
  const pickImage = () => {
    selectImage().then((res)=>{
      console.log("res?.uri",res?.uri)
      firestore()
      .collection('chats')
      .add({
        image: res?.uri,
        createdAt: new Date(),
        user: {
          _id: 1, // Change this to the current user's ID
          name: 'User Test', // Change this to the current user's name
        },
      });
    }).catch(error=>console.log("img error",error))
    // ImagePicker.launchImageLibrary({}, (response) => {
    //   if (response.uri) {
    //     const { uri } = response;
    //     // Upload the image to a storage solution and get the URL
    //     const imageUrl = uri; // Replace with the actual URL after upload

    //     firestore()
    //       .collection('chats')
    //       .add({
    //         image: imageUrl,
    //         createdAt: new Date(),
    //         user: {
    //           _id: 1, // Change this to the current user's ID
    //           name: 'User Test', // Change this to the current user's name
    //         },
    //       });
    //   }
    // });
  };

  const startRecording = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }

    const path = Platform.select({
      ios: 'audio.m4a',
      android: `${RNFS.CachesDirectoryPath}/audio.mp3`,
    });

    setAudioPath(path);
    await audioRecorderPlayer.startRecorder(path);
    setRecording(true);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    setAudioPath(result);

    // Upload the audio file to a storage solution and get the URL
    const audioUrl = result; // Replace with the actual URL after upload

    firestore()
      .collection('chats')
      .add({
        audio: audioUrl,
        createdAt: new Date(),
        user: {
          _id: 1, // Change this to the current user's ID
          name: 'User Test', // Change this to the current user's name
        },
      });
  };

  const renderCustomActions = (props) => {
    return (
      <Actions
        {...props}
        options={{
          'Send Image': pickImage,
          'Send Document': handlePickDocument,
          // 'Start Recording': startRecording,
          // 'Stop Recording': stopRecording,
        }}
        icon={() => (
          <View style={{ padding: 5 }}>
            <Button title="+" onPress={() => {}} />
          </View>
        )}
        onSend={(args) => console.log(args)}
      />
    );
  };


  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1, // Change this to the current user's ID
      }}
      renderActions={renderCustomActions}
      // onPressActionButton={() => setActionsVisible(!actionsVisible)}

    />
  );
};

export default Chat;

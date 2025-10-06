import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

let connection;

// تهيئة الإشعارات
export const configurePushNotifications = async () => {
  PushNotification.configure({
    requestPermissions: Platform.OS === 'ios',
    onNotification: function (notification) {
      console.log('📬 Notification received:', notification);
    },
    popInitialNotification: true,
  });
};

// إنشاء اتصال جديد
const createSignalRConnection = () => {
  return new HubConnectionBuilder()
    .withUrl('https://your-server-url/hub') // 👈 غيّري الرابط إلى رابط السيرفر الخاص بك
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect([0, 2000, 10000, 30000]) // 👈 محاولات الإعادة: فوراً، بعد 2 ثانية، 10 ثواني، 30 ثانية
    .build();
};

// بدء الاتصال
export const startSignalRConnection = async () => {
  connection = createSignalRConnection();

  connection.onreconnecting((error) => {
    console.log('🔄 SignalR reconnecting...', error);
  });

  connection.onreconnected((connectionId) => {
    console.log('✅ SignalR reconnected. Connection ID:', connectionId);
  });

  connection.onclose((error) => {
    console.log('❌ SignalR disconnected.', error);
    reconnectSignalR();
  });

  try {
    await connection.start();
    console.log('✅ SignalR Connected');
  } catch (err) {
    console.error('❗ SignalR Connection failed:', err);
    reconnectSignalR();
  }

  // استقبال الرسائل من السيرفر
  connection.on('ReceiveMessage', (title, message) => {
    console.log('📩 New message from server:', { title, message });
    showLocalNotification(title, message);
  });
};

// وظيفة لإعادة الاتصال إذا فشل
const reconnectSignalR = async () => {
  console.log('⏳ Trying to reconnect to SignalR...');
  setTimeout(async () => {
    try {
      connection = createSignalRConnection();
      await connection.start();
      console.log('✅ Reconnected to SignalR after disconnection.');
    } catch (error) {
      console.error('❗ Reconnection attempt failed:', error);
      reconnectSignalR(); // نعيد المحاولة من جديد لو فشل
    }
  }, 5000); // ننتظر 5 ثواني قبل المحاولة
};

// إرسال إشعار محلي احترافي
const showLocalNotification = (title, message) => {
  PushNotification.localNotification({
    /* خيارات الإشعار */
    channelId: "default-channel-id", // تأكدي أن عندك قناة معرفة بهذا الاسم (نجهزها لو حبيتي)
    title: title || '📢 إشعار جديد', 
    message: message || 'لديك رسالة جديدة.',
    playSound: true,
    soundName: 'default', // أو ضعي اسم ملف الصوت إن أردتِ تخصيصه
    // smallIcon: 'ic_notification', // تأكدي أن الأيقونة مضافة في Android
    // largeIcon: 'ic_launcher', // الأيقونة الكبيرة
    importance: "high",
    priority: "high",
    vibrate: true,
  });
};

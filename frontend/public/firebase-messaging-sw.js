importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB9CMAKbmDW3G_MVFyZw86re6VdaVvHkw0",
  projectId: "proje-1b199",
  messagingSenderId: "385901686366",
  appId: "1:385901686366:web:5dc27837665554734e4ecf"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'USDT Transfer';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.amount + " USDT Transferred",
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

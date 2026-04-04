import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB9CMAKbmDW3G_MVFyZw86re6VdaVvHkw0",
  authDomain: "proje-1b199.firebaseapp.com",
  projectId: "proje-1b199",
  storageBucket: "proje-1b199.firebasestorage.app",
  messagingSenderId: "385901686366",
  appId: "1:385901686366:web:5dc27837665554734e4ecf",
  measurementId: "G-MPVTCLKHC8"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messagingPromise = (async () => {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  return null;
})();

export const requestFirebaseNotificationPermission = async () => {
  try {
    const messaging = await messagingPromise;
    if (!messaging) {
      throw new Error("Firebase Messaging is not supported in this browser.");
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js?v=3');
      const token = await getToken(messaging, {
        vapidKey: "BIoow0xeexP1vVDO4QTG8V5snuR01KHzTs34OmP3WiMUQo4i80ZGmBOMaYup2AjKbWqEzubQfdvNcRJ60x-9lPE",
        serviceWorkerRegistration: registration
      });
      return token;
    } else {
      throw new Error("Notification permission denied");
    }
  } catch (error) {
    console.error("An error occurred while requesting permission. ", error);
    throw error;
  }
};

export const onMessageListener = async () =>
  new Promise(async (resolve) => {
    const messaging = await messagingPromise;
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoJoeUm418bslrDctRor61d04-TqK_Pa0",
  authDomain: "realtimepostapp.firebaseapp.com",
  projectId: "realtimepostapp",
  storageBucket: "realtimepostapp.appspot.com",
  messagingSenderId: "346522972771",
  appId: "1:346522972771:web:d722ef537d065f498f7e56",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

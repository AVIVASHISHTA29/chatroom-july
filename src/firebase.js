import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDbY6ps50YhcHJ25qmxy5BO8ve-eOMICp8",
    authDomain: "chatroom-app-f91b4.firebaseapp.com",
    projectId: "chatroom-app-f91b4",
    storageBucket: "chatroom-app-f91b4.appspot.com",
    messagingSenderId: "430021031709",
    appId: "1:430021031709:web:997e3a7927dfcd1fc913f4",
    measurementId: "G-QRL3MFCZFW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

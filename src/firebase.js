import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBhrmO_2Jgd43IXltl17P_RMNHJU7s5u8Q",
    authDomain: "chatroom-9da7d.firebaseapp.com",
    projectId: "chatroom-9da7d",
    storageBucket: "chatroom-9da7d.appspot.com",
    messagingSenderId: "479473445161",
    appId: "1:479473445161:web:6a3ac29135dffe15856f38",
    measurementId: "G-3XW1CJJYPV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

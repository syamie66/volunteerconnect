import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC3oZtJ_3BeXCQeDI2it--CBk_fLnjrZjk',
  authDomain: 'volunteer-connect-2b807.firebaseapp.com',
  projectId: 'volunteer-connect-2b807',
  storageBucket: 'volunteer-connect-2b807.appspot.com',
  messagingSenderId: '90338049754',
  appId: '1:90338049754:web:6295a05362846edccd2fe3',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // <-- export as db

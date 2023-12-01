import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDHWOPGb5nn5uIx4fHzSOyqYj3XKy9pcIU",
  authDomain: "agenda-sacramental-6ab52.firebaseapp.com",
  projectId: "agenda-sacramental-6ab52",
  storageBucket: "agenda-sacramental-6ab52.appspot.com",
  messagingSenderId: "1050291682581",
  appId: "1:1050291682581:web:6ab24ff892aa5e501f7d1c",
  measurementId: "G-F758S6R53R"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseConfig;
export { firebaseApp };

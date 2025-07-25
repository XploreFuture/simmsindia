// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIKt4f9t4IVkjT_COq5NaXKvBVMLorsgM",
  authDomain: "simmsindia25.firebaseapp.com",
  projectId: "simmsindia25",
  storageBucket: "simmsindia25.firebasestorage.app",
  messagingSenderId: "519960408331",
  appId: "1:519960408331:web:58fd05a5e5e0b05b14b20e",
  measurementId: "G-N8S4EYSDFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

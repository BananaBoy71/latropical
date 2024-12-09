
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import firebase from 'firebase/compat/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const settings = {timestampsInSnapshots: true,merge:true};
const config = {
   apiKey: "AIzaSyABS1bZi4da3AFcmTed1kOVd2BywV7v90s",
  authDomain: "latropical-f6311.firebaseapp.com",
  databaseURL: "https://latropical-f6311-default-rtdb.firebaseio.com",
  projectId: "latropical-f6311",
  storageBucket: "latropical-f6311.firebasestorage.app",
  messagingSenderId: "924570997222",
  appId: "1:924570997222:web:a84e1b79ffb75fbd518627",
  measurementId: "G-HN05QF7W03"
};

// Initialize Firebase
firebase.initializeApp(config);
firebase.firestore().settings(settings);
const storage=firebase.storage;
const database = firebase.database();

export default conexion = firebase.firestore()
const auth = firebase.auth() 
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export {
    firebase,
    auth,
   googleAuthProvider,
   storage,
   database
}
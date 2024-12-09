import firebase from "firebase/compat/app";
import 'firebase/compat/database';

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


if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  export default firebase;
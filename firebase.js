import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

//깃헙에는 업로드 하지 않아야한다
//gitignore에 추가하면된다
const firebaseConfig = {
  apiKey: "AIzaSyDhXdiI7yv-8HIk9l76z4p2fMxAWYSvnCI",
  authDomain: "carrot-market-d9867.firebaseapp.com",
  databaseURL:
    "https://carrot-market-d9867-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "carrot-market-d9867",
  storageBucket: "carrot-market-d9867.appspot.com",
  messagingSenderId: "880527489278",
  appId: "1:880527489278:web:cb5b49b2a5cd9ab5dc0daf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

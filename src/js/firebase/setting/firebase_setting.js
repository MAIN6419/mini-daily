// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

import {
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnaqMLR9z8naAC0J06ptfd6HQb1jSnSbY",
  authDomain: "mini-diary-65ff3.firebaseapp.com",
  projectId: "mini-diary-65ff3",
  storageBucket: "mini-diary-65ff3.appspot.com",
  messagingSenderId: "407798731197",
  appId: "1:407798731197:web:130b483a33ace812bdc2d4",
  measurementId: "G-NZGRQDDVH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export {
  db,
  app,
  storage,
};

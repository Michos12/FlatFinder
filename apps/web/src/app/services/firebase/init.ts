// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4YhSRZKc2lknNPCfRw-8Pofd2lgP_vEc",
  authDomain: "flanfinder-d51ad.firebaseapp.com",
  projectId: "flanfinder-d51ad",
  storageBucket: "flanfinder-d51ad.firebasestorage.app",
  messagingSenderId: "494577718737",
  appId: "1:494577718737:web:9416d59213602c8a77fcf0",
  measurementId: "G-ZQQ94E0C6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

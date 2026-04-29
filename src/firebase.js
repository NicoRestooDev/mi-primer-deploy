// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzJZUtSwzOdupu5OQ9e_i4tYh-U3kuDoU",
  authDomain: "mi-primer-deploy-ca523.firebaseapp.com",
  databaseURL: "https://mi-primer-deploy-ca523-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mi-primer-deploy-ca523",
  storageBucket: "mi-primer-deploy-ca523.firebasestorage.app",
  messagingSenderId: "971069294544",
  appId: "1:971069294544:web:adf5a1f94ffa8637795bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
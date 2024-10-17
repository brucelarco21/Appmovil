// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi2pHHqInx86QvkD_aQ-dEqkCToubcQXQ",
  authDomain: "appmovil-fb604.firebaseapp.com",
  databaseURL: "https://appmovil-fb604-default-rtdb.firebaseio.com",
  projectId: "appmovil-fb604",
  storageBucket: "appmovil-fb604.appspot.com",
  messagingSenderId: "542332897501",
  appId: "1:542332897501:web:30a4a3c5708036dd343334",
  measurementId: "G-4JX441TDQ5"
};

// Define your API base URL and endpoints separately
export const apiBaseUrl = "https://rickandmortyapi.com/api";
export const apiEndpoints = {
  characters: "/character",
  episodes: "/episode",
  locations: "/location"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

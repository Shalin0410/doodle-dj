import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCv1QT-zGNH5iQAxebM8wD2Ksp5lgbVckw",
  authDomain: "doodledj-c05e8.firebaseapp.com",
  projectId: "doodledj-c05e8",
  storageBucket: "doodledj-c05e8.firebasestorage.app",
  messagingSenderId: "842732855029",
  appId: "1:842732855029:web:228cffa41f9fd67506afbc",
  measurementId: "G-Y3BQELYETJ",
};

// Initialize Firebase app once
const app = initializeApp(firebaseConfig);

// Export authentication instance
export const auth = getAuth(app);
export default app;

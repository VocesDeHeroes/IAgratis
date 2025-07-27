import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6_o_Mm6QG7sHOD5zKITeVGhAtvKz25ZM",
  authDomain: "iagratuita.firebaseapp.com",
  projectId: "iagratuita",
  storageBucket: "iagratuita.firebasestorage.app",
  messagingSenderId: "133887632889",
  appId: "1:133887632889:web:8c2136bae705aeb1a9c928",
  measurementId: "G-KHFH4BPEQ0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

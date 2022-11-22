// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";   // 사용안함

// 아래 데이터는 본인의 Firebase 프로젝트 설정에서 확인할 수 있습니다.
const firebaseConfig = {
  apiKey: "AIzaSyCnwMprbRwpWM3oFkCH5iGjEcY4W7dtsBo",
  authDomain: "i-like-people.firebaseapp.com",
  projectId: "i-like-people",
  storageBucket: "i-like-people.appspot.com",
  messagingSenderId: "671297245671",
  appId: "1:671297245671:web:971b3c4bea9c579d0bed42",
  measurementId: "G-Y9J7QEH4D8"   // 사용안함
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
export const analytics = getAnalytics(app);   // 사용안함
